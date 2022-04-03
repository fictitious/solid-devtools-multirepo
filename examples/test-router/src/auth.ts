import {createRoot, createEffect} from 'solid-js';
import {createStore} from 'solid-js/store';

function createSessionStore<T>(key: string, initialValue: T) {
  const persisted = sessionStorage.getItem(key);
  const store = createStore<T>(
    persisted ? (JSON.parse(persisted) as T) : initialValue
  );
  createEffect(() => {
    sessionStorage.setItem(key, JSON.stringify(store[0]));
  });
  return store;
}

interface User {
  name: string;
}

interface Auth {
  isLoggedIn: boolean;
  user?: User;
}

const [authState, {login, logout}] = createRoot(() => {
  const [state, setState] = createSessionStore<Auth>('auth', {
    isLoggedIn: false
  });

  function login(user: User) {
    setState({
      isLoggedIn: true,
      user
    });
  }

  function logout() {
    setState({
      isLoggedIn: false,
      user: undefined
    });
  }
  return [state, {login, logout}];
});

export {authState, login, logout};
