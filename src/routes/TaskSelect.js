import React, { useState } from 'react';
import styled from 'styled-components';
import { Button, Container } from 'routes/Menu';
import dummyData from '../dummyData.js';

const TaskSelect = () => {
  return (
    <StyledContainer>
      {dummyData.student_data.map((item) => (
        <Button>{item.label}</Button>
      ))}
    </StyledContainer>
  );
};

export default TaskSelect;

const StyledContainer = styled(Container)`
  padding: 10px;
  width: 320px;
  height: 430px;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
`;
