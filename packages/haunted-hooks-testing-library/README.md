# Haunted Hooks Testing Library

This is a testing library for Haunted that tries to be as API compatible with React Hooks Testing Library. The motivation for this was to ensure that swapping from React to Haunted in Universal Hooks Testing Library is very easy and that the tests have the same behavior.

## Differences

Errors and storing of more than the last function call have not been implemented yet. Act doesn't actually do anything besides execute the callback.

## Documentation

The API that this is based off is here: https://react-hooks-testing-library.com/reference/api

Here's what's been implemented so far:

- act
- renderHook (only option is initialProps)
  - result
  - rerender
  - unmount
  - waitFor
  - waitForNextUpdate
  - waitForValueToChange