# Universal Hooks Monorepo

This monorepo is a collection of packages that allows the reuse of React hooks with haunted hooks and vice-versa. Here's what each package does:

- **Universal Hooks** provides an interface which haunted and React can plug into. Write your hooks for the interface and the implementation can be swapped out.
- **Universal Hooks Testing Library** provides an interface for testing, based off of React Hooks Testing Library
- **Haunted Hooks Testing Library** provides a Universal Hooks compatible testing API for haunted.