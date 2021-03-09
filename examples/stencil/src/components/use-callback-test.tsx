import { Component, h } from '@stencil/core';
import { withHooks } from '@saasquatch/stencil-hooks';
import { useCallback, useState } from '@saasquatch/universal-hooks';
import _ from 'lodash';

@Component({
  tag: 'use-callback-test',
})
export class UseCallbackTest {
  render() {
    const [typing, setTyping] = useState(false);
    const [text, setText] = useState('Start typing!');

    function formatTyping(typing: boolean) {
      return typing ? 'TYPING' : '...';
    }

    function toggleTyping() {
      setTyping(s => !s);
    }

    const typingThing = useCallback(_.debounce(toggleTyping, 500, { leading: true, trailing: true }), []);

    return (
      <div>
        <input type="text" value={text} onInput={e => (setText((e.target as HTMLInputElement).value), typingThing())} />
        <p>{formatTyping(typing)}</p>
      </div>
    );
  }

  constructor() {
    withHooks(this);
  }
  disconnectedCallback() {}
}
