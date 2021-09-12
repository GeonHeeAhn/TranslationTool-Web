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
  setIsStudent,
  isStudent,
}) => {
  const studentUID = [
    'KPvOLs0dIBVSmv9dY2GFRI32Yzz1',
    'ljN4ZcEo22RyXOhJcFv2X6VYUBk2',
    'ywCd3Xquo0cuJDQqcHlXgaQ0klo2',
    'i9q6lEDhBUeYcNBvfZkk46piDEt1',
    'Ni2piOEen4d8q7C5bSY9PpVDJLg2',
    'nXy6fEzaeTe0lx3oJueYH61Kyn73',
    'icbhfUAQrdhDrO322jBT0gMbfCJ3',
    'hrY18LKqCWMiefRTxkuQkDzvkeJ2',
  ];
  const isStudOrProf = () => {
    if (studentUID.includes(authService.currentUser.uid)) {
      setIsStudent(true);
    } else {
      setIsStudent(false);
    }
  };

  const getTaskList = async () => {
    const TaskList = await dbService.collection('professor').get();
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
    const TaskList = await dbService.collection('student').get();
    const arr = [];
    for (const document of TaskList.docs) {
      arr.push(document.data());
    }
    let Arr = [];
    Arr = arr.filter((el) => el.userID === authService.currentUser.uid);
    console.log(Arr);
    setMyScriptList(Arr);
  };

  useEffect(() => {
    isStudOrProf();
    getTaskList();
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
    <>
      {isStudent ? (
        <Page>
          <StyledContainer>
            {dummyData.student_data.map((item) => (
              <Link to={`${match.url}/${item.id}`}>
                <StyledButton>{item.label}</StyledButton>
              </Link>
            ))}
          </StyledContainer>
        </Page>
      ) : (
        <Page>
          {SearchBar()}
          <StyledContainer>
            {dummyData.student_data.map((item) => (
              <Link to={`${match.url}/${item.id}`}>
                <StyledButton>{item.label}</StyledButton>
              </Link>
            ))}
          </StyledContainer>
        </Page>
      )}
    </>
  );
};

const MyPage = ({ match }) => {
  const [myName, setMyName] = useState();
  const [myTask, setMyTask] = useState();
  const [myScriptList, setMyScriptList] = useState();
  const [isStudent, setIsStudent] = useState();

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
            isStudent={isStudent}
            setIsStudent={setIsStudent}
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
            myName={myName}
            isStudent={isStudent}
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
