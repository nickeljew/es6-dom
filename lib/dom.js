'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function animationFrame(tick) {
  window.requestAnimationFrame && requestAnimationFrame(tick) || setTimeout(tick, 16);
}

var Dom = {
  isDescendant: function isDescendant(parent, child) {
    var node = child.parentNode;

    while (node !== null) {
      if (node === parent) return true;
      node = node.parentNode;
    }

    return false;
  },
  offset: function offset(el) {
    var rect = el.getBoundingClientRect(),
        body = document.body,
        html = document.documentElement,
        scrollTop = html && html.scrollTop ? html.scrollTop : body.scrollTop,
        scrollLeft = html && html.scrollLeft ? html.scrollLeft : body.scrollLeft;
    return {
      top: rect.top + scrollTop,
      left: rect.left + scrollLeft
    };
  },
  getStyleAttributeAsNumber: function getStyleAttributeAsNumber(el, attr) {
    var attrStyle = el.style[attr];
    var attrNum = 0;

    if (attrStyle && attrStyle.length) {
      attrNum = parseInt(attrStyle);
    }

    return attrNum;
  },
  addClass: function addClass(el, className) {
    if (el.classList) el.classList.add(className);else el.className += ' ' + className;
  },
  removeClass: function removeClass(el, className) {
    if (el.classList) el.classList.remove(className);else el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
  },
  hasClass: function hasClass(el, className) {
    if (el.classList) return el.classList.contains(className);else return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
  },
  toggleClass: function toggleClass(el, className) {
    if (this.hasClass(el, className)) this.removeClass(el, className);else this.addClass(el, className);
  },
  forceRedraw: function forceRedraw(el) {
    var originalDisplay = el.style.display;
    el.style.display = 'none';
    el.offsetHeight; // no need to store this anywhere, the reference is enough

    el.style.display = originalDisplay;
  },
  withoutTransition: function withoutTransition(el, callback) {
    var originalTransition = el.style.transition; //turn off transition

    el.style.transition = null;
    callback(); //force a redraw

    this.forceRedraw(el); //put the transition back

    el.style.transition = originalTransition;
  },
  nodeById: function nodeById(id) {
    return document.getElementById(id);
  },
  nodeBySelector: function nodeBySelector(el, s) {
    return (el || document).querySelector(s);
  },
  nodesBySelector: function nodesBySelector(el, s) {
    return (el || document).querySelectorAll(s);
  },
  text: function text(el, _text) {
    if (typeof _text === 'string') {
      el && (el.innerText = _text);
      return this;
    }

    return el ? el.innerText || el.textContent || '' : '';
  },
  documentWidth: function documentWidth() {
    return Math.max(document.body.scrollWidth, document.body.offsetWidth, document.documentElement.clientWidth, document.documentElement.scrollWidth, document.documentElement.offsetWidth);
  },
  documentHeight: function documentHeight() {
    return Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
  },
  windowWidth: function windowWidth() {
    return window.innerWidth || document.documentElement.clientWidth || document.getElementsByTagName('body')[0].clientWidth;
  },
  windowHeight: function windowHeight() {
    return window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
  },
  animate: function animate(tick) {
    var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 200;
    var easing = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'linear';
    var easings = {
      linear: function linear(t) {
        return t;
      },
      easeInQuad: function easeInQuad(t) {
        return t * t;
      },
      easeOutQuad: function easeOutQuad(t) {
        return t * (2 - t);
      },
      easeInOutQuad: function easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      },
      easeInCubic: function easeInCubic(t) {
        return t * t * t;
      },
      easeOutCubic: function easeOutCubic(t) {
        return --t * t * t + 1;
      },
      easeInOutCubic: function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
      },
      easeInQuart: function easeInQuart(t) {
        return t * t * t * t;
      },
      easeOutQuart: function easeOutQuart(t) {
        return 1 - --t * t * t * t;
      },
      easeInOutQuart: function easeInOutQuart(t) {
        return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
      },
      easeInQuint: function easeInQuint(t) {
        return t * t * t * t * t;
      },
      easeOutQuint: function easeOutQuint(t) {
        return 1 + --t * t * t * t * t;
      },
      easeInOutQuint: function easeInOutQuint(t) {
        return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
      }
    };
    var startTime = 'now' in window.performance ? performance.now() : new Date().getTime();

    var _tick = function _tick() {
      var now = 'now' in window.performance ? performance.now() : new Date().getTime(),
          time = duration <= 0 ? 1 : Math.min(1, (now - startTime) / duration);
      var percent = easings[easing](time);
      if (duration <= 0 || !tick(percent)) return;
      animationFrame(_tick);
    };

    _tick();
  },
  scrollTo: function scrollTo(x, y) {
    var duration = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 200;
    var easing = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'linear';
    var startX = window.pageXOffset,
        startY = window.pageYOffset,
        docW = Dom.documentWidth(),
        docH = Dom.documentHeight(),
        winW = Dom.windowWidth(),
        winH = Dom.windowHeight(),
        offsetLeft = Math.round(docW - x < winW ? docW - winW : x),
        offsetTop = Math.round(docH - y < winH ? docH - winH : y);
    Dom.animate(function (percent) {
      var scrollLeft = Math.ceil(percent * (offsetLeft - startX) + startX),
          scrollTop = Math.ceil(percent * (offsetTop - startY) + startY);
      window.scroll(scrollLeft, scrollTop);
      return window.pageXOffset < offsetLeft || window.pageYOffset < offsetTop;
    }, duration, easing);
  }
};
var _default = Dom;
exports["default"] = _default;
