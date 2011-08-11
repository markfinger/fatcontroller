# Fat Controller - Javascript Signal Transmission and Receipt

```javascript
    // Using Fat Controller allows you to ensure communication between modules 
    // that are other ignorant of anything outside of the DOM.

    // Create a receiver
    myReceiver = new fatcontroller.receiver('My Receiver');
    
    // Register a receiver
    fatcontroller.register(myReceiver);
    
    // Set the receiver to listen for a specific signal and bind a response to it
    myReceiver.listen('System event', function(data) {
        // process data
    };
    
    // Send a signal, which will be received by all registered receivers
    fatcontroller.transmit('System event', myData);
    
    // myReceiver receives the signal and passes myData into the function
    
    // You can register as many receivers as you like, each of which can listen
    // for as many signals as you like.
```
