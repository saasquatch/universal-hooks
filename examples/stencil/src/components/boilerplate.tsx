import { Component, h } from '@stencil/core';
import { withHooks } from '@saasquatch/stencil-hooks';

@Component({
  tag: 'boiler-plate',
})
export class Boilerplate {
  render() {
    return <div>
      <h1>Boilerplate</h1>
    </div>
  }

  constructor() {
    withHooks(this);
  }
  disconnectedCallback() {}
}
