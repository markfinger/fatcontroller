// Fat Controller - a publish-subscribe service in JS
// https://github.com/markfinger/fatcontroller

// ES5 polyfills from MDN
Array.prototype.forEach||(Array.prototype.forEach=function(e,g){var b,a;if(null==this)throw new TypeError("this is null or not defined");var c=Object(this),d=c.length>>>0;if("[object Function]"!={}.toString.call(e))throw new TypeError(e+" is not a function");g&&(b=g);for(a=0;a<d;){var f;a in c&&(f=c[a],e.call(b,f,a,c));a++}});
Array.prototype.filter||(Array.prototype.filter=function(e,g){if(null==this)throw new TypeError;var b=Object(this),a=b.length>>>0;if("function"!=typeof e)throw new TypeError;for(var c=[],d=0;d<a;d++)if(d in b){var f=b[d];e.call(g,f,d,b)&&c.push(f)}return c});
