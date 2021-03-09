import { Component, h } from '@stencil/core';
import { withHooks } from '@saasquatch/stencil-hooks';
import { useRef, useEffect } from '@saasquatch/universal-hooks';
@Component({
  tag: 'use-ref-test',
})
export class UseRefTest {
  render() {
    const counter = useRef<HTMLElement>(null);

    function ticker() {
      setTimeout(() => {
        counter.current.textContent = (parseInt(counter.current.textContent ?? '0') + 1).toString();
        ticker();
      }, 1000);
    }

    useEffect(() => {
      ticker();
    }, []);

    return (
      <p>
        Counting: <strong ref={el => (counter.current = el)}>0</strong>
      </p>
    );
  }

  constructor() {
    withHooks(this);
  }
  disconnectedCallback() {}
}
