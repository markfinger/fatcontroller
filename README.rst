--------------------------------------------------------------------------------
Fat Controller
--------------------------------------------------------------------------------

A JS publish-subscribe messaging system, which:

- **simplifies communication** between modules,
- **decouples** system modules, and
- enables a cleaner style of **event-driven programming**.

Documentation:

- `Basic Example`_
- `Subscribe`_
- `Publish`_
- `Unsubscribe`_
- `Message Syntax`_
- `Registry`_

--------------------------------------------------------------------------------
Basic Example
--------------------------------------------------------------------------------

Fat Controller's two most import functionalities are publishing messages and 
subscribing to messages.

::

  // Subscribe to a specific message and associate our handler with it
  fc.subscribe('delicious_pie:is_ready', function() { 
      console.log('The pie is ready!'); 
  });
  
  // Publish the same message, which triggers our handler
  fc.publish('delicious_pie:is_ready');
  
  // Now our handler gets called and "The pie is ready!" is logged to the console

--------------------------------------------------------------------------------
Publish
--------------------------------------------------------------------------------
// 	fc.publish(message[, data])
// 		Publish :message to all subscribers.

--------------------------------------------------------------------------------
Subscribe
--------------------------------------------------------------------------------
// 	fc.subscribe(message, callback[, thisArg])
// 		Listen for :message, calling :callback when the signal is received.

--------------------------------------------------------------------------------
Unsubscribe
--------------------------------------------------------------------------------
// 	fc.unsubscribe(message)
// 		Remove any subscriber listening for :message.

--------------------------------------------------------------------------------
Message Syntax
--------------------------------------------------------------------------------
// 	'namespace:event:identifier'

--------------------------------------------------------------------------------
Registry
--------------------------------------------------------------------------------
// 	fc.registry()
// 		Returns an associative array containing all subscribers.
