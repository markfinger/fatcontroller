fatcontroller
=============

*simple pub sub, with pre/post bindings and debug tracing*

```javascript
// Basic usage

define(['fc'], function(fc) {

  fc.on('some:event', function() {
    // ...
  });

  // ...

  fc.trigger('some:event');

});



// Single use bindings are available
fc.once('some:event', function() {
  // ...
});



// Post bindings can be triggered after an event occurred.
// This is useful when asynchronous operations depend on state changes

fc.trigger('some:event');

fc.after('some:event', function() {
   // ...
});



// Debug tracing will log all the actions that are being sent through fatcontroller

fc.debug = true;

fc.on('some:event', function() {
  // ...
});
// Logs a stack trace indicating where the binding originated from

fc.trigger('some:event');
// Logs a stack trace indicating where the event was triggered



// Bindings can be removed by event name and callback
fc.off('some:event');
fc.off('some:event', someFunction);
```