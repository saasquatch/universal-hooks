import { Component, h } from '@stencil/core';
import { withHooks } from '@saasquatch/stencil-hooks';
import { useState, useEffect } from '@saasquatch/universal-hooks';

@Component({
  tag: 'use-effect-test',
})
export class UseEffectTest {
  render() {
    const [text1, setText1] = useState('Change me!');
    const [text2, setText2] = useState('And me! And change the dependency again!');
    const [displayText1, setDisplayText1] = useState(text1);
    const [displayText2, setDisplayText2] = useState(text2);

    useEffect(() => {
      setDisplayText1(text1);
      setDisplayText2(text2);
    }, [text1]);

    return (
      <div>
        <div>
          <h3>A Dependency</h3>
          <input type="text" value={text1} onInput={e => setText1((e.target as HTMLInputElement).value)} />
          <p>
            <strong>Text:</strong> {displayText1}
          </p>
        </div>
        <br />
        <div>
          <h3>Not a Dependency</h3>
          <input type="text" value={text2} onInput={e => setText2((e.target as HTMLInputElement).value)} />
          <p>
            <strong>Text:</strong> {displayText2}
          </p>
        </div>
      </div>
    );
  }

  constructor() {
    withHooks(this);
  }
  disconnectedCallback() {}
}
