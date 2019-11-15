function extend(TextClass) {
  const updateText = TextClass.prototype.updateText;

  function getFontSize(textObject) {
    return parseInt(textObject.fontSize || textObject.style.fontSize, 10);
  }

  TextClass.prototype.updateText = function (a, b, c, d) {
    if (this.context.measureText.textIconsFlag) {
      return updateText.call(this, a, b, c, d);
    }

    const self = this;
    const ctx = this.context;
    const measureText = ctx.measureText;
    const fillText = ctx.fillText;

    ctx.measureText = function (text) {
      const keys = self.icons && Object.keys(self.icons);

      if (!keys || keys.length === 0) {
        return measureText.call(ctx, text);
      }

      let width = measureText.call(ctx, text).width;

      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const match = text.match(new RegExp(key, 'g'));

        if (match) {
          const icon = self.icons[key];
          const scale = getFontSize(self) / icon.texture.frame.height;
          width -= match.length * measureText.call(ctx, key).width;
          width += match.length * (icon.x + icon.width) * scale;
        }
      }

      return {width};
    };

    ctx.measureText.textIconsFlag = true;

    ctx.fillText = function (text, x, y, maxWidth) {
      const keys = self.icons && Object.keys(self.icons);

      if (!keys || keys.length === 0) {
        return fillText.call(ctx, text, x, y, maxWidth);
      }

      const splitter = '| p | e | a | c | e & s | e | c | u | r | i | t | y |';
      const order = [];

      const parts = text
        .replace(
          new RegExp(keys.join('|'), 'g'),
          (match) => {
            order.push(self.icons[match]);
            return splitter;
          },
        )
        .split(splitter);

      const fontSize = getFontSize(self);
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
        const trim = icon.texture.trim;
        const tx = mx + icon.x * scale + trim.x;
        const ty = y - fontSize * 0.35 + (icon.y - icon.height * 0.5) * scale + trim.y;
        const source = icon.texture.baseTexture.source ||
          icon.texture.baseTexture.resource.source;

        ctx.drawImage(
          source,
          frame.x, frame.y, frame.width, frame.height,
          tx, ty, trim.width * scale, trim.height * scale,
        );

        mx += (icon.x + icon.width) * scale;
      }
    };

    return updateText.call(this, a, b, c, d);
  };
}

module.exports = {extend};
