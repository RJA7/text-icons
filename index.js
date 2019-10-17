function extend(TextClass) {
  return class Text extends TextClass {
    constructor(...args) {
      super(...args);

      this.icons = {};

      const ctx = this.canvas.getContext('2d');
      const measureText = ctx.measureText;
      const fillText = ctx.fillText;

      const getFontSize = () => {
        return parseInt(this.fontSize || this.style.fontSize, 10);
      };

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
            const scale = getFontSize() / icon.texture.frame.height;
            width -= match.length * measureText.call(ctx, key).width;
            width += match.length * (icon.x + icon.width) * scale;
          }
        }

        return {width};
      };

      ctx.fillText = (text, x, y, maxWidth) => {
        const keys = Object.keys(this.icons);

        if (keys.length === 0) {
          return fillText.call(ctx, text, x, y, maxWidth);
        }

        const splitter = '| p | e | a | c | e & s | e | c | u | r | i | t | y |';
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

        const fontSize = getFontSize();
        let mx = x;

        for (let i = 0; i < parts.length; i++) {
          const part = parts[i];

          if (part) {
            fillText.call(ctx, part, mx, y);
            mx += measureText.call(ctx, part).width;
          }

          if (order.length === 0) continue;

          const icon = order.shift();
          const scale = fontSize / icon.texture.frame.height;
          const frame = icon.texture.frame;
          const tx = mx + icon.x * scale;
          const ty = y - fontSize * 0.35 + (icon.y - icon.height * 0.5) * scale;
          const source = icon.texture.baseTexture.source ||
            icon.texture.baseTexture.resource.source;

          ctx.drawImage(
            source,
            frame.x, frame.y, frame.width, frame.height,
            tx, ty, icon.width * scale, icon.height * scale,
          );

          mx += (icon.x + icon.width) * scale;
        }
      };
    }
  };
}

module.exports = {extend};
