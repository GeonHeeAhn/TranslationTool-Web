import React, { useState, useEffect, useCallback } from 'react';
import { dbService } from 'fbase.js';
import { Route, Link } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { Button, Container } from 'routes/Menu';
import 'boxicons';
import Select from 'react-select';

const classOptions = [
  { value: 'all', label: '전체' },
  { value: '2021-02', label: '2021학년도 2학기' },
  { value: '2022-01', label: '2022학년도 1학기' },
  { value: '2022-02', label: '2022학년도 2학기' },
];

const ButtonGroup = () => {
  return (
    <BtnGroup>
      <IconBtn style={{ marginLeft: 10 }}>
        <box-icon name="user" type="solid" size="sm" animation="tada-hover" />
      </IconBtn>
      <IconBtn>
        <box-icon type="solid" name="pencil" size="sm" animation="tada-hover" />
      </IconBtn>
      <IconBtn>
        <box-icon type="solid" name="trash" size="sm" animation="tada-hover" />
      </IconBtn>
    </BtnGroup>
  );
};

const SubjectList = () => {
  const [subjectList, setSubjectList] = useState([]);
  const [originalList, setOriginalList] = useState([]);
  const [classValue, setClassValue] = useState({ value: 'all' });
  const getSubj = async () => {
    const dbsubj = await dbService.collection('subject').get();
    const subjects = [];
    for (const document of dbsubj.docs) {
      subjects.push({
        ...document.data(),
      });
    }
    setSubjectList(subjects);
    setOriginalList(subjects);
  };

  const sortSubjList = () => {
    if (classValue.value === 'all') {
      setSubjectList(originalList);
    } else {
      const arr = originalList.filter(
        (item) => item.semester === classValue.value
      );
      console.log(classValue);
      console.log(arr);
      setSubjectList(arr);
    }
  };

  const handleChange = useCallback(
    (inputValue) => setClassValue(inputValue),
    []
  );

  useEffect(() => {
    getSubj();
  }, []);

  useEffect(() => {
    sortSubjList();
  }, [classValue]);

  return (
    <>
      <GlobalStyle />
      <StyledContainer>
        <Spacer />
        <Spacer />
        <Select
          options={classOptions}
          value={classValue}
          onChange={handleChange}
          placeholder="연도/학기 "
        />
        <Spacer />
        {subjectList.map((item) => (
          <StyledButton>
            <InnerBtnContainer>
              {item.subjectName}
              <ButtonGroup />
            </InnerBtnContainer>
            {/* {item.description} */}
          </StyledButton>
        ))}
      </StyledContainer>
    </>
  );
};

export default SubjectList;

const GlobalStyle = createGlobalStyle`
.css-g1d714-ValueContainer{
    width: 400px;
}
.css-yk16xz-control{
    height: 50px;
}
.css-1pahdxg-control{
    height: 50px;
}
`;

const StyledContainer = styled(Container)`
  width: 600px;
  height: 500px;
  justify-content: flex-start;
`;

const StyledButton = styled(Button)`
  width: 500px;
  border-radius: 20px;
  color: black;
  flex-direction: row;
  height: 70px;
`;

const InnerBtnContainer = styled.div`
  margin-bottom: 0;
  font-weight: 600;
  font-size: 18px;
  width: auto;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const IconBtn = styled.button`
  border: none;
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2px;
  margin: 0;
`;

const BtnGroup = styled.div`
  display: flex;
  width: auto;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const Spacer = styled.div`
  height: 30px;
`;
