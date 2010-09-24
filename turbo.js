/*jslint white: true, browser: true, devel: true, onevar: true, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, indent: 2 */
/*global window ActiveXObject */
/*
  The MIT License

  Copyright (c) 2010 Joshua Perez http://www.7bc7.com

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/

/* turbo.js */
var Turbo = { 
  version: '1.5.6',
  $_SERVER: location.protocol + "//" + location.host,
  mouse: { x: 0, y: 0, offsetX: 0, offsetY: 0 },
  browser: {
    browsers: ["MSIE", "Firefox", "Chrome", "webOS", "Android", "iPad", "iPhone", "Safari", "Opera"],
    mobileOS: ["webOS", "Android", "iPhone", "iPad"],
    browser: false,
    version: false,
    mobile: undefined
  },
  onMouseMove: false,
  $nodes: { },
  activeModules: {
    carousel: { },
    accordion: { },
    tooltip: { },
    notifications: { },
  },

/*
  Returns an Element from the DOM
  @param {string} id - the ID of the element to retrieve
  @return {Object} if found, the element, otherwise false
*/
  $: function (id) {
    return this.$nodes[id] ? this.$nodes[id] : this.$nodes[id] = document.getElementById(id);
  },

/*
  Returns an Array of Elements from the DOM that match the given Class
  @param {Object} node - node to search within
  @param {string} cls - class to find and return
  @return {Array} all elements that match the query
*/
  $$: function (node, cls) {
    var el = [], i = 0, j = 0, classnames = [], id = "#" + node.id + "." + cls;

    if (this.$nodes[id]) {
      return this.$nodes[id];
    } else {

      // if we can use the native function, use it.
      if (node.getElementsByClassName !== undefined) {
       
        // load pointers into tmp array
        classnames = node.getElementsByClassName(cls);

        // load objects into array
        for (i = 0; i < classnames.length; i = i + 1) {
          el.push(classnames[i]);
        } 

      // old browser
      } else {

        // checking for children
        if (node.hasChildNodes()) {

          // loop through each children of the provided node
          for (i = 0; i < node.childNodes.length; i = i + 1) {

            // if a class name doesn't exist, skip
            if (node.childNodes[i].className === undefined) {
              continue;
            }
      
            // split multiple classes into an array
            classnames = node.childNodes[i].className.split(" ");

            // loop through array to find matches
            for (j = 0; j < classnames.length; j = j + 1) {

              // if the classname matches, push the results into an array
              if (classnames[j] === cls) {
                el.push(node.childNodes[i]);
              }
            }

          }
        }
      }

      this.$nodes[id] = el;
  
      // return results
      return el;
    }
  },

/*
  Attaches a function to another function 
  Thank you to Prototype Framework for the idea and the lesson: http://prototypejs.org/assets/2009/8/31/prototype.js
  @param {Object} obj - the function that will be executed
  @param {Object} context - the scope to use in the callback (this, document, window)
  @param {Params} params - additional parameters (comma delimited) to pass to the return function
  @return {Object} the binded function
*/
  attach: function (obj, context) {
    var args = Array.prototype.slice.call(arguments, 2);

    return function () {
      if (arguments.length > 0) {
        for (var i = 0; i < arguments.length; i = i + 1) {
          args.push(arguments[i]);
        }
      }
      obj.apply(context, args);
    };
  },

/*
  Function recursively loops through the element's parents in the DOM node tree and adds up each parent's left and top position.
  @param {Object} obj - the DOM element that needs to be located
  @return {Object} left, top - the left and top position of the element passed
*/
  getPosition: function (obj) {
    var l = 0, t = 0;
    l = obj.offsetLeft;
    t = obj.offsetTop;
    while (obj.offsetParent) {
      obj = obj.offsetParent;
      l += obj.offsetLeft;
      t += obj.offsetTop;
    }
    return {
      left: l,
      top: t
    };
  },

/*
  Gets Window size and scrollbar positions
  @return {Object} height, width, innerHeight, innerWidth, left, top - the document's positions
*/
  getWindowSize: function () {
    var properties = {
      height: [ document.documentElement.scrollHeight, document.documentElement.offsetHeight, document.documentElement.clientHeight],
      width: [ document.documentElement.scrollWidth, document.documentElement.offsetWidth, document.documentElement.clientWidth ],
      innerHeight: [ window.innerHeight, document.documentElement.clientHeight, document.body.clientHeight ],
      innerWidth: [ window.innerWidth, document.documentElement.clientWidth, document.body.clientWidth ],
      left: [ window.pageXOffset, document.documentElement.scrollLeft, document.body.scrollLeft ],
      top: [ window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop ]
    }, offsets = { }, property, i, tmp;

    for (property in properties) {
      if (properties.hasOwnProperty(property)) {
        tmp = 0;
        for (i = 0; i < properties[property].length; i = i + 1) {
          if (properties[property][i] > tmp) {
            tmp = properties[property][i];
          }
        }
        offsets[property] = tmp;
      }
    }

    return offsets;
  },

/*
  Determines the Internet browser the user is using
  @return {Object} internet browser, version
*/
  getBrowser: function () {
    if (this.browser.browser) {
      return {
        browser: this.browser.browser,
        version: this.browser.version
      };
    } else {
      var i, version, versionSearch;
      for (i = 0; i < this.browser.browsers.length; i = i + 1) {
        if (navigator.userAgent.indexOf(this.browser.browsers[i]) !== -1) {
          this.browser.browser = this.browser.browsers[i];
          break;
        }
      }

      if (!this.browser.browser) {
        this.browser.browser = "Unknown Browser";
      }

      versionSearch = (this.browser.browser === "Safari") ? "Version" : this.browser.browser;
      version = navigator.userAgent.indexOf(versionSearch);
      if (version !== -1) {
        this.browser.version = "";
        for (i = (version + versionSearch.length + 1); i <= navigator.userAgent.length; i = i + 1) {
          if (navigator.userAgent.substring(i, i + 1) === " ") {
            break;
          }
          this.browser.version = this.browser.version + "" + navigator.userAgent.substring(i, i + 1);
        }
      } else {
        this.browser.version = "Unknown Version";
      }

      return {
        browser: this.browser.browser,
        version: this.browser.version
      };
    }
  },

/*
  Determine if user is using a mobile device
  @return {Boolean}
*/
  isMobileBrowser: function () {
    if (this.browser.mobile !== undefined) {
      return this.browser.mobile;
    } else {
      for (var i = 0; i < this.browser.mobileOS.length; i = i + 1) {
        if (Turbo.getBrowser().browser === this.browser.mobileOS[i]) {
          this.browser.mobile = true;
          return true;
        }
      }
      this.browser.mobile = false;
      return false;
    }
  },

/*
  Returns the object passed with default parameters
  @param {Object} obj - object to parse
  @param {Object} params - default parameters to use if they are missing
  @return {Object} obj - the modified object
*/
  defaults: function (obj, params) {
    obj = obj || {};
    for (var property in params) {
      if (params.hasOwnProperty(property)) {
        obj[property] = (obj[property] === undefined) ? params[property] : obj[property];
      }
    }

    return obj;
  },

/*
  Mobile browsers and IE 6.0 don't have position fixed, this function returns false if user is using one of those browsers
  @return {Boolean}
*/
  hasPositionFixed: function () {
    if (Turbo.isMobileBrowser() || (Turbo.getBrowser().browser === "MSIE" && Turbo.getBrowser().version === "6.0;")) {
      return false;
    } else {
      return true;
    }
  }

};

