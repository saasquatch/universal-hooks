import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {setImplementation} from "@saasquatch/universal-hooks"

setImplementation(React);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);