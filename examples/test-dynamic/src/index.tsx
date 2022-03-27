import {render} from 'solid-js/web';

import {App1, App2} from './app';
import {App3} from './app3/app3';

render(() => <App1 />, document.getElementById('root1'));
render(() => <App2 />, document.getElementById('root2'));
render(() => <App3 />, document.getElementById('root3'));

