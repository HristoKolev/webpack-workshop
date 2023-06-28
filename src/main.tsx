import { createRoot } from 'react-dom/client';

import { App } from '~App';

import './main.css';
import './styles.scss';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const rootElement = document.getElementById('root') as Element;

createRoot(rootElement).render(<App />);