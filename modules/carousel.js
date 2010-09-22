/* carousel.js */
Turbo.Carousel = function (element, content, o) {
  element = (typeof(element) === "string") ? Turbo.$(element) : element;
  if (Turbo.activeModules.carousel[element.id]) {
    return false;
  } else {
    Turbo.activeModules.carousel[element.id] = true;
  }
  content = (typeof(content) === "string") ? Turbo.$$(element, content) : content;

  o = Turbo.defaults(o, {
    style: "horizontal",
    overflow: false,
    slideshow: false,
    interval: 3000,
    scroller: false,
    page: 1
  });

  this.current = 0;
  this.scrolling = false;
  this.width = element.offsetWidth;
  this.height = element.offsetHeight;

  this.getLastPage = function () {
    return content.length;
  };

  this.getPage = function () {
    return this.page;
  };

/*
  this.gotoPage = function (page) { // animate it?
    if (o.overflow) {

      var i = 0, pages = page - this.getPage();

      if (pages < 0) {
        for (i = this.getPage(); i < content.length; i = i + 1) {
          this.contentNext();
        }
        pages = 5;
      }

      for (i = 0; i < pages; i = i + 1) {
        this.contentNext();
      }

    } else {
      this.current = page - 1;
      this.moveCarousel();
    }

    this.page = page;
  };
*/

  var wrapper = document.createElement('div');
  wrapper.style.position = 'absolute';
  wrapper.style.top = '0px';
  wrapper.style.left = '0px';
  if (o.style === "vertical") {
    wrapper.style.height = (content.length * this.height) + 'px';
  } else {
    wrapper.style.width = (content.length * this.width) + 'px';
  }

  this.contentNext = function () {
    wrapper.appendChild(content[0]);
    content.push(content.shift());
  };

  this.contentPrev = function () {
    wrapper.insertBefore(content[this.getLastPage() - 1], content[this.current]);
    content.unshift(content[this.getLastPage() - 1]);
    content.splice(this.getLastPage() - 1, 1);
  };

  this.afterScroll = function () {
    this.scrolling = false;

    if (o.overflow) {
      if (this.current > 1) {
        this.contentNext();
      } else if (this.current < 1) {
        this.contentPrev();
      }

      this.current = 1;

      if (o.style === "vertical") {
        wrapper.style.top = "-" + this.height + 'px';
      } else {
        wrapper.style.left = "-" + this.width + 'px';
      }
    }

    if (o.scroller) {
      this.next();
    } else if (o.slideshow) {
      window.setTimeout(Turbo.attach(this.next, this), o.interval);
    }
  };

  this.moveCarousel = function () {
    var duration = o.scroller ? 25000 : 500, easing = o.scroller ? function (pos) { 
      return pos; 
    } : undefined, css = (o.style === "horizontal") ? "left: -" + (this.current * this.width) + "px" : "top: -" + (this.current * this.height) + "px";
    this.scrolling = true;
    Turbo.Effects(wrapper, css, { duration: duration, easing: easing }, Turbo.attach(this.afterScroll, this));
  };

  this.next = function () {
    if (this.current < this.getLastPage() - 1 && !this.scrolling) {

      this.page = this.page + 1;
      if (this.getPage() > this.getLastPage()) {
        this.page = 1;
      }

      this.current = this.current + 1;
      this.moveCarousel();
    } 
  };

  this.previous = function () {
    if (this.current > 0 && !this.scrolling) {

      this.page = this.page - 1;
      if (this.getPage() < 1) {
        this.page = this.getLastPage();
      }

      this.current = this.current - 1;
      this.moveCarousel();
    } 
  };

  for (this.current = 0; this.current < content.length; this.current = this.current + 1) {
    if (o.style === "vertical") {
      content[0].style.height = this.height + 'px';
    } else {
      content[0].style.width = this.width + 'px';
      content[0].style.cssFloat = 'left';
    }
    this.contentNext();
  }

  this.current = 0;

  if (o.overflow) {
    if (o.style === "vertical") {
      wrapper.style.top = '-' + this.height + 'px';
    } else {
      wrapper.style.left = '-' + this.width + 'px';
    }
    this.contentPrev();
    this.current = 1;
  }

  element.style.overflow = 'hidden';
  element.style.position = 'relative';
  element.appendChild(wrapper);

  // initialize
  this.page = 1;
  //this.gotoPage(o.page);

  if (o.scroller) {
    this.next();
  } else if (o.slideshow) {
    window.setTimeout(Turbo.attach(this.next, this), o.interval);
  }
};
