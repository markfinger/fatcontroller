/*
    ////////////////////////////////////////////////////////////////
    Fat Controller - Javascript Signalling System
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
    
    fatcontroller.debug = true;
    
    fatcontroller.receivers = [];
    
    fatcontroller.register = function(receiver) {
        // Register a new reciever
        
        fatcontroller.receivers.push(receiver);
    };
    
    fatcontroller.transmit = function (name, data) {
        // Instantiate a signal and then transmit it to all receivers.
        var signal = new fatcontroller.signal(name, data ? data : undefined);
        if (fatcontroller.debug)
            console.log('Transmitting '+signal.name);
        // Transmit to all receivers
        var receivers = fatcontroller.receivers;
        for (receiver in receivers) {
            receivers[receiver].receive(signal);
        }
    };
    
    //--------fatcontroller models---------------------
    
    fatcontroller.signal = function Signal(name, data) {
        this.name = name;
        if (data)
            this.data = data;
        // Set a timestamp
        this.time = new Date;
    };
    
    fatcontroller.receiver = function Reciever() {
        // Recievers map transmitted signals to functions.
        
        // { 'signal name' : [function() {}], ... }
        this.signals = { };
        
        this.listen = function(signal, binding) {
            if (fatcontroller.debug)
                console.log('Listening for '+signal+' signal, with a response of '+binding);
            var signals = this.signals;
            // If the signal is already being listened for, add the binding
            // Else add the signal with the binding 
            if (signals[signal])
                signals[signal].push(binding);
            else
                signals[signal] = [binding];
        }
        
        this.receive = function(signal) {
            if (fatcontroller.debug)
                console.log('Received \''+signal.name+'\' signal.');
            var signals = this.signals;
            if (signals[signal.name]) {
                var responses = signals[signal.name];
                for(var response in responses) {
                    responses[response](signal.data);
                }
            }
        }
    };
    
})();
