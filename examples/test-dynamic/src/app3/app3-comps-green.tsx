
import type {Component} from 'solid-js';

const GreenInnerD: Component = () => {
    return <div>green 4 5 6 d d</div>;
};

const GreenD: Component = () => {
    return <div> <GreenInnerD /> mm dd </div>;
};

export default GreenD;
