import React, { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import OutsideAlerter from './outsideAlerter';
import { Modal, ModalBackground, BodyContainer } from './userInfoModal';
import { RowCompo } from './CreateTask';

const ModalContent = ({
  title,
  id,
  dueDate,
  description,
  isPublic,
  content,
}) => {
  return (
    <BodyContainer>
      <RowCompo
        style={{
          width: '100%',
          justifyContent: 'space-around',
          alignContent: 'center',
        }}
      >
        <h4>{title}</h4>
        <h5>{id}</h5>
      </RowCompo>
      <h5>{dueDate}</h5>
      <h5>{description}</h5>
      <RowCompo>
        <div>{content}</div>
      </RowCompo>
      <div>
        {{ isPublic } === 'private'
          ? '아직 공개되지 않은 과제입니다. '
          : '공개된과제입니다.'}
      </div>
    </BodyContainer>
  );
};

const ModalPage = ({
  isModalVisible,
  setIsModalVisible,
  title,
  id,
  dueDate,
  description,
  isPublic,
  content,
}) => {
  return (
    <>
      {/* <GlobalStyle /> */}
      <ModalBackground
        isModalVisible={isModalVisible}
        style={{ zIndex: '999', positon: 'fixed' }}
      >
        <OutsideAlerter setIsModalVisible={setIsModalVisible}>
          <Modal isModalVisible={isModalVisible}>
            <ModalContent
              title={title}
              id={id}
              dueDate={dueDate}
              description={description}
              isPublic={isPublic}
              content={content}
            />
          </Modal>
        </OutsideAlerter>
      </ModalBackground>
    </>
  );
};

export default ModalPage;

// const StyledRowCompo = styled(RowCompo)`
//   justify-content: space-around;
//   width: 100%;
// `;
