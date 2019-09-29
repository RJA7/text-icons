function extend(TextClass) {
  return class Text extends TextClass {
    constructor(...args) {
      super(...args);

      this.icons = {};

      const ctx = this.canvas.getContext('2d');
      const measureText = ctx.measureText;
      const fillText = ctx.fillText;

      ctx.measureText = (text) => {
        const keys = Object.keys(this.icons);

        if (keys.length === 0) {
          return measureText.call(ctx, text);
        }

        let width = measureText.call(ctx, text).width;

        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          const match = text.match(new RegExp(key, 'g'));

          if (match) {
            const icon = this.icons[key];
            width -= match.length * measureText.call(ctx, key).width;
            width += match.length * (icon.x + icon.width);
          }
        }

        return { width };
      };

      ctx.fillText = (text, x, y, maxWidth) => {
        const keys = Object.keys(this.icons);

        if (keys.length === 0) {
          return fillText.call(ctx, text, x, y, maxWidth);
        }

        const splitter = 'f@*|₴i$|$T';
        const order = [];

        const parts = text
          .replace(
            new RegExp(keys.join('|'), 'g'),
            (match) => {
              order.push(this.icons[match]);
              return splitter;
            },
          )
          .split(splitter);

        let mx = x;

        for (let i = 0; i < parts.length; i++) {
          const part = parts[i];

          if (!part) continue;

          fillText.call(ctx, part, mx, y);
          mx += measureText.call(ctx, part).width;

          if (order.length === 0) continue;

          const icon = order.shift();
          const frame = icon.texture.frame;
          const tx = mx + icon.x;
          const ty = y + icon.y - icon.height * 0.5;

          ctx.drawImage(
            icon.texture.baseTexture.source,
            frame.x, frame.y, frame.width, frame.height,
            tx, ty, icon.width, icon.height,
          );

          mx += icon.x + icon.width;
        }
      };
    }
  };
}

module.exports = { extend };
