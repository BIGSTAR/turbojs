/* drag.js */
Turbo.Drag = function (element, opts) {
  element = (typeof(element) === "string") ? Turbo.$(element) : element;
  opts = Turbo.defaults(opts, {
    onDrag: false,
    onDrop: false
  });

  this.drag = function () {
    element.style.left = (Turbo.mouse.x + Turbo.mouse.offsetX) + 'px';
    element.style.top = (Turbo.mouse.y + Turbo.mouse.offsetY) + 'px';

    if (opts.onDrag) {
      opts.onDrag();
    }
  };

  this.drop = function () {
    document.removeEventListener('mousemove', this.events.drag, false);
    document.onselectstart = function () { }

    if (opts.onDrop) {
      opts.onDrop();
    }
  };

  this.pickup = function () {
    Turbo.mouse.offsetX = element.offsetLeft - Turbo.mouse.x;
    Turbo.mouse.offsetY = element.offsetTop - Turbo.mouse.y;
    element.style.position = 'absolute';
    document.addEventListener('mousemove', this.events.drag, false);
    document.onselectstart = function () {
      return false;
    }
  };

  this.events = {
    drag: Turbo.attach(this.drag, this),
    drop: Turbo.attach(this.drop, this),
    pickup: Turbo.attach(this.pickup, this)
  };

  element.style.cursor = 'move';
  element.addEventListener('mousedown', this.events.pickup, false);
  document.addEventListener('mouseup', this.events.drop, false);
};

