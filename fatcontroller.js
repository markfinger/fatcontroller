/*
    ////////////////////////////////////////////////////////////////
    Fat Controller - Javascript Signal Transmitter
    https://github.com/mfinger/fatcontroller
    mark.finger@gmail.com
    ////////////////////////////////////////////////////////////////

    This is free and unencumbered software released into the public domain.

    Anyone is free to copy, modify, publish, use, compile, sell, or
    distribute this software, either in source code form or as a compiled
    binary, for any purpose, commercial or non-commercial, and by any
    means.

    In jurisdictions that recognize copyright laws, the author or authors
    of this software dedicate any and all copyright interest in the
    software to the public domain. We make this dedication for the benefit
    of the public at large and to the detriment of our heirs and
    successors. We intend this dedication to be an overt act of
    relinquishment in perpetuity of all present and future rights to this
    software under copyright law.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
    IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
    OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
    ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
    OTHER DEALINGS IN THE SOFTWARE.

    For more information, please refer to <http://unlicense.org/>
*/

fatcontroller = {};

(function() {
    
    // Debug switch, reports all events to the console. 
    // Defaults to true if the console exists
    fatcontroller.debug = window.console ? true : false;
    
    // Registry of receivers
    fatcontroller.receivers = [];
    
    fatcontroller.register = function(receiver) {
        // Register a new reciever
        if (fatcontroller.debug)
            console.log('Fat Controller registering new receiver \''+receiver.name+'\':', receiver);
        fatcontroller.receivers.push(receiver);
    };
    
    fatcontroller.transmit = function (name, data) {
        // Transmit the arguments out in fatcontroller.signal form.
        
        var signal = new fatcontroller.signal(name, data ? data : undefined);
        if (fatcontroller.debug)
            console.log('Fat Controller transmitting \''+signal.name+'\':', signal);
        // Transmit to all receivers
        var receivers = fatcontroller.receivers;
        for (receiver in receivers) {
            receivers[receiver].receive(signal);
        }
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
        this.time = new Date;
    };
    
    fatcontroller.receiver = function Receiver(name) {
        // Receivers map transmitted signals to bound functions.
        
        // name is used for identifying receivers in debug logging
        if (name)
            this.name = name;
        else
            this.name = 'Unidentified Receiver';
            
        // Format: { 'signal name' : [function() {}, ...], ... }
        this.signals = {};
        
        this.listen = function(signal, binding) {
            // Listen for signals with a name matching :signal and bind
            // :binding as a response.
            
            if (fatcontroller.debug)
                console.log('Receiver \''+this.name+'\' listening for \''+signal+'\' signal, with binding:', binding);
            var signals = this.signals;
            // If the signal is already being listened for, add the binding,
            // otherwise add the signal with the binding.
            if (signals[signal])
                signals[signal].push(binding);
            else
                signals[signal] = [binding];
        }
        
        this.receive = function(signal) {
            // Passes :signal to any functions bound to :signal.name.
            
            if (fatcontroller.debug)
                console.log('Receiver \''+this.name+'\' received \''+signal.name+'\': ', signal);
            var signals = this.signals;
            // If listening for this signal
            if (signals[signal.name]) {
                var bindings = signals[signal.name];
                // Pass the signal into each of the bound functions
                for(var binding in bindings) {
                    if (fatcontroller.debug)
                        console.log('Receiver \''+this.name+'\' passing', signal, 'to', bindings[binding]);
                    bindings[binding](signal);
                }
            }
        }
    };
    
})();
