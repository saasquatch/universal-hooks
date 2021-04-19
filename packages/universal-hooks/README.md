# Universal Hooks

This library aims to provide a common interface for React-like hooks to plug into. Simply plug in an implementation and your hooks are reusable across different implementations.

## Usage

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

## API

It supports most hooks besides `useContext`:

- useState
- useMemo
- useCallback
- useEffect
- useReducer
- useRef