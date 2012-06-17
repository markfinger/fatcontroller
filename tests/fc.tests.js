// Unit tests for fc.js
// http://github.com/markfinger/fatcontroller/


////////////////////////////////////////////////////////////////////////////////
//                                 messageName                                 //
////////////////////////////////////////////////////////////////////////////////


module('messageName testing for listening and signalling');

test('can receive a variety of different messageName arguments each of which are mapped correctly', 3, function() {
	var callback = function() {
		ok(true, 'this should execute');
	};

	fc.subscribe('event1', callback);
	fc.publish('event1');

	fc.subscribe('namespace2:event2', callback);
	fc.publish('namespace2:event2');

	fc.subscribe('namespace3:event3:identification3', callback);
	fc.publish('namespace3:event3:identification3');
});

test('Ignores the identifer when broadcasting signals', 3, function() {
	var callback = function() {
		ok(true, 'this should execute');
	};

	fc.subscribe('namespace:event', callback);
	fc.subscribe('namespace:event:identifier1', callback);
	fc.subscribe('namespace:event:identifier2', callback);
	fc.publish('namespace:event');
});

test('Signal passed to callback has the correct messageName despite identifier', 2, function() {
	var messageName1 = 'testmessageName:testmessageName',
		callback1 = function(signal) {
			equal('testmessageName:testmessageName', signal.name, 'signal.name is correct');
		},
		messageName2 = 'testmessageName:testmessageName:testmessageName',
		callback2 = function(signal) {
			equal('testmessageName:testmessageName', signal.name, 'signal.name is correct');
		};
	fc.subscribe(messageName1, callback1);
	fc.subscribe(messageName2, callback2);
	fc.publish(messageName1); // messageName2's identifier should be ignored and callback2 will run
});


////////////////////////////////////////////////////////////////////////////////
//                                 fc.subscribe                                  //
////////////////////////////////////////////////////////////////////////////////


module('fc.subscribe behaviour tests');

test('returns a subscriber object with the correct members', 4, function() {
	var messageName = 'some_namespace1:some_event1',
		callback = function() { return messageName; },
		context = { this: this },
		subscriber = fc.subscribe(messageName, callback, context);

	equal(messageName, subscriber.messageName, 'subscriber.messageName is correct');
	equal(callback, subscriber.callback, 'subscriber.callback is correct');
	equal(messageName, subscriber.callback(), 'subscriber.callback returns the correct value');
	deepEqual(context, subscriber.thisArg, 'subscriber.context is correct');
});

test('handles messageName identifiers correctly', 2, function() {
	var messageName = 'some_namespace1:some_event1:some_identifier1',
		callback = function() {},
		subscriber = fc.subscribe(messageName, callback);

	equal('some_namespace1:some_event1', subscriber.messageName, 'subscriber.messageName is correct');
	equal('some_identifier1', subscriber.identifier, 'subscriber.identifier is correct');
});

test('can listen for a signal which executes the callback', 1, function() {
	var messageName = 'some_namespace2:some_event2:some_identifier2',
		callback = function() { ok(true, 'this should execute'); };

	fc.subscribe(messageName, callback);
	fc.publish(messageName);
});


////////////////////////////////////////////////////////////////////////////////
//                                 fc.publish                                  //
////////////////////////////////////////////////////////////////////////////////


module('fc.publish behaviour tests');

test('fc.publish takes and passed data to callbacks', 1, function() {
	fc.subscribe('test_event', function(signal) {
		ok(signal.data.apple == 'green')
	});
	fc.publish('test_event', { apple: 'green' })
});

test('can receive a variety of different `this` arguments each of which becomes `this` for the callback', 5, function() {
	var callback1 = function() { // object
			this.thisFunction();
		},
		this1 = {
			thisFunction: function() { ok(true, 'this should execute'); }
		},
		callback2 = function() { // object
			equal(true, this.test);
		},
		this2 = new function() {
			this.test = true;
		},
		callback3 = function() { // number
			equal(3, this);
		},
		this3 = 3,
		callback4 = function() { // boolean
			equal(true, this);
		},
		this4 = true,
		callback5 = function() { // string
			equal('test', this);
		},
		this5 = 'test';

	fc.subscribe('test1', callback1, this1);
	fc.subscribe('test2', callback2, this2);
	fc.subscribe('test3', callback3, this3);
	fc.subscribe('test4', callback4, this4);
	fc.subscribe('test5', callback5, this5);
	fc.publish('test1');
	fc.publish('test2');
	fc.publish('test3');
	fc.publish('test4');
	fc.publish('test5');
});

test('callback has access to signal object', 1, function() {
	var messageName = 'some_namespace4:some_event4:some_identifier4',
		callback = function(signal) {
			signal.data.testFunction();
		},
		data = {
			testFunction: function() { ok(true, 'this should execute'); }
		};

	fc.subscribe(messageName, callback);
	fc.publish(messageName, data);
});

////////////////////////////////////////////////////////////////////////////////
//                                 fc.unsubscribe                                  //
////////////////////////////////////////////////////////////////////////////////


module('fc.unsubscribe behaviour tests', {
	setup: function() {
		this.callback = function() { ok(true, 'This should be called') };
	}
});

test('fc.unsubscribe succesfully removes all subscribers', 5, function() {
	fc.subscribe('ignore_test', this.callback);
	fc.subscribe('ignore_test', this.callback);
	ok(fc.registry()['ignore_test'].length == 2);
	fc.publish('ignore_test');
	fc.unsubscribe('ignore_test');
	ok(fc.registry()['ignore_test'] === undefined);
	raises(function() {
		fc.publish('ignore_test');
	});
});

test('fc.unsubscribe succesfully removes all subscribers with identifiers', 4, function() {
	fc.subscribe('testo_namespace:testo_event:testo_identifier', this.callback);
	fc.subscribe('testo_namespace:testo_event:another_testo_identifier', this.callback);
	ok(fc.registry()['testo_namespace:testo_event'].length == 2);
	fc.publish('testo_namespace:testo_event');
	fc.unsubscribe('testo_namespace:testo_event');
	ok(fc.registry()['testo_namespace:testo_event'] === undefined);
});

test('fc.unsubscribe succesfully removes only subscribers with matching identifiers, if an identifier is provided', 5, function() {
	fc.subscribe('testoo_namespace:testoo_event', this.callback);
	fc.subscribe('testoo_namespace:testoo_event', this.callback);
	fc.subscribe('testoo_namespace:testoo_event:testoo_identifier', this.callback);
	fc.subscribe('testoo_namespace:testoo_event:testoo_identifier', this.callback);
	fc.subscribe('testoo_namespace:testoo_event:another_testoo_identifier', this.callback);
	ok(fc.registry()['testoo_namespace:testoo_event'].length == 5);
	fc.unsubscribe('testoo_namespace:testoo_event:testoo_identifier');
	fc.publish('testoo_namespace:testoo_event');
	ok(fc.registry()['testoo_namespace:testoo_event'].length == 3);
});

////////////////////////////////////////////////////////////////////////////////
//                                 fc.registry                                //
////////////////////////////////////////////////////////////////////////////////


module('fc.registry behaviour tests');

test('fc.registry succesfully returns all subscribers', 2, function() {
	fc.subscribe('registry_test', function() {});
	fc.subscribe('registry_test', function() {});
	fc.subscribe('other_registry_test', function() {});
	ok(fc.registry()['registry_test'].length == 2);
	ok(fc.registry()['other_registry_test'].length == 1);
});