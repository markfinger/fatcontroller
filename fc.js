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
		// Passes a clone of :message to each subscriber listening
		// for :message.name

		var subscriberList = _registry[message.name];

		subscriberList.forEach(function(subscriber) {
			// If subscriber has a contextual `this` value to apply, assign it
			// as subscriber.callback's `this`
			if (subscriber.thisArg !== undefined)
				subscriber.callback.call(subscriber.thisArg, _clone(message));
			else
				subscriber.callback(_clone(message));
		});

		return message;
	}

	///////////////// Argument handling ////////////////

	function _checkMessage(message) {
		// Performs validation on :message and removes any identifier

		// Ensuring message is of type string
		if (typeof message != 'string')
			throw new TypeError('fc._checkMessage: `message` must be a string.');

		// Case-insensitive test for alphanumeric characters, underscores,
		// spaces, colons, and dashes
		if (!/^[a-z0-9_/ /:/-]+$/i.test(message))
			throw new Error(
				'fc._checkMessage: `message` must be a string containing at ' +
				'least one character, and composed only of alphanumeric ' +
				'characters, underscores, spaces, colons, and dashes.'
			);

		// Ensure there are at most 3 colons in :message
		if (_splitMessage(message).length > 3)
			throw new Error(
				'fc._checkMessage: `message` may contain at most three colons, ' +
				'example: `namespace:event:identifier`.'
			);

		return _removeMessageIdentifier(message);
	}

	function _checkCallback(callback) {
		// Ensure :callback is a function

		if (typeof callback != 'function')
			throw new TypeError('fc._checkCallback: `callback` must be a function.');

		return callback;
	}

	function _checkData(data) {
		// Ensure :data is either an object or undefined

		if (!_undefinedOrObject(data))
			throw new TypeError(
				'fc._checkData: `data` must be either undefined or an object.'
			);

		return data;
	}

	///////////////// Utility functions ////////////////

	function _clone(obj) {
		// Returns a clone of :obj

		return JSON.parse(JSON.stringify(obj))
	}

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