"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extend = extend;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// @ts-ignore
var ContextWrapper = /*#__PURE__*/function () {
  function ContextWrapper() {
    var _this = this;

    _classCallCheck(this, ContextWrapper);

    this.ctx = void 0;
    this.icons = void 0;

    this.fillTextCb = function (text, x, y, maxWidth) {
      if (typeof maxWidth === 'number') {
        _this.ctx.fillText(text, Math.floor(x), Math.floor(y), Math.floor(maxWidth));
      } else {
        _this.ctx.fillText(text, Math.floor(x), Math.floor(y));
      }
    };

    this.strokeTextCb = function (text, x, y, maxWidth) {
      if (typeof maxWidth === 'number') {
        _this.ctx.strokeText(text, Math.floor(x), Math.floor(y), Math.floor(maxWidth));
      } else {
        _this.ctx.strokeText(text, Math.floor(x), Math.floor(y));
      }
    };
  }

  _createClass(ContextWrapper, [{
    key: "measureText",
    value: function measureText(text) {
      var keys = Object.keys(this.icons);
      var metrics = this.ctx.measureText(text);

      if (keys.length === 0) {
        return metrics;
      }

      var width = metrics.width;
      var exec = /\d+/.exec(this.ctx.font);
      var mHeight = Number(exec && exec[0] || 36);

      for (var i = 0, l = keys.length; i < l; i++) {
        var _key = keys[i];
        var match = text.match(new RegExp(_key, 'g'));

        if (match) {
          var icon = this.icons[_key];
          var frame = icon.texture.frame;
          var scale = mHeight / frame.height;
          var iconWidth = frame.width * icon.scale.x * scale;
          width -= match.length * this.ctx.measureText(_key).width;
          width += match.length * iconWidth;
        }
      }

      return _objectSpread(_objectSpread({}, metrics), {}, {
        width: width
      });
    }
  }, {
    key: "fillText",
    value: function fillText(text, x, y, maxWidth) {
      this.fillOrStrokeTextWithIcons(this.fillTextCb, true, text, x, y, maxWidth);
    }
  }, {
    key: "strokeText",
    value: function strokeText(text, x, y, maxWidth) {
      this.fillOrStrokeTextWithIcons(this.strokeTextCb, false, text, x, y, maxWidth);
    }
  }, {
    key: "fillOrStrokeTextWithIcons",
    value: function fillOrStrokeTextWithIcons(drawCb, isFill, text, x, y, maxWidth) {
      var _this2 = this;

      var keys = Object.keys(this.icons);

      if (keys.length === 0) {
        return drawCb(text, x, y, maxWidth);
      }

      var isShadow = this.ctx.shadowBlur !== 0 || this.ctx.shadowOffsetX !== 0 || this.ctx.shadowOffsetY !== 0;
      var splitter = '!#$@-%';
      var order = [];
      var parts = text.replace(new RegExp(keys.join('|'), 'g'), function (match) {
        order.push(_this2.icons[match]);
        return splitter;
      }).split(splitter);
      var exec = /\d+/.exec(this.ctx.font);
      var mHeight = Number(exec && exec[0] || 36);
      var mx = x;

      for (var i = 0; i < parts.length; i++) {
        var part = parts[i];
        var icon = order.shift();

        if (part) {
          drawCb(part, mx, y);
          mx += this.ctx.measureText(part).width;
        }

        if (icon) {
          var frame = icon.texture.frame;
          var scale = mHeight / frame.height;
          var iconX = icon.x * scale;
          var iconY = icon.y * scale;
          var iconWidth = frame.width * icon.scale.x * scale;
          var iconHeight = frame.height * icon.scale.y * scale;

          if (isShadow ? icon.shadow : isFill) {
            var _icon$texture$baseTex;

            var tx = mx + iconX;
            var ty = y - mHeight * 0.4 + iconY - iconHeight * 0.5; // @ts-ignore

            var source = icon.texture.baseTexture.source || ((_icon$texture$baseTex = icon.texture.baseTexture.resource) === null || _icon$texture$baseTex === void 0 ? void 0 : _icon$texture$baseTex.source);

            if (source) {
              this.ctx.drawImage(source, frame.x, frame.y, frame.width, frame.height, Math.floor(tx), Math.floor(ty), Math.floor(iconWidth), Math.floor(iconHeight));
            }
          }

          mx += iconWidth;
        }
      }
    }
  }]);

  return ContextWrapper;
}();

var contextWrapper = new ContextWrapper();
['canvas', 'globalAlpha', 'globalCompositeOperation', 'direction', 'fillStyle', 'filter', 'font', 'imageSmoothingEnabled', 'imageSmoothingQuality', 'lineCap', 'lineDashOffset', 'lineJoin', 'lineWidth', 'miterLimit', 'shadowBlur', 'shadowColor', 'shadowOffsetX', 'shadowOffsetY', 'strokeStyle', 'textAlign', 'textBaseline'].forEach(function (prop) {
  Object.defineProperty(contextWrapper, prop, {
    get: function get() {
      return this.ctx[prop];
    },
    set: function set(v) {
      this.ctx[prop] = v;
    }
  });
});
['beginPath', 'arc', 'arcTo', 'bezierCurveTo', 'clearRect', 'clip', 'closePath', 'createImageData', 'createLinearGradient', 'createPattern', 'createRadialGradient', 'drawFocusIfNeeded', 'drawImage', 'ellipse', 'fill', 'fillRect', 'getImageData', 'getLineDash', 'getTransform', 'isPointInPath', 'isPointInStroke', 'lineTo', 'moveTo', 'putImageData', 'quadraticCurveTo', 'rect', 'resetTransform', 'restore', 'translate', 'transform', 'strokeRect', 'stroke', 'setTransform', 'setLineDash', 'scrollPathIntoView', 'scale', 'save', 'rotate'].forEach(function (method) {
  // @ts-ignore
  contextWrapper[method] = function () {
    var _contextWrapper$ctx;

    return (_contextWrapper$ctx = contextWrapper.ctx)[method].apply(_contextWrapper$ctx, arguments);
  };
}); // @ts-ignore

function extend(PIXI) {
  var updateText = PIXI.Text.prototype.updateText;
  var measureText = PIXI.TextMetrics.measureText;
  var canvasWrapper = {
    getContext: function getContext() {
      return contextWrapper;
    }
  };

  PIXI.Text.prototype.updateText = function (respectDirty) {
    if (this.icons) {
      contextWrapper.ctx = this.context;
      contextWrapper.icons = this.icons;
      this.context = contextWrapper;
    }

    updateText.call(this, respectDirty);

    if (this.context === contextWrapper) {
      this.context = contextWrapper.ctx;
      contextWrapper.icons = null;
      contextWrapper.ctx = null;
    }
  };

  PIXI.TextMetrics.measureText = function (text, style, wordWrap, canvas) {
    return measureText(text, style, wordWrap, contextWrapper.ctx ? canvasWrapper : canvas);
  };
}
