import React from 'react';
import { HashRouter as Router, Route, Switch, Link } from 'react-router-dom';
import Auth from '../routes/Auth';
import Home from '../routes/Home';
import Translate from '../routes/Translate';
import Student from '../routes/Student';
import { Menu } from '../routes/Menu';

const AppRouter = ({ isLoggedIn }) => {
  return (
    <Router>
      <Link to="/" />
      <Link to="/professor" />
      <Link to="/student" />
      {isLoggedIn ? (
        <>
          <Route exact path="/" component={Menu} />
          <Switch>
            <Route path="/professor" component={Translate} />
            <Route path="/student" component={Student} />
          </Switch>
        </>
      ) : (
        <Route exact path="/">
          <Auth />
        </Route>
      )}
    </Router>
  );
};
export default AppRouter;