/* mouse.js */
Turbo.getMouseCoordinates = function (event) {

  if (Turbo.getBrowser().browser === "MSIE") {
    Turbo.mouse.x = event.clientX + document.body.scrollLeft; 
    Turbo.mouse.y = event.clientY + document.body.scrollTop;
  } else { 
    Turbo.mouse.x = event.pageX;
    Turbo.mouse.y = event.pageY;
  }
  
  if (Turbo.mouse.x < 0) {
    Turbo.mouse.x = 0;
  }

  if (Turbo.mouse.y < 0) {
    Turbo.mouse.y = 0;
  }

  if (Turbo.onMouseMove) {
    Turbo.onMouseMove();
  }

  return Turbo.mouse;
};

if (Turbo.getBrowser().browser === "MSIE") {
  document.attachEvent('onclick', Turbo.getMouseCoordinates);
  document.attachEvent('onmousemove', Turbo.getMouseCoordinates);
} else {
  document.addEventListener('click', Turbo.getMouseCoordinates, false);
  document.addEventListener('mousemove', Turbo.getMouseCoordinates, false);
}

/* effects.js */
/*
  Animates a DOM object's styles
  @param {Object|string} element - The DOM element that will be animated
  @param {string} style - targetted styles written in CSS-like syntax
  @param {Object} opts - options to use
  @param {Object} callback - a function to be called after animations complete

  // emile.js (c) 2009 Thomas Fuchs
  Emile bit taken from emile.js (http://github.com/madrobby/emile/blob/master/emile.js) and then modified and documented to fit TurboJS
  This code is licensed under the terms of the MIT license (see above for terms)
*/
Turbo.Effects = function (element, style, opts, callback) {
  return Turbo.Animation.start(element, style, opts, callback);
};
Turbo.Animation = {
  timer: false,
  elementQueue: [],

  emile: {
    properties: ['backgroundColor', 'borderBottomColor', 'borderBottomWidth', 'borderLeftColor', 'borderLeftWidth',
      'borderRightColor', 'borderRightWidth', 'borderSpacing', 'borderTopColor', 'borderTopWidth', 'bottom', 'color', 'fontSize',
      'fontWeight', 'height', 'left', 'letterSpacing', 'lineHeight', 'marginBottom', 'marginLeft', 'marginRight', 'marginTop', 'maxHeight',
      'maxWidth', 'minHeight', 'minWidth', 'opacity', 'outlineColor', 'outlineOffset', 'outlineWidth', 'paddingBottom', 'paddingLeft',
      'paddingRight', 'paddingTop', 'right', 'textIndent', 'top', 'width', 'wordSpacing', 'zIndex'],
    parseEl: false,

    interpolate: function (source, target, pos) { 
      return (source + (target - source) * pos).toFixed(3);
    },

    parse: function (property) { // TODO Internet Explorer fade test && color
      var p = parseFloat(property), q = property.replace(/^[\-\d\.]+/, '');
      return { value: p, func: this.interpolate, suffix: q };
    },

    normalize: function (style) {
      var css, rules = {}, i = this.properties.length;

      this.parseEl.innerHTML = '<div style="' + style + '"></div>';
      css = this.parseEl.childNodes[0].style;

      while (i >= 0) {
        if (css[this.properties[i]]) {
          rules[this.properties[i]] = this.parse(css[this.properties[i]]);
        }
        i = i - 1;
      }

      return rules;
    }

  },

  start: function (element, style, opts, callback) {
    element = (typeof(element) === "string") ? Turbo.$(element) : element;

    opts = Turbo.defaults(opts, {
      duration: 500,
      easing: function (pos) { 
        return (-Math.cos(pos * Math.PI) / 2) + 0.5; 
      }
    });

    if (!this.emile.parseEl) {
      this.emile.parseEl = document.createElement('div');
    }

    var target = this.emile.normalize(style), 
    comp = element.currentStyle ? element.currentStyle : getComputedStyle(element, null),
    property, 
    current = {}, 
    start = (new Date()).getTime(), 
    end = start + opts.duration,
    id = this.elementQueue.length;

    for (property in target) {
      if (target.hasOwnProperty(property)) {
        current[property] = this.emile.parse(comp[property]);
      }
    }

    this.elementQueue.push({
      id: id,
      element: element,
      opts: opts,
      start: start,
      end: end,
      target: target,
      current: current,
      callback: callback
    });

    if (!this.timer) {
      this.timer = setInterval(Turbo.attach(this.run, this), 10);
    }

    return id;
  },

  stop: function (id) {
    id = id || false;

    if (typeof(id) === "number") {
      this.elementQueue[id] = null;
    } else if (typeof(id) === "object") {
      for (var i = 0; i < id.length; i = i + 1) {
        this.elementQueue[id[i]] = null;
      }
    } else {
      clearInterval(this.timer);
      this.timer = false;
      this.elementQueue = [];
    }
  },

  run: function () {
    var time = (new Date()).getTime(), pos, property, i, j = 0, obj;
    for (i = 0; i < this.elementQueue.length; i = i + 1) {
      obj = this.elementQueue[i];

      if (!obj) {
        obj = null;
      }

      if (obj === null) {
        j = j + 1;
        if (j === this.elementQueue.length) {
          this.stop();
        }

        continue;
      }

      pos = (time > obj.end) ? 1 : (time - obj.start) / obj.opts.duration;

      for (property in obj.target) {
        if (obj.target.hasOwnProperty(property)) {
          obj.element.style[property] = obj.target[property].func(obj.current[property].value, obj.target[property].value, obj.opts.easing(pos)) + obj.target[property].suffix;
        }
      }
      
      if (time > obj.end) {
        if (obj.callback) {
          obj.callback();
        }
        this.elementQueue[i] = null;
      }

    }
  }
};

