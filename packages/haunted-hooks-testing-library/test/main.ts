import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "haunted";
import { act, renderHook } from "../src";

// BUG issues with props and stuff
describe("useState", () => {
  test("no props", () => {
    const { result } = renderHook(useState);

    expect(result.current[0]).toBeUndefined();

    act(() => {
      result.current[1](12345);
    });
    expect(result.current[0]).toBe(12345);

    act(() => {
      result.current[1](undefined);
    });
    expect(result.current[0]).toBeUndefined;

    const someSymbol = Symbol();
    act(() => {
      result.current[1](someSymbol);
    });
    expect(result.current[0]).toBe(someSymbol);
  });

  test("props", () => {
    const { result } = renderHook(useState, { initialProps: "testing" });

    expect(result.current[0]).toBe("testing");

    act(() => {
      result.current[1]("something else");
    });
    expect(result.current[0]).toBe("something else");

    act(() => {
      result.current[1](undefined);
    });
    expect(result.current[0]).toBeUndefined();
  });
});

describe("useReducer", () => {
  function counterReducer(state: number, action: "INC" | "DEC") {
    switch (action) {
      case "INC":
        return state + 1;
      case "DEC":
        return state - 1;
      default:
        return state;
    }
  }

  test("initial value", () => {
    function hook(init: number) {
      const [state, dispatch] = useReducer(counterReducer, init);
      return { state, dispatch };
    }

    const { result } = renderHook(hook, { initialProps: 0 });
    expect(result.current.state).toBe(0);

    act(() => {
      result.current.dispatch("INC");
      result.current.dispatch("INC");
    });
    expect(result.current.state).toBe(2);

    act(() => {
      result.current.dispatch("DEC");
    });
    expect(result.current.state).toBe(1);

    act(() => {
      result.current.dispatch("INVALID_ACTION" as any);
    });
    expect(result.current.state).toBe(1);
  });

  test("initial function and argument", () => {
    function hook({ initFunc, initArg }) {
      const [state, dispatch] = useReducer(counterReducer, initArg, initFunc);
      return { state, dispatch };
    }

    const { result } = renderHook(hook, {
      initialProps: {
        initFunc: parseInt,
        initArg: "0",
      },
    });
    expect(result.current.state).toBe(0);

    act(() => {
      result.current.dispatch("INC");
      result.current.dispatch("INC");
    });
    expect(result.current.state).toBe(2);

    act(() => {
      result.current.dispatch("DEC");
    });
    expect(result.current.state).toBe(1);

    act(() => {
      result.current.dispatch("INVALID_ACTION" as any);
    });
    expect(result.current.state).toBe(1);
  });
});

describe("useEffect", () => {
  test("no dependencies", () => {
    function myHook() {
      const [stateA, setStateA] = useState("A");
      const [stateB, setStateB] = useState("B");

      useEffect(() => {
        setStateA("Triggered A");
        setStateB("Triggered B");
      }, []);

      return { stateA, stateB, setStateA, setStateB };
    }

    const { result, rerender } = renderHook(myHook);

    expect(result.current.stateA).toBe("Triggered A");
    expect(result.current.stateB).toBe("Triggered B");

    act(() => {
      result.current.setStateA("AA");
    });
    expect(result.current.stateA).toBe("AA");
    expect(result.current.stateB).toBe("Triggered B");

    act(() => {
      result.current.setStateB("BB");
    });
    expect(result.current.stateA).toBe("AA");
    expect(result.current.stateB).toBe("BB");
  });

  test("dependency", async () => {
    function myHook() {
      const [stateA, setStateA] = useState("A");
      const [stateB, setStateB] = useState("B");

      useEffect(() => {
        setStateA("Triggered A");
        setStateB("Triggered B");
      }, [stateB]);

      return { stateA, stateB, setStateA, setStateB };
    }

    const { result, rerender } = renderHook(myHook);

    expect(result.current.stateA).toBe("Triggered A");
    expect(result.current.stateB).toBe("Triggered B");

    act(() => {
      result.current.setStateA("AA");
      rerender();
    });
    expect(result.current.stateA).toBe("AA");
    expect(result.current.stateB).toBe("Triggered B");

    await act(async () => {
      result.current.setStateB("BB");
      rerender();
    });
    expect(result.current.stateA).toBe("Triggered A");
    expect(result.current.stateB).toBe("Triggered B");
  });
});

