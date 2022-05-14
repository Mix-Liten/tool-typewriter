# tool-typewriter

A simple yet powerful native javascript plugin for a cool typewriter effect.

![](./preview.gif)

## Core

```js
new Typewriter(container[, options]);
```

- container

  String or HTMLElement, where would be set typewriter effect

- options

  See [Options](#options)

## Examples

[Example](https://mix-liten.github.io/tool-typewriter/)

### Basic example

```js
import Typewriter from 'lib/Typewriter.js';

const typewriter = new Typewriter('#letter');

typewriter
  .typeString('Where do I start?')
  .pauseFor(1000)
  .typeString('\n\nHello World!');
```

## Options

| Name             | Type    | Default value           | Description                                    |
| ---------------- | ------- | ----------------------- | ---------------------------------------------- |
| loop             | Boolean | false                   | Whether to keep looping or not.                |
| delay            | Number  | random in 120ms ~ 160ms | The delay between each key when typing.        |
| deleteSpeed      | Number  | random in 40ms ~ 80ms   | The delay between deleting each character.     |
| defaultPauseFor  | Number  | 1500                    | The default pause duration for pauseFor method |
| wrapperClassName | String  | 'Typewriter__wrapper'   | Class name for the wrapper element.            |
| cursorClassName  | String  | 'Typewriter__cursor'    | Class name for the cursor element.             |
| cursor           | String  | '\|'                    | String value to use as the cursor.             |


## Methods

All methods can be chained together.

| Name        | Params                                                  | Description                                                                 |
| ----------- | ------------------------------------------------------- | --------------------------------------------------------------------------- |
| start       | -                                                       | Start the typewriter effect.                                                |
| pause       | -                                                       | Pause the typewriter effect.                                                |
| pauseFor    | ``ms`` Time to pause for in milliseconds                | Pause for milliseconds                                                      |
| typeString  | ``string`` String to type out, it can contain HTML tags | Type out a string using the typewriter effect.                              |
| deleteAll   | ``ms`` Time in ms to deleteAll                          | Delete everything that is visible inside of the typewriter wrapper element. |
| deleteChars | ``amount`` Number of characters                         | Delete and amount of characters, starting at the end of the visible string. |
