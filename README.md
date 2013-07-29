fatcontroller - simple pub sub (AMD & non-AMD compatible)
=========================================================

```javascript
// Basic usage

fc.on('some:event', function() {
  // ...
});

fc.trigger('some:event');

fc.off('some:event');


// ====================
// ======= DOCS =======
// ====================

// Use `fc.on` to add bindings. It requires two args:
// 1.  a string identifying the event,
// 2.  a function to bind to the event,
// and has an optional third (3) argument which will be the
// function's `this` argument.
fc.on('some:event', function() {
  console.log(this); // thisArg
  // ...
}, thisArg);


// Use `fc.trigger` to trigger calls to an event's bindings
fc.trigger('some:event');


// Use `fc.off` to remove bindings. It requires one of three possible arguments,
// 1.  an event string,
// 2.  a bound function, or
// 3.  the `this` argument used.
// the position of an argument denotes it's role, you can pad the arguments with falsy values
fc.off('some:event');
fc.off(null, someFunction);
fc.off(null, null, thisArg);
```