# Universal Hooks Testing Library

This library provides an interface to test hooks written with Universal Hooks. You simply plug an implementation in an continue testing as usual. The API is based off of React Hooks Testing Library.

## Usage

First, you plug in an implementation. Here's an example with React:

```javascript
import * as React from "react";
import * as ReactTestLib from "@testing-library/react-hooks";

setImplementation(React);
setTestImplementation(ReactTestLib);
```

Or with haunted:

```javascript
import * as haunted from "haunted";
import * as hauntedTestingLib from "@saasquatch/haunted-hooks-testing-library";

setImplementation(haunted);
setTestImplementation(hauntedTestingLib);
```

Then, use it like usual.

```javascript
import { setImplementation, useState } from "@saasquatch/universal-hooks";
import { act, renderHook, setTestImplementation } from "../src";

test("example", () => {
  function useHook() {
    const [counter, setCounter] = useState(0);
    const inc = setCounter((c) => c + 1);
    return { counter, inc };
  }

  let result;
  act(() => {
    ({ result } = renderHook(useHook));
  });
  expect(result.current.counter).toBe(0);

  act(() => {
    result.current.inc();
  });
  expect(result.current.counter).toBe(1);
});
```
