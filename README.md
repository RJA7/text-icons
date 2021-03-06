# Text Icons

The tool allows to inline sprites into text objects. 
Works with PIXI as well as Phaser.

![PIXI & Phaser Text Icons!](https://repository-images.githubusercontent.com/211646503/9dc55980-e2c2-11e9-9d36-bd2480e18352)

## Setup
<pre>
import textIcons from 'text-icons';

textIcons.extend(PIXI.Text); // or textIcons.extend(Phaser.Text);
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

## Changelog

#### 3.0.1:
* Fix drawing with stroke

#### 3.0.0:
* Do not use texture trim

#### 2.0.2:
* Fix trimmed textures render

#### 2.0.0:
* Don't override Library Text property

#### 1.2.2:
* Use new source place for pixi

#### 1.2.1:
* Fix icon is not drown right after another one

#### 1.2.0:
* Fix phaser font size NaN
* Center icon vertically, by default, for standard font

#### 1.1.0:
* Make icons size depend on text font size

#### 1.0.0:
* Initial
