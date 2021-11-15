import React, { useState } from 'react';
import styled from 'styled-components';
import OutsideAlerter from './outsideAlerter';

const ModalContent = () => {
  return (
    <BodyContainer>
      <Label>** 선택</Label>
      <SelectBox>
        <SelectButton>교수</SelectButton>
        <SelectButton>학생</SelectButton>
      </SelectBox>
      <Label>학과 선택</Label>
      <SelectBox>
        <SelectButton>중국어</SelectButton>
        <SelectButton>한국어</SelectButton>
      </SelectBox>
      <Label>학기 선택</Label>
      <SelectBox>
        <SelectButton>1학기</SelectButton>
        <SelectButton>2학기</SelectButton>
      </SelectBox>
      <Button>submit</Button>
    </BodyContainer>
  );
};

const ModalWindow = ({ isModalVisible, setIsModalVisible }) => {
  return (
    <>
      <ModalBackground isModalVisible={isModalVisible}>
        <OutsideAlerter setIsModalVisible={setIsModalVisible}>
          <Modal isModalVisible={isModalVisible}>
            <ModalContent />
          </Modal>
        </OutsideAlerter>
      </ModalBackground>
    </>
  );
};

export default ModalWindow;

const Modal = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  height: 500px;
  background-color: grey;
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
`;

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.25);
  visibility: ${(props) => (props.isModalVisible ? 'visible' : 'hidden')};
  transition: ${(props) =>
    props.isModalVisible
      ? 'opacity 500ms'
      : 'opacity 500ms , visibility 500ms'};
`;

const Label = styled.div`
  font-size: 1.125rem;
  font-weight: normal;
  color: #b0b1b6;
  text-align: center;
  word-break: break-word;
`;

const Button = styled.button`
  border-radius: 100px;
  padding: 18px 14px;
  margin-bottom: 40px;
  font-weight: normal;
  text-align: center;
  font-size: 1rem;
  color: #ffffff;
  line-height: 1.5rem;
  background-color: #3562ff;
  border: none;
  width: 246px;
  z-index: 999;
  :disabled {
    background-color: #393a3f;
  }
`;

const SelectBox = styled.div`
  width: 70%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  background-color: none;
`;

const SelectButton = styled.button`
  border-radius: 30px;
  width: 100px;
  height: 80px;
  color: rgb(0, 0, 0);
  background-color: ${(props) => (props.isSelected ? '#f6f6f6' : '#f9f9f9')};
  border: none;
`;

const BodyContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  -ms-overflow-style: none;
  ::-webkit-scrollbar {
    display: none;
  }
`;
