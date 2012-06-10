// Fat Controller - a messaging/signalling service in JS
// https://github.com/markfinger/fatcontroller

window.fc = (function() {

	///////////////// Public API ////////////////

	function listen(signalName, callback, context) {
		// TODO: expand on this with examples

		// Check the arguments
		signalName = _checkSignalName(signalName);
		callback = _checkCallback(callback);
		context = _checkContext(context);

		// Return an object reflecting the listener's internal representation
		return _registerListener({
			signalName: signalName,
			callback: callback,
			context: context
		});
	}

	function signal(signalName, data) {
		// TODO: expand on this with examples
		// Execute every callback listening for :signalName.
		// :data is an optional object which is passed

		var signal = {
			signalName: _checkSignalName(signalName),
			__timestamp: __getTimestamp()
		};

		if (data)
			signal.data = _checkData(data);

		return _transmit(signal);
	}

	function ignore(signalName) {
		// TODO: expand on this with examples

		// stop listening for :signalName
		// deletes all listeners with a signalName matching :signalName
	}

	///////////////// Internal variables ///////////////

	var _signalRegistery = {};

	///////////////// Argument handling ////////////////

	function _checkSignalName(signalName) {
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
		if (__splitSignalName(signalName).length > 3)
			throw new Error(
				'fc.signal: `signalName` may contain at most three colons, ' +
				'example: `namespace:event:identifier`.'
			);
		return signalName;
	}

	function _checkCallback(callback) {
		// Ensure :callback is a function
		if (typeof callback != 'function')
			throw new Error('fc.listen: `callback` must be a function.');
		return callback;
	}

	function _checkContext(context) {
		// Ensure :context is either an object or undefined
		if (!__undefinedOrObject(context))
			throw new Error(
				'fc.listen: `obj` must be either undefined or an object.'
			);
		return context;
	}

	function _checkData(data) {
		// Ensure :data is either an object or undefined
		if (!__undefinedOrObject(data))
			throw new Error(
				'fc.signal: `data` must be either undefined or an object.'
			);
		return data;
	}


	///////////////// Utility functions ////////////////

	function __undefinedOrObject(obj) {
		if (obj === undefined)
			return true;
		else
			return typeof obj == 'object';
	}

	function __getTimestamp() {
		// Returns a Unix-style time encoding
		return (new Date).getTime();
	}

	function __splitSignalName(signalName) {
		return signalName.split(':');
	}

	////////// Helper functions for the public API //////////

	function _registerListener(listener) {

		var signalNames = __splitSignalName(listener.signalName);

		return listener;
	}

	function _transmit(signal) {
		return signal;
	}

	// Keep a simple API by only returning public methods, underscores should
	// be prepended to any private methods
	return {
		listen: listen,
		signal: signal,
		ignore: ignore
	};
})();
