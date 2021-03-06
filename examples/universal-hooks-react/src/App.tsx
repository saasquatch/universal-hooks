import React, { createContext } from "react";
import {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "../../../dist/universal-hooks";
import _ from "lodash";

import "./App.css";

function App() {
  return (
    <div style={{ padding: 15 }}>
      <h1>Testing</h1>
      <hr />
      <h2>useState</h2>
      <UseStateTest />
      <hr />
      <h2>useEffect</h2>
      <UseEffectTest />
      <hr />
      <h2>useContext</h2>
      <UseContextTest />
      <hr />
      <h2>useLayout</h2>
      <UseLayoutEffectTest />
      <hr />
      <h2>useReducer</h2>
      <UseReducerTest />
      <hr />
      <h2>useCallback</h2>
      <UseCallbackTest />
      <hr />
    </div>
  );
}

function UseStateTest() {
  const [counter, setCounter] = useState(0);
  function inc() {
    setCounter(counter + 1);
  }
  function dec() {
    setCounter((c) => c - 1);
  }

  return (
    <>
      <div>
        <p>Counter: {counter}</p>
      </div>
      <div>
        <button onClick={inc}>Increment</button>
        <button onClick={dec}>Decrement</button>
      </div>
    </>
  );
}

function UseEffectTest() {
  const [text1, setText1] = useState("Change me!");
  const [text2, setText2] = useState(
    "And me! And change the dependency again!"
  );
  const [displayText1, setDisplayText1] = useState(text1);
  const [displayText2, setDisplayText2] = useState(text2);

  useEffect(() => {
    setDisplayText1(text1);
    setDisplayText2(text2);
  }, [text1]);

  return (
    <>
      <div>
        <h3>A Dependency</h3>
        <input
          type="text"
          value={text1}
          onChange={(e) => setText1(e.target.value)}
        />
        <p>
          <strong>Text:</strong> {displayText1}
        </p>
      </div>
      <br />
      <div>
        <h3>Not a Dependency</h3>
        <input
          type="text"
          value={text2}
          onChange={(e) => setText2(e.target.value)}
        />
        <p>
          <strong>Text:</strong> {displayText2}
        </p>
      </div>
    </>
  );
}

const Ctx = React.createContext(9999);

function UseContextTest() {
  const [counter, setCounter] = useState(0);
  function inc() {
    setCounter(counter + 1);
  }
  function dec() {
    setCounter((c) => c - 1);
  }

  return (
    <>
      <div>
        <button onClick={inc}>Increment</button>
        <button onClick={dec}>Decrement</button>
      </div>
      <div style={{ borderStyle: "solid", margin: 15, padding: 10 }}>
        <Ctx.Provider value={counter}>
          <h3>Consumer</h3>
          <ConsumerDisplay />
          <h3>useContext</h3>
          <UseContextDisplay />
        </Ctx.Provider>
      </div>
    </>
  );
}

function ConsumerDisplay() {
  return <Ctx.Consumer>{(value) => <p>Counter: {value}</p>}</Ctx.Consumer>;
}

function UseContextDisplay() {
  return <p>Counter: {useContext(Ctx)}</p>;
}

function UseLayoutEffectTest() {
  const [logs, setLogs] = useState<string[]>([]);
  const [counter, setCounter] = useState(0);
  function inc() {
    setCounter(counter + 1);
  }
  function dec() {
    setCounter((c) => c - 1);
  }

  useEffect(() => {
    setLogs((L) => [
      ...L,
      new Date(Date.now()).toLocaleString("en-CA") + ": useEffect called!",
    ]);
  }, [counter]);

  useLayoutEffect(() => {
    setLogs((L) => [
      ...L,
      new Date(Date.now()).toLocaleString("en-CA") +
        ": useLayoutEffect called!",
    ]);
  }, [counter]);

  return (
    <>
      <div>
        <p>Counter: {counter}</p>
      </div>
      <div>
        <button onClick={inc}>Increment</button>
        <button onClick={dec}>Decrement</button>
      </div>
      <ul>
        {logs.map((entry) => (
          <li key={entry}>{entry}</li>
        ))}
      </ul>
    </>
  );
}

function reducer(prev: number, action: "INC" | "DEC") {
  switch (action) {
    case "INC":
      return prev + 1;
    case "DEC":
      return prev - 1;
    default:
      throw new Error("uh oh");
  }
}

function UseReducerTest() {
  const [counter1, counterAction1] = useReducer(reducer, 0);
  function inc1() {
    counterAction1("INC");
  }
  function dec1() {
    counterAction1("DEC");
  }

  const [counter2, counterAction2] = useReducer(
    reducer,
    "0",
    (unparsed: string) => JSON.parse(unparsed)
  );
  function inc2() {
    counterAction2("INC");
  }
  function dec2() {
    counterAction2("DEC");
  }

  return (
    <>
      <div>
        <h3>Initial Value</h3>
        <div>
          <p>Counter A: {counter1}</p>
        </div>
        <div>
          <button onClick={inc1}>Increment</button>
          <button onClick={dec1}>Decrement</button>
        </div>
      </div>
      <br />
      <div>
        <h3>Initial Function</h3>
        <div>
          <p>Counter B: {counter2}</p>
        </div>
        <div>
          <button onClick={inc2}>Increment</button>
          <button onClick={dec2}>Decrement</button>
        </div>
      </div>
    </>
  );
}

function UseCallbackTest() {
  const [typing, setTyping] = useState(false);
  const [text, setText] = useState("Start typing!")

  function formatTyping(typing: boolean) {
    return typing ? "TYPING" : "..."
  }

  function toggleTyping() {
    setTyping((s)=>!s)
  }

  const typingThing = useCallback(_.debounce(toggleTyping, 500, {leading: true, trailing: true}), [])

  return <>
  <input type="text" value={text} onChange={(e)=>(setText(e.target.value), typingThing())} />
  <p>{formatTyping(typing)}</p>
  </>;
}

export default App;
