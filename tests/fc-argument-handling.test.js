// Unit tests for fc.js
// http://github.com/markfinger/fatcontroller/


////////////////////////////////////////////////////////////////////////////////
//                                 signalName                                 //
////////////////////////////////////////////////////////////////////////////////


module('signalName argument handling', {
	setup: function() { this.callback = function() {}; },
	teardown: function() { fc.registry = {}; }
});

test('signalName is empty string', function() {
	raises(function() {
		fc.listen('', this.callback);
	});
});

test('signalName contains bad characters', function() {
	raises(function() {
		fc.listen('test^test;test/test#test', this.callback);
	});
});

test('signalName contains too many colons', 2, function() {
	raises(function() {
		fc.listen('test:test:test:test', this.callback);
	});
	raises(function() {
		fc.listen('test:test:test:test:test', this.callback);
	});
});

test('Correctly formatted signalName arguments accepted', 3, function() {
	ok(fc.listen('event', this.callback));
	ok(fc.listen('namespace:event', this.callback));
	ok(fc.listen('namespace:event:identifier', this.callback));
});


////////////////////////////////////////////////////////////////////////////////
//                                 fc.listen                                  //
////////////////////////////////////////////////////////////////////////////////


module('fc.listen argument handling', {
	teardown: function() { fc.registry = {}; }
});

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

test('Suitable signalName, callback and context arguments accepted', function() {
	ok(fc.listen('test', function(){}), {});
});

////////////////////////////////////////////////////////////////////////////////
//                                 fc.signal                                  //
////////////////////////////////////////////////////////////////////////////////

module('fc.signal argument handling', {
	teardown: function() { fc.registry = {}; }
});

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