/* ajax.js */
/*
  Handles Ajax requests and the response.
  @param {string} url - The URL for the Ajax function to call
  @param {Object} parameters - the parameters to be sent to the url
  @param {string|Object} callback - a callback function to be returned with the transport
  @return {Object} Callback if declared
*/
Turbo.Ajax = function (url, parameters, callback) {
  this.http = false;
  this.url = (url.indexOf("http://") !== -1) ? url : Turbo.$_SERVER + '/' + url;

  if (parameters) { 
    var param = false, params = [];
    for (param in parameters) {
      if (parameters.hasOwnProperty(param)) {
        params.push(param + "=" + parameters[param]);
      }
    }
    this.parameters = params.join("&");
  }

  try { 
    this.http = new XMLHttpRequest();
  } catch (ex1) {
    try { 
      this.http = new ActiveXObject('Msxml2.XMLHTTP');
    } catch (ex2) { 
      try { 
        this.http = new ActiveXObject('Microsoft.XMLHTTP');
      } catch (ex3) { 
        alert('We apologize, your browser does not support Ajax');
        return false;
      } 
    } 
  }

/*
  Handles the AJAX request
  @return {Object} - Callback function if declared, otherwise it sets the innerHTML of an element to the transport's response
*/
  this.handleRequest = function () {
    switch (typeof(callback)) {
    case "string":
      Turbo.$(callback).innerHTML = this.http.responseText;
      break;
    case "function":
      return callback(this.http);
    default:
      return false;
    }
  };

/*
  uses the POST method
*/
  this.post = function () {
    this.http.open('POST', this.url, true);
    this.http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    this.http.setRequestHeader("Content-length", this.parameters.length);
    this.http.setRequestHeader("Connection", "close");
    this.http.send(this.parameters);
    this.http.onreadystatechange = Turbo.attach(function () { 
      if (this.http.readyState === 4) {
        return this.handleRequest();
      }
    }, this);
  };

/*
  uses the GET request method
*/
  this.get = function () {
    this.url = this.parameters ? this.url + '?' + this.parameters : this.url;
    this.http.open('GET', this.url, true);
    this.http.send(null);
    this.http.onreadystatechange = Turbo.attach(function () { 
      if (this.http.readyState === 4) {
        return this.handleRequest();
      }
    }, this);
  };
};

