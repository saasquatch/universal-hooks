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

type Result<T> = { current: T };

type RenderHookReturn<P, R> = {
  result: Result<R>;
  rerender: (props?: P) => void;
  waitForNextUpdate: (options?: { timeout?: number | false }) => Promise<void>;
  waitFor: (
    callback: () => boolean | void,
    options?: {
      interval?: number | false;
      timeout?: number | false;
    }
  ) => Promise<void>;
  waitForValueToChange: (
    selector: () => any,
    options?: {
      interval?: number | false;
      timeout?: number | false;
    }
  ) => Promise<void>;
  unmount: () => void;
};

type RenderHookReturnVoid<R> = {
  result: Result<R>;
  rerender: () => void;
  waitForNextUpdate: (options?: { timeout?: number | false }) => Promise<void>;
  waitFor: (
    callback: () => boolean | void,
    options?: {
      interval?: number | false;
      timeout?: number | false;
    }
  ) => Promise<void>;
  waitForValueToChange: (
    selector: () => any,
    options?: {
      interval?: number | false;
      timeout?: number | false;
    }
  ) => Promise<void>;
  unmount: () => void;
};

export function renderHook<P, R>(
  hook: (props: P) => R,
  options: { initialProps: P }
): RenderHookReturn<P, R>;
export function renderHook<P, R>(hook: () => R): RenderHookReturnVoid<R>;
export function renderHook(
  hook: any,
  options?: any,
): any {
  return impl.current.renderHook(hook, options);
}

export function act(cb: () => Promise<void | undefined>): Promise<undefined>;
export function act(cb: () => void | undefined): void;
export function act(cb: any): any {
  return impl.current.act(cb);
}
