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
          <StyledButton>{item.label}</StyledButton>
        </Link>
      ))}
    </StyledContainer>
  );
};

export default function TaskSelect({ match, userObj }) {
  return (
    <>
      <Route exact path={match.path} component={SelectList} />
      <Route path={`${match.path}/:id`} component={Student} userObj={userObj} />
    </>
  );
}

const StyledContainer = styled(Container)`
  padding: 20px;
  width: 300px;
  height: 410px;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: space-around;
`;

const StyledButton = styled(Button)`
  width: 130px;
  margin-left: 5px;
  margin-right: 5px;
  margin-bottom: 0px;
  font-size: 0.9rem;
`;
