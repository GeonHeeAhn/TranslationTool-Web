import React from 'react';
import { HashRouter as Router, Route, Switch, Link } from 'react-router-dom';
import Auth from '../routes/Auth';
import { Translate } from '../routes/Translate';
import TaskSelect from '../routes/TaskSelect';
import { Menu } from '../routes/Menu';
import { useState } from 'react';
import profMenu from '../routes/ProfMenu';
import MyPage from '../routes/MyPage';

const AppRouter = ({ isLoggedIn }) => {
  return (
    <Router>
      <Link to="/" />
      <Link to="/professor" />
      <Link to="/student" />
      <Link to="/mypage" />
      {isLoggedIn ? (
        <>
          <Route exact path="/" component={Menu} />
          <Switch>
            <Route path="/professor" component={Translate} />
            <Route path="/forstudent" component={TaskSelect} />
            <Route path="/forprofessor" component={profMenu} />
            <Route path="/myPage" component={MyPage} />
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