/* activity.js */
/*
  An Activity Indicator/Ajax loader that shows on the screen when the application is waiting to return a result
*/
Turbo.ActivityIndicator = {
  config: {
    imageMouse: 'images/ajaxloader.gif',
    imageScrim: 'images/ajaxloader2.gif'
  },

/*
  Binds the activity indicator to follow the mouse around. Happens if scrim is set to false
  @private
*/
  follow: function () {
    this.ajaxLoader.style.top = (Turbo.mouse.y + 10) + 'px';
    this.ajaxLoader.style.left = (Turbo.mouse.x + 10) + 'px';
  },

/*
  Shows the activity indicator
  @param {boolean} scrim - If true, it shows a scrim in the background rendering the page unusuable until the indicator is hidden
*/
  show: function (scrim) {
    if (!this.ajaxLoader) {
      this.ajaxLoader = document.createElement('img');

      if (scrim) {
        this.scrim = Turbo.Scrim.show();
        this.scrim.className = 'trScrim trActivity';
        this.ajaxLoader.src = this.config.imageScrim;
        this.ajaxLoader.className = 'trActivityIndicatorScrim';

        if (!Turbo.hasPositionFixed()) {
          var offsets = Turbo.getWindowSize();
          this.ajaxLoader.style.position = 'absolute';
          this.ajaxLoader.style.top = (Math.floor(offsets.innerHeight / 2) + offsets.top) + 'px';
          this.ajaxLoader.style.left = (Math.floor(offsets.innerWidth / 2) + offsets.left) + 'px';
        }
      } else {
        this.ajaxLoader.src = this.config.imageMouse;
        this.ajaxLoader.className = 'trActivityIndicator';
      }

      document.body.appendChild(this.ajaxLoader);
      this.ajaxLoader.style.display = 'block';
      if (!scrim) {
        this.follow();
        Turbo.onMouseMove = Turbo.attach(this.follow, this);
      }
    }
  },

/*
  Hides the activity indicator from the screen
*/
  hide: function () {
    if (this.ajaxLoader) {
      this.ajaxLoader.parentNode.removeChild(this.ajaxLoader);
      this.ajaxLoader = null;
      if (this.scrim) {
        this.scrim = Turbo.Scrim.hide(this.scrim);
      }
    }
    Turbo.onMouseMove = false;
  }

};

