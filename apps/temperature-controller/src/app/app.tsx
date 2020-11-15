import React from 'react';
import { Link, Switch } from 'react-router-dom';
import { Route } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import Main from './pages/main';
import Settings from './pages/settings';

export const App = () => {
  return (
    <BrowserRouter>
      <Link to="/">Home</Link>
      <Link to="/settings">Settings</Link>
      <Switch>
        <Route path="/settings">
          <Settings />
        </Route>
        <Route>
          <Main />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

export default App;
