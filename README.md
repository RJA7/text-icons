# Text Icons

The tool allows to inline sprites into PIXI text objects. 

## Setup
<pre>
import * as textIcons from 'text-icons';

textIcons.extend(PIXI);
</pre>

## Usage
<pre>
const textObject = new PIXI.Text('PIXI @coin@ Phaser\nText Icons @coin@ !');

textObject.icons = {
  '@coin@': new PIXI.Sprite(PIXI.Texture.from('coin.png')),
}
</pre>

## Notes
The keys for icons object cannot contain some special symbols,
which require escapes in regex. 

Do not use `$`, `.` and others.

Use letters, `@` and `_`.
