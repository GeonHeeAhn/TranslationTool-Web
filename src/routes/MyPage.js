import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Container, Button } from 'routes/Menu';
import MyFeedBack from 'routes/MyFeedBack';
import { dbService, authService } from 'fbase.js';
import { Route, Link } from 'react-router-dom';
import dummyData from '../dummyData.js';

const MyPageMenu = ({
  match,
  setMyName,
  myName,
  setMyTask,
  setMyScriptList,
}) => {
  const getTaskList = async () => {
    const TaskList = await dbService.collection('professorTest').get();
    const arr = [];
    for (const document of TaskList.docs) {
      arr.push(document.data());
    }
    let Arr = [];
    Arr = arr.filter((el) => el.student_ID === authService.currentUser.uid);
    console.log(Arr);
    setMyTask(Arr);
  };

  const getStudentScriptList = async () => {
    const TaskList = await dbService.collection('studentTest').get();
    const arr = [];
    for (const document of TaskList.docs) {
      arr.push(document.data());
    }
    let Arr = [];
    Arr = arr.filter((el) => el.userID === authService.currentUser.uid);
    console.log(Arr);
    setMyScriptList(Arr);
  };

  // const isMyTaskEmpty = () => {
  //   if (myTask === undefined) {
  //     return 'loading';
  //   } else {
  //     return myTask.map((item) => (
  //       <Link to={`${match.url}/${item.script_ID}`}>
  //         <Button>{item.script_ID}</Button>
  //       </Link>
  //     ));
  //   }
  // };
  useEffect(() => {
    getTaskList();
    // isMyTaskEmpty();
    getStudentScriptList();
  }, []);

  const SearchBar = () => {
    const inputOnChange = (e) => {
      setMyName(e.target.value);
    };

    const searchOnClick = () => {
      window.alert('이름이 정상적으로 입력되었습니다.');
    };

    return (
      <SearchToggle>
        <Input
          placeholder="Enter your name here"
          onChange={(e) => inputOnChange(e)}
          value={myName}
        />
        <SearchButton type="submit" onClick={searchOnClick}>
          <img
            src={process.env.PUBLIC_URL + '/design/search.png'}
            alt="search icon"
            style={{ height: '20px', width: '20px' }}
          />
        </SearchButton>
      </SearchToggle>
    );
  };

  return (
    <Page>
      {/* {SearchBar()} */}
      <StyledContainer>
        {dummyData.student_data.map((item) => (
          <Link to={`${match.url}/${item.id}`}>
            <StyledButton>{item.label}</StyledButton>
          </Link>
        ))}
      </StyledContainer>
    </Page>
  );
};

const MyPage = ({ match }) => {
  const [myName, setMyName] = useState();
  const [myTask, setMyTask] = useState();
  const [myScriptList, setMyScriptList] = useState();
  return (
    <>
      <Route
        exact
        path={match.path}
        render={(props) => (
          <MyPageMenu
            {...props}
            setMyName={setMyName}
            myName={myName}
            setMyTask={setMyTask}
            setMyScriptList={setMyScriptList}
          />
        )}
      />
      <Route
        path={`${match.path}/:id`}
        render={(props) => (
          <MyFeedBack
            {...props}
            // myName={myName}
            myTask={myTask}
            myScriptList={myScriptList}
          />
        )}
      />
    </>
  );
};

export default MyPage;

const Page = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const StyledButton = styled(Button)`
  width: 130px;
  margin-left: 5px;
  margin-right: 5px;
  margin-bottom: 0px;
  font-size: 0.9rem;
`;

const StyledContainer = styled(Container)`
  padding: 20px;
  width: 300px;
  height: 410px;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: space-around;
`;

const SearchToggle = styled.div`
  width: 300px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-around;
`;

const SearchButton = styled.button`
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  background: none;
  :focus {
    outline: none;
  }
`;

const Input = styled.input`
  width: 200px;
  border: none;
  border-bottom: 1px solid grey;
  padding: 5px;
  line-height: 20px;
  :focus {
    outline: none;
  }
`;
