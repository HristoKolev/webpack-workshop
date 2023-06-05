import { formatDate } from 'src/helpers';
import logoUrl from './logo.png';

import './index.css';

const element = document.createElement('div');

element.innerHTML = `
    <div class="text">
        <div>Hello Webpack</div> 
        <div>${formatDate(new Date())}
        <div>
            <img src="${logoUrl}" alt="logo">
        </div>
    </div>
`;

document.body.appendChild(element);