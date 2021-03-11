function unimplemented() {
  throw Error("No implementation defined for universal-hooks-testing-library");
}

type TestLib = {
  renderHook: typeof renderHook;
  act: typeof act;
};

const impl: { current: TestLib } = {
  current: {
    renderHook: unimplemented as any,
    act: unimplemented as any,
  },
};

export function setTestImplementation(lib: TestLib) {
  impl.current = lib;
}

export function renderHook<P, R>(
  hook: (props: P) => R,
  options: { initialProps?: P } = {}
): {
  result: {
    current: R;
  };
  rerender: (props?: P) => void;
  unmount: () => void;
} {
  return impl.current.renderHook(hook, options);
}

export function act(cb: () => Promise<void | undefined>): Promise<undefined>;
export function act(cb: () => void | undefined): void;
export function act(cb: any): any {
  return impl.current.act(cb);
}
