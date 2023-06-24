import { createRoot } from 'react-dom/client';

import { App } from '~App';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import './main.css';
import './styles.scss';

const rootElement = document.getElementById('root') as Element;

createRoot(rootElement).render(<App />);
