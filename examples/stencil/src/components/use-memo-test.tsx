import { Component, h } from '@stencil/core';
import { withHooks } from '@saasquatch/stencil-hooks';
import { useReducer, useMemo } from '@saasquatch/universal-hooks';

function formatDate(date: Date): string {
  function pad2(n: number): string | number {
    return n >= 10 ? n : '0' + n;
  }
  function pad3(n: number): string | number {
    return n >= 100 ? n : n >= 10 ? '0' + n : '00' + n;
  }
  return pad2(date.getHours()) + ':' + pad2(date.getMinutes()) + ':' + pad2(date.getSeconds()) + '.' + pad3(date.getMilliseconds());
}

function timestampNow(): string {
  return formatDate(new Date(Date.now()));
}

@Component({
  tag: 'use-memo-test',
})
export class Boilerplate {
  constructor() {
    withHooks(this);
  }

  reducer(prev: number, action: 'INC' | 'DEC') {
    switch (action) {
      case 'INC':
        return prev + 1;
      case 'DEC':
        return prev - 1;
      default:
        throw new Error('uh oh');
    }
  }

  render() {
    const [counterCheap, counterCheapAction] = useReducer(this.reducer, 0);
    const [counterCostly, counterCostlyAction] = useReducer(this.reducer, 0);

    // new Date(Date.now()).toLocaleString("en-CA") + ": useEffect called!",

    return (
      <div>
        <div style={{ display: 'flex' }}>
          <div style={{ padding: '15px' }}>
            <div>
              <p>Counter: {counterCheap}</p>
              <p>Cheap calculation: {timestampNow()}</p>
            </div>
            <div>
              <button onClick={() => counterCheapAction('INC')}>Increment</button>
              <button onClick={() => counterCheapAction('DEC')}>Decrement</button>
            </div>
          </div>
          <div style={{ padding: '15px' }}>
            <div>
              <p>Counter: {counterCostly}</p>
              <p>Costly calculation: {useMemo(() => timestampNow(), [counterCostly])}</p>
            </div>
            <div>
              <button onClick={() => counterCostlyAction('INC')}>Increment</button>
              <button onClick={() => counterCostlyAction('DEC')}>Decrement</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  disconnectedCallback() {}
}
