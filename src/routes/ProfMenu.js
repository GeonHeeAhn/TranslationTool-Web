import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Translate } from 'routes/Translate';
import { Route, Link } from 'react-router-dom';
import { dbService } from 'fbase.js';
import dummyData from '../dummyData.js';
import {
  StyledContainer,
  StyledButton,
  InnerBtnContainer,
  BtnGroup,
  IconBtn,
  AddSubjContainer,
  SubjListContainer,
} from './subjectList';
import 'boxicons';

const ButtonGroup = () => {
  return (
    <BtnGroup>
      <IconBtn style={{ marginLeft: 10 }}>
        <box-icon type="solid" name="pencil" size="sm" animation="tada-hover" />
      </IconBtn>
      <IconBtn>
        <box-icon type="solid" name="trash" size="sm" animation="tada-hover" />
      </IconBtn>
    </BtnGroup>
  );
};

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
      <Spacer />
      <Title>과제 목록</Title>
      <SubjListContainer>
        {dummyData.student_data.map((item) => (
          <Link
            to={{
              pathname: `${match.url}/${item.id}`,
              state: {
                fromWhere: 'newFeedback',
                studentID: '',
              },
            }}
          >
            <StyledButton>
              <InnerBtnContainer>
                <div style={{ width: 200, textAlign: 'left' }}>
                  {item.label}
                </div>
                <ButtonGroup />
              </InnerBtnContainer>
            </StyledButton>
          </Link>
        ))}
      </SubjListContainer>
      <Link to="/createtask">
        <AddSubjContainer>
          <IconBtn>
            <box-icon name="plus-circle" type="solid" size="sm"></box-icon>
          </IconBtn>
          <Spacer />
          과목 추가
        </AddSubjContainer>
      </Link>
      <Spacer />
      <Spacer />
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

const Spacer = styled.div`
  height: 30px;
  width: 16px;
`;

const Title = styled.h3`
  width: 500px;
  text-align: left;
  margin: 30px;
`;
