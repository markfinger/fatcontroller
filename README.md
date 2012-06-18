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

**Message namespaces**

While using a simple message such as 'object saved' will work fine during the early
stages of development, it will begin to cause issues as a system's complexity increases.
Fat Controller's messages use a specific syntax which can tokenise a message into 
components each of which is split with a colon.

For example, if you have to two modules ``chef`` and ``waiter``, with waiter waiting
for the chef to finish cooking a meal, the message name would be 
``chef:finished-cooking``. When ``chef`` publishes the subscribed message, ``waiter`` 
would then receive the message and respond suitably. Prepending an event with a 
namespace improves the readability and maintainability of message names.

**Message identifiers**

If multiple modules have subscribed to a single message, unsubscribing a single 
subscriber can be problematic. Messages identifiers solve this problem by allowing a 
third token to be inferred. 

Extending the ``chef`` and ``waiter`` example to include a ``dish-washer`` module,
we would end up with both ``dish-washer`` and ``waiter`` subscribing to 
``chef:finished-cooking``. If we wanted to unsubscribe ``waiter``, but have 
``dish-washer`` continue subscribing, we would have to unsubscribe both, then
subscribe ``dish-washer`` again. By using a more explicit message 
``chef:finished-cooking:waiter`` we can unsubscribe just the ``waiter`` module, 
leaving ``dish-washer`` to continue responding to events.

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
