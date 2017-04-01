//----------------------------------------------------------------------
//
// This source file is part of the Emoj project.
//
// Licensed under MIT. See LICENCE for full licence information.
//
//----------------------------------------------------------------------

const { BigInteger } = require('bigdecimal');


// The Emoj VM is fully defined here, since we don't have an AST, and
// the parser is trivial.

function last(xs) {
  return xs[xs.length - 1];
}

function isSeparator(text) {
  return /\s/.test(text);
}

function nonEmpty(xs) {
  return xs.length > 0;
}

function parse(source) {
  return Array.from(source);
}


class Primitive {
  constructor(name, fn) {
    this.computation = fn;
    this.name = name;
  }

  execute(vm) {
    this.computation(vm);
  }
}

class Procedure {
  constructor(name, code) {
    this.code = code;
    this.name = name;
  }

  execute(vm) {
    vm.nestExecution(this.code);
  }
}


const numberMap = new Map([
  ['0', 0],
  ['1', 1],
  ['2', 2],
  ['3', 3],
  ['4', 4],
  ['5', 5],
  ['6', 6],
  ['7', 7],
  ['8', 8],
  ['9', 9]
]);

const numbers = new Set(numberMap.keys());

const defaultEnv = Object.assign(Object.create(null), {
  '✅': new Primitive('✅', (vm) => {
    let digits = [vm.pop()];
    if (!digits.every(x => numbers.has(x))) {
      throw new Error('✅ requires at least one digit on the stack');
    }
    while (vm.stack.length > 0) {
      let digit = vm.pop();
      if (!numbers.has(digit)) {
        vm.stack.push(digit);
        break;
      } else {
        digits.push(digit);
      }
    }
    vm.stack.push(new BigInteger(digits.map(x => numberMap.get(x)).join('')));
  }),

  '🔤': new Primitive('🔤', (vm) => {
    const letter = vm.pop();
    vm.show(String.fromCharCode(Number(letter)));
  }),

  '🔢': new Primitive('🔢', (vm) => {
    const number = vm.pop();
    vm.show(number.toString());
  }),

  '❕': new Primitive('❕', (vm) => {
    vm.switchMode();
  }),

  '🔀': new Primitive('🔀', (vm) => {
    const first = vm.pop();
    const second = vm.pop();
    vm.stack.push(first, second);
  }),

  '⏫': new Primitive('⏫', (vm) => {
    const item = vm.pop();
    vm.stack.push(item, item);
  }),

  '⤵': new Primitive('⤵', (vm) => {
    vm.pop();
  }),

  '🙏': new Primitive('🙏', (vm) => {
    const code = vm.pop();
    vm.nestExecution(code);
  }),

  '👌': new Primitive('👌', (vm) => {
    const code = vm.pop();
    const name = vm.pop();
    vm.environment[name] = new Procedure(name, code);
  }),

  '✖': new Primitive('✖', (vm) => {
    const a = vm.pop();
    const b = vm.pop();
    vm.stack.push(a.multiply(b));
  }),

  '➕': new Primitive('➕', (vm) => {
    const a = vm.pop();
    const b = vm.pop();
    vm.stack.push(a.add(b));
  }),

  '➖': new Primitive('➖', (vm) => {
    const a = vm.pop();
    const b = vm.pop();
    vm.stack.push(a.subtract(b));
  }),

  '➗': new Primitive('➗', (vm) => {
    const a = vm.pop();
    const b = vm.pop();
    vm.stack.push(a.divide(b));
  }),

  '🔁': new Primitive('🔁', (vm) => {
    let condition = vm.pop();
    const code = vm.pop();
    while (condition !== '🙅') {
      vm.nestExecution(code);
      condition = vm.pop();
    }
  }),

  '👐': new Primitive('👐', (vm) => {
    const a = vm.pop();
    const b = vm.pop();
    vm.stack.push(a === b ? '🙆' : '🙅');
  }),

  '⁉': new Primitive('⁉', (vm) => {
    const condition = vm.pop();
    const alternate = vm.pop();
    const consequent = vm.pop();
    vm.nestExecution(condition === '🙆' ? consequent : alternate);
  })
});

class VM {
  constructor(source) {
    this.position = 0;
    this.code = parse(source);
    this.stack = [];
    this.mode = 'code';
    this.modeControl = '❕';
    this.environment = Object.create(defaultEnv);
    this.evaluationStack = [];
    this.output = '';
  }

  executeNext() {
    if (this.position < this.code.length) {
      const instruction = this.code[this.position];
      this.position += 1;
      switch (this.mode) {
        case 'code': {
          if (instruction in this.environment) {
            this.environment[instruction].execute(this, instruction);
          } else {
            this.stack.push(instruction);
          }
          break;
        }

        case 'data': {
          if (instruction === this.modeControl) {
            this.switchMode();
          } else {
            const current = this.pop();
            this.stack.push([...current, instruction]);
          }
          break;
        }

        default:
          throw new Error(`Invalid mode: ${this.mode}`);
      }
      return false;
    } else {
      return true;
    }
  }

  execute() {
    let done = false;
    while (!done) {
      done = this.executeNext();
      if (done && this.evaluationStack.length) {
        const state = this.evaluationStack.pop();
        this.position = state.position;
        this.code = state.code;
        this.mode = state.mode;
        done = false;
      }
    }
    return this.output;
  }

  nestExecution(source) {
    this.evaluationStack.push({
      position: this.position,
      code: this.code,
      mode: this.mode
    });

    this.position = 0;
    this.code = parse(source);
    this.mode = 'code';
  }

  newExecution(source) {
    this.position = 0;
    this.code = parse(source);
    this.mode = 'code';
    this.output = '';
    this.evaluationStack = [];

    return this.execute();
  }

  switchMode() {
    if (this.mode === 'code') {
      this.mode = 'data';
      this.stack.push([]);
    } else {
      this.mode = 'code';
    }
  }

  pop() {
    if (this.stack.length > 0) {
      return this.stack.pop();
    } else {
      throw new Error('There are no items on the stack');
    }
  }

  show(text) {
    this.output += text;
  }
}


module.exports = VM;
