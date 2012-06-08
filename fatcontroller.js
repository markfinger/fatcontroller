/*
    ////////////////////////////////////////////////////////////////
    Fat Controller - Signal Transmission and Receipt
    https://github.com/markfinger/fatcontroller
    ////////////////////////////////////////////////////////////////
*/

fatcontroller = window.fatcontroller || {};

(function() {

    // Registry of receivers
    fatcontroller.receivers = [];
    
    fatcontroller._register = function(receiver) {
        // Register a new reciever
        this.receivers.push(receiver);
    };
    
    fatcontroller.transmit = function(name, data) {
        // Transmit the arguments out in fatcontroller.signal form.

        var signal = new this.signal(name, data),
			receivers = this.receivers;
        // Transmit to all receivers
        for (var i in receivers)
            receivers[i].receive(signal);
    };
    
    //----------------Fat Controller's models---------------------
    
    fatcontroller.signal = function Signal(name, data) {
        // Signals are transmitted to all registered receivers.
        
        // The value used by receivers to identify signals
        this.name = name;
        // Optional payload with the signal
        if (data)
            this.data = data;
        // Set a timestamp
        this.timestamp = (new Date).getTime();
    };
    
    fatcontroller.receiver = function Receiver() {
        // Receivers map transmitted signals to bound functions.

        // Format: { 'signal name' : [function() {}, ...], ... }
        this.signals = {};

		// Register with the fatcontroller's receivers
		fatcontroller._register(this);
        
        this.listen = function(signal, binding) {
            // Listen for signals with a name matching :signal and bind
            // :binding as a response.

            var signals = this.signals;
            // If the signal is already being listened for, add the binding,
            // otherwise add the signal with the binding.
            if (signals[signal])
                signals[signal].push(binding);
            else
                signals[signal] = [binding];
        };
        
        this.receive = function(signal) {
            // Passes :signal to any functions bound to :signal.name.

			var signals = this.signals;
            // If listening for this signal
            if (signals[signal.name]) {
                var bindings = signals[signal.name];
                // Pass the signal into each of the bound functions
                for(var i in bindings)
                    bindings[i](signal);
            }
        };
    };
})();
