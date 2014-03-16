fatcontroller
=============

**Simple pub sub, with pre/post bindings and debug tracing**

### Install

`bower install --save fatcontroller`

### Dependencies

- Lodash/Underscore

### Basic Usage

```javascript
fc.on('some:event', function() {
  // ...
});

fc.trigger('some:event');
```

### Documentation by example

```javascript
// Single use bindings are available

fc.once('some:event', someFunction);



// Post bindings can be bound and triggered after an event occurred.
// This is useful when asynchronous modules depend on state changes.

// Something denotes a state change
fc.trigger('some:event');

// The binding will immediately be called as the event has occurred
fc.after('some:event', someFunction);

// Post bindings can also defer the callback until multiple events have
// all occurred
fc.afterAll(['some:event', 'another:event', 'yet:another:event'], someFunction);


// Debug tracing will trace and log all the actions that are
// being sent through fatcontroller

fc.debug = true;

// Logs a stack trace indicating where the binding originated from
fc.on('some:event', someFunction);

// Logs a stack trace indicating where the event was triggered
fc.trigger('some:event');



// Bindings can be removed by event name and callback

fc.off('some:event');
fc.off('some:event', someFunction);
```
