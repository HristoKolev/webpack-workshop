import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import { App } from './App';
import { createReduxStore } from './redux/createReduxStore';

import './main.css';

const rootElement = document.getElementById('root')!;

const store = createReduxStore();

ReactDOM.createRoot(rootElement).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
