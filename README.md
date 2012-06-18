Fat Controller
==================================================

A publish-subscribe messaging system in Javascript, which:

- **simplifies communication** between modules,  
- **decouples** system modules, and  
- enables a cleaner style of **event-driven programming**.


Documentation
--------------------------------------------------

- [Basic Example](#basic-example)  
- [Subscribe](#subscribe)  
- [Publish](#publish)  
- [Unsubscribe](#unsubscribe)  
- [Message Syntax](#message-syntax)  
- [Message Objects](#message-objects)  
- [Registry of Subscribers](#registry)  


### Basic Example

Fat Controller's two most import functionalities are publishing messages and 
subscribing to messages.

```javascript
// Subscribe to a specific message and associate our handler with it
fc.subscribe('delicious_pie:is_ready', function() { 
    console.log('The pie is ready!'); 
});

// Publish the same message, which triggers our handler
fc.publish('delicious_pie:is_ready');

// Now our handler gets called and "The pie is ready!" is logged to the console
```


### Publish

``fc.publish(message[, data])``

Publish a message to any subscribers who are listening for that specific 
message.

**Arguments**
- ``message`` a string identifying the event to publish.
- ``data`` an optional variable which is [passed to the callback](#message-objects) of each subscriber.


### Subscribe

``fc.subscribe(message, callback[, thisArg])``

Subscribe to a specific message, the provided function is called when a matching message is published.

**Arguments**
- ``message`` a string identifying the event to listen for.
- ``callback`` a function which is called when a message is published which matches
  the argument ``message``. Callbacks receive a [message object](#message-objects) as the first argument.
- ``thisArg`` an optional argument which ``callback`` will receive as it's 'this' variable.


### Unsubscribe

``fc.unsubscribe(message)``

Removes any subscribers listening for a specific message.

Using [message identifiers](#message-syntax) allows you to easily unsubscribe a single subscriber.


### Message Syntax

The messages sent by Fat Controller can contain alphanumeric characters, dashes, underscores and colons. 

Concise messages will help the flow and logic between modules.

Fat Controller uses a specific syntax for fragmenting a message into tokens. You can ignore the syntax
and only used simple messages such 'object saved', but this can result in more complexity as your
system scales and you have multiple modules publishing different messages.

// 	'namespace:event:identifier'


### Message Objects

//   'namespace:event:identifier'


### Registry

``fc.registry()``

Returns an associative array containing all subscribers. Subscribers are grouped 
by the message they are listening for.
