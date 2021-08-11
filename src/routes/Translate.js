import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import CreatableSelect from 'react-select/creatable';
import Highlighter from 'react-highlight-words';
import { wrapper } from 'text-wrapper';
import dummyData from '../dummyData.js';
import { dbService } from 'fbase.js';

function Translate({ match }) {
  const [inputText, setInputText] = useState('');
  const [studentScript, setstudentScript] = useState([]);
  const [selected, setSelected] = useState('내용 오역');
  const [isToggled, setIsToggled] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [num, setNum] = useState(0);
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
    console.log(Arr);
    console.log(arr);
    setstudentScript(Arr);
  };

  const isStudentScriptEmpty = () => {
    if (studentScript.length === 0) {
      return 'none';
    } else {
      return studentScript[num].translate_txt;
    }
  };

  useEffect(() => {
    feedBack.splice(0, 1);
    getScripts();
    isStudentScriptEmpty();
  }, []);

  const sendFeedBack = () => {
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
      // FBId.current -= 1;
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
        parseInt((studentScript[num].translate_txt.indexOf(sentence) + 45) / 45)
      );

      console.log(sentence);

      const select = {
        id: nextId.current,
        indexNum: parseInt(
          (studentScript[num].translate_txt.indexOf(sentence) + 45) / 45
        ),
        text: window.getSelection().toString(),
      };
      console.log(studentScript[num].translate_txt.indexOf(sentence));
      setSelectedText([...selectedText, select]);
      nextId.current += 1;
      console.log(selectedText);
    };

    const WrappedBefore = wrapper(dummyData.translate_data[id].output_data, {
      wrapOn: 45,
      continuationIndent: '\n',
    });

    const WrappedAfter = wrapper(isStudentScriptEmpty(), {
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
        <TextField>
          {/* {inputTxt()} */}
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
          {/* <Highlighter
            highlightClassName="TranslateField"
            searchWords={[selectedText[nextId.current].text]}
            autoEscape={true}
            textToHighlight={dummyData.translate_data[id].output_data}
          /> */}
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

  return (
    <Container>
      <GlobalStyle />
      <TextBox />
      {InputLayout()}
      <FeedBack list={feedBack} />
    </Container>
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

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
  margin: 15px;
`;

const TextContainer = styled.div`
  width: 1500px;
  height: 600px;
  display: flex;
  border: 1px solid grey;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 20px;
`;

const InputContainer = styled.div`
  width: 1500px;
  height: 500px;
  border: 1px solid grey;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  justify-content: center;
`;

const FeedBackContainer = styled.div`
  width: 1500px;
  height: 250px;
  border: 1px solid grey;
  display: flex;
  align-items: center;
`;

const TextField = styled.div`
  width: 40%;
  height: 300px;
  border-radius: 15px;
  overflow-y: scroll;
  padding: 10px;
  border: 1px solid grey;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const FeedBackSelect = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;

const ToggleInputContainer = styled.div`
  display: flex;
  width: 500px;
  height: 100px;
  display: ${(props) => (props.isToggled ? 'inherit' : 'none')};
  justify-content: space-between;
  align-items: center;
`;

const SelectList = styled.select`
  width: 170px;
  margin-top: 10px;
  margin-left: 10px;
  margin-bottom: 5px;
  padding: 10px;
  border-radius: 15px;
  :focus {
    outline: none;
  }
`;

const SelectedLabel = styled.div`
  margin-left: 10px;
`;

const InputBox = styled.input`
  margin: 10px;
  width: 1400px;
  height: 100px;
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
  width: auto;
  height: 30px;
  border: none;
  margin-bottom: 10px;
  margin-left: 10px;
  margin-top: 5px;
  background-color: grey;
  :hover {
    border: none;
  }
  a:active {
    border: none;
  }
`;

const FeedBackList = styled.div`
  width: 40%;
  height: 200px;
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
  /* align-items: center; */
`;

const SelectInput = styled.input`
  width: 300px;
  height: 50px;
  margin: 10px;
  border-radius: 8px;
  border: 1px solid grey;
  display: inherit;
  :focus {
    outline: none;
  }
`;

const ChangeButton = styled.button`
  width: 30px;
  height: 30px;
  border-radius: 100px;
  border: 1px solid grey;
  :focus {
    outline: none;
  }
`;
