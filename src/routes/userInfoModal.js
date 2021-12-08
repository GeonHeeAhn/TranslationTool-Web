import React, { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import OutsideAlerter from './outsideAlerter';
import { Switch } from '@nextui-org/react';
import { Input } from '@nextui-org/react';
import { Button } from '@nextui-org/react';
import { dbService, authService } from 'fbase';

const ModalContent = ({ setIsSelected, setIsModalVisible }) => {
  const [personalID, setPersonalID] = useState('');
  const [name, setName] = useState('');
  const [isStudent, setIsStudent] = useState('student');

  const switchOnChange = (checked) => {
    checked.target.checked
      ? setIsStudent('student')
      : setIsStudent('professor');
  };

  const idOnChange = (e) => {
    e.preventDefault();
    setPersonalID(e.target.value);
  };

  const nameOnChange = (e) => {
    e.preventDefault();
    setName(e.target.value);
  };

  const saveOnClick = async () => {
    if (name === '' || personalID === '') {
      window.alert('회원정보를 정확히 입력해주세요. ');
    } else {
      await dbService.collection('userInformation').add({
        userID: authService.currentUser.uid,
        personalID: personalID,
        name: name,
        isStudent: isStudent,
      });
      setIsModalVisible(false);
    }
  };

  return (
    <BodyContainer>
      <Title>회원정보</Title>
      <TextLabel>학번/교번</TextLabel>
      <Input
        size="large"
        placeholder="학번/교번을 입력해주세요."
        value={personalID}
        onChange={idOnChange}
      />
      <TextLabel>이름</TextLabel>
      <Input
        size="large"
        placeholder="이름을 입력해주세요."
        value={name}
        onChange={nameOnChange}
      />
      <RowComponent>
        <TextLabel>학생인가요?</TextLabel>
        <Switch initialChecked size="large" onChange={switchOnChange} />
      </RowComponent>
      <Button flat color="primary" rounded auto onClick={saveOnClick}>
        저장
      </Button>
    </BodyContainer>
  );
};

const ModalWindow = ({ isModalVisible, setIsModalVisible }) => {
  return (
    <>
      <GlobalStyle />
      <ModalBackground isModalVisible={isModalVisible}>
        <OutsideAlerter setIsModalVisible={setIsModalVisible}>
          <Modal isModalVisible={isModalVisible}>
            <ModalContent setIsModalVisible={setIsModalVisible} />
          </Modal>
        </OutsideAlerter>
      </ModalBackground>
    </>
  );
};

export default ModalWindow;

const GlobalStyle = createGlobalStyle`
  .button.jsx-129748894 {
    height: 50px !important;
  }
  .text.jsx-129748894{
    font-size: 16px;
  }
`;
const Modal = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  height: 500px;
  background-color: white;
  border-radius: 50px;
  opacity: ${(props) => (props.isModalVisible ? '1' : '0')};
  visibility: ${(props) => (props.isModalVisible ? 'visible' : 'hidden')};
  transition: ${(props) =>
    props.isModalVisible
      ? 'opacity 500ms'
      : 'opacity 500ms , visibility 500ms'};
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0 0 25px rgba(0, 0, 0, 0.25);
`;

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  visibility: ${(props) => (props.isModalVisible ? 'visible' : 'hidden')};
  transition: ${(props) =>
    props.isModalVisible
      ? 'opacity 500ms'
      : 'opacity 500ms , visibility 500ms'};
`;

const Title = styled.label`
  font-size: 30px;
  font-weight: Bold;
  text-align: center;
  word-break: break-word;
  margin-bottom: 20px;
`;

const TextLabel = styled.label`
  font-size: 16px;
  margin-top: 15px;
  margin-bottom: 10px;
`;

const RowComponent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 35px;
  margin-top: 10px;
`;

const BodyContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* align-items: center; */
  padding: 30px 50px 30px 50px;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  -ms-overflow-style: none;
  ::-webkit-scrollbar {
    display: none;
  }
`;
