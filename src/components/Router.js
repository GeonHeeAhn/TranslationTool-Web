import React from 'react';
import { HashRouter as Router, Route, Switch, Link } from 'react-router-dom';
import Auth from '../routes/Auth';
import { Translate } from '../routes/Translate';
import TaskSelect from '../routes/TaskSelect';
import { Menu } from '../routes/Menu';
import { useState } from 'react';
import profMenu from '../routes/ProfMenu';
import MyPage from '../routes/MyPage';
import Header from '../routes/Header';
import { CreateTask } from '../routes/CreateTask';
import CreateSubject from 'routes/CreateSubject';

const AppRouter = ({ isLoggedIn }) => {
  return (
    <Router>
      <Link to="/" />
      <Link to="/professor" />
      <Link to="/student" />
      <Link to="/mypage" />
      <Link to="/createtask" />
      <Link to="/createSubject" />
      <Link to="/subjectlist" />
      {isLoggedIn ? (
        <>
          <Route path="/" component={Header} />
          <Route exact path="/" component={Menu} />
          <Switch>
            <Route path="/createtask" component={CreateTask} />
            <Route path="/professor" component={Translate} />
            <Route path="/forstudent" component={TaskSelect} />
            <Route path="/forprofessor" component={profMenu} />
            <Route path="/myPage" component={MyPage} />
            <Route path="/createsubject" component={CreateSubject} />
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