/* scrim.js */
/*
  Shows a scrim on the screen
*/
Turbo.Scrim = {
/*
  Shows the scrim
  @return {Object} scrim - the DOM element that is appended to the document body
*/
  show: function () {
    var scrim = document.createElement('div'), offsets;
    if (!Turbo.hasPositionFixed()) {
      offsets = Turbo.getWindowSize();
      scrim.style.width = offsets.width + 'px';
      scrim.style.height = offsets.height + 'px';
    }
    scrim.className = 'trScrim';
    document.body.appendChild(scrim);
    
    return scrim;
  },

/*
  Hides the scrim
  @param {Object} scrim - The DOM element to be removed
*/
  hide: function (scrim) {
    document.body.removeChild(scrim);
    return null;
  }
};

/* notification.js */
/*
  Pushes a notification onto the screen to alert the user
  @param {string} message - the message to relay to the user
  @param {Object} opts - additional options
*/
// TODO needs testing and better performance
Turbo.Notification = function (message, opts) {
  opts = Turbo.defaults(opts, {
    id: (new Date()).getTime(),
    timeout: 15000,
    type: 'neutral',
    onClick: false
  });
  opts.id = 'trN' + opts.id;

  if (Turbo.activeModules.notifications[opts.id]) {
    return false;
  } else {
    Turbo.activeModules.notifications[opts.id] = true;
  }

  this.interval = false;

  this.father = function () {
    if (Turbo.$('trNotificationChain')) {
      return Turbo.$('trNotificationChain');
    } else {
      this.chain = document.createElement('div');
      this.chain.id = 'trNotificationChain';
      document.body.appendChild(this.chain);
      return this.chain;
    }
  };

  this.kill = function () {
    if (this.note) {
      this.note.onmouseup = function () { };
      Turbo.Effects(this.note, 'top: -' + this.note.offsetHeight + 'px', { duration: 200 }, Turbo.attach(function () {
        this.chain.removeChild(this.note);
        this.note = null;
      }, this));
      delete Turbo.activeModules.notifications[opts.id];
    }
  };

  this.child = function () {
    if (Turbo.$(opts.id)) {
      this.note = Turbo.$(opts.id);
      if (!Turbo.$(opts.id + 'ct')) {
        this.counter = document.createElement('span');
        this.counter.className = 'trCount';
        this.counter.id = opts.id + 'ct';
        this.counter.innerHTML = '1';
        this.note.appendChild(this.counter);
      } else {
        this.counter = Turbo.$(opts.id + 'ct');
      }
      this.counter.innerHTML = parseInt(this.counter.innerHTML, 10) + 1;
    } else {
      this.chain = this.father();

      if (!Turbo.hasPositionFixed()) {
        var offsets = Turbo.getWindowSize();
        this.chain.style.position = 'absolute';
        this.chain.style.top = offsets.top + 'px';
      }

      this.note = document.createElement('div');
      this.note.id = opts.id;
      this.chain.appendChild(this.note);
      this.note.className = "trNotification " + opts.type;
      this.note.style.display = 'none';
      this.note.innerHTML = message;

      if (opts.onClick) {
        if (typeof(opts.onClick) === "string") {
          this.note.onmouseup = function () {
            location.href = opts.onClick;
          }
        } else {
          this.note.onmouseup = opts.onClick;
        }
      } else {
        this.note.onmouseup = Turbo.attach(this.kill, this);
      }

      this.note.style.display = 'block';
      this.note.style.top = "-" + this.note.offsetHeight + "px";
      Turbo.Effects(this.note, 'top: 0px', { duration: 200 });
      if (opts.timeout) {
        window.setTimeout(Turbo.attach(this.kill, this), opts.timeout);
      }
    }
  };

  this.child();
};

