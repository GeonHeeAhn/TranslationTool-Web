import react, { useState, Component, useCallback } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { dbService, authService } from 'fbase';
import useInputs from '../hooks/useInputs';
import { Container } from 'routes/Menu.js';
import { Input, Button } from '@nextui-org/react';
import { RowCompo, FileInput, StyledContainer } from './CreateTask';
import Select from 'react-select';

const classOptions = [
  { value: '01', label: '1분반' },
  { value: '02', label: '2분반' },
  { value: '03', label: '3분반' },
];

const semesterOptions = [
  { value: '2021-02', label: '2021/2' },
  { value: '2022-01', label: '2022/1' },
  { value: '2022-02', label: '2022/2' },
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
  const [studentList, setStudentList] = useState();
  const subjName = useInputs('');
  const classNum = useInputs('');
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

  const handleOnChange = (e) => {
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.onload = function (event) {
      setStudentList(event.target.result);
    };
    reader.readAsText(file);
  };

  const createSubj = async () => {
    if (
      classValue.value === null ||
      semesterValue.value === null ||
      translateValue.value === null ||
      subjName === null ||
      classNum === null
    ) {
      window.alert('주어진 정보를 모두 입력해주세요. ');
    } else {
      await dbService.collection('subject').add({
        subjectName: subjName.value,
        semester: semesterValue.value,
        classNum: classNum.value + '-' + classValue.value,
        studentList: studentList || '',
        translateOption: translateValue.value,
      });
      console.log(classNum);
      window.alert('과제가 성공적으로 등록되었습니다. ');
    }
  };
  return (
    <>
      <GlobalStyle />
      <StyledContainer>
        <h3>과목 추가</h3>
        <RowCompo>
          <div>과목명</div>
          <Input
            placeholder="Add text"
            size="large"
            width="250px"
            {...subjName}
          />
        </RowCompo>
        <RowCompo>
          <div>학수번호</div>
          <Input
            placeholder="Add text"
            size="large"
            width="250px"
            {...classNum}
          />
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
          <FileInput
            type="file"
            accept=".txt"
            onChange={(e) => handleOnChange(e)}
          />
        </RowCompo>
        <Button auto rounded flat color="Accents4" onClick={createSubj}>
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
