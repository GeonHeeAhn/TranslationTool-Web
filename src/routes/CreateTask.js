import React, { useState } from 'react';
import styled from 'styled-components';
import { Container } from 'routes/Student.js';
import { dbService, authService } from 'fbase';

const CreateTask = () => {
  const [newTask, setNewTask] = useState();
  const [taskTitle, setTaskTitle] = useState();
  const [scriptId, setScriptId] = useState();
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
    });
  };
  return (
    <Container>
      <h3>파일 업로드</h3>
      <input
        type="text"
        placeholder="과제명을 입력해주세요"
        value={taskTitle}
        onChange={(e) => titleOnChange(e)}
      />
      <input
        type="text"
        placeholder="과제아이디를 입력해주세요"
        value={scriptId}
        onChange={(e) => idOnChange(e)}
      />
      <FileInput
        type="file"
        accept=".txt"
        onChange={(e) => handleChangeFile(e)}
      />
      <button type="button" onClick={uploadOnClick}>
        업로드
      </button>
    </Container>
  );
};

export default CreateTask;

const FileInput = styled.input`
  /* border-radius: 15px; */
`;
