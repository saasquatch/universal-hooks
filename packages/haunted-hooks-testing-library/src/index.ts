import { State } from "haunted";
import { Subject } from "rxjs";
import { first, mapTo, timeout } from "rxjs/operators";

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

export function renderHook<P, R>(
  hook: (props: P) => R,
  options: { initialProps?: P } = {}
): RenderHookReturn<P, R> {
  const updateSubject = new Subject<R>();

  let result = new Result<R>();

  let state = new State(() => {
    update(options.initialProps);
  }, null);

  function update(props) {
    state.run(() => {
      const res = hook(props);
      result.current = res;
      updateSubject.next(res);
    });
  }

  function rerender(newProps?: any) {
    update(newProps);
    state.runLayoutEffects();
    state.runEffects();
  }
  rerender(options.initialProps);

  async function waitForNextUpdate(options?: {
    timeout?: number | false;
  }): Promise<void> {
    const timeoutMs: number | false = options?.timeout ?? 1000;

    const timeObserver = timeoutMs
      ? updateSubject.pipe(timeout(timeoutMs))
      : updateSubject;

    return timeObserver.pipe(first(), mapTo(null)).toPromise();
  }

  async function waitFor(
    callback: () => boolean | void,
    options?: {
      interval?: number | false;
      timeout?: number | false;
    }
  ): Promise<void> {}

  async function waitForValueToChange(
    selector: () => any,
    options?: {
      interval?: number | false;
      timeout?: number | false;
    }
  ): Promise<void> {}

  return {
    result,
    rerender,
    unmount: () => state.teardown(),
    waitFor,
    waitForNextUpdate,
    waitForValueToChange,
  };
}

export function act(cb: () => Promise<void | undefined>): Promise<undefined>;
export function act(cb: () => void | undefined): void;
export function act(cb: () => any): any {
  return Promise.resolve(cb());
}
