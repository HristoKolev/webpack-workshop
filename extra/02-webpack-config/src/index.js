import { format } from 'date-fns';

import logoUrl from './logo.png';

import './index.css';

const element = document.createElement('div');

element.innerHTML = `
    <div class="text">
        <div>Hello Webpack</div> 
        <div>${format(new Date(), 'dd MMM yyyy')}</div>
        <div>
            <img src="${logoUrl}" alt="logo">
        </div>
    </div>
`;

document.body.appendChild(element);