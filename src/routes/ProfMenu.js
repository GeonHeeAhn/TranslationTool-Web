import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button, Container } from 'routes/Menu';
import Translate from 'routes/Translate';
import { Route, Link } from 'react-router-dom';
import { dbService } from 'fbase.js';
import dummyData from '../dummyData.js';

const SelectList = ({ match }) => {
  const [subjectId, setSubjectId] = useState([]);
  const getScripts = async () => {
    const dbScript = await dbService.collection('student').get();
    const arr = [];
    for (const document of dbScript.docs) {
      arr.push({
        ...document.data(),
      });
    }
    var result = [];
    for (const a of arr) {
      result.push(a.scriptID);
    }
    let uniqueArr = [];
    result.forEach((element) => {
      if (!uniqueArr.includes(element)) {
        uniqueArr.push(element);
      }
    });
    setSubjectId(uniqueArr);
  };

  useEffect(() => {
    getScripts();
  }, []);

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

const ProfMenu = ({ match }) => {
  return (
    <>
      <Route exact path={match.path} component={SelectList} />
      <Route path={`${match.path}/:id`} component={Translate} />
    </>
  );
};

export default ProfMenu;

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
