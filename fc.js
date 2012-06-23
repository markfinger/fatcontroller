// Fat Controller - a publish-subscribe service in JS
// https://github.com/markfinger/fatcontroller
//
//
// API Outline (See the README for more information and examples)
//
// 	fc.publish(message[, data])
// 		Publish :message to all subscribers.
//
// 	fc.subscribe(message, callback[, thisArg])
// 		Listen for :message, calling :callback when the signal is received.
//
// 	fc.unsubscribe(message)
// 		Remove any subscriber listening for :message.
//
// 	fc.registry()
// 		Returns an associative array containing all subscribers.
//

// ES5 polyfills
Array.prototype.forEach||(Array.prototype.forEach=function(e,g){var b,a;if(null==this)throw new TypeError("this is null or not defined");var c=Object(this),d=c.length>>>0;if("[object Function]"!={}.toString.call(e))throw new TypeError(e+" is not a function");g&&(b=g);for(a=0;a<d;){var f;a in c&&(f=c[a],e.call(b,f,a,c));a++}});
Array.prototype.filter||(Array.prototype.filter=function(e,g){if(null==this)throw new TypeError;var b=Object(this),a=b.length>>>0;if("function"!=typeof e)throw new TypeError;for(var c=[],d=0;d<a;d++)if(d in b){var f=b[d];e.call(g,f,d,b)&&c.push(f)}return c});
// Crockford's json2.js
var JSON;JSON||(JSON={});(function(){function k(a){return 10>a?"0"+a:a}function o(a){p.lastIndex=0;return p.test(a)?'"'+a.replace(p,function(a){var c=r[a];return"string"===typeof c?c:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+a+'"'}function m(a,j){var c,d,h,n,g=e,f,b=j[a];b&&("object"===typeof b&&"function"===typeof b.toJSON)&&(b=b.toJSON(a));"function"===typeof i&&(b=i.call(j,a,b));switch(typeof b){case "string":return o(b);case "number":return isFinite(b)?""+b:"null";case "boolean":case "null":return""+b;case "object":if(!b)return"null";e+=l;f=[];if("[object Array]"===Object.prototype.toString.apply(b)){n=b.length;for(c=0;c<n;c+=1)f[c]=m(c,b)||"null";h=0===f.length?"[]":e?"[\n"+e+f.join(",\n"+e)+"\n"+g+"]":"["+f.join(",")+"]";e=g;return h}if(i&&"object"===typeof i){n=i.length;for(c=0;c<n;c+=1)"string"===typeof i[c]&&(d=i[c],(h=m(d,b))&&f.push(o(d)+(e?": ":":")+h))}else for(d in b)Object.prototype.hasOwnProperty.call(b,d)&&(h=m(d,b))&&f.push(o(d)+(e?": ":":")+h);h=0===f.length?"{}":e?"{\n"+e+f.join(",\n"+e)+"\n"+g+"}":"{"+f.join(",")+"}";e=g;return h}}"function"!==typeof Date.prototype.toJSON&&(Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+k(this.getUTCMonth()+1)+"-"+k(this.getUTCDate())+"T"+k(this.getUTCHours())+":"+k(this.getUTCMinutes())+":"+k(this.getUTCSeconds())+"Z":null},String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(){return this.valueOf()});var q=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,p=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,e,l,r={"\u0008":"\\b","\t":"\\t","\n":"\\n","\u000c":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},i;"function"!==typeof JSON.stringify&&(JSON.stringify=function(a,j,c){var d;l=e="";if(typeof c==="number")for(d=0;d<c;d=d+1)l=l+" ";else typeof c==="string"&&(l=c);if((i=j)&&typeof j!=="function"&&(typeof j!=="object"||typeof j.length!=="number"))throw Error("JSON.stringify");return m("",{"":a})});"function"!==typeof JSON.parse&&(JSON.parse=function(a,e){function c(a,d){var g,f,b=a[d];if(b&&typeof b==="object")for(g in b)if(Object.prototype.hasOwnProperty.call(b,g)){f=c(b,g);f!==void 0?b[g]=f:delete b[g]}return e.call(a,d,b)}var d,a=""+a;q.lastIndex=0;q.test(a)&&(a=a.replace(q,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)}));if(/^[\],:{}\s]*$/.test(a.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){d=eval("("+a+")");return typeof e==="function"?c({"":d},""):d}throw new SyntaxError("JSON.parse");})})();

