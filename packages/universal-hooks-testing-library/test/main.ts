import {
  setImplementation,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "@saasquatch/universal-hooks";
import { act, renderHook, setTestImplementation } from "@saasquatch/universal-hooks-testing-library";
import * as haunted from "haunted";
import * as hauntedTestingLib from "@saasquatch/haunted-hooks-testing-library";
import * as React from "react";
import * as ReactTestLib from "@testing-library/react-hooks";

function counterHook(delay: number) {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const ticker = setInterval(() => setCounter((c = 0) => c + 1), delay);
    return () => clearInterval(ticker);
  }, []);

  return {
    counter,
    setCounter,
  };
}

function mutableCounterHook(delay: number) {
  const counter = useRef(0);

  useEffect(() => {
    const ticker = setInterval(() => counter.current++, delay);
    return () => clearInterval(ticker);
  }, []);

  return {
    counter,
  };
}

describe("Haunted", () => {
  setImplementation(haunted);
  setTestImplementation(hauntedTestingLib);
  runTests();
});

describe("React", () => {
  // TODO make sure all state changes are wrapped in act
  // this could take a while to fix
  setImplementation(React);
  setTestImplementation(ReactTestLib);
  runTests();
});

function runTests() {
  describe("Async Utils", () => {
    describe("waitForNextUpdate", () => {
      test("default", async () => {
        const { result, waitForNextUpdate } = renderHook(() => counterHook(10));

        expect(result.current?.counter).toBe(0);
        await waitForNextUpdate();
        expect(result.current?.counter).toBe(1);
        await waitForNextUpdate();
        expect(result.current?.counter).toBe(2);
      });

      test("timeout expiry", async () => {
        let error: Error | undefined = undefined;

        const { result, waitForNextUpdate } = renderHook(() => counterHook(10));

        expect(result.current?.counter).toBe(0);

        await waitForNextUpdate();
        expect(result.current?.counter).toBe(1);

        try {
          await waitForNextUpdate({ timeout: 1 });
        } catch (e) {
          error = e;
        }
        expect(error?.name).toMatch(/^(TimeoutError|Error)$/);
        expect(result.current?.counter).toBe(1);

        await waitForNextUpdate();
        expect(result.current?.counter).toBe(2);
      });

      test("default timeout", async () => {
        let error: Error | undefined = undefined;

        const { result, waitForNextUpdate } = renderHook(() => counterHook(2000));

        expect(result.current?.counter).toBe(0);

        try {
          await waitForNextUpdate();
        } catch (e) {
          error = e;
        }
        expect(error?.name).toMatch(/^(TimeoutError|Error)$/);
        expect(result.current?.counter).toBe(0);
      });
    });

    describe("waitFor", () => {
      // test truthy, false, undefined, and error states
      test("resolve when callback returns truthy or undefined", async () => {
        const { result, waitFor } = renderHook(() => counterHook(10));

        expect(result.current?.counter).toBe(0);

        await waitFor(() => result.current?.counter === 2);
        expect(result.current?.counter).toBe(2);

        await waitFor(() => expect(result.current?.counter).toBe(4));
        expect(result.current?.counter).toBe(4);
      });

      test("timeout expiry", async () => {
        let error: Error | undefined = undefined;

        const { result, waitFor } = renderHook(() => counterHook(10));

        expect(result.current?.counter).toBe(0);

        await waitFor(() => result.current?.counter === 1);
        expect(result.current?.counter).toBe(1);

        try {
          await waitFor(() => result.current?.counter === 2, { timeout: 1 });
        } catch (e) {
          error = e;
        }
        expect(error?.name).toMatch(/^(TimeoutError|Error)$/);
        expect(result.current?.counter).toBe(1);

        await waitFor(() => result.current?.counter === 2);
        expect(result.current?.counter).toBe(2);
      });

      test("default timeout", async () => {
        let error: Error | undefined = undefined;

        const { result, waitFor } = renderHook(() => counterHook(2000));

        expect(result.current?.counter).toBe(0);

        try {
          await waitFor(() => result.current?.counter === 2);
        } catch (e) {
          error = e;
        }
        expect(error?.name).toMatch(/^(TimeoutError|Error)$/);
        expect(result.current?.counter).toBe(0);
      });

      // use useRef to test this one, we can't trigger updates
      test("resolve during interval with no updates", async () => {
        const { result, waitFor } = renderHook(() => mutableCounterHook(10));

        expect(result.current?.counter.current).toBe(0);

        await waitFor(() => result.current?.counter.current === 2, {
          interval: 2,
        });
        expect(result.current?.counter.current).toBe(2);

        await waitFor(() => expect(result.current?.counter.current).toBe(4), {
          interval: 2,
        });
        expect(result.current?.counter.current).toBe(4);
      });
    });

    describe("waitForValueToChange", () => {
      test("resolve when value changes", async () => {
        const { result, waitForValueToChange } = renderHook(() => counterHook(10));

        expect(result.current?.counter).toBe(0);

        await waitForValueToChange(() => result.current?.counter === 2);
        expect(result.current?.counter).toBe(2);

        await waitForValueToChange(() => result.current?.counter);
        expect(result.current?.counter).toBe(3);
      });

      test("timeout expiry", async () => {
        let error: Error | undefined = undefined;

        const { result, waitForValueToChange } = renderHook(() => counterHook(10));

        expect(result.current?.counter).toBe(0);

        await waitForValueToChange(() => result.current?.counter === 1);
        expect(result.current?.counter).toBe(1);

        try {
          await waitForValueToChange(() => result.current?.counter, {
            timeout: 1,
          });
        } catch (e) {
          error = e;
        }
        expect(error?.name).toMatch(/^(TimeoutError|Error)$/);
        expect(result.current?.counter).toBe(1);

        await waitForValueToChange(() => result.current?.counter);
        expect(result.current?.counter).toBe(2);
      });

      test("default timeout", async () => {
        let error: Error | undefined = undefined;

        const { result, waitForValueToChange } = renderHook(() => counterHook(2000));

        expect(result.current?.counter).toBe(0);

        try {
          await waitForValueToChange(() => result.current?.counter);
        } catch (e) {
          error = e;
        }
        expect(error?.name).toMatch(/^(TimeoutError|Error)$/);
        expect(result.current?.counter).toBe(0);
      });

      // use useRef to test this one, we can't trigger updates
      test("resolve during interval with no updates", async () => {
        const { result, waitForValueToChange } = renderHook(() => mutableCounterHook(10));

        expect(result.current?.counter.current).toBe(0);

        await waitForValueToChange(
          () => result.current?.counter.current === 2,
          {
            interval: 2,
          }
        );
        expect(result.current?.counter.current).toBe(2);

        await waitForValueToChange(() => result.current?.counter.current, {
          interval: 2,
        });
        expect(result.current?.counter.current).toBe(3);
      });
    });
  });
  describe("useState", () => {
    test("no props", () => {
      let result;
      act(() => {
        result = renderHook(() => useState(undefined))["result"];
      });

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
      let result;
      act(() => {
        result = renderHook(useState, { initialProps: "testing" })["result"];
      });

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

      const { result, rerender } = renderHook(hook, {
        initialProps: undefined,
      });
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

      const { result, rerender } = renderHook(hook, {
        initialProps: "whatever",
      });
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
}
