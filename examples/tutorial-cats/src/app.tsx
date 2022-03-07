

import type {Component} from 'solid-js';
import {createSignal, For} from 'solid-js';

const Cat: Component<{index: number; cat: {id: string; name: string}}> = props => 
    <li>
        <a target="_blank" href={`https://www.youtube.com/watch?v=${props.cat.id}`}>
            {props.index + 1}: {props.cat.name}
        </a>
    </li>
;

const App: Component = () => {
    const [cats, setCats] = createSignal([
        { id: 'J---aiyznGQ', name: 'Keyboard Cat' },
        { id: 'z_AbfPXTKms', name: 'Maru' },
        { id: 'OUtn3pvWmpg', name: 'Henri The Existential Cat' }
    ]);

    return <ul>
        <For each={cats()}>{(cat, i) => <Cat index={i()} cat={cat} />}</For>
    </ul>
    ;
};

export {App};

