import { html } from "https://unpkg.com/lit-html/lit-html.js";
import * as haunted from "https://unpkg.com/haunted/haunted.js";
import "https://unpkg.com/lodash/lodash.js";
import {
  setImplementation,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "../../dist/universal-hooks.modern.js";

setImplementation(haunted);

customElements.define("my-counter", haunted.component(Counter));
customElements.define("use-state-test", haunted.component(UseStateTest));
customElements.define("use-effect-test", haunted.component(UseEffectTest));
customElements.define("use-context-test", haunted.component(UseContextTest));
customElements.define("use-reducer-test", haunted.component(UseReducerTest));
customElements.define("use-callback-test", haunted.component(UseCallbackTest));
customElements.define("use-memo-test", haunted.component(UseMemoTest));
customElements.define("use-ref-test", haunted.component(UseRefTest));

function Counter() {
  const [count, setCount] = useState(0);

  return html`
    <div id="count">${count}</div>
    <button type="button" @click=${() => setCount(count + 1)}>Increment</button>
  `;
}

function UseStateTest() {
  const [counter, setCounter] = useState(0);
  function inc() {
    setCounter(counter + 1);
  }
  function dec() {
    setCounter((c) => c - 1);
  }

  return html`
    <div>
      <div>
        <p>Counter: ${counter}</p>
      </div>
      <div>
        <button @click=${inc}>Increment</button>
        <button @click=${dec}>Decrement</button>
      </div>
    </div>
  `;
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

  return html`
    <div>
      <div>
        <h3>A Dependency</h3>
        <input
          type="text"
          value=${text1}
          @input=${(e) => setText1(e.target.value)}
        />
        <p><strong>Text:</strong> ${displayText1}</p>
      </div>
      <br />
      <div>
        <h3>Not a Dependency</h3>
        <input
          type="text"
          value=${text2}
          @input=${(e) => setText2(e.target.value)}
        />
        <p><strong>Text:</strong> ${displayText2}</p>
      </div>
    </div>
  `;
}

const Ctx = haunted.createContext(9999);
customElements.define("ctx-provider", Ctx.Provider);
customElements.define("ctx-consumer", Ctx.Consumer);

function ConsumerDisplay() {
  return html`<ctx-consumer
    .render=${(value) => html`<p>Counter: ${value}</p>`}
  ></ctx-consumer>`;
}
customElements.define("consumer-display", haunted.component(ConsumerDisplay));

function UseContextDisplay() {
  return html`<p>Counter: ${useContext(Ctx)}</p>`;
}
customElements.define(
  "use-context-display",
  haunted.component(UseContextDisplay)
);

function UseContextTest() {
  const [counter, setCounter] = useState(0);
  function inc() {
    setCounter(counter + 1);
  }
  function dec() {
    setCounter((c) => c - 1);
  }

  return html`
    <div>
      <div>
        <button @click=${inc}>Increment</button>
        <button @click=${dec}>Decrement</button>
      </div>
      <div style="border: solid; margin: 15px; padding: 10px">
        <ctx-provider .value=${counter}>
          <h3>Consumer</h3>
          <consumer-display></consumer-display>
          <h3>useContext</h3>
          <use-context-display></use-context-display>
        </ctx-provider>
      </div>
    </div>
  `;
}

function formatDate(date) {
  function pad2(n) {
    return n >= 10 ? n : "0" + n;
  }
  function pad3(n) {
    return n >= 100 ? n : n >= 10 ? "0" + n : "00" + n;
  }
  return (
    pad2(date.getHours()) +
    ":" +
    pad2(date.getMinutes()) +
    ":" +
    pad2(date.getSeconds()) +
    "." +
    pad3(date.getMilliseconds())
  );
}

function timestampNow() {
  return formatDate(new Date(Date.now()));
}

function reducer(prev, action) {
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

  const [counter2, counterAction2] = useReducer(reducer, "0", (unparsed) =>
    JSON.parse(unparsed)
  );
  function inc2() {
    counterAction2("INC");
  }
  function dec2() {
    counterAction2("DEC");
  }

  return html`
    <div>
      <div>
        <h3>Initial Value</h3>
        <div>
          <p>Counter A: ${counter1}</p>
        </div>
        <div>
          <button @click=${inc1}>Increment</button>
          <button @click=${dec1}>Decrement</button>
        </div>
      </div>
      <br />
      <div>
        <h3>Initial Function</h3>
        <div>
          <p>Counter B: ${counter2}</p>
        </div>
        <div>
          <button @click=${inc2}>Increment</button>
          <button @click=${dec2}>Decrement</button>
        </div>
      </div>
    </div>
  `;
}

function UseCallbackTest() {
  const [typing, setTyping] = useState(false);
  const [text, setText] = useState("Start typing!");

  function formatTyping(typing) {
    return typing ? "TYPING" : "...";
  }

  function toggleTyping() {
    setTyping((s) => !s);
  }

  const typingThing = useCallback(
    _.debounce(toggleTyping, 500, { leading: true, trailing: true }),
    []
  );

  return html`
    <div>
      <input
        type="text"
        value=${text}
        @input=${(e) => (setText(e.target.value), typingThing())}
      />
      <p>${formatTyping(typing)}</p>
    </div>
  `;
}

function UseMemoTest() {
  const [counterCheap, counterCheapAction] = useReducer(reducer, 0);
  const [counterCostly, counterCostlyAction] = useReducer(reducer, 0);

  // new Date(Date.now()).toLocaleString("en-CA") + ": useEffect called!",

  return html`
    <div>
      <div style="display: flex">
        <div style="padding: 15px">
          <div>
            <p>Counter: ${counterCheap}</p>
            <p>Cheap calculation: ${timestampNow()}</p>
          </div>
          <div>
            <button @click=${() => counterCheapAction("INC")}>Increment</button>
            <button @click=${() => counterCheapAction("DEC")}>Decrement</button>
          </div>
        </div>
        <div style="padding: 15px">
          <div>
            <p>Counter: ${counterCostly}</p>
            <p>
              Costly calculation:
              ${useMemo(() => timestampNow(), [counterCostly])}
            </p>
          </div>
          <div>
            <button @click=${() => counterCostlyAction("INC")}>
              Increment
            </button>
            <button @click=${() => counterCostlyAction("DEC")}>
              Decrement
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function UseRefTest() {
  const counter = useRef(0);
  const [dummy, setDummy] = useState(false);

  function refresh() {
    setDummy((d) => !d);
  }

  function ticker() {
    setTimeout(() => {
      counter.current++;
      ticker();
    }, 100);
  }

  useEffect(() => {
    ticker();
  }, []);

  return html`
    <p>Counting: <strong>${counter.current}</strong></p>
    <button @click=${refresh}>Refresh</button>
  `;
}
