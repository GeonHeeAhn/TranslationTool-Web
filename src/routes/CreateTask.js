import React, { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { Container } from 'routes/Menu.js';
import { dbService, authService } from 'fbase';
import { Input, Switch, Textarea, Button } from '@nextui-org/react';

const CreateTask = () => {
  const [newTask, setNewTask] = useState();
  const [taskTitle, setTaskTitle] = useState();
  const [scriptId, setScriptId] = useState();
  const [startDate, setStartDate] = useState(new Date());

  const handleChangeFile = (e) => {
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.onload = function (event) {
      // The file's text will be printed here
      console.log(event.target.result);
      setNewTask(event.target.result);
    };
    reader.readAsText(file);
  };

  const titleOnChange = (e) => {
    e.preventDefault();
    setTaskTitle(e.target.value);
  };

  const idOnChange = (e) => {
    e.preventDefault();
    setScriptId(e.target.value);
  };

  const uploadOnClick = async () => {
    await dbService.collection('tasks').add({
      professor_ID: authService.currentUser.uid,
      task: newTask,
      script_ID: scriptId,
      taskTitle: taskTitle,
      data: startDate,
    });
  };
  return (
    <>
      <GlobalStyle />
      <StyledContainer>
        <h3>과제 추가</h3>
        <RowCompo>
          <div>과제명</div>
          <Input
            placeholder="Add text"
            size="large"
            value={taskTitle}
            onChange={(e) => titleOnChange(e)}
            width="250px"
          />
        </RowCompo>
        <RowCompo>
          <div>과제 ID</div>
          <Input
            size="large"
            placeholder="task id here"
            color="default"
            value={scriptId}
            onChange={(e) => idOnChange(e)}
            width="250px"
          />
        </RowCompo>
        <RowCompo>
          <div>과제 설명</div>
          <Textarea placeholder="Add text" minRows={5} width="250px" />
        </RowCompo>
        <RowCompo>
          <div>과제 제출물 공개 여부</div>{' '}
          <Switch initialChecked size="large" />
        </RowCompo>
        <RowCompo>
          <div>기한</div>
          <Input width="250px" type="date" size="large" />
        </RowCompo>
        <RowCompo>
          <div style={{ width: '100px' }}>
            파일
            <br />
            업로드
          </div>
          <FileInput
            type="file"
            accept=".txt"
            onChange={(e) => handleChangeFile(e)}
          />
        </RowCompo>
        <RowCompo style={{ justifyContent: 'space-around' }}>
          <Button auto rounded flat color="Accents4">
            미리보기
          </Button>
          <Button auto rounded flat color="Accents4" onClick={uploadOnClick}>
            생성하기
          </Button>
        </RowCompo>
      </StyledContainer>
    </>
  );
};

export default CreateTask;

const GlobalStyle = createGlobalStyle`
  .button.jsx-386292894  {
    margin-top: 20px;
    height: 50px !important;
    min-width: 150px !important;
  }
  .text.jsx-129748894{
    font-size: 16px;
  }
`;

const FileInput = styled.input`
  /* border-radius: 15px; */
  margin: 5px;
  margin-left: 20px;
`;

const StyledContainer = styled(Container)`
  width: 500px;
  height: 700px;
`;

const RowCompo = styled.div`
  display: flex;
  justify-content: space-between;
  width: 350px;
  margin: 10px 0px 10px 0px;
  align-items: center;
`;
