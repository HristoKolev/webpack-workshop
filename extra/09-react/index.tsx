import {createRoot} from "react-dom/client";

import { formatDate } from 'src/helpers';
import logoUrl from './logo.png';

import './index.css';

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
}

const rootElement = document.getElementById('root') as Element;

createRoot(rootElement).render(<App />);
