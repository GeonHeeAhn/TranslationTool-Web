import react, { useState, Component, useCallback } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { dbService, authService } from 'fbase';
import useInputs from '../hooks/useInputs';
import { Container } from 'routes/Menu.js';
import { Input, Button } from '@nextui-org/react';
import { RowCompo, FileInput, StyledContainer } from './CreateTask';
import Select from 'react-select';

const classOptions = [
  { value: 'class1', label: '1분반' },
  { value: 'class2', label: '2분반' },
  { value: 'class3', label: '3분반' },
];

const semesterOptions = [
  { value: '2021/2', label: '2021/2' },
  { value: '2022/1', label: '2022/1' },
  { value: '2022/2', label: '2022/2' },
];

const translateOptions = [
  { value: 'translate', label: '번역' },
  { value: 'sequential', label: '순차통역' },
  { value: 'simultaneous', label: '동시통역' },
];

const CreateSubject = () => {
  const [classValue, setClassValue] = useState();
  const [semesterValue, setSemesterValue] = useState();
  const [translateValue, setTranslateValue] = useState();
  const handleChange = useCallback(
    (inputValue) => setClassValue(inputValue),
    []
  );

  const semesterChange = useCallback(
    (inputValue) => setSemesterValue(inputValue),
    []
  );

  const transChange = useCallback(
    (inputValue) => setTranslateValue(inputValue),
    []
  );

  return (
    <>
      <GlobalStyle />
      <StyledContainer>
        <h3>과목 추가</h3>
        <RowCompo>
          <div>과목명</div>
          <Input placeholder="Add text" size="large" width="250px" />
        </RowCompo>
        <RowCompo>
          <div>학수번호</div>
          <Input placeholder="Add text" size="large" width="250px" />
        </RowCompo>
        <RowCompo>
          <div>분반</div>
          <Select
            options={classOptions}
            value={classValue}
            onChange={handleChange}
            placeholder="분반을 선택해주세요. "
          />
        </RowCompo>
        <RowCompo>
          <div>연도/학기</div>
          <Select
            options={semesterOptions}
            value={semesterValue}
            onChange={semesterChange}
            placeholder="학기를 선택해주세요. "
          />
        </RowCompo>
        <RowCompo>
          <div>구분</div>
          <Select
            options={translateOptions}
            value={translateValue}
            onChange={transChange}
            placeholder="번역/순차통역/동시통역"
          />
        </RowCompo>
        <RowCompo>
          <div style={{ width: '110px' }}>
            수강생 정보
            <br />
            업로드
          </div>
          <FileInput type="file" accept=".txt" />
        </RowCompo>
        <Button auto rounded flat color="Accents4">
          생성하기
        </Button>
      </StyledContainer>
    </>
  );
};

export default CreateSubject;

const GlobalStyle = createGlobalStyle`
  .button.jsx-386292894  {
    margin-top: 20px;
    height: 50px !important;
    min-width: 150px !important;
  }
  .text.jsx-129748894{
    font-size: 16px;
  }
  .css-2b097c-container{
    width:250px;
}

`;
