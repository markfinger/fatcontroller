// Unit tests for fc.js
// http://github.com/markfinger/fatcontroller/


////////////////////////////////////////////////////////////////////////////////
//                                 signalName                                 //
////////////////////////////////////////////////////////////////////////////////


module('signalName testing for listening and signalling');

test('can receive a variety of different signalName arguments each of which are mapped correctly', 3, function() {
	var callback = function() {
		ok(true, 'this should execute');
	};

	fc.listen('event1', callback);
	fc.signal('event1');

	fc.listen('namespace2:event2', callback);
	fc.signal('namespace2:event2');

	fc.listen('namespace3:event3:identification3', callback);
	fc.signal('namespace3:event3:identification3');
});

test('Ignores the identifer when broadcasting signals', 3, function() {
	var callback = function() {
		ok(true, 'this should execute');
	};

	fc.listen('namespace:event', callback);
	fc.listen('namespace:event:identifier1', callback);
	fc.listen('namespace:event:identifier2', callback);
	fc.signal('namespace:event');
});

test('Signal passed to callback has the correct signalName despite identifier', 2, function() {
	var signalName1 = 'testsignalName:testsignalName',
		callback1 = function(signal) {
			equal('testsignalName:testsignalName', signal.signalName, 'signal.signalName is correct');
		},
		signalName2 = 'testsignalName:testsignalName:testsignalName',
		callback2 = function(signal) {
			equal('testsignalName:testsignalName', signal.signalName, 'signal.signalName is correct');
		};
	fc.listen(signalName1, callback1);
	fc.listen(signalName2, callback2);
	fc.signal(signalName1); // signalName2's identifier should be ignored and callback2 will run
});


////////////////////////////////////////////////////////////////////////////////
//                                 fc.listen                                  //
////////////////////////////////////////////////////////////////////////////////


module('fc.listen behaviour tests');

test('returns a listener object with the correct members', 4, function() {
	var signalName = 'some_namespace1:some_event1',
		callback = function() { return signalName; },
		context = { this: this },
		listener = fc.listen(signalName, callback, context);

	equal(signalName, listener.signalName, 'listener.signalName is correct');
	equal(callback, listener.callback, 'listener.callback is correct');
	equal(signalName, listener.callback(), 'listener.callback returns the correct value');
	deepEqual(context, listener.context, 'listener.context is correct');
});

test('handles signalName identifiers correctly', 2, function() {
	var signalName = 'some_namespace1:some_event1:some_identifier1',
		callback = function() {},
		listener = fc.listen(signalName, callback);

	equal('some_namespace1:some_event1', listener.signalName, 'listener.signalName is correct');
	equal('some_identifier1', listener.identifier, 'listener.identifier is correct');
});

test('can listen for a signal which executes the callback', 1, function() {
	var signalName = 'some_namespace2:some_event2:some_identifier2',
		callback = function() { ok(true, 'this should execute'); };

	fc.listen(signalName, callback);
	fc.signal(signalName);
});


////////////////////////////////////////////////////////////////////////////////
//                                 fc.signal                                  //
////////////////////////////////////////////////////////////////////////////////


module('fc.signal behaviour tests');

test('fc.signal throws an error if no listeners for signalName', 1, function() {
	raises(function() {
		fc.signal('nothing_is_listening_for_this')
	});
});

test('fc.signal takes and passed data to callbacks', 1, function() {
	fc.listen('test_event', function(signal) {
		ok(signal.data.apple == 'green')
	});
	fc.signal('test_event', { apple: 'green' })
});

test('can receive a variety of different context arguments each of which becomes `this` for the callback', 5, function() {
	var callback1 = function() { // object
			this.contextFunction();
		},
		context1 = {
			contextFunction: function() { ok(true, 'this should execute'); }
		},
		callback2 = function() { // object
			equal(true, this.test);
		},
		context2 = new function() {
			this.test = true;
		},
		callback3 = function() { // number
			equal(3, this);
		},
		context3 = 3,
		callback4 = function() { // boolean
			equal(true, this);
		},
		context4 = true,
		callback5 = function() { // string
			equal('test', this);
		},
		context5 = 'test';

	fc.listen('test1', callback1, context1);
	fc.listen('test2', callback2, context2);
	fc.listen('test3', callback3, context3);
	fc.listen('test4', callback4, context4);
	fc.listen('test5', callback5, context5);
	fc.signal('test1');
	fc.signal('test2');
	fc.signal('test3');
	fc.signal('test4');
	fc.signal('test5');
});

test('callback has access to signal object', 1, function() {
	var signalName = 'some_namespace4:some_event4:some_identifier4',
		callback = function(signal) {
			signal.data.testFunction();
		},
		data = {
			testFunction: function() { ok(true, 'this should execute'); }
		};

	fc.listen(signalName, callback);
	fc.signal(signalName, data);
});

////////////////////////////////////////////////////////////////////////////////
//                                 fc.ignore                                  //
////////////////////////////////////////////////////////////////////////////////


module('fc.ignore behaviour tests', {
	setup: function() {
		this.callback = function() { ok(true, 'This should be called') };
	}
});

test('fc.ignore succesfully removes all listeners', 5, function() {
	fc.listen('ignore_test', this.callback);
	fc.listen('ignore_test', this.callback);
	ok(fc.registry()['ignore_test'].length == 2);
	fc.signal('ignore_test');
	fc.ignore('ignore_test');
	ok(fc.registry()['ignore_test'] === undefined);
	raises(function() {
		fc.signal('ignore_test');
	});
});

test('fc.ignore succesfully removes all listeners with identifiers', 4, function() {
	fc.listen('testo_namespace:testo_event:testo_identifier', this.callback);
	fc.listen('testo_namespace:testo_event:another_testo_identifier', this.callback);
	ok(fc.registry()['testo_namespace:testo_event'].length == 2);
	fc.signal('testo_namespace:testo_event');
	fc.ignore('testo_namespace:testo_event');
	ok(fc.registry()['testo_namespace:testo_event'] === undefined);
});

test('fc.ignore succesfully removes only listeners with matching identifiers, if an identifier is provided', 5, function() {
	fc.listen('testoo_namespace:testoo_event', this.callback);
	fc.listen('testoo_namespace:testoo_event', this.callback);
	fc.listen('testoo_namespace:testoo_event:testoo_identifier', this.callback);
	fc.listen('testoo_namespace:testoo_event:testoo_identifier', this.callback);
	fc.listen('testoo_namespace:testoo_event:another_testoo_identifier', this.callback);
	ok(fc.registry()['testoo_namespace:testoo_event'].length == 5);
	fc.ignore('testoo_namespace:testoo_event:testoo_identifier');
	fc.signal('testoo_namespace:testoo_event');
	ok(fc.registry()['testoo_namespace:testoo_event'].length == 3);
});

////////////////////////////////////////////////////////////////////////////////
//                                 fc.registry                                //
////////////////////////////////////////////////////////////////////////////////


module('fc.registry behaviour tests');

test('fc.registry succesfully returns all listeners', 2, function() {
	fc.listen('registry_test', function() {});
	fc.listen('registry_test', function() {});
	fc.listen('other_registry_test', function() {});
	ok(fc.registry()['registry_test'].length == 2);
	ok(fc.registry()['other_registry_test'].length == 1);
});