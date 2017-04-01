//----------------------------------------------------------------------
//
// This source file is part of the Emoj project.
//
// Licensed under MIT. See LICENCE for full licence information.
//
//----------------------------------------------------------------------

const React = require('react');
const ReactDOM = require('react-dom');

const App = require('./app');

if (!localStorage.chats) {
  localStorage.chats = JSON.stringify([{
    id: 'getting-started',
    name: 'Getting Started',
    date: new Date,
    allowDelete: false,
    session: [
      {
        type: 'debug',
        text: `Emoj is a modern programming language that solves some of the major problems with existing languages, like JavaScript.

Emoj uses emoji, instead of English, making the program’s source code much smaller. Also, since Emoj has no fixed syntax, you can change the meaning of any part of your code.`
      },
      {
        type: 'input',
        text: '123✅'
      },
      {
        type: 'output',
        text: '321'
      },
      {
        type: 'debug',
        text: 'The example above adds the symbols 1, 2, and 3 to the program, then interprets those symbols as a number (✅). Since Emoj is a stack-based language, the digits are interpreted from most recent to oldest.'
      },
      {
        type: 'input',
        text: '2✅➕'
      },
      {
        type: 'output',
        text: '323'
      },
      {
        type: 'debug',
        text: `Operations work on the program’s stack. Here we’re adding the number 2 to the value that was previously on the stack.

There are operations to manipulate the stack directly in Emoj:

- 🔀 swaps the top two items of the stack.
- ⏫ duplicates the top item of the stack.
- ⤵ discards the top item of the stack.`
      },
      {
        type: 'input',
        text: '⏫01✅🔀➖'
      },
      {
        type: 'output',
        text: '323, 313'
      },
      {
        type: 'input',
        text: '🔀⤵'
      },
      {
        type: 'output',
        text: '313'
      },
      {
        type: 'debug',
        text: `In emoji, there are two kinds of data: numbers, and program code. Program code is what’s added to the stack when there’s no operation defined for a character. Numbers are what you get by interpreting the stack with ✅.

Instead of tagging values with their types, as JavaScript does, in Emoj operations interpret numbers as they see fit. This saves memory, since we don’t need to store the type of the value with its data. There are two operations to interpret data built-in:

- 🔤 interprets data as text (where the number is a character code).
- 🔢 interprets data as a number.`
      },
      {
        type: 'input',
        text: '23✅56✅🔤🔤🔢'
      },
      {
        type: 'output',
        text: 'A 313'
      },
      {
        type: 'debug',
        text: `In general, the Emoj VM will add the character to the stack only if it can’t interpret it, but you can switch to the Data mode in order to add all characters to the stack. This also lets you add more complex emojis. The ❕ switches between Data mode and Code mode.`
      },
      {
        type: 'input',
        text: '❕👏👏👏❕❕⏫⏫⏫❕'
      },
      {
        type: 'output',
        text: '[👏, 👏, 👏], [⏫, ⏫, ⏫]'
      },
      {
        type: 'debug',
        text: `You can run something that's on the stack as a program with 🙏.`
      },
      {
        type: 'input',
        text: '🙏'
      },
      {
        type: 'output',
        text: '[👏, 👏, 👏], [👏, 👏, 👏], [👏, 👏, 👏], [👏, 👏, 👏]'
      },
      {
        type: 'debug',
        text: 'You can also define new meanings in the program by using the 👌 operation.'
      },
      {
        type: 'input',
        text: '🤘❕801✅79✅611✅101✅901✅🔤🔤🔤🔤🔤❕👌'
      },
      {
        type: 'input',
        text: '🤘'
      },
      {
        type: 'output',
        text: 'metal'
      },
      {
        type: 'debug',
        text: `Besides applying and composing functions, Emoj comes with two control flow operations:

- 🔁 repeats the code on the top of the stack until it adds 🙅 to the stack.
- ⁉ checks the top of the stack, executes the third item if it's 🙆, the second otherwise.`
      },
      {
        type: 'input',
        text: '101✅❕🔤❕❕🔢❕🙆⁉'
      },
      {
        type: 'output',
        text: 'e'
      },
      {
        type: 'debug',
        text: 'A small introduction to Emoj'
      }
    ]
  }, {
    id: 'reference',
    name: 'Reference',
    date: new Date,
    allowDelete: false,
    session: [{
      type: 'debug',
      text: `- 🙆
  Used to signal an OK.

- 🙅
  Used to signal a Not OK.

- [s | a b] 👐 -> [s | bool]
  Compares a and b.

- [s | a b c ...] ✅ -> [s | number]
  Interprets the top items of the stack as a number.

- [s | a] 🔤 -> [s | ]
  Outputs the top of the stack as a text.

- [s | a] 🔢 -> [s | ]
  Outputs the top of the stack as a number.

- [s | ] ❕ -> [s | ]
  Switches between Code and Data modes (nested quotations are not supported).

- [s | a b] 🔀 -> [s | b a]
  Swaps the top two items on the stack.

- [s | a] ⏫ -> [s | a a]
  Duplicates the top item on the stack.

- [s | a] ⤵ -> [s | ]
  Discards the top item from the stack.

- [s | a] 🙏 -> [s | ...]
  Runs the top item on the stack as a program.

- [s | a b] 👌 -> [s | ]
  Defines a new instruction (a) with code (b).

- [s | a b] ✖ -> [s | n]
  Multiplies (b) by (a).

- [s | a b] ➕ -> [s | n]
  Adds (a) to (b).

- [s | a b] ➖ -> [s | n]
  Subtracts (a) from (b).

- [s | a b] ➗ -> [s | n]
  Divides (b) by (a).

- [s | a] 🔁 -> [s | ...]
  Executes (a) until it puts 🙅 at the top of the stack.

- [s | a b c] ⁉ -> [s | ...]
  Executes (a) if (c) is 🙆, executes (b) otherwise.`
    }]
  }])
}

ReactDOM.render(
  <App />,
  document.querySelector('#app')
);
