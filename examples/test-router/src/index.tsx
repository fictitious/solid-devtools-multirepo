import {render} from 'solid-js/web';
import {Show, createMemo, on} from 'solid-js';
import type {JSX} from 'solid-js';
import {
  Router,
  Routes,
  Route,
  Navigate,
  Outlet,
  NavLink,
  useLocation
} from 'solid-app-router';
import {authState, logout} from './auth';

import LoginPage from './pages/Login';
import HomePage from './pages/Home';
import SomewherePage from './pages/Somewhere';
import NotFoundPage from './pages/NotFound';

interface ProtectedProps {
  redirect: string;
}

function Protected(props: ProtectedProps) {
  const location = useLocation();

  // This is here to determine the returnTo query parameter when accessing a protected page
  const loginPath = createMemo(
    on(
      () => authState.isLoggedIn,
      (_, wasLoggedIn) => {
        if (!wasLoggedIn && location.pathname !== '/') {
          return `${props.redirect}?returnTo=${encodeURI(location.pathname)}`;
        }
        return props.redirect;
      }
    )
  );

  // Show the outlet when logged in, otherwise redriect to the login page
  return (
    <Show
        when={authState.isLoggedIn}
        fallback={<Navigate href={loginPath()} />}
    >
        <Outlet />
    </Show>
  );
}

interface ProtectedRouteProps {
  path?: string;
  redirect: string;
  children: JSX.Element;
}

function ProtectedRoute(props: ProtectedRouteProps) {
  return (
    <Route
      path={props.path || '/'}
      element={<Protected redirect={props.redirect} />}
    >
      {props.children}
    </Route>
  );
}

function Header() {
  return (
    <header>
      <Show when={authState.isLoggedIn}>
        <div>
          Logged in as <strong>{authState.user!.name}</strong>
          {' | '}
          <button onClick={logout}>Logout</button>
        </div>
        <hr />
      </Show>
      <nav>
        <NavLink href="/">Home</NavLink>
        {' | '}
        <NavLink href="/somewhere">Somewhere</NavLink>
        {' | '}
        <NavLink href="/nowhere">Nowhere</NavLink>
      </nav>
    </header>
  );
}

function App() {
  return (
    <>
      <Header />
      <hr />
      <Routes>
        <ProtectedRoute redirect="/login">
          <Route path="/" component={HomePage} />
          <Route path="/somewhere" component={SomewherePage} />
        </ProtectedRoute>
        <Route path="/login" component={LoginPage} />
        <Route path="*all" component={NotFoundPage} />
      </Routes>
    </>
  );
}

render(
  () => (
    <Router>
      <App />
    </Router>
  ),
  document.getElementById('app')!
);
