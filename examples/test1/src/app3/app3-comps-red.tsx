import type {Component} from 'solid-js';

const RedInnerD: Component = () => {
    return <div>red r r</div>;
};


const RedD: Component = () => {
    return <div>t t<RedInnerD /></div>;
};

export default RedD;
