================================================================================
Fat Controller
================================================================================

Fat Controller is a JS implementation of a publish-subscribe service.
Using a pub-sub service loosens coupling between system modules.

 - `Basic Usage`_
 - `Subscribe`_
 - `Publish`_
 - `Unsubscribe`_
 - `Registry`_

--------------------------------------------------------------------------------
Basic Usage
--------------------------------------------------------------------------------

Fat Controller's two most import functionalities are publishing messages
(``fc.publish``) and subscribing to messages (``fc.subscribe``).

::
  fc.subscribe('delicious_pie_has_been_baked', function() {
	console.log('Yum, delicious pie!')
  });

  fc.publish('delicious_pie_has_been_baked');

In the above example, ``fc.subscribe`` is used to subscribe to messages about
baking pies and associates them with our callback.
``fc.publish`` then notifies Fat Controller that the pie is baked, which
causes the callback to be executed and our message is logged.

--------------------------------------------------------------------------------
Subscribe
--------------------------------------------------------------------------------
// 	fc.publish(message[, data])
// 		Publish :message to all subscribers.

--------------------------------------------------------------------------------
Publish
--------------------------------------------------------------------------------
// 	fc.subscribe(message, callback[, thisArg])
// 		Listen for :message, calling :callback when the signal is received.

--------------------------------------------------------------------------------
Unsubscribe
--------------------------------------------------------------------------------
// 	fc.unsubscribe(message)
// 		Remove any subscriber listening for :message.

--------------------------------------------------------------------------------
Registry
--------------------------------------------------------------------------------
// 	fc.registry()
// 		Returns an associative array containing all subscribers.
