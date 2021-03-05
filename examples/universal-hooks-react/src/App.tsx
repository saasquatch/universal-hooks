import React from "react";
import logo from "./logo.svg";
import {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "../../../src/universal-hooks";
import "./App.css";

function useStateTest() {
  const [counter, setCounter] = useState(0);
}

function App() {
  return (
    <>
      <h1>Testing</h1>

      <h2>useState</h2>

    </>
  );
}

export default App;
