export type Icon = {
  x: number;
  y: number;
  scale: { x: number; y: number };
  shadow?: boolean;
  texture: {
    baseTexture: {
      source?: CanvasImageSource;
      resource?: unknown;
    };
    frame: { x: number; y: number; width: number; height: number };
  };
};

// @ts-ignore
declare module 'pixi.js' {
  export interface Text {
    icons: {
      [key: string]: Icon;
    };
  }
}

class ContextWrapper {
  public ctx!: CanvasRenderingContext2D;
  public icons!: { [key: string]: Icon };

  public measureText(text: string): TextMetrics {
    const keys = Object.keys(this.icons);
    const metrics = this.ctx.measureText(text);

    if (keys.length === 0) {
      return metrics;
    }

    let width = metrics.width;
    const exec = /\d+/.exec(this.ctx.font);
    const mHeight = Number((exec && exec[0]) || 36);

    for (let i = 0, l = keys.length; i < l; i++) {
      const key = keys[i];
      const match = text.match(new RegExp(key, 'g'));

      if (match) {
        const icon = this.icons[key];
        const frame = icon.texture.frame;
        const scale = mHeight / frame.height;
        const iconWidth = frame.width * icon.scale.x * scale;

        width -= match.length * this.ctx.measureText(key).width;
        width += match.length * iconWidth;
      }
    }

    return { ...metrics, width };
  }

  public fillText(text: string, x: number, y: number, maxWidth?: number): void {
    this.fillOrStrokeTextWithIcons(this.fillTextCb, true, text, x, y, maxWidth);
  }

  public strokeText(text: string, x: number, y: number, maxWidth?: number): void {
    this.fillOrStrokeTextWithIcons(this.strokeTextCb, false, text, x, y, maxWidth);
  }

  private fillTextCb = (text: string, x: number, y: number, maxWidth?: number): void => {
    if (typeof maxWidth === 'number') {
      this.ctx.fillText(text, Math.floor(x), Math.floor(y), Math.floor(maxWidth));
    } else {
      this.ctx.fillText(text, Math.floor(x), Math.floor(y));
    }
  };

  private strokeTextCb = (text: string, x: number, y: number, maxWidth?: number): void => {
    if (typeof maxWidth === 'number') {
      this.ctx.strokeText(text, Math.floor(x), Math.floor(y), Math.floor(maxWidth));
    } else {
      this.ctx.strokeText(text, Math.floor(x), Math.floor(y));
    }
  };

  private fillOrStrokeTextWithIcons(
    drawCb: (text: string, x: number, y: number, maxWidth?: number) => void,
    isFill: boolean,
    text: string,
    x: number,
    y: number,
    maxWidth?: number,
  ) {
    const keys = Object.keys(this.icons);

    if (keys.length === 0) {
      return drawCb(text, x, y, maxWidth);
    }

    const isShadow = this.ctx.shadowBlur !== 0 || this.ctx.shadowOffsetX !== 0 || this.ctx.shadowOffsetY !== 0;
    const splitter = '!#$@-%';
    const order: Icon[] = [];

    const parts = text
      .replace(new RegExp(keys.join('|'), 'g'), (match) => {
        order.push(this.icons[match]);
        return splitter;
      })
      .split(splitter);

    const exec = /\d+/.exec(this.ctx.font);
    const mHeight = Number((exec && exec[0]) || 36);
    let mx = x;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const icon = order.shift();

      if (part) {
        drawCb(part, mx, y);
        mx += this.ctx.measureText(part).width;
      }

      if (icon) {
        const frame = icon.texture.frame;
        const scale = mHeight / frame.height;
        const iconX = icon.x * scale;
        const iconY = icon.y * scale;
        const iconWidth = frame.width * icon.scale.x * scale;
        const iconHeight = frame.height * icon.scale.y * scale;

        if (isShadow ? icon.shadow : isFill) {
          const tx = mx + iconX;
          const ty = y - mHeight * 0.4 + iconY - iconHeight * 0.5;
          // @ts-ignore
          const source = icon.texture.baseTexture.source || icon.texture.baseTexture.resource?.source;

          if (source) {
            this.ctx.drawImage(
              source,
              frame.x,
              frame.y,
              frame.width,
              frame.height,
              Math.floor(tx),
              Math.floor(ty),
              Math.floor(iconWidth),
              Math.floor(iconHeight),
            );
          }
        }

        mx += iconWidth;
      }
    }
  }
}

const contextWrapper = new ContextWrapper();

[
  'canvas',
  'globalAlpha',
  'globalCompositeOperation',
  'direction',
  'fillStyle',
  'filter',
  'font',
  'imageSmoothingEnabled',
  'imageSmoothingQuality',
  'lineCap',
  'lineDashOffset',
  'lineJoin',
  'lineWidth',
  'miterLimit',
  'shadowBlur',
  'shadowColor',
  'shadowOffsetX',
  'shadowOffsetY',
  'strokeStyle',
  'textAlign',
  'textBaseline',
].forEach((prop) => {
  Object.defineProperty(contextWrapper, prop, {
    get() {
      return this.ctx[prop];
    },
    set(v) {
      this.ctx[prop] = v;
    },
  });
});

[
  'beginPath',
  'arc',
  'arcTo',
  'bezierCurveTo',
  'clearRect',
  'clip',
  'closePath',
  'createImageData',
  'createLinearGradient',
  'createPattern',
  'createRadialGradient',
  'drawFocusIfNeeded',
  'drawImage',
  'ellipse',
  'fill',
  'fillRect',
  'getImageData',
  'getLineDash',
  'getTransform',
  'isPointInPath',
  'isPointInStroke',
  'lineTo',
  'moveTo',
  'putImageData',
  'quadraticCurveTo',
  'rect',
  'resetTransform',
  'restore',
  'translate',
  'transform',
  'strokeRect',
  'stroke',
  'setTransform',
  'setLineDash',
  'scrollPathIntoView',
  'scale',
  'save',
  'rotate',
].forEach((method) => {
  // @ts-ignore
  contextWrapper[method] = (...args) => contextWrapper.ctx[method](...args);
});

// @ts-ignore
export function extend(PIXI) {
  const updateText = PIXI.Text.prototype.updateText;
  const measureText = PIXI.TextMetrics.measureText;
  const canvasWrapper = { getContext: () => contextWrapper };

  PIXI.Text.prototype.updateText = function (respectDirty: boolean) {
    if (this.icons) {
      contextWrapper.ctx = this.context;
      contextWrapper.icons = this.icons;
      this.context = contextWrapper;
    }

    updateText.call(this, respectDirty);

    if (this.context === contextWrapper) {
      this.context = contextWrapper.ctx;
      contextWrapper.icons = null!;
      contextWrapper.ctx = null!;
    }
  };

  PIXI.TextMetrics.measureText = function (
    text: string,
    style: unknown,
    wordWrap?: boolean,
    canvas?: HTMLCanvasElement,
  ) {
    return measureText(text, style, wordWrap, contextWrapper.ctx ? canvasWrapper : canvas);
  };
}
