// fatcontroller - simple pub-sub
// https://github.com/markfinger/fatcontroller

define(['lodash'], function(_) {

  // Registry of event bindings
  var registry = {
    // event: [
    //   {
    //     callback: <function>,
    //     once: <boolean>
    //   },
    //   ...
    // ],
    // ...
  };

  var triggeredEvents = {};

  var on = function on(event, callback) {
    var binding = {
      callback: callback,
      once: false
    };
    if (registry[event] === undefined) {
      registry[event] = [];
    }
    registry[event].push(binding);
    return binding;
  };

  var once = function once() {
    var binding = on.apply(this, arguments);
    binding.once = true;
    return binding;
  };

  var after = function after(event, callback) {
    var binding = on.apply(this, arguments);

    if (triggeredEvents[event]) {
      callback();
    }

    return binding;
  };

  var off = function off(event, callback) {
    if (registry.event) {
      if (callback) {
        _.remove(registry[event], function(binding) {
          return binding.callback === callback;
        });
      } else {
        delete registry[event];
      }
    }
  };

  var trigger = function trigger(event) {
    _.invoke(registry[event], 'callback');

    if (!triggeredEvents[event]) {
      triggeredEvents[event] = undefined;
    }
  };

  return {
    on: on,
    once: once,
    after: after,
    off: off,
    trigger: trigger,
    registry: registry
  };

});