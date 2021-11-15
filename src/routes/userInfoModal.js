import React, { useState } from 'react';
import styled from 'styled-components';
import OutsideAlerter from './outsideAlerter';

const ModalWindow = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  return (
    <>
      <button type="primary" onClick={showModal}>
        Open Modal
      </button>
      <ModalBackground isModalVisible={isModalVisible}>
        <OutsideAlerter setIsModalVisible={setIsModalVisible}>
          <Modal isModalVisible={isModalVisible}>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
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
