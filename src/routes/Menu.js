import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router';
import { dbService, authService } from '../fbase';
import { ModalWindow } from './userInfoModal';
import SubjectList from './subjectList';

const Menu = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isStudent, setIsStudent] = useState('');
  let history = useHistory();
  const onLogOutClick = () => {
    authService.signOut();
    history.push('/');
  };

  const getUserInitialInfo = async () => {
    const dbScript = await dbService.collection('userInformation').get();
    const arr = [];
    for (const document of dbScript.docs) {
      arr.push({
        ...document.data(),
      });
    }
    if (!arr.find((el) => el.userID === authService.currentUser.uid)) {
      setIsModalVisible(true);
    } else {
      const myInfo = arr.filter(
        (el) => el.userID === authService.currentUser.uid
      );
      myInfo[0].isStudent === 'professor'
        ? setIsStudent('professor')
        : setIsStudent('student');
    }
  };

  useEffect(() => {
    getUserInitialInfo();
  }, []);

  return (
    <>
      <ModalWindow
        style={{ zIndex: '999' }}
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
      />
      {isStudent === 'student' ? (
        <Container>
          <Link to="/myPage">
            <Button>학생용</Button>
          </Link>
        </Container>
      ) : (
        <>
          <Container>
            <Link to="/forprofessor">
              <Button>교수용</Button>
            </Link>
            <Link to="/createtask">
              <Button>과제생성</Button>
            </Link>
            <Link to="/myPage">
              <Button>학생용</Button>
            </Link>
          </Container>
          {/* <SubjectList /> */}
        </>
      )}

      <Button
        onClick={onLogOutClick}
        style={{ position: 'absolute', bottom: '20px' }}
      >
        press here to logout{' '}
      </Button>
    </>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 15px;
  box-shadow: 0 0 25px rgba(0, 0, 0, 0.25);
  width: 350px;
  height: 450px;
  overflow-y: auto;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const Button = styled.button`
  margin-bottom: 30px;
  background: #f9f9f9;
  border-radius: 100px;
  width: 180px;
  height: 3.5rem;
  font-weight: 500;
  font-size: 1rem;
  line-height: 1.5rem;
  text-align: center;
  color: grey;
  border: none;
  :hover {
    box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.07);
    color: black;
  }
`;

export { Menu, Button, Container };