/* lightbox.js */
Turbo.Lightbox = {

  dimensions: {
    width: false,
    height: false,
    left: 0,
    top: 0
  },

  isActive: false,

  close: function () {
    this.isActive = false;
    this.lightBox.style.display = 'none';
    if (this.wrapper) {
      this.wrapper.parentNode.removeChild(this.wrapper);
      this.wrapper = null;
    }
    if (this.scrim) {
      this.scrim = Turbo.Scrim.hide(this.scrim);
    }
  },

  show: function (url, callback) {

    if (this.isActive) {
      return this.isActive;
    } else {
      this.isActive = true;
    }

    /* initialize */
    if (this.wrapper) {
      this.close();
    }

    Turbo.ActivityIndicator.show();
    this.scrim = Turbo.Scrim.show();
    this.scrim.style.display = 'none';
    this.wrapper = document.createElement('div');
    this.wrapper.className = 'trLightbox-wrapper';

    this.lightBox = document.createElement('div');
    this.lightBox.className = 'trLightbox';

    this.closeBtn = document.createElement('a');
    this.closeBtn.className = 'close';
    this.closeBtn.innerHTML = 'X';

    this.closeBtn.onmouseup = Turbo.attach(this.close, this);
    this.scrim.onmouseup = Turbo.attach(this.close, this);

    this.wrapper.appendChild(this.lightBox);
    this.wrapper.appendChild(this.closeBtn);
    document.body.appendChild(this.wrapper);

    /* load content */
    if (url.substr(0, 1) === "#") {
      this.lightBox.innerHTML = Turbo.$(url.substr(1, url.length)).innerHTML;
      this.load(callback);
    } else {
      new Turbo.Ajax(url, false, Turbo.attach(function (transport) {
          this.lightBox.innerHTML = transport.responseText;
          this.load(callback);
        }, this)
      ).get();
    }
  },

  load: function (callback) {
    var maxWidth = (document.documentElement.clientWidth / 2), maxHeight = (document.documentElement.clientHeight / 2), offsets;

    this.dimensions = {
      width: (this.lightBox.offsetWidth < (maxWidth + this.lightBox.offsetWidth)) ? this.lightBox.offsetWidth : maxWidth,
      height: (this.lightBox.offsetHeight < (maxHeight + this.lightBox.offsetHeight)) ? this.lightBox.offsetHeight : maxHeight
    };

    this.wrapper.style.width = this.dimensions.width + 'px';
    this.wrapper.style.height = this.dimensions.height + 'px';

    this.dimensions.left = (maxWidth) - ((this.dimensions.width / 2) + ((this.wrapper.offsetWidth - this.dimensions.width) / 2));
    this.dimensions.top = (maxHeight) - ((this.dimensions.height / 2) + ((this.wrapper.offsetHeight - this.dimensions.height) / 2));
  
    if (!Turbo.hasPositionFixed()) {
      offsets = Turbo.getWindowSize();
      this.wrapper.style.position = 'absolute';
      this.dimensions.top = this.dimensions.top + offsets.top;
      this.dimensions.left = this.dimensions.left + offsets.left;
    }

    this.dimensions.left = (this.dimensions.left > 0) ? this.dimensions.left : 0;
    this.dimensions.top = (this.dimensions.top > 0) ? this.dimensions.top : 0;

    this.wrapper.style.display = 'none';
    this.wrapper.style.left = this.dimensions.left + 'px';
    this.wrapper.style.top = this.dimensions.top + 'px';

    this.lightBox.style.visibility = 'hidden';

    Turbo.ActivityIndicator.hide();

    this.scrim.style.opacity = '0';
    this.scrim.style.display = 'block';
    Turbo.Effects(this.scrim, 'opacity: 0.85', null, Turbo.attach(function () {
      if (this.wrapper) {
        this.wrapper.style.display = 'block';
      }
    }, this));

    this.lightBox.style.visibility = 'visible';

    if (callback) {
      callback();
    }
  }

};

