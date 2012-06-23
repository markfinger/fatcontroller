Fat Controller
==================================================

A publish-subscribe messaging system in Javascript, which:

- **simplifies communication** between modules,
- **decouples** system modules, and
- enables a cleaner style of **event-driven programming**.


**Documentation:**

- [Basic Example](#basic-example)  
- [Subscribe](#subscribe)  
- [Publish](#publish)  
- [Unsubscribe](#unsubscribe)  
- [Message Syntax](#message-syntax)  
- [Message Objects](#message-objects)  
- [Registry of Subscribers](#registry)  


Basic Example
--------------------------------------------------

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


Publish
--------------------------------------------------

``fc.publish(message[, data])``

Publish a message to any subscribers who are listening for that specific 
message.

**Arguments:**
- ``message`` a string identifying the event to publish. [Message syntax](#message-syntax).
- ``data`` an optional variable which is [passed to the callback](#message-objects) of each subscriber.


Subscribe
--------------------------------------------------

``fc.subscribe(message, callback[, thisArg])``

Subscribe to a specific message, the provided function is called when a matching message is published.

**Arguments:**
- ``message`` a string identifying the event to listen for. [Message syntax](#message-syntax).
- ``callback`` a function which is called when a message is published which matches
  the argument ``message``. Callbacks receive a [message object](#message-objects) as the first argument.
- ``thisArg`` an optional argument which ``callback`` will receive as it's 'this' variable.


Unsubscribe
--------------------------------------------------

``fc.unsubscribe(message)``

Removes any subscribers listening for a specific message.

Using [message identifiers](#message-syntax) allows you to easily unsubscribe a single subscriber.


Message Syntax
--------------------------------------------------

Fat Controller accepts strings as messages, for example 'object saved'. Messages 
may contain alphanumeric characters, underscores, spaces, colons, and dashes.

Messages used with Fat Controller can optionally take advantage of a syntax which splits a message 
into specific tokens, delimited by colons. Messages are tokenised into *namespaces*, *events*, and 
*identifiers*, for example: 'namespace:event:identifier'. *Namespaces* improve the readability of 
a message and prevent the chance of multiple events with a similar name. *Identifiers* are used to 
specify a particular subscriber when unsubscribing them.

For example, if a module named 'waiter' was subscribing for another module 'chef' to publish a 
message 'prepared-meal', the subscription message from 'waiter' would be ``chef:prepared-meal:waiter`` 
and the published message from 'chef' would be ``chef:prepared-meal``.

```javascript
// `waiter` listens for `chef` to publish a specific message
fc.subscribe('chef:prepared-meal:waiter', waiter.preparedMealHandler);

// `chef` publishes the event and waiter.preparedMealHandler is called. 
fc.publish('chef:prepared-meal');

// Only the subscription from `waiter` is removed.
// Any other subscriptions for 'chef:prepared-meal' continue.
fc.unsubscribe('chef:prepared-meal:waiter')
```

*Namespaces* are useful in most cases as they drastically improve the readibility of a 
message. The main use of *identifiers* is when an event has multiple subscribers and you need to 
unsubscribe only one.

Message Objects
--------------------------------------------------

Callbacks provided to [fc.publish()](#subscribe) will receive a message object as
their first argument, when a corresponding message is published.

**Message objects contain:**
- ``name`` a string containing the namespace and event of the published message. 
- ``timestamp`` a unix-style timestamp representing the time the message was published.
- ``identifier`` any identifier fragment contained within the published message.
- ``data`` a payload of data delivered to each subscriber.


Registry
--------------------------------------------------

``fc.registry()``

Returns an associative array containing all subscribers. Subscribers are grouped 
by the message (namespace and event) they are listening for.

**Subscribers contain:**
- ``messageName`` a string containing the namespace and event of the subscribed message.
- ``callback`` the function executed when a matching message is published.
- ``identifier`` any identifier fragment contained within the subscribed message.
- ``thisArg`` assigned as the 'this' object of ``callback``.
