import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import CreatableSelect from 'react-select/creatable';
import Highlighter from 'react-highlight-words';
import { wrapper } from 'text-wrapper';
import dummyData from '../dummyData.js';
import { dbService, authService } from 'fbase.js';
import { Container, IdInput, StyledButton } from 'routes/Student.js';

function Translate({ match, history }) {
  const [inputText, setInputText] = useState('');
  const [studentScript, setstudentScript] = useState([]);
  const [num, setNum] = useState(0);
  const [originalScript, setOriginalScript] = useState([]);
  const [finalComment, setFinalComment] = useState('');
  const [value, setValue] = useState();
  const [selectedText, setSelectedText] = useState([
    {
      id: '',
      indexNum: '',
      text: '',
    },
  ]);
  const [feedBack, setFeedBack] = useState([
    {
      id: '',
      feedBack: '',
      comment: '',
      selectedText: '',
    },
  ]);
  const nextId = useRef(0);
  const FBId = useRef(1);
  const getScripts = async () => {
    const dbScript = await dbService.collection('student').get();
    const arr = [];
    for (const document of dbScript.docs) {
      arr.push({ ...document.data(), id: document.id });
    }
    let Arr = [];
    Arr = arr.filter((el) => el.scriptID === match.params.id);
    if (
      match.params.id === 'j3' ||
      match.params.id === 'j4' ||
      match.params.id === 'c2' ||
      match.params.id === 'c4'
    ) {
      Arr = Arr.reverse();
    }
    console.log(Arr);
    setstudentScript(Arr);
  };

  const IsStudentScriptEmpty = () => {
    if (studentScript.length === 0) {
      return 'loading';
    } else {
      return studentScript[num].translate_txt;
    }
  };

  const findScript = () => {
    setOriginalScript(
      dummyData.student_data.find((el) => el.id === match.params.id)
    );
  };

  const isOriginalScriptEmpty = () => {
    if (originalScript.length === 0) {
      return 'loading';
    } else {
      return originalScript.script;
    }
  };

  useEffect(() => {
    feedBack.splice(0, 1);
    getScripts();
    IsStudentScriptEmpty();
    findScript();
  }, []);

  const sendFeedBack = (e) => {
    if (value === undefined) {
      window.alert('카테고리를 선택해주세요.');
    } else {
      const FB = {
        id: FBId.current,
        feedBack: value.value,
        comment: inputText,
        selectedText: selectedText[nextId.current],
      };
      setFeedBack([...feedBack, FB]);
      FBId.current += 1;
      console.log(feedBack);
      setInputText('');
    }
  };

  const SelectBox = ({ data }) => {
    const [options, setOptions] = useState(data);

    const handleChange = useCallback((inputValue) => setValue(inputValue), []);

    const handleCreate = useCallback(
      (inputValue) => {
        const newValue = { value: inputValue.toLowerCase(), label: inputValue };
        setOptions([...options, newValue]);
        setValue(newValue);
      },
      [options]
    );

    return (
      <FeedBackSelect>
        <div className="App">
          <CreatableSelect
            isClearable
            value={value}
            options={options}
            onChange={handleChange}
            onCreateOption={handleCreate}
          />
        </div>
        <SelectedLabel>: {selectedText[nextId.current].text}</SelectedLabel>
      </FeedBackSelect>
    );
  };

  const InputLayout = () => {
    const onChange = (e) => {
      e.preventDefault();
      setInputText(e.target.value);
    };

    return (
      <InputContainer>
        <SelectBox data={dummyData.options} />
        <InputBox
          placeholder="Enter your feedback here"
          onChange={onChange}
          value={inputText}
        />
        <Button type="submit" onClick={sendFeedBack} style={{ width: 100 }}>
          Submit
        </Button>
      </InputContainer>
    );
  };

  const FeedBack = (id) => {
    const deleteElement = (id) => {
      setFeedBack(feedBack.filter((fb) => fb.id !== id));
      FBId.current -= 1;
    };

    return (
      <FeedBackContainer>
        <FeedBackList>
          {feedBack.map((el) => (
            <FeedBackBox key={el.id}>
              <div>
                {el.id} . {el.feedBack} : {el.comment}
              </div>
              <div>
                {el.selectedText.indexNum}번째 줄 : {el.selectedText.text}
              </div>
              <Button onClick={() => deleteElement(el.id)}>Delete</Button>
            </FeedBackBox>
          ))}
        </FeedBackList>
      </FeedBackContainer>
    );
  };

  const TextBox = () => {
    const [id, setId] = useState(0);
    const [indexNumber, setIndexNumber] = useState();
    const dragAndSelect = (e) => {
      console.log(studentScript);
      e.preventDefault();
      const sentence = window
        .getSelection()
        .toString()
        .replace(/(\r\n\t|\n|\r\t)/gm, '');
      setIndexNumber(
        parseInt((studentScript[num].translate_txt.indexOf(sentence) + 38) / 38)
      );

      console.log(sentence);

      const select = {
        id: nextId.current,
        indexNum: parseInt(
          (studentScript[num].translate_txt.indexOf(sentence) + 38) / 38
        ),
        text: window.getSelection().toString(),
      };
      console.log(studentScript[num].translate_txt.indexOf(sentence));
      setSelectedText([...selectedText, select]);
      nextId.current += 1;
      console.log(selectedText);
    };

    const originalDragAndSelect = (e) => {
      e.preventDefault();
      const sentence = window
        .getSelection()
        .toString()
        .replace(/(\r\n\t|\n|\r\t)/gm, '');
      setIndexNumber(
        parseInt((originalScript.script.indexOf(sentence) + 38) / 38)
      );

      const select = {
        id: nextId.current,
        indexNum: parseInt((originalScript.script.indexOf(sentence) + 38) / 38),
        text: window.getSelection().toString(),
      };
      console.log(originalScript.script.indexOf(sentence));
      setSelectedText([...selectedText, select]);
      nextId.current += 1;
      console.log(selectedText);
    };

    const WrappedBefore = wrapper(isOriginalScriptEmpty(), {
      wrapOn: 38,
      continuationIndent: '\n',
    });

    const WrappedAfter = wrapper(IsStudentScriptEmpty(), {
      wrapOn: 38,
      continuationIndent: '\n',
    });

    const plusId = () => {
      if (num === studentScript.length - 1) {
        alert('더 이상 뒤로 갈 수 없습니다.');
      } else {
        setNum(num + 1);
      }
    };

    const minusId = () => {
      if (num === 0) {
        alert('더 이상 앞으로 갈 수 없습니다.');
      } else {
        setNum(num - 1);
      }
    };

    return (
      <TextContainer>
        <ChangeButton onClick={minusId}>-</ChangeButton>
        <TextField onClick={originalDragAndSelect}>
          {WrappedBefore.split('\n').map((line) => {
            return (
              <span>
                {line}
                <br />
              </span>
            );
          })}
        </TextField>
        <TextField className="TranslateField" onClick={dragAndSelect}>
          {WrappedAfter.split('\n').map((line) => {
            return (
              <span>
                {line}
                <br />
              </span>
            );
          })}
        </TextField>
        <ChangeButton onClick={plusId}>+</ChangeButton>
      </TextContainer>
    );
  };

  const BottomContainer = () => {
    const [profId, setProfId] = useState('');
    const CommentOnChange = (e) => {
      e.preventDefault();
      setFinalComment(e.target.value);
    };

    const onSubmit = async () => {
      console.log('이거지정');
      await dbService.collection('test').add({
        student_ID: studentScript[0].studentID,
        script_ID: studentScript[0].scriptID,
        professor_name: profId,
        professor_ID: authService.currentUser.uid,
        feedBack: feedBack,
        general_critique: finalComment,
      });
      window.alert('과제 피드백이 정상적으로 처리되었습니다. ');
      history.goBack();
    };

    const inputOnChange = (e) => {
      setProfId(e.target.value);
    };

    return (
      <FinalCommentContainer>
        <div>총평</div>
        <FinalComment
          placeholder="총평을 적어주세요"
          onChange={CommentOnChange}
          value={finalComment}
        />
        <RowFlexBox>
          <StyledIdInput
            placeholder="Enter your Id"
            value={profId}
            onChange={inputOnChange}
          />
          <SubmitButton onClick={onSubmit}>제출하기</SubmitButton>
        </RowFlexBox>
      </FinalCommentContainer>
    );
  };

  return (
    <>
      <GlobalStyle />
      <StyledContainer>
        <Box>
          <TextBox />
          {InputLayout()}
          <FeedBack list={feedBack} />
          {BottomContainer()}
        </Box>
      </StyledContainer>
    </>
  );
}

