import React, { useState, useRef, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import Highlighter from 'react-highlight-words';
import { useHistory } from 'react-router';
import { authService } from '../fbase';

const dummyData = {
  input_data:
    'As part of the U.S.-China E-Language Project the Department of Education developed e-language learning scripts that could be used to drive online gaming applications to teach Chinese students English and American culture. The department released the scripts into the public domain in support of those in the field who can gain from this research and development effort in language learning using technology. As with all other public domain content, approval from the Department is not required by anyone to use these materials or create derivative products based on these materials. Please also note that the Department would not be a position to certify, endorse, or approve any learning products that incorporate the scripts or are inspired by the scripts.',
  output_data:
    '연령 추정 알고리즘은 계층적 접근 방식을 실현합니다(그림 10). 첫째, 입력 조각은 18세 미만, 18-45세, 45세 이상의 세 연령 그룹으로 나누어 집니다. 둘째, 이 단계의 결과는 각각 10년 단위로 제한되는 7개의 작은 그룹으로 세분화됩니다. 따라서, 다중 클래스 분류 문제는 “일대다” 이진 분류자 집합으로 감소합니다. 따라서 이 분류자는 관련 클래스를 기반으로 이미지의 순위를 매기고, 이러한 순위 히스토그램을 분석하여 최종 결정을 내립니다. 이 BC들은 2단계 접근 방식을 사용하여 구성됩니다. 앞에서 설명한 대로 이미지는 적응형 특징 공간으로 처음 전환한 후 RBF 커널이 있는 지원 벡터 머신을 통해 분류됩니다. 입력 조각은 밝기 특성이 균일한 척도로 정렬되고 변환되도록 사전 처리됩니다. 이 사전 처리 단계에는 색상 공간 변환 및 스케일링이 포함되며, 두 작업 모두 성별 인식 알고리즘에 사용된 과정과 유사합니다. 특징은 각 색상 구성 요소에 대해 계산되고 결합되어 균일한 특징 벡터를 형성합니다.',
  options: [
    { value: '내용 오역', label: '내용 오역' },
    { value: '불필요한 첨가', label: '불필요한 첨가' },
    { value: '문제 부적합', label: '문제 부적합' },
    { value: '직접 입력', label: '직접 입력' },
  ],
};

function Translate() {
  const [inputText, setInputText] = useState('');
  const [selected, setSelected] = useState('내용 오역');
  const [isToggled, setIsToggled] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectedText, setSelectedText] = useState([
    {
      id: '',
      indexStart: '',
      indexEnd: '',
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
  const history = useHistory();
  const nextId = useRef(0);
  const FBId = useRef(1);

  useEffect(() => {
    feedBack.splice(0, 1);
    // selectedText.splice(0, 1);
  }, []);

  const onLogOutClick = () => {
    authService.signOut();
    history.push('/');
  };
  const dragAndSelect = (e) => {
    e.preventDefault();
    const select = {
      id: nextId.current,
      indexStart: window.getSelection().anchorOffset,
      indexEnd: window.getSelection().focusOffset,
      text: window.getSelection().toString(),
    };
    setSelectedText([...selectedText, select]);
    nextId.current += 1;
    console.log(selectedText);
  };

  const sendFeedBack = () => {
    const FB = {
      id: FBId.current,
      feedBack: selected,
      comment: inputText,
      selectedText: selectedText[nextId.current].text,
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
        <Button type="submit" onClick={sendFeedBack}>
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
              <Button onClick={() => deleteElement(el.id)}>Delete</Button>
            </FeedBackBox>
          ))}
        </FeedBackList>
        <Button onClick={onLogOutClick}>press here to logout</Button>
      </FeedBackContainer>
    );
  };

  return (
    <Container>
      <GlobalStyle />
      <TextContainer>
        <TextField>{dummyData.input_data}</TextField>
        <TextField className="TranslateField" onClick={dragAndSelect}>
          <Highlighter
            highlightClassName="TranslateField"
            searchWords={[selectedText[nextId.current].text]}
            autoEscape={true}
            textToHighlight={dummyData.output_data}
          />
        </TextField>
      </TextContainer>
      {Input()}
      <FeedBack list={feedBack} />
    </Container>
  );
}

export default Translate;

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
  height: 500px;
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
  padding: 5px;
  border-radius: 15px;
  width: 100px;
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
  flex-direction: row;
  justify-content: space-between;
  margin: 10px;
  align-items: center;
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
