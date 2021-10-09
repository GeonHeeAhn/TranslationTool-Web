import React, { useState } from 'react';
import styled from 'styled-components';
import { Container } from 'routes/Menu.js';
import { dbService, authService } from 'fbase';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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
    <Container>
      <h3>파일 업로드</h3>
      <TextInput
        type="text"
        placeholder="title here"
        value={taskTitle}
        onChange={(e) => titleOnChange(e)}
      />
      <TextInput
        type="text"
        placeholder="task id here"
        value={scriptId}
        onChange={(e) => idOnChange(e)}
      />
      <FileInput
        type="file"
        accept=".txt"
        onChange={(e) => handleChangeFile(e)}
      />
      <StyledDatePicker
        dataFormat="yyyy/MM/dd"
        selected={startDate}
        onChange={(date) => setStartDate(date)}
      />
      <Button type="button" onClick={uploadOnClick}>
        업로드
      </Button>
    </Container>
  );
};

export default CreateTask;

const FileInput = styled.input`
  /* border-radius: 15px; */
  margin: 5px;
`;

const TextInput = styled.input`
  padding: 5px;
  margin: 5px;
  border-radius: 15px;
  border: 1px solid #dadada;
  :focus {
    outline: none;
  }
`;

const StyledDatePicker = styled(DatePicker)`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1.5em;
  width: 150px;
  height: 42px;
  box-sizing: border-box;
  padding: 8px 20px;
  border-radius: 4px;
  border: 1px solid #dadada;
  font-size: 12px;
  :focus {
    outline: none;
  }
`;

const Button = styled.button`
  padding: 12px;
  border-radius: 20px;
  width: 100px;
  margin: 5px;
  background-color: #f3f3f3;
  border: none;
`;
