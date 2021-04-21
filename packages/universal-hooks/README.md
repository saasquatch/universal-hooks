# Universal Hooks

This library aims to provide a common interface for React-like hooks to plug into. Simply plug in an implementation and your hooks are reusable across different implementations.

## Usage

There are two ways to plug in an implementation. You can supply a module at runtime or you can replace Universal Hooks at compile time.

### Provide an implementation at runtime

```javascript
// Set an implementation for the hooks
setImplementation(haunted)
// OR
setImplementation(React)
// OR
setImplementation(Preact)

// Use the hooks like normal
function useCounter() {
    const [counter, setCounter] = useState(0);

    const increment = () => setCounter((c) => c + 1)
    const decrement = () => setCounter((c) => c - 1)

    return {counter, increment, decrement}
}
```

### Provide an implementation via bundlers

Rollup, Webpack and other bundlers allow compile-time replacement of implementations.

E.g. with the Rollup `alias` plugin https://github.com/rollup/plugins/tree/master/packages/alias

To swap in React
```js
entries: [
  { find: '@saasquatch/universal-hooks', replacement: 'React' },
];
```

To swap in Haunted
```js
entries: [
  { find: '@saasquatch/universal-hooks', replacement: 'haunted' },
];
```


## API

Most common hooks are supported, except for `useContext`.

- useState
- useMemo
- useCallback
- useEffect
- useReducer
- useRef