window.fc = (function() {

	// Private registry of subscribers; retrievable with `fc.registry()`
	var _registry = {};

	///////////////// Public API ////////////////

	function publish(message, data) {
		// Publish :message to any subscribers listening for it. Each
		// subscriber's callback will be called, with optional argument :data
		// passed with the message

		return _publishMessage({
			name: _checkMessage(message),
			timestamp: _getTimestamp(),
			identifier: _getMessageIdentifier(message),
			data: _checkData(data)
		});
	}

	function subscribe(message, callback, thisArg) {
		// Listen for :message, when it occurs :callback will be executed.
		//
		// :thisArg is an optional argument which will override :callback's
		// `this` property

		return _registerSubscriber({
			messageName: _checkMessage(message),
			callback: _checkCallback(callback),
			identifier: _getMessageIdentifier(message),
			thisArg: thisArg
		});
	}

	function unsubscribe(message) {
		// Remove any subscribers with a `name` corresponding to :message.
		// If :message contains an identifier fragment, only subscribers with
		// matching identifiers will be removed

		var identifier = _getMessageIdentifier(message);
		message = _checkMessage(message);

		// Filter out subscriber with matching identifiers
		if (identifier)
			_registry[message] = _registry[message].filter(
				function(subscriber) {
					return subscriber.identifier != this;
				},
				identifier
			);

		// If no identifier was provided, or there are no subscribers left
		if (!identifier || !_registry[message].length)
			delete _registry[message];

		return message;
	}

	function registry() {
		// Returns the internal registry of signals and subscribers

		return _registry;
	}

	////////// Helper functions for the public API //////////

	function _registerSubscriber(subscriber) {
		// Adds :subscriber to the subscriber registry

		var subscribers = _registry[subscriber.messageName];

		if (!subscribers)
			subscribers = _registry[subscriber.messageName] = [];

		subscribers.push(subscriber);

		return subscriber;
	}

	function _publishMessage(message) {
		// Passes :message to each subscriber listening for :message.name

		var subscriberList = _registry[message.name];

		subscriberList.forEach(function(subscriber) {
			// If subscriber has a contextual `this` value to apply, assign it
			// as subscriber.callback's `this`
			if (subscriber.thisArg !== undefined)
				subscriber.callback.call(subscriber.thisArg, message);
			else
				subscriber.callback(message);
		});

		return message;
	}

	///////////////// Argument handling ////////////////

	function _checkMessage(message) {
		// Performs validation on :message and removes any identifier

		// Ensuring message is of type string
		if (typeof message != 'string')
			throw new TypeError('fc.publish: `message` must be a string.');

		// Case-insensitive test for alphanumeric characters, underscores,
		// spaces, colons, and dashes
		if (!/^[a-z0-9_/ /:/-]+$/i.test(message))
			throw new Error(
				'fc.publish: `message` must be a string containing at ' +
				'least one character, and composed only of alphanumeric ' +
				'characters, underscores, spaces, colons, and dashes.'
			);

		// Ensure there are at most 3 colons in :message
		if (_splitMessage(message).length > 3)
			throw new Error(
				'fc.publish: `message` may contain at most three colons, ' +
				'example: `namespace:event:identifier`.'
			);

		return _removeMessageIdentifier(message);
	}

	function _checkCallback(callback) {
		// Ensure :callback is a function

		if (typeof callback != 'function')
			throw new TypeError('fc.subscribe: `callback` must be a function.');

		return callback;
	}

	function _checkData(data) {
		// Ensure :data is either an object or undefined

		if (!_undefinedOrObject(data))
			throw new TypeError(
				'fc.publish: `data` must be either undefined or an object.'
			);

		return data;
	}

	///////////////// Utility functions ////////////////

	function _undefinedOrObject(obj) {
		// Returns true if :obj is either undefined or an object

		if (obj === undefined)
			return true;
		else
			return typeof obj == 'object';
	}

	function _getTimestamp() {
		// Returns a Unix-style time encoding

		return (new Date).getTime();
	}

	function _splitMessage(message) {
		// Returns :message split by the colon character

		return message.split(':');
	}

	function _removeMessageIdentifier(message) {
		// Remove the identifier from :message

		var messageTokens = _splitMessage(message);

		if (messageTokens.length == 1)
			return message;
		else
			return messageTokens[0] + ':' + messageTokens[1];
	}

	function _getMessageIdentifier(message) {
		// If :message has an identifier, return it

		var messageTokens = _splitMessage(message);

		if (messageTokens.length == 3)
			return messageTokens[2];
	}

	// Present a simple API by only returning public methods.
	// Stylistically, underscores should be prepended to any private
	// methods or members
	return {
		publish: publish,
		subscribe: subscribe,
		unsubscribe: unsubscribe,
		registry: registry
	};
})();