describe("useMemo", () => {
  test("no dependency", () => {
    function hook({ initA, initB }) {
      function sumOfSquares(a: number, b: number): number {
        return a * a + b * b;
      }

      const [a, setA] = useState(initA);
      const [b, setB] = useState(initB);
      const res = useMemo(() => sumOfSquares(a, b), []);

      return {
        a,
        b,
        res,
        setA,
        setB,
      };
    }

    const { result } = renderHook(hook, {
      initialProps: { initA: 1, initB: 2 },
    });
    expect(result.current.a).toBe(1);
    expect(result.current.b).toBe(2);
    expect(result.current.res).toBe(5);

    act(() => {
      result.current.setA(3);
    });
    expect(result.current.a).toBe(3);
    expect(result.current.b).toBe(2);
    expect(result.current.res).toBe(5);

    act(() => {
      result.current.setB(4);
    });
    expect(result.current.a).toBe(3);
    expect(result.current.b).toBe(4);
    expect(result.current.res).toBe(5);
  });

  test("dependency", () => {
    function hook({ initA, initB }) {
      function sumOfSquares(a: number, b: number): number {
        return a * a + b * b;
      }

      const [a, setA] = useState(initA);
      const [b, setB] = useState(initB);
      const res = useMemo(() => sumOfSquares(a, b), [b]);

      return {
        a,
        b,
        res,
        setA,
        setB,
      };
    }

    const { result } = renderHook(hook, {
      initialProps: { initA: 1, initB: 2 },
    });
    expect(result.current.a).toBe(1);
    expect(result.current.b).toBe(2);
    expect(result.current.res).toBe(5);

    act(() => {
      result.current.setA(3);
    });
    expect(result.current.a).toBe(3);
    expect(result.current.b).toBe(2);
    expect(result.current.res).toBe(5);

    act(() => {
      result.current.setB(4);
    });
    expect(result.current.a).toBe(3);
    expect(result.current.b).toBe(4);
    expect(result.current.res).toBe(25);
  });
});

describe("useCallback", () => {
  test("no dependency", () => {
    function hook({ initA, initB }) {
      function sumOfSquares(a: number, b: number): number {
        return a * a + b * b;
      }

      const [a, setA] = useState(initA);
      const [b, setB] = useState(initB);
      const res = useCallback(() => sumOfSquares(a, b), []);

      return {
        a,
        b,
        res,
        setA,
        setB,
      };
    }

    const { result } = renderHook(hook, {
      initialProps: { initA: 1, initB: 2 },
    });
    expect(result.current.a).toBe(1);
    expect(result.current.b).toBe(2);
    expect(result.current.res()).toBe(5);

    act(() => {
      result.current.setA(3);
    });
    expect(result.current.a).toBe(3);
    expect(result.current.b).toBe(2);
    expect(result.current.res()).toBe(5);

    act(() => {
      result.current.setB(4);
    });
    expect(result.current.a).toBe(3);
    expect(result.current.b).toBe(4);
    expect(result.current.res()).toBe(5);
  });

  test("dependency", () => {
    function hook({ initA, initB }) {
      function sumOfSquares(a: number, b: number): number {
        return a * a + b * b;
      }

      const [a, setA] = useState(initA);
      const [b, setB] = useState(initB);
      const res = useCallback(() => sumOfSquares(a, b), [b]);

      return {
        a,
        b,
        res,
        setA,
        setB,
      };
    }

    const { result } = renderHook(hook, {
      initialProps: { initA: 1, initB: 2 },
    });
    expect(result.current.a).toBe(1);
    expect(result.current.b).toBe(2);
    expect(result.current.res()).toBe(5);

    act(() => {
      result.current.setA(3);
    });
    expect(result.current.a).toBe(3);
    expect(result.current.b).toBe(2);
    expect(result.current.res()).toBe(5);

    act(() => {
      result.current.setB(4);
    });
    expect(result.current.a).toBe(3);
    expect(result.current.b).toBe(4);
    expect(result.current.res()).toBe(25);
  });
});

describe("useRef", () => {
  test("uninitialized", () => {
    function hook<T>(init: T) {
      const ref = useRef(init);
      return ref;
    }

    const { result, rerender } = renderHook(hook, { initialProps: undefined });
    expect(result.current.current).toBeUndefined();

    act(() => {
      result.current.current = 12345;
    });
    expect(result.current.current).toBe(12345);

    const someSymbol = Symbol();
    act(() => {
      result.current.current = someSymbol;
      rerender();
    });

    expect(result.current.current).toBe(someSymbol);
  });
  test("initialized", () => {
    function hook<T>(init: T) {
      const ref = useRef<any>(init);
      return ref;
    }

    const { result, rerender } = renderHook(hook, { initialProps: "whatever" });
    expect(result.current.current).toBe("whatever");

    act(() => {
      result.current.current = 12345;
    });
    expect(result.current.current).toBe(12345);

    const someSymbol = Symbol();
    act(() => {
      result.current.current = someSymbol;
      rerender();
    });

    expect(result.current.current).toBe(someSymbol);
  });
});
