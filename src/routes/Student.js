import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button } from 'routes/Menu';
import dummyData from '../dummyData.js';
import { dbService, authService } from 'fbase';

const Student = ({ match, history }) => {
  const studentData = dummyData.student_data.find(
    (studentData) => studentData.id === match.params.id
  );
  const [transText, setTransText] = useState('');
  const [id, setId] = useState('');
  const [mySavedtxt, setMySavedtxt] = useState();

  const translateOnChange = (e) => {
    e.preventDefault();
    setTransText(e.target.value);
  };

  const inputOnChange = (e) => {
    setId(e.target.value);
  };

  const loadSavedTask = async () => {
    const arr = [];
    const db = await dbService.collection('studentTemporaryStorage').get();
    for (const document of db.docs) {
      const data = { ...document.data(), docID: document.id };
      arr.push(data);
    }
    const filterByScriptID = arr.filter(
      (el) => el.scriptID === match.params.id
    );
    const filterByUID = filterByScriptID.filter(
      (el) => el.userID === authService.currentUser.uid
    );
    console.log(filterByUID);
    if (filterByUID.length > 0) {
      setMySavedtxt(filterByUID);
      setTransText(filterByUID[0].translate_txt);
    } else if (filterByUID.length === 0) {
      setMySavedtxt([]);
    }
  };

  const submitOnClick = async () => {
    if (id === null || id === '') {
      window.alert('학번을 입력해주세요.');
      return false;
    } else {
      await dbService.collection('student').add({
        studentID: id,
        scriptID: studentData.id,
        translate_txt: transText,
        userID: authService.currentUser.uid,
      });
      setId('');
      history.goBack();
      window.alert('과제 제출이 정상적으로 처리되었습니다. ');
    }
  };

  const saveOnClick = async () => {
    if (!mySavedtxt) {
      window.alert('loading');
    } else if (mySavedtxt.length === 0) {
      await dbService.collection('studentTemporaryStorage').add({
        studentID: id,
        scriptID: studentData.id,
        translate_txt: transText,
        userID: authService.currentUser.uid,
      });
    } else if (mySavedtxt.length > 0) {
      dbService
        .collection('studentTemporaryStorage')
        .doc(mySavedtxt[0].docID)
        .update({
          translate_txt: transText,
        });
    }
    window.alert('과제가 저장되었습니다.');
  };

  useEffect(() => {
    loadSavedTask();
  }, []);

  return (
    <>
      <TextContainer>
        <Script>{studentData.script}</Script>
        <Translate
          placeholder="Textarea"
          value={transText}
          onChange={translateOnChange}
        >
          {transText}
        </Translate>
      </TextContainer>
      <BottomContainer>
        <IdInput
          placeholder="Enter your Id"
          value={id}
          onChange={inputOnChange}
        />
        <StyledButton onClick={saveOnClick}>Save</StyledButton>
        <StyledButton onClick={submitOnClick}>Submit</StyledButton>
      </BottomContainer>
    </>
  );
};

const Container = styled.div`
  padding: 2%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 15px;
  box-shadow: 0 0 25px rgba(0, 0, 0, 0.25);
  width: 64%;
  height: 73%;
`;

const TextContainer = styled.div`
  width: 100%;
  height: 75%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Script = styled.div`
  width: 40%;
  height: 75%;
  padding: 1%;
  overflow-y: scroll;
  margin-right: 5%;
  ::-webkit-scrollbar {
    display: inherit;
    width: 10px;
    background-color: none;
  }
  ::-webkit-scrollbar-thumb {
    background-color: #f3f3f3;
    border-radius: 10px;
  }
  ::-webkit-scrollbar-track {
    background-color: none;
  }
`;

const Translate = styled.textarea`
  border: none;
  width: 40%;
  height: 75%;
  padding: 1%;
  word-break: break-all;
  border-radius: 12px;
  :focus {
    outline: none;
    border: 1px solid #dadada;
  }
  ::-webkit-scrollbar {
    display: inherit;
    width: 10px;
    background-color: none;
  }
  ::-webkit-scrollbar-thumb {
    background-color: #f3f3f3;
    border-radius: 10px;
  }
  ::-webkit-scrollbar-track {
    background-color: none;
  }
`;

const BottomContainer = styled.div`
  width: 100%;
  height: 25%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const IdInput = styled.input`
  width: 15%;
  height: 30px;
  padding: 1%;
  border-radius: 15px;
  border: 1px solid #dadada;
  :focus {
    outline: none;
    border: 1px solid #dadada;
  }
  margin-right: 5%;
`;

const StyledButton = styled(Button)`
  margin-bottom: 0;
`;

export { Student, Container, IdInput, StyledButton };
