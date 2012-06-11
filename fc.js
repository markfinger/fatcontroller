// Fat Controller - a messaging/signalling service in JS
// https://github.com/markfinger/fatcontroller

window.fc = (function() {

	var _registry = {};

	///////////////// Public API ////////////////

	// TODO: move basic examples out of functions into here, leave complicated examples for the docs

	function listen(signalName, callback, context) {
		// Listen for :signalName, when it occurs :callback will be executed.
		//
		// :context is an optional argument which will override :callback's
		// `this` property.
		//
		// Basic example:
		// ```
		// 	fc.listen('object_saved', function() {
		// 		console.log('an object has been saved');
		// 	});
		// ```

		var listener = {
			signalName: _checkSignalName(signalName),
			callback: _checkCallback(callback),
			identifier: _getIdentifier(signalName),
			context: context
		};

		return _registerListener(listener);
	}

	function signal(signalName, data) {
		// Execute every callback listening for :signalName.
		// :data is an optional object which is passed to every callback

		var signal = {
			signalName: _checkSignalName(signalName),
			timestamp: _getTimestamp(),
			identifier: _getIdentifier(signalName),
			data: _checkData(data)
		};

		return _transmit(signal);
	}

	function ignore(signalName) {
		// Remove all listeners with signalNames corresponding to :signalName.

		var identifier = _getIdentifier(signalName);
		signalName = _checkSignalName(signalName);

		if(!_registry[signalName])
			throw new Error(
				'fc.ignore: no listeners currently listening for "' +
				signalName + '"'
			);

		// Filter out listeners with matching identifiers
		if(identifier)
			_registry[signalName] = _registry[signalName].filter(
				function(listener) {
					return listener.identifier != this;
				},
				identifier
			);

		// If no identifier was provided, or there are no listeners left
		if (!identifier || !_registry[signalName].length)
			delete _registry[signalName];

		return signalName;
	}

	function registry() {
		// Returns the internal registry of signals and listeners
		return _registry;
	}

	////////// Helper functions for the public API //////////

	function _registerListener(listener) {

		var listenerList = _registry[listener.signalName];

		if (!listenerList)
			listenerList = _registry[listener.signalName] = [];

		listenerList.push(listener);

		return listener;
	}

	function _transmit(signal) {
		var listenerList = _registry[signal.signalName];

		if (!listenerList)
			throw new Error(
				'fc.signal: no listeners for "' + signal.signalName + '"'
			);

		for (var i=0; i<listenerList.length; i++) {
			var listener = listenerList[i];
			// Assign listener.context as callback's `this`
			listener.callback.call(listener.context, signal);
		}

		return signal;
	}

	///////////////// Argument handling ////////////////

	function _checkSignalName(signalName) {
		// Performs validation on :signalName and removes any identifier
		//
		// Best practice for signalName's is 'namespace:event:identifier',
		// although any alphanumeric string will suffice. The advantage of using
		// the namespace and event is that it allows for an identifier field
		// for uniquely identifying listeners.

		// Ensuring signalName is of type string
		if (typeof signalName != 'string')
			throw new Error('fc.signal: `signalName` must be a string.');
		// Case-insensitive search for alphanumeric characters, underscores,
		// dashes and colons
		if (signalName.search(/^[a-z0-9_/:/-]+$/i) == -1)
			throw new Error(
				'fc.signal: `signalName` must be a string containing at ' +
				'least one character, and composed only of alphanumeric ' +
				'characters, underscores, dashes and colons.'
			);
		// Ensure there are at most 3 colons in :signalName
		if (_splitSignalName(signalName).length > 3)
			throw new Error(
				'fc.signal: `signalName` may contain at most three colons, ' +
				'example: `namespace:event:identifier`.'
			);
		return _removeIdentifier(signalName);
	}

	function _checkCallback(callback) {
		// Ensure :callback is a function
		if (typeof callback != 'function')
			throw new Error('fc.listen: `callback` must be a function.');
		return callback;
	}

	function _checkData(data) {
		// Ensure :data is either an object or undefined
		if (!_undefinedOrObject(data))
			throw new Error(
				'fc.signal: `data` must be either undefined or an object.'
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

	function _splitSignalName(signalName) {
		// Returns :signalName split by the colon character
		return signalName.split(':');
	}

	function _removeIdentifier(signalName) {
		// Remove the identifier from the signalName
		var signalTokens = _splitSignalName(signalName);
		if (signalTokens.length == 1)
			return signalName;
		else
			return signalTokens[0] + ':' + signalTokens[1];
	}

	function _getIdentifier(signalName) {
		// Remove the identifier from the signalName
		var signalTokens = _splitSignalName(signalName);
		return signalTokens.length == 3 ? signalTokens[2] : undefined;
	}

	///////////////// Public API instantiation ////////////////

	// Present a simple API by only returning public methods.
	// Stylistically, underscores should be prepended to any private
	// methods or members
	return {
		registry: registry,
		listen: listen,
		signal: signal,
		ignore: ignore
	};
})();
