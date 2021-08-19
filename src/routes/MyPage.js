import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Container } from 'routes/Menu';
import MyFeedBack from 'routes/MyFeedBack';
import { dbService, authService } from 'fbase.js';
import { Route, Link } from 'react-router-dom';

const MyPageMenu = ({ match }) => {
  const [myTask, setMyTask] = useState();
  const getTaskList = async () => {
    const TaskList = await dbService.collection('professor').get();
    const arr = [];
    for (const document of TaskList.docs) {
      arr.push(document.data());
    }
    let Arr = [];
    Arr = arr.filter((el) => el.student_ID === authService.currentUser.uid);
    if (Arr.length === 0) {
      Arr.push({
        scriptID: '작성한 과제가 없습니다.',
      });
    }
    console.log(Arr);
    setMyTask(Arr);
  };

  const isMyTaskEmpty = () => {
    if (myTask === undefined) {
      return 'loading';
    } else {
      return myTask.map((item) => (
        <Link to={`${match.url}/${item.script_ID}`}>
          <Button>{item.script_ID}</Button>
        </Link>
      ));
    }
  };

  useEffect(() => {
    getTaskList();
    isMyTaskEmpty();
  }, []);

  return <Container>{isMyTaskEmpty()}</Container>;
};

const MyPage = ({ match }) => {
  return (
    <>
      <Route exact path={match.path} component={MyPageMenu} />
      <Route path={`${match.path}/:id`} component={MyFeedBack} />
    </>
  );
};

export default MyPage;

const Button = styled.button`
  width: 100%;
  height: 50px;
  padding: 20px;
  border: none;
  background: none;
  text-align: left;
  :focus {
    outline: none;
  }
`;
