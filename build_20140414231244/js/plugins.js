// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place any jQuery/helper plugins in here.


// Enable the passage of the 'this' object through the JavaScript timers
 
// var __nativeST__ = window.setTimeout, __nativeSI__ = window.setInterval;
 
// window.setTimeout = function (vCallback, nDelay /*, argumentToPass1, argumentToPass2, etc. */) {
//   var oThis = this, aArgs = Array.prototype.slice.call(arguments, 2);
//   return __nativeST__(vCallback instanceof Function ? function () {
//     vCallback.apply(oThis, aArgs);
//   } : vCallback, nDelay);
// };
 
// window.setInterval = function (vCallback, nDelay /*, argumentToPass1, argumentToPass2, etc. */) {
//   var oThis = this, aArgs = Array.prototype.slice.call(arguments, 2);
//   return __nativeSI__(vCallback instanceof Function ? function () {
//     vCallback.apply(oThis, aArgs);
//   } : vCallback, nDelay);
// };

Array.prototype.removeByValue = function(value) {
  var indexArray = [];
  for(var i=0; i < this.length; i++){
    if (this[i].valueOf()==value){
      indexArray.push(i);
    }
  }
  for (var i = indexArray.length -1; i >= 0; i--){
    this.splice(indexArray[i],1);
  }
  return this;
}

Array.prototype.keeyObjWithType = function(value) {
  var indexArray = [];
  for(var i=0; i < this.length; i++){
    if (this[i].type.valueOf() != value){
      indexArray.push(i);
    }
  }
  for (var i = indexArray.length -1; i >= 0; i--){
    this.splice(indexArray[i],1);
  }
  return this;
}

Array.prototype.removeById = function(id) {
  var success = false;
  for(var i=0; i < this.length; i++){
    var index = this[i].id.indexOf(id);
    if(index != -1) {
      success = true;
      return this.splice(i, 1);
    }
  }
  if (!success){ return false; }
}

Array.prototype.getById = function(id) {
  var success = false;

  for(var i=0; i < this.length; i++){

    var index = this[i].id.indexOf(id);
    if(index != -1) {
      
      success = true;
      return this[i];
    }
  }
  if (!success){ 
    return false; 
  }
}

Array.prototype.countByFatherId = function(fatherId) {
  var count = 0;

  for(var i=0; i < this.length; i++){
    var index = this[i].father_id.indexOf(fatherId);
    if(index != -1) {
      count++;
    }
  }

  return count;
}


