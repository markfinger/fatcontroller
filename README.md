Fat Controller - Javascript Signal Transmission and Receipt
===========================================================

```javascript
    // Using Fat Controller allows you to ensure communication between modules 
    // that are otherwise ignorant of anything outside of their scope or the DOM.

    /////////////////////////////////////////////////////////////////
    //////////////////// FAT CONTROLLER EXAMPLE /////////////////////
    /////////////////////////////////////////////////////////////////

    // Create some receivers and add them into your applications
    app1.receiver = new fatcontroller.receiver;
    app2.receiver = new fatcontroller.receiver;
    
    // Set the receivers to listen for a specific signal and bind a unique response to each.
    app1.receiver.listen("App One: object saved", function(signal) { app1.updateDOM(); };
    app2.receiver.listen("App One: object saved", function(signal) { app2.newObject(signal.data); };
    
    // One module of your system can perform an action, such as saving an object
    // then transmit a signal, with the object attached, which enables every
    // module listening for that signal to receive both the notifiction and 
    // the data
    fatcontroller.transmit("App One: object saved", app1.object);
    
    // Signals are passed into bound functions with three attributes:
    //
    //     signal.name: the signal's name.
    //     signal.data: the attached object.
    //     signal.timestamp: a unix-form timestamp denoting the point at which the signal was transmitted.
    //
```
