
import type {Component} from 'solid-js';
import {lazy, createSignal, onCleanup, Show} from 'solid-js';
import {Dynamic} from 'solid-js/web';

import {Red, Green} from './app3-comps';


const Comp3: Component<{text: string}> = (props) => {

    try {
        throw new Error('x');
    } catch (e) {
        console.log(`Comp3 render`, e.stack);
    }

    onCleanup(() => {
        try {
            throw new Error('x');
        } catch (e) {
            console.log(`Comp3 cleanup`, e.stack);
        }
    });
    return <span>Comp3 mm: {props.text}</span>;
}

function createShowSignal() {
    const [show, setShow] = createSignal(true);
    return {show, setShow};
}


const RedD = lazy(() => import ('./app3-comps-red'));
const GreenD = lazy(() => import ('./app3-comps-green'));

const App3: Component = () => {


    const showSignals = [
        createShowSignal(),
        createShowSignal(),
        createShowSignal(),
        createShowSignal()
    ];
    const toggleShow = (n: number) => showSignals[n].setShow(s => !s);
    return <div>
        App: 
        <div><button onclick={[toggleShow, 0]}>{showSignals[0].show() ? 'Hide' : 'Show'}</button> <Show when={showSignals[0].show()}><Comp3 text="0" /></Show></div>
        <div><button onclick={[toggleShow, 1]}>{showSignals[1].show() ? 'Hide' : 'Show'}</button> <Show when={showSignals[1].show()}><Comp3 text="1" /></Show></div>
        <div><button onclick={[toggleShow, 2]}>{showSignals[2].show() ? 'Hide' : 'Show'}</button> <Show when={showSignals[2].show()}><Comp3 text="2" /></Show></div>
        <div><button onclick={[toggleShow, 3]}>{showSignals[3].show() ? 'Red' : 'Green'}</button><Dynamic component={showSignals[3].show() ? Red : Green} /></div>
        <div>x <RedD /></div>
        <div>y <GreenD /></div>
    </div>
};

export {App3};
