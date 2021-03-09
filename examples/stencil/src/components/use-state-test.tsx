import { Component, h } from '@stencil/core';
import { withHooks } from '@saasquatch/stencil-hooks';
import { useState } from '@saasquatch/universal-hooks';
@Component({
  tag: 'use-state-test',
})
export class UseStateTest {
  render() {
    const [counter, setCounter] = useState(0);
    function inc() {
      setCounter(counter + 1);
    }
    function dec() {
      setCounter(c => c - 1);
    }

    return (
      <div>
        <div>
          <p>Counter: {counter}</p>
        </div>
        <div>
          <button onClick={inc}>Increment</button>
          <button onClick={dec}>Decrement</button>
        </div>
      </div>
    );
  }

  constructor() {
    withHooks(this);
  }
  disconnectedCallback() {}
}