/* tooltip.js */
/*
  A tooltip - small box with information about the item being hovered over
  @param {Object|string} element - The DOM element that will trigger the tooltip
  @param {string} url - Either an external URL or an internal a:name which contains the content to be loaded into the tooltip
  @param {Object} o - Tooltip options
*/
Turbo.Tooltip = function (element, url, o) { // TODO - add follow mouse, add hover over tooltip stay, add click events
  this.element = (typeof(element) === "string") ? Turbo.$(element) : element;
  if (Turbo.activeModules.tooltip[element.id]) {
    return false;
  } else {
    Turbo.activeModules.tooltip[element.id] = true;
  }
  this.url = url;
  this.dimensions = {
    width: 0,
    height: 0,
    left: 0,
    top: 0
  };
  this.original = {
    documentWidth: 0,
    documentHeight: 0,
    elementLeft: 0,
    elementTop: 0,
    elementWidth: 0,
    elementHeight: 0
  };

  o = Turbo.defaults(o, {
    showDelay: 250,
    hideDelay: 10,
    followMouse: false,
    allowTooltipHover: false
  });

  this.hideMe = true;
  

  this.create = function () {
    this.tooltip = document.createElement('div');
    this.tooltip.className = 'trTooltip';
    this.stem = document.createElement('div');
    this.stem.className = 'trTooltip-stem';
    document.body.appendChild(this.tooltip);
    this.tooltip.appendChild(this.stem);

    if (this.url.substr(0, 1) === "#") {
      var wrapper = document.createElement('div');
      wrapper.innerHTML = Turbo.$(this.url.substr(1, this.url.length)).innerHTML;
      this.tooltip.appendChild(wrapper);
      this.load();
    } else {
      Turbo.ActivityIndicator.show();
      new Turbo.Ajax(this.url, false, Turbo.attach(function (transport) {
          Turbo.ActivityIndicator.hide();
          var wrapper = document.createElement('div');
          wrapper.innerHTML = transport.responseText;
          this.tooltip.appendChild(wrapper);
          this.load();
        }, this)
      ).get();
    }
  };

  this.load = function () {
    this.tooltip.style.display = 'block';
    this.tooltip.style.left = '-10000px';

    if (this.element.offsetParent) {
      this.elementOffset = Turbo.getPosition(this.element);
      this.dimensions = {
        left: o.followMouse ? Turbo.mouse.x : (this.elementOffset.left + this.element.offsetWidth),
        top: o.followMouse ? Turbo.mouse.y : (this.elementOffset.top + (this.element.offsetHeight / 2) - (this.tooltip.offsetHeight / 2))
      };
    } else {
      this.dimensions = {
        left: o.followMouse ? Turbo.mouse.x : (this.element.offsetLeft + this.element.offsetWidth),
        top: o.followMouse ? Turbo.mouse.y : (this.element.offsetTop + (this.element.offsetHeight / 2) - (this.tooltip.offsetHeight / 2))
      };
    }

    // if the tooltip will overflow the screen's width
    if (this.dimensions.left > (document.documentElement.clientWidth - this.tooltip.offsetWidth)) {

      // checking to make sure element is not 100% width
      if ((this.element.offsetLeft - this.tooltip.offsetWidth) < 0) {
        this.dimensions.left = Turbo.mouse.x + 25;

      // show the tooltip to the left of the element
      } else {
        this.dimensions.left = this.dimensions.left - (this.element.offsetWidth + this.tooltip.offsetWidth) - 25;
        this.tooltip.className = 'trTooltip right';
      }

    // show the tooltip to the right of the element
    } else {
      this.tooltip.className = 'trTooltip';
    }

    this.original = {
      documentWidth: document.documentElement.clientWidth,
      documentHeight: document.documentElement.clientHeight,
      elementWidth: this.element.offsetWidth,
      elementHeight: this.element.offsetHeight,
      elementLeft: this.element.offsetLeft,
      elementTop: this.element.offsetTop
    };

    this.tooltip.style.display = 'none';
    this.tooltip.style.left = this.dimensions.left + 'px';
    this.tooltip.style.top = this.dimensions.top + 'px';

    this.show();
  };

  this.show = function () {
    if (this.showMe) {
      if (!this.tooltip) {
        this.create();
      } else {
        if (
          document.documentElement.clientWidth !== this.original.documentWidth ||
          document.documentElement.clientHeight !== this.original.documentHeight ||
          this.element.offsetWidth !== this.original.elementWidth ||
          this.element.offsetHeight !== this.original.elementHeight ||
          this.element.offsetLeft !== this.original.elementLeft ||
          this.element.offsetTop !== this.original.elementTop
        ) {
          this.load();
        }

        this.tooltip.style.display = 'block';
      }
    }
  };

  this.hide = function () {
    if (this.tooltip && this.hideMe) {
      this.tooltip.style.display = 'none';
    }
  };

  this.element.onmouseover = Turbo.attach(function () {
    this.showMe = true;
    window.setTimeout(Turbo.attach(this.show, this), o.showDelay);
  }, this);

  this.element.onmouseout = Turbo.attach(function () {
    this.showMe = false;
    window.setTimeout(Turbo.attach(this.hide, this), o.hideDelay);
  }, this);
};

