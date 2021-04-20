import { State } from "haunted";
import { interval, merge, NEVER, race, Subject } from "rxjs";
import { filter, first, mapTo, timeout } from "rxjs/operators";

class Result<T> {
  private _current: T | undefined;

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
export function renderHook<P, R>(
  hook: (props?: P) => R,
  options?: any
): RenderHookReturn<P, R> {
  const _options: P extends unknown
    ? undefined
    : { initialProps: P } = options;

  const updateSubject = new Subject<R>();

  let result = new Result<R>();

  let state = new State(() => {
    // options can only be undefined if P is undefined
    update(_options?.initialProps);
  }, null);

  function update(props?: P) {
    state.run(() => {
      const res = hook(props);
      result.current = res;
      updateSubject.next(res);
    });
  }

  function rerender(newProps?: P) {
    if (newProps === undefined) {
      update(_options?.initialProps);
    } else {
      update(newProps);
    }
    state.runLayoutEffects();
    state.runEffects();
  }
  // options can only be undefined if P is undefined
  rerender(_options?.initialProps);

  async function waitForNextUpdate(options?: {
    timeout?: number | false;
  }): Promise<void> {
    const timeoutMs: number | false = options?.timeout ?? 1000;

    const updateObservable = timeoutMs
      ? updateSubject.pipe(timeout(timeoutMs))
      : updateSubject;

    return updateObservable.pipe(first(), mapTo(undefined)).toPromise();
  }

  async function waitFor(
    callback: () => boolean | void,
    options?: {
      interval?: number | false;
      timeout?: number | false;
    }
  ): Promise<void> {
    // should resolve promise if callback returns truthy or undefined
    // callback can error
    function shouldResolve() {
      try {
        const res = callback();
        return res === undefined || !!res;
      } catch {
        return false;
      }
    }

    const timeoutMs: number | false = options?.timeout ?? 1000;
    const intervalMs: number | false = options?.interval ?? 50;

    const updateObservable = timeoutMs
      ? updateSubject.pipe(timeout(timeoutMs))
      : updateSubject;

    const intervalObservable = intervalMs ? interval(intervalMs) : NEVER;

    const mergedPromise = merge(updateObservable, intervalObservable)
      .pipe(filter(shouldResolve), first(), mapTo(undefined))
      .toPromise();

    return mergedPromise;
  }

  async function waitForValueToChange(
    selector: () => any,
    options?: {
      interval?: number | false;
      timeout?: number | false;
    }
  ): Promise<void> {
    const initialValue = selector();

    const timeoutMs: number | false = options?.timeout ?? 1000;
    const intervalMs: number | false = options?.interval ?? 50;

    const updateObservable = timeoutMs
      ? updateSubject.pipe(timeout(timeoutMs))
      : updateSubject;

    const intervalObservable = intervalMs ? interval(intervalMs) : NEVER;

    const mergedPromise = merge(updateObservable, intervalObservable)
      .pipe(
        filter(() => selector() !== initialValue),
        first(),
        mapTo(undefined)
      )
      .toPromise();

    return mergedPromise;
  }

  return {
    result,
    rerender,
    unmount: () => { 
        state.teardown()
        // TODO: Teardown subject
    },
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
