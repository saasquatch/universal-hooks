import { Component, h } from '@stencil/core';
import { withHooks } from '@saasquatch/stencil-hooks';

@Component({
  tag: 'use-context-test',
})
export class UseContextTest {
  render() {
    return <div>
      <h1>TODO</h1>
    </div>
  }

  constructor() {
    withHooks(this);
  }
  disconnectedCallback() {}
}
