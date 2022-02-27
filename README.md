
## Solid devtools chrome extension

**work in progress, not quite usable yet**

- requires [changes](https://github.com/fictitious/solid-devtools-multirepo/blob/main/README.md#changes-to-solid-js-code) to solid-js and dom-expressions code 
- so it works only with examples built from this multirepo, which are using modified solid-js from this repo
- it's buggy, does not handle Portal yet
- only shows component tree and component props, no signals yet

It does not (yet) use the [solid-debugger](https://github.com/CM-Tech/solid-debugger), and it does not rely on the development mode provided by solid, because

- the ability to use devtools on a production site might turn out to be useful
- devtools should be usable on any code that uses Solid JS, users should not need to add anything to their code for that

## Installation

```bash
git clone https://github.com/fictitious/solid-devtools-multirepo.git
cd solid-devtools-multirepo
git submodule update --init
node .yarn/releases/yarn-3.0.2.cjs install --mode=skip-build
./node_modules/.bin/yarn build
```

Install unpacked extension in chrome from `submodules/solid-devtools/dist/unpacked`

Start examples
```bash
./node_modules/.bin/yarn start-examples
```

https://user-images.githubusercontent.com/189742/155890283-f4d01a2e-8e9b-4338-a3f8-79c0edcaaaec.mp4


Afther the first full build which builds all dependencies including solid-js, the updated devtools version can be built by
```bash
./node_modules/.bin/yarn build-solid-devtools
```

Then you will need to reload it on the chrome extensions page.
## Overview

### Component Tree

Let's take this [slightly modified](https://github.com/fictitious/solid-devtools-multirepo/blob/main/examples/test2/src/app.tsx) example from [Solid tutorial](https://www.solidjs.com/tutorial/flow_for?solved)

```typescript
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
```

The imaginary component tree for `App` looks like this:
- ovals are components
- diamonds are DOM elements



This tree is imaginary because components are not part of the tree - in fact, there's nothing left
of the components after they are rendered, except their result - DOM nodes.

For devtools, one way to show the component tree is to look where the DOM nodes from each component are inserted into the DOM tree, and recover parent/child component relationship from that.

### Changes to Solid JS code

To recover this information, Solid JS code is modified to intercept component creation (so we know which DOM nodes were created by each component), and to intercept DOM node insertion (to see where in the tree the components are inserted). This is done by the devtools hook script, which is injected into the page and uses wrappers called by modified Solid JS code in [createComponent](https://github.com/fictitious/solid/blob/solid-devtools/packages/solid/src/render/component.ts#L69)  and [dom-expressions insertParent](https://github.com/fictitious/dom-expressions/blob/solid-devtools/packages/dom-expressions/src/client.js#L34). There's also another wrapper in [dom-expressions render](https://github.com/fictitious/dom-expressions/blob/solid-devtools/packages/dom-expressions/src/client.js#L34) which tracks DOM elements that are the roots of DOM generated by Solid. 

When the devtools page is not open, the wrappers are no-op functions which just return immediately. Although they are always called by the Solid JS code, this does not seem to affect performance, according to the [benchmark](https://github.com/fictitious/solid-devtools-multirepo/blob/main/README.md#running-benchmark).

### The hook script

The hook script collects information from `createComponent`, `insertParent` and `render` wrappers and stored it in the [registry](https://github.com/fictitious/solid-devtools/blob/main/src/hook/registry/registry.ts#L15). It assigns IDs to component instances and DOM nodes which are results of components, and keeps the map of components and the map of component results:


### The channel and the devtools panel

To show component tree, that information must be transferred from the hook to the devtools panel which runs in a separate javascript context inside chrome devtools. [Channel](https://github.com/fictitious/solid-devtools/blob/main/src/channel/channel-types.ts) is used for that. Channel code was taken from React devtools (it's called the bridge there) and modified to adapt to chrome extension manifest V3.

Message types from page to devtools and from devtools to page are [defined here](https://github.com/fictitious/solid-devtools/blob/main/src/channel/channel-message-types.ts#L107). 

On the devtools side, there's [RegistryMirror](https://github.com/fictitious/solid-devtools/blob/main/src/devtools-page/registry-mirror/registry-mirror.ts#L9) which also has the map of components and map of their results. RegistryMirror is used by the [code that infers parent/child relationship](https://github.com/fictitious/solid-devtools/blob/main/src/devtools-page/registry-mirror/connect-components.ts) for the components.

Links for the devtools UI code:
- [Data types for UI code](https://github.com/fictitious/solid-devtools/blob/main/src/devtools-page/data/component-data-types.ts)
- [Components panel](https://github.com/fictitious/solid-devtools/blob/main/src/devtools-page/ui/components-panel.tsx#L70)
- [Component tree](https://github.com/fictitious/solid-devtools/blob/main/src/devtools-page/ui/component-tree.tsx#L56)
- [Component details (props)](https://github.com/fictitious/solid-devtools/blob/main/src/devtools-page/ui/component-details.tsx#L123)

### Running the benchmark

There's a submodule for [js-framework-benchmark](https://github.com/krausest/js-framework-benchmark) in examples directory here. It can be used to run benchmark for original and modified solid-js code, after the dev dependencies are built:

```bash
./node_modules/.bin/yarn build-dev-dependencies
./node_modules/.bin/yarn run-benchmark
```

The script installs the original solid-js benchmark using `npm ci` in `frameworks/keyed/solid`, so it uses the version of solid-js from npm as specified in `package.json` there.

The "patched" benchmark is in `examples/benchmark-solid-patchced`, it's included as workspace in this monorepo, installed via `yarn`, and symlinked under `frameworks/keyed/solid-patched`. So the only difference from original benchmark is that it uses modified solid-js also from this monorepo.

There's no significant difference in the results - I'm getting similar differences between multiple runs of the benchmark for the same code.

