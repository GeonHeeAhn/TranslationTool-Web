import React, { useState } from 'react';
import styled from 'styled-components';
import { Button, Container } from 'routes/Menu';
import Student from 'routes/Student';
import dummyData from '../dummyData.js';
import { Route, Link } from 'react-router-dom';

const SelectList = ({ match }) => {
  return (
    <StyledContainer>
      {dummyData.student_data.map((item) => (
        <Link to={`${match.url}/${item.id}`}>
          <Button>{item.label}</Button>
        </Link>
      ))}
    </StyledContainer>
  );
};

export default function TaskSelect({ match }) {
  return (
    <>
      <Route exact path={match.path} component={SelectList} />
      <Route path={`${match.path}/:id`} component={Student} />
    </>
  );
}

const StyledContainer = styled(Container)`
  padding: 10px;
  width: 320px;
  height: 430px;
  overflow-y: auto;
  ::-webkit-scrollbar {
    display: none;
  }
`;
