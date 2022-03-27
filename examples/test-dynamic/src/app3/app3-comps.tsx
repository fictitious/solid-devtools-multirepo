import type {Component} from 'solid-js';

const RedInner: Component = () => {
    return <div>red</div>;
};


const Red: Component = () => {
    return <div><RedInner /></div>;
};


const GreenInner: Component = () => {
    return <div>green 4 5 6 </div>;
};

const Green: Component = () => {
    return <div> <GreenInner /> </div>;
};


export {Red, Green};
