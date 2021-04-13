import { State } from "haunted";

class Result<T> {
  private _current: T;

  constructor() {
    this._current = undefined;
  }
  get current() {
    return this._current;
  }
  set current(next) {
    this._current = next;
  }
}

export function renderHook<P, R>(
  hook: (props: P) => R,
  options: { initialProps?: P } = {}
): {
  result: Result<R>;
  rerender: (props?: P) => void;
  unmount: () => void;
} {
  let result = new Result<R>();
  let state = new State(() => {
    update(options.initialProps);
  }, null);

  function update(props) {
    state.run(() => {
      result.current = hook(props);
    });
  }

  function rerender(newProps?: any) {
    update(newProps);
    state.runLayoutEffects();
    state.runEffects();
  }
  rerender(options.initialProps);

  return {
    result,
    rerender,
    unmount: () => state.teardown(),
  };
}

export function act(cb: () => Promise<void | undefined>): Promise<undefined>;
export function act(cb: () => void | undefined): void;
export function act(cb: () => any): any {
  return Promise.resolve(cb());
}

export async function waitForNextUpdate(options?: {
  timeout?: number | false;
}): Promise<void> {}

export async function waitFor(
  callback: () => boolean | void,
  options?: {
    interval?: number | false;
    timeout?: number | false;
  }
): Promise<void> {}

export async function waitForValueToChange(
  selector: () => any,
  options?: {
    interval?: number | false;
    timeout?: number | false;
  }
): Promise<void> {}