export default React.memo(Translate);

const GlobalStyle = createGlobalStyle`
  body{
    overflow-y: scroll; 
    ::-webkit-scrollbar {
    display: none;
    } 
  }
  .css-2b097c-container {
    width: 170px;
    margin-top: 10px;
    margin-left: 10px;
    margin-bottom: 5px;
  }
`;

const Box = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
`;

const StyledContainer = styled(Container)`
  height: 80%;
  overflow-y: auto;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const TextContainer = styled.div`
  margin-top: 3%;
  height: 300px;
  width: 100%;
  top: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 20px;
`;

const InputContainer = styled.div`
  width: 100%;
  height: 300px;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  justify-content: center;
`;

const FeedBackContainer = styled.div`
  width: 100%;
  min-height: 300px;
  display: flex;
  align-items: center;
  background-color: #f9f9f9;
  border-radius: 25px;
  margin-bottom: 20px;
`;

const FinalCommentContainer = styled.div`
  margin-top: 20px;
  margin-bottom: 20px;
  width: 100%;
  min-height: 200px;
  /* height: 35%; */
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const FinalComment = styled.textarea`
  margin-top: 20px;
  border: none;
  border-radius: 25px;
  width: 98%;
  padding: 15px;
  min-height: 150px;
  background-color: #f6f6f6;
  :focus {
    outline: none;
  }
