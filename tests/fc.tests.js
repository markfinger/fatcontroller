/*
Unit tests for fc.js

http://github.com/markfinger/fatcontroller/
*/

/*

listen for an event, provide callback with data + signal
	can listen for an event, callback executes
	can receive a signal, containing data
	can provide extra data for the callback

signal an event, providing data for the signal
	signal has signalName
	signal can take optional data in dict form
	signalling argument can be a string or a string + dict

unbind a signal and callback
	'event'
	'namespace:event'
	'namespace:event:identifier'
 */


module('signalName argument handling');

test('signalName is empty string', function() {
	raises(function() {
		fc.signal('');
	});
});

test('signalName contains bad characters', function() {
	raises(function() {
		fc.signal('test^test;test/test#test');
	});
});

test('signalName contains too many colons', 2, function() {
	raises(function() {
		fc.signal('test:test:test:test');
	});
	raises(function() {
		fc.signal('test:test:test:test:test');
	});
});

test('Correctly formatted signalName arguments accepted', 3, function() {
	ok(fc.signal('event'));
	ok(fc.signal('namespace:event'));
	ok(fc.signal('namespace:event:identifier'));
});



module('fc.listen argument handling');

test('Missing signalName and callback', function() {
	raises(function() {
		fc.listen();
	});
});

test('Missing callback', function() {
	raises(function() {
		fc.listen('test');
	});
});

test('callback is not a function', function() {
	raises(function() {
		fc.listen('test', 1);
	});
});

test('Suitable signalName and callback arguments accepted', function() {
	ok(fc.listen('test', function(){}));
});

test('Unsuitable context argument provided', function() {
	raises(function() {
		fc.listen('test', function(){}, 1)
	});
});

test('Suitable signalName, callback and context arguments accepted', function() {
	ok(fc.listen('test', function(){}), {});
});



module('fc.signal argument handling');

test('Missing signalName', function() {
	raises(function() {
		fc.signal();
	});
});

test('signalName is empty string', function() {
	raises(function() {
		fc.signal('');
	});
});

test('Correct signalName argument accepted', function() {
	ok(fc.signal('test'));
});

test('data is not an object', function() {
	raises(function() {
		fc.signal('testing', 1);
	});
});

test('Correct signalName and data arguments accepted', function() {
	ok(fc.signal('test', {}));
});