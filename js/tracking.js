/*global window Turbo */

/* Stats Analyzer */
Turbo.Tracking = {
  // TODO track mouse movement

  stats: {
    location: null,
    navigator: null,
    events: []
  },
  trackingUrl: false,

  init: function (trackingUrl, ifNull) {
    this.trackingUrl = trackingUrl || false;

    if (window.name) {
      this.pushData();
    }

    this.stats.location = {
      host: window.location.host,
      hostname: window.location.hostname,
      href: window.location.href,
      pathname: window.location.pathname,
      port: window.location.port,
      protocol: window.location.protocol
    };
    this.stats.navigator = {
      appName: window.navigator.appName,
      appVersion: window.navigator.appVersion,
      language: window.navigator.language,
      platform: window.navigator.platform,
      userAgent: window.navigator.userAgent,
      vendor: window.navigator.vendor
    };

    //window.onunload = this.pushData;
    window.name = JSON.stringify(this.stats);
  },

  attach: function (el, custom, opts) {
    custom = custom || {};
    opts = Turbo.defaults(opts, {
      click: true,
      mouseover: true,
      mouseout: true,
      mousedown: false,
      mouseup: false
    });

    for (var event in opts) {
      if (opts.hasOwnProperty(event)) {
        if (opts[event] === true) {
          el.addEventListener(event, Turbo.attach(this.track, this, el, custom), false);
        }
      }
    }

    if (!el.id) {
      el.id = "trTracking" + Date.now();
    }
  },

  track: function (el, custom, event) {
    custom = custom || { };

    var obj = {
      element: el.id,
      x: Turbo.mouse.x,
      y: Turbo.mouse.y,
      type: event.type
    }, property;

    // load custom properties
    for (property in custom) {
      if (custom.hasOwnProperty(property)) {
        obj[property] = custom[property];
      }
    }

    this.stats.events.push(obj);
    this.save();
  },

  save: function () {
    var data = JSON.stringify(this.stats), bytes;
    bytes = unescape(encodeURIComponent(data)).length;
    if (bytes >= 2000000) {
      this.init(this.trackingUrl);
    } else {
      window.name = data; 
    }
  },

  pushData: function () {
    var data = window.name;
    window.name = "";

/*
    // don't report if there are no events
    if (!this.ifNull) {
      if (json.events.length === 0) {
        return false;
      }
    }
*/

    if (this.trackingUrl) {
      new Turbo.Ajax(this.trackingUrl, { serialized: data }).post();
    } else {
      alert(data);
    }
  }

/*
  // for tracking mouse movements across the page
  draw: function (stats) {
    if (this.overlay) {
      this.clear();
    }
    // if stats is array, parse all stats, use opacity to determine frequency/popularity!
    stats = stats || this.stats;
    var i, div, opts, x, y, overlay = document.createElement('div');
    overlay.style.opacity = '0.50';
    for (i = 0; i < stats.breadcrumbs.length; i = i + 1) {
      div = document.createElement('div');
      div.style.position = 'absolute';
      div.style.left = stats.breadcrumbs[i].x + 'px';
      div.style.top = stats.breadcrumbs[i].y + 'px';

      switch (stats.breadcrumbs[i].type) {
      case 'click':
        opts = {
          color: 'red',
          width: 7,
          height: 7
        }
      break;
      default:
        opts = {
          color: 'black',
          width: 5,
          height: 5
        }
      }
      div.style.backgroundColor = opts.color;
      div.style.width = opts.width + 'px';
      div.style.height = opts.height + 'px';
      overlay.appendChild(div);
    }
    document.body.appendChild(overlay);
    this.overlay = overlay;
  },

  clear: function () {
    document.body.removeChild(this.overlay);
    this.overlay = null;
  }
*/
};
