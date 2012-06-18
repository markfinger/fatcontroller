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
- `Signal Objects`_
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

``fc.publish(message[, data])``

Publish a message to any subscribers who are listening for that specific 
message.

``message`` a string identifying the event to publish.

``data`` an optional variable to pass to each subscriber's callback.

--------------------------------------------------------------------------------
Subscribe
--------------------------------------------------------------------------------

``fc.subscribe(message, callback[, thisArg])``

Subscribe to events concerning a specific message. When the event occurs the 
provided function will be called.

``message`` a string identifying the event to listen for.

``callback`` a function which will receive a `Signal Objects`_.

``thisArg`` an optional argument which will be assigned as the ``this`` object for ``callback``.

--------------------------------------------------------------------------------
Unsubscribe
--------------------------------------------------------------------------------

``fc.unsubscribe(message)``

Removes any subscribers listening for a specific message.

--------------------------------------------------------------------------------
Message Syntax
--------------------------------------------------------------------------------

// 	'namespace:event:identifier'

--------------------------------------------------------------------------------
Signal Objects
--------------------------------------------------------------------------------

//   'namespace:event:identifier'

--------------------------------------------------------------------------------
Registry
--------------------------------------------------------------------------------
``fc.registry()``

Returns an associative array containing all subscribers. Subscribers are grouped 
by the message they are listening for.