`;

const TextField = styled.div`
  width: 40%;
  height: 300px;
  border-radius: 15px;
  overflow-y: scroll;
  padding: 10px;
  background-color: #f9f9f9;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const FeedBackSelect = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;

const SelectedLabel = styled.div`
  margin-left: 10px;
`;

const InputBox = styled.input`
  margin-top: 10px;
  margin-bottom: 10px;
  padding: 8px;
  width: 99%;
  height: 100px;
  border-radius: 25px;
  border: none;
  background-color: #f3f3f3;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
  :focus {
    outline: none;
  }
`;

const Button = styled.button`
  padding-right: 15px;
  padding-left: 15px;
  padding-top: 10px;
  padding-bottom: 10px;
  border-radius: 15px;
  width: 100px;
  height: 30px;
  border: none;
  margin-bottom: 10px;
  margin-left: 10px;
  margin-top: 5px;
  background-color: grey;
  :hover {
    box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.07);
    border: none;
  }
  a:active {
    border: none;
  }
`;

const FeedBackList = styled.div`
  width: 40%;
  height: 95%;
  overflow-y: scroll;
  padding: 10px;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const FeedBackBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 10px;
`;

const ChangeButton = styled.button`
  width: 30px;
  height: 30px;
  border-radius: 100px;
  border: none;
  :focus {
    outline: none;
  }
`;

const StyledIdInput = styled(IdInput)`
  margin-top: 10px;
  margin-bottom: 10px;
`;

const RowFlexBox = styled.div`
  display: flex;
  align-items: center;
  height: 200px;
`;

const SubmitButton = styled(StyledButton)`
  background-color: #f6f6f6;
`;
