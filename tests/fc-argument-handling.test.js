// Unit tests for fc.js
// http://github.com/markfinger/fatcontroller/


////////////////////////////////////////////////////////////////////////////////
//                                 messageName                                 //
////////////////////////////////////////////////////////////////////////////////


module('messageName argument handling', {
	setup: function() { this.callback = function() {}; }
});

test('messageName is empty string', function() {
	raises(function() {
		fc.subscribe('', this.callback);
	});
});

test('messageName contains bad characters', function() {
	raises(function() {
		fc.subscribe('test^test;test/test#test', this.callback);
	});
});

test('messageName contains too many colons', 2, function() {
	raises(function() {
		fc.subscribe('test:test:test:test', this.callback);
	});
	raises(function() {
		fc.subscribe('test:test:test:test:test', this.callback);
	});
});

test('Correctly formatted messageName arguments accepted', 3, function() {
	ok(fc.subscribe('event', this.callback));
	ok(fc.subscribe('namespace:event', this.callback));
	ok(fc.subscribe('namespace:event:identifier', this.callback));
});


////////////////////////////////////////////////////////////////////////////////
//                                 fc.subscribe                                  //
////////////////////////////////////////////////////////////////////////////////


module('fc.subscribe argument handling');

test('Missing messageName and callback', function() {
	raises(function() {
		fc.subscribe();
	});
});

test('Missing callback', function() {
	raises(function() {
		fc.subscribe('test');
	});
});

test('callback is not a function', function() {
	raises(function() {
		fc.subscribe('test', 1);
	});
});

test('Suitable messageName and callback arguments accepted', function() {
	ok(fc.subscribe('test', function(){}));
});

test('Suitable messageName, callback and context arguments accepted', function() {
	ok(fc.subscribe('test', function(){}), {});
});

////////////////////////////////////////////////////////////////////////////////
//                                 fc.publish                                  //
////////////////////////////////////////////////////////////////////////////////

module('fc.publish argument handling');

test('Missing messageName', function() {
	raises(function() {
		fc.publish();
	});
});

test('messageName is empty string', function() {
	raises(function() {
		fc.publish('');
	});
});

test('Correct messageName argument accepted', function() {
	ok(fc.publish('test'));
});

test('data is not an object', function() {
	raises(function() {
		fc.publish('testing', 1);
	});
});

test('Correct messageName and data arguments accepted', function() {
	ok(fc.publish('test', {}));
});

////////////////////////////////////////////////////////////////////////////////
//                                 fc.unsubscribe                                  //
////////////////////////////////////////////////////////////////////////////////

module('fc.unsubscribe argument handling');

test('Missing messageName', function() {
	raises(function() {
		fc.unsubscribe();
	});
});

test('messageName is empty string', function() {
	raises(function() {
		fc.unsubscribe('');
	});
});

test('Correct messageName argument accepted', function() {
	fc.subscribe('test', function() {});
	ok(fc.unsubscribe('test'));
});