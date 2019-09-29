# Text Icons

The tool allows to inline sprites into text objects. 
Works with PIXI as well as Phaser.

![PIXI & Phaser Text Icons!](https://repository-images.githubusercontent.com/211646503/9dc55980-e2c2-11e9-9d36-bd2480e18352)

## Setup
<pre>
import textIcons from 'text-icons';

PIXI.Text = textIcons.extend(PIXI.Text); // or Phaser.Text = textIcons.extend(Phaser.Text);
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


This module is written on es2015.
Make sure node_modules compilation is enabled in your project setup.

## Changelog

-> 1.0.0:
* Initial
