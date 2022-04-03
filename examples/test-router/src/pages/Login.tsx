import {Navigate, useSearchParams} from 'solid-app-router';
import {Show, JSX} from 'solid-js';
import {authState, login} from '../auth';

export default function LoginPage() {
  const [search] = useSearchParams();
  const handleLogin: JSX.EventHandler<HTMLFormElement, Event> = (evt) => {
    evt.preventDefault();
    const data = new FormData(evt.currentTarget);
    login({
      name: data.get('name')!.toString()
    });
  };

  // Show the login form when not logged in, otherwise redirect
  return (
    <Show
      when={!authState.isLoggedIn}
      fallback={<Navigate href={decodeURI(search.returnTo || '/')} />}
    >
      <main>
        <form onSubmit={handleLogin}>
          <label>
            User Name
            <input name="name" required />
          </label>
          <button>Login</button>
        </form>
      </main>
    </Show>
  );
}
