
import type {Component} from 'solid-js';

const App1: Component = () => <div data-app1="div from App1 outside Comp1"><Comp1>App 1</Comp1></div>;

const App2: Component = () => <Comp2><div data-app2="div from App2 inside Comp2">App 2</div></Comp2>;

const Comp1: Component = props => <div data-comp1="div from Comp1">{props.children}</div>;

const Comp2: Component = props => <div data-comp2="div from Comp2">{props.children}</div>;

export {App1, App2};
