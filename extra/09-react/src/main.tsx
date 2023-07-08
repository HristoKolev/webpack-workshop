import { JSX } from 'react';
import { createRoot } from 'react-dom/client';

import { formatDate } from 'src/helpers';
import logoUrl from './logo.png';

import './main.css';

const App = (): JSX.Element => {
  return (
    <div className="text">
      <div>Hello Webpack</div>
      <div>{formatDate(new Date())}</div>
      <div>
        <img src={logoUrl} alt="logo" />
      </div>
    </div>
  );
};

const rootElement = document.getElementById('root')!;

createRoot(rootElement).render(<App />);
