import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from 'routes/Menu';
import dummyData from '../dummyData.js';
import { CSVLink } from 'react-csv';

const MyTaskContainer = () => {
  const [transText, setTransText] = useState('');
  const [id, setId] = useState();
  const [data, setData] = useState([]);

  const translateOnChange = (e) => {
    e.preventDefault();
    setTransText(e.target.value);
  };

  const inputOnChange = (e) => {
    setId(e.target.value);
  };

  const downloadOnClick = () => {
    if (id === null || id === '') {
      window.alert('학번을 입력해주세요.');
      return false;
    } else {
      const datas = {
        studentID: id,
        scriptID: dummyData.student_data[0].id,
        translate_txt: transText,
      };
      setData([...data, datas]);
      console.log(data);
    }
  };

  return (
    <>
      <TextContainer>
        <Script>{dummyData.student_data[0].script}</Script>
        <Translate
          placeholder="Textarea"
          value={transText}
          onChange={translateOnChange}
        ></Translate>
      </TextContainer>
      <BottomContainer>
        <IdInput
          placeholder="Enter your Id"
          value={id}
          onChange={inputOnChange}
        />
        <CSVLink data={data}>
          <StyledButton onClick={downloadOnClick}>Submit</StyledButton>
        </CSVLink>
      </BottomContainer>
    </>
  );
};

const Student = () => {
  return <Container>{MyTaskContainer()}</Container>;
};

export default Student;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 15px;
  box-shadow: 0 0 25px rgba(0, 0, 0, 0.25);
  width: 70%;
  height: 80%;
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
  height: 10%;
  padding: 1%;
  border-radius: 12px;
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
