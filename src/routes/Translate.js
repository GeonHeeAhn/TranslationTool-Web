import React, { useState, useRef, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import Highlighter from 'react-highlight-words';
import { wrapper } from 'text-wrapper';
import dummyData from '../dummyData.js';

function Translate() {
  const [inputText, setInputText] = useState('');
  const [selected, setSelected] = useState('내용 오역');
  const [isToggled, setIsToggled] = useState(false);
  const [inputValue, setInputValue] = useState('');
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

  useEffect(() => {
    feedBack.splice(0, 1);
    // selectedText.splice(0, 1);
  }, []);

  const sendFeedBack = () => {
    const FB = {
      id: FBId.current,
      feedBack: selected,
      comment: inputText,
      // selectedText: selectedText[nextId.current].text,
      selectedText: selectedText[nextId.current],
    };
    setFeedBack([...feedBack, FB]);
    FBId.current += 1;
    console.log(feedBack);
    setInputText('');
  };

  const SelectBox = (props) => {
    const handleChange = (e) => {
      e.preventDefault();
      setSelected(e.target.value);
      console.log(selected);
      if (e.target.value === '직접 입력') {
        setIsToggled(true);
      } else {
        setIsToggled(false);
      }
    };

    return (
      <FeedBackSelect>
        <SelectList onChange={handleChange}>
          {props.data.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </SelectList>
        <SelectedLabel>: {selectedText[nextId.current].text}</SelectedLabel>
      </FeedBackSelect>
    );
  };

  const SelectCT = (props) => {
    const inputOnChange = (e) => {
      e.preventDefault();
      setInputValue(e.target.value);
    };

    const doneOnClick = () => {
      setSelected(inputValue);
      setIsToggled(false);
      console.log(selected);
      setInputValue('');
    };

    return (
      <>
        <SelectBox data={dummyData.options} value={selected} />
        <ToggleInputContainer isToggled={isToggled}>
          <SelectInput value={inputValue} onChange={inputOnChange} />
          <Button type="submit" onClick={doneOnClick}>
            Done
          </Button>
        </ToggleInputContainer>
      </>
    );
  };

  const Input = () => {
    const onChange = (e) => {
      e.preventDefault();
      setInputText(e.target.value);
    };

    return (
      <InputContainer>
        {SelectCT()}
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
            <FeedBackBox>
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
    const [stringToFind, setStringToFind] = useState('');
    const [indexNumber, setIndexNumber] = useState();
    const dragAndSelect = (e) => {
      e.preventDefault();
      const sentence = window.getSelection().toString();
      setIndexNumber(
        parseInt(
          (dummyData.translate_data[id].output_data.indexOf(sentence) + 45) / 45
        )
      );
      const select = {
        id: nextId.current,
        indexNum: parseInt(
          (dummyData.translate_data[id].output_data.indexOf(sentence) + 45) / 45
        ),
        text: window.getSelection().toString(),
      };
      console.log(dummyData.translate_data[id].output_data.indexOf(sentence));
      setSelectedText([...selectedText, select]);
      nextId.current += 1;
      console.log(selectedText);
    };

    const WrappedBefore = wrapper(dummyData.translate_data[id].input_data, {
      wrapOn: 80,
      continuationIndent: '\n',
    });

    const WrappedAfter = wrapper(dummyData.translate_data[id].output_data, {
      wrapOn: 45,
      continuationIndent: '\n',
    });

    const plusId = () => {
      if (id === dummyData.translate_data.length - 1) {
        alert('더 이상 뒤로 갈 수 없습니다.');
      } else {
        setId(id + 1);
      }
    };

    const minusId = () => {
      if (id === 0) {
        alert('더 이상 앞으로 갈 수 없습니다.');
      } else {
        setId(id - 1);
      }
    };

    return (
      <TextContainer>
        <ChangeButton onClick={minusId}>-</ChangeButton>
        <TextField>
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
      {Input()}
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
