import React from 'react';
import { Link, Switch, useLocation } from 'react-router-dom';
import { Route } from 'react-router-dom';
import Main from './pages/main';
import Settings from './pages/settings';
import home from './home.svg';
import settings from './settings.svg';
import './app.scss';

export const App = () => {
  const location = useLocation();
  return (
    <>
      <nav>
        {location.pathname !== '/' && (
          <Link to="/">
            <img src={home} alt="Home" />
          </Link>
        )}
        {location.pathname !== '/settings' && (
          <Link to="/settings">
            <img src={settings} alt="Settings" />
          </Link>
        )}
      </nav>
      <Switch>
        <Route path="/settings">
          <Settings />
        </Route>
        <Route>
          <Main />
        </Route>
      </Switch>
    </>
  );
};

export default App;
