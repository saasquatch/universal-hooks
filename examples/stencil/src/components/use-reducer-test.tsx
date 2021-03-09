import { Component, h } from '@stencil/core';
import { withHooks } from '@saasquatch/stencil-hooks';
import { useReducer } from "@saasquatch/universal-hooks"

@Component({
  tag: 'use-reducer-test',
})
export class UseReducerTest {

  constructor() {
    withHooks(this);
  }

  render() {
    function reducer(prev: number, action: "INC" | "DEC") {
      switch (action) {
        case "INC":
          return prev + 1;
        case "DEC":
          return prev - 1;
        default:
          throw new Error("uh oh");
      }
    }
    
    const [counter1, counterAction1] = useReducer(reducer, 0);
    function inc1() {
      counterAction1("INC");
    }
    function dec1() {
      counterAction1("DEC");
    }
  
    const [counter2, counterAction2] = useReducer(
      reducer,
      "0",
      (unparsed: string) => JSON.parse(unparsed)
    );
    function inc2() {
      counterAction2("INC");
    }
    function dec2() {
      counterAction2("DEC");
    }
  
    return (
      <div>
        <div>
          <h3>Initial Value</h3>
          <div>
            <p>Counter A: {counter1}</p>
          </div>
          <div>
            <button onClick={inc1}>Increment</button>
            <button onClick={dec1}>Decrement</button>
          </div>
        </div>
        <br />
        <div>
          <h3>Initial Function</h3>
          <div>
            <p>Counter B: {counter2}</p>
          </div>
          <div>
            <button onClick={inc2}>Increment</button>
            <button onClick={dec2}>Decrement</button>
          </div>
        </div>
      </div>
    );
  }
  disconnectedCallback() {}
}