/* accordion.js */
// TODO horizontal
Turbo.Accordion = function (element, toggle, content, o) {
  element = (typeof(element) === "string") ? Turbo.$(element) : element;
  if (Turbo.activeModules.accordion[element.id]) {
    return false;
  } else {
    Turbo.activeModules.accordion[element.id] = true;
  }

  this.toggle = (typeof(toggle) === "string") ? Turbo.$$(element, toggle) : toggle;
  this.content = (typeof(content) === "string") ? Turbo.$$(element, content) : content;
  this.offset = [];
  this.activeAccordion = false;

  o = Turbo.defaults(o, {
    style: 'vertical'
  });

  this.collapseAccordion = function (i) {
    Turbo.Effects(this.content[i], 'height: 0px');
  };

  this.selectAccordion = function (i) {
    if (this.activeAccordion !== false) {
      this.collapseAccordion(this.activeAccordion);
    }

    if (this.activeAccordion !== i) {
      Turbo.Effects(this.content[i], 'height: ' + this.offset[i].height + 'px');
      this.activeAccordion = i;
    } else {
      this.activeAccordion = false;
    }
  };

  for (var i = 0; i < this.toggle.length; i = i + 1) {
    this.toggle[i].style.cursor = 'pointer';
    this.toggle[i].onclick = Turbo.attach(this.selectAccordion, this, i);
    this.offset[i] = {
      width: this.content[i].offsetWidth,
      height: this.content[i].offsetHeight
    };
    
    this.content[i].style.height = '0px';
    this.content[i].style.overflow = 'hidden'; // TODO - test
  }
};
