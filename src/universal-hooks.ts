type Dispatch<S> = (value: S) => void;

type SetState<S> = S | ((prev: S) => S);

type EffectCallback = () => void | (() => void);

type Reducer<S, A> = (prev: S, action: A) => S;

type Ref<T> = {
  current: T;
};

type Deps = readonly any[];

type HookLib = {
  useState: typeof useState;
  useMemo: typeof useMemo;
  useCallback: typeof useCallback;
  useEffect: typeof useEffect;
  useContext: typeof useContext;
  useReducer: typeof useReducer;
  useRef: typeof useRef;
};

const impl: Ref<HookLib> = {
  current: ({
    useState: unimplemented,
    useMemo: unimplemented,
    useCallback: unimplemented,
    useEffect: unimplemented,
    useContext: unimplemented,
    useReducer: unimplemented,
    useRef: unimplemented,
  } as unknown) as HookLib,
};

export function setImplementation(lib: any) {
  impl.current = lib
}

function unimplemented() {
  throw new Error("No implementation defined for universal hooks");
}

export function useState<T>(init: T | (() => T)): [T, Dispatch<SetState<T>>] {
  return impl.current.useState(init);
}

export function useMemo<T>(factory: () => T, deps: Deps | undefined): T {
  return impl.current.useMemo(factory, deps);
}

export function useCallback<T extends Function>(callback: T, deps: Deps): T {
  return impl.current.useCallback(callback, deps);
}

export function useEffect(effect: EffectCallback, deps?: Deps): void {
  return impl.current.useEffect(effect, deps);
}

export function useContext<T>(ctx: unknown): T {
  return impl.current.useContext(ctx);
}

export function useReducer<S, A>(
  reducer: Reducer<S, A>,
  initialState: S
): [S, Dispatch<A>];

export function useReducer<S, A, I>(
  reducer: Reducer<S, A>,
  initialArg: I,
  init: (arg: I) => S
): [S, Dispatch<A>];

export function useReducer(reducer: any, initialThing: any, init: any = undefined){
  return impl.current.useReducer(reducer, initialThing, init)
};

export function useRef<T = unknown>(): Ref<T>;

export function useRef<T = unknown>(init?: T | null): Ref<T>

export function useRef(init: any = undefined){
  return impl.current.useRef(init)
};