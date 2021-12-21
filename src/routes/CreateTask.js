import React, { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { Container } from 'routes/Menu.js';
import { dbService, authService } from 'fbase';
import { Input, Switch, Textarea, Button } from '@nextui-org/react';
import useInputs from '../hooks/useInputs';
import Modal from './taskModal';

const CreateTask = () => {
  const [newTask, setNewTask] = useState();
  const [isPublic, setIsPublic] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const taskTitle = useInputs('');
  const scriptId = useInputs('');
  const description = useInputs('');
  const dueDate = useInputs();

  const viewOnClick = () => {
    setIsModalVisible(true);
  };
  const handleChangeFile = (e) => {
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.onload = function (event) {
      setNewTask(event.target.result);
    };
    reader.readAsText(file);
  };

  const switchOnChange = (checked) => {
    checked.target.checked ? setIsPublic('public') : setIsPublic('private');
  };

  const uploadOnClick = async () => {
    if (
      newTask === null ||
      taskTitle.value === '' ||
      scriptId.value === '' ||
      dueDate.value === ''
    ) {
      window.alert('주어진 정보를 입력해주세요. ');
    } else {
      await dbService.collection('tasks').add({
        professor_ID: authService.currentUser.uid,
        task: newTask,
        taskTitle: taskTitle.value,
        script_ID: scriptId.value,
        dueDate: dueDate.value,
        description: description.value,
        isPublic: isPublic,
      });
      window.alert('과제가 성공적으로 등록되었습니다. ');
    }
  };

  return (
    <>
      <GlobalStyle />
      <Modal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        title={taskTitle.value}
        id={scriptId.value}
        dueDate={dueDate.value}
        description={description.value}
        ispublic={isPublic}
        content={newTask}
      />
      <>
        <StyledContainer>
          <h3>과제 추가</h3>
          <RowCompo>
            <div>과제명</div>
            <Input
              placeholder="Add text"
              size="large"
              width="250px"
              {...taskTitle}
            />
          </RowCompo>
          <RowCompo>
            <div>과제 ID</div>
            <Input
              size="large"
              placeholder="task id here"
              color="default"
              width="250px"
              {...scriptId}
            />
          </RowCompo>
          <RowCompo>
            <div>과제 설명</div>
            <Textarea
              placeholder="Add text"
              minRows={5}
              width="250px"
              {...description}
            />
          </RowCompo>
          <RowCompo>
            <div>과제 제출물 공개 여부</div>
            <Switch initialChecked size="large" onChange={switchOnChange} />
          </RowCompo>
          <RowCompo>
            <div>기한</div>
            <Input width="250px" type="date" size="large" {...dueDate} />
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
            <Button auto rounded flat color="Accents4" onClick={viewOnClick}>
              미리보기
            </Button>
            <Button auto rounded flat color="Accents4" onClick={uploadOnClick}>
              생성하기
            </Button>
          </RowCompo>
        </StyledContainer>
      </>
    </>
  );
};

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
  margin: 5px;
  margin-left: 20px;
`;

const StyledContainer = styled(Container)`
  width: 500px;
  height: 700px;
  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const RowCompo = styled.div`
  display: flex;
  justify-content: space-between;
  width: 350px;
  margin: 10px 0px 10px 0px;
  align-items: center;
`;

export { CreateTask, FileInput, RowCompo, StyledContainer };
