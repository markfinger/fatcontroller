Fat Controller - Javascript Signal Transmission and Receipt
================================

```javascript
    // Using Fat Controller allows you to ensure communication between modules 
    // that are otherwise ignorant of anything outside of their scope or the DOM.

    /////////////////////////////////////////////////////////////////
    //////////////////// FAT CONTROLLER EXAMPLE /////////////////////
    /////////////////////////////////////////////////////////////////

    // Create some receivers and add them into your applications
    app1.receiver = new fatcontroller.receiver("App One's Receiver");
    app2.receiver = new fatcontroller.receiver("App Two's Receiver");
    
    // Register the receivers
    fatcontroller.register(app1.receiver);
    fatcontroller.register(app2.receiver);
    
    // Set the receivers to listen for a specific signal and bind a unique response to each.
    app1.receiver.listen("App One: object saved", function(signal) { app1.updateDOM(); };
    app2.receiver.listen("App One: object saved", function(signal) { app2.newObject(signal.data); };
    
    // One module of your system performs an action...
    app1.object.save()
    // ...the module then sends a signal with an attached object.
    fatcontroller.transmit("App One: object saved", object);
    // Each receiver will receive the signal and perform their unique responses to the event.
    //     app1 updates the DOM to reflect any changes and
    //     app2 creates a new object to reflect the changes in app1.
    
    // Signals are passed into bound functions with three attributes:
    //
    //     signal.name: the signal's name.
    //     signal.data: the attached object.
    //     signal.timestamp: a unix-form timestamp denoting the point at which the signal was transmitted.
    //
    
    // You can register as many receivers as you like, each of which can listen
    // for as many signals as you like, each possessing a unique response to the signal.
```
