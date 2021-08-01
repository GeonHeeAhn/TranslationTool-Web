import React, { useState, useRef, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import Highlighter from 'react-highlight-words';
import { useHistory } from 'react-router';
import { authService } from '../fbase';
import { Doughnut } from 'react-chartjs-2';

const dummyData = {
  options: [
    { value: '내용 오역', label: '내용 오역' },
    { value: '불필요한 첨가', label: '불필요한 첨가' },
    { value: '문제 부적합', label: '문제 부적합' },
    { value: '직접 입력', label: '직접 입력' },
  ],
  translate_data: [
    {
      id: 0,
      input_data:
        'As part of the U.S.-China E-Language Project the Department of Education developed e-language learning scripts that could be used to drive online gaming applications to teach Chinese students English and American culture. The department released the scripts into the public domain in support of those in the field who can gain from this research and development effort in language learning using technology. As with all other public domain content, approval from the Department is not required by anyone to use these materials or create derivative products based on these materials. Please also note that the Department would not be a position to certify, endorse, or approve any learning products that incorporate the scripts or are inspired by the scripts.',
      output_data:
        '연령 추정 알고리즘은 계층적 접근 방식을 실현합니다(그림 10). 첫째, 입력 조각은 18세 미만, 18-45세, 45세 이상의 세 연령 그룹으로 나누어 집니다. 둘째, 이 단계의 결과는 각각 10년 단위로 제한되는 7개의 작은 그룹으로 세분화됩니다. 따라서, 다중 클래스 분류 문제는 “일대다” 이진 분류자 집합으로 감소합니다. 따라서 이 분류자는 관련 클래스를 기반으로 이미지의 순위를 매기고, 이러한 순위 히스토그램을 분석하여 최종 결정을 내립니다. 이 BC들은 2단계 접근 방식을 사용하여 구성됩니다. 앞에서 설명한 대로 이미지는 적응형 특징 공간으로 처음 전환한 후 RBF 커널이 있는 지원 벡터 머신을 통해 분류됩니다. 입력 조각은 밝기 특성이 균일한 척도로 정렬되고 변환되도록 사전 처리됩니다. 이 사전 처리 단계에는 색상 공간 변환 및 스케일링이 포함되며, 두 작업 모두 성별 인식 알고리즘에 사용된 과정과 유사합니다. 특징은 각 색상 구성 요소에 대해 계산되고 결합되어 균일한 특징 벡터를 형성합니다.',
    },
    {
      id: 1,
      input_data:
        'The location, the opening credits tell us, is “Somewhere in Northern Italy.” Such vagueness is deliberate: the point of a paradise is that it could exist anywhere but that, once you reach the place, it brims with details so precise in their intensity that you never forget them. Thus it is that a young American named Oliver (Armie Hammer) arrives, dopey with jet lag, at the house of Professor Perlman (Michael Stuhlbarg) and his Italian wife, Annella (Amira Casar), whose custom is to spend their summers there and also to return for Hanukkah. (Like them, Oliver is Jewish; a closeup shows a Star of David hanging from a chain around his neck.) The Professor, an American expert in classical archeology, requires an annual assistant, and Oliver is this year’s choice. “We’ll have to put up with him for six long weeks,” Annella says, with a sigh. Not long enough, as it turns out. You can pack a whole lifetime into six weeks.',
      output_data:
        '오프닝 크레딧이 말해주는 장소는 "북이탈리아의 어딘가"입니다. 그러한 모호함은 의도적이다. 낙원의 요점은 낙원이 어디에든 존재할 수 있다는 것이다. 낙원은 일단 그곳에 도달하면 그 강렬함이 너무 정밀해서 절대 잊지 못할 정도로 그 세밀함이 넘쳐난다. 그래서 올리버라는 젊은 미국인이 펄만 교수와 그의 이탈리아인 아내인 안넬라(아미라 카사르)의 집에 도착해 시차 적응증을 앓고 있다. 그의 목에.) 미국의 고전 고고학 전문가인 교수는 연간 조수가 필요한데, 올리버가 올해의 선택이다. 안넬라는 한숨을 쉬며 "우리는 6주 동안 그를 참아야 할 것입니다."라고 말한다. 알고 보니 오래 걸리지 않았다. 당신은 평생을 6주로 포장할 수 있습니다.',
    },
    {
      id: 2,
      input_data:
        '"As Long as You Love Me" is a song by Canadian singer Justin Bieber, from his third studio album, Believe (2012). The track features American rapper Big Sean. It was written by Eric H, and was produced by Rodney "Darkchild" Jerkins and Andre Lindal. It was first released on July 10, 2012, as a promotional single from the album, and one month later it was released as the albums second single. The song has since charted in the United Kingdom, first at number thirty as a promotional single with first-week sales of 11,598, and then after being released as a single it improved its position on the UK Singles Chart, reaching number 22.[3] On Billboards Rhythmic Airplay Chart, the single reached number one, giving Bieber his first number one single on an American airplay music chart.[4] It peaked at number six on the Billboard Hot 100. It also reached the number one position on Billboards Dance/Mix Show Airplay chart, making Bieber the fifth Canadian artist to reach that position after Martin Solveig featuring Dragonettes "Hello" in 2011.[5] The song has sold 2,240,000 copies in the US as December 2012.[6] The music video features actor Michael Madsen.',
      output_data:
        '"Long as You Love Me"는 캐나다 가수 저스틴 비버의 세 번째 정규 앨범인 Believe (2012)에 수록된 곡이다. 이 트랙에는 미국인 래퍼 빅 숀이 등장한다. 에릭 H가 썼고 로드니 "다크차일드" 저킨스와 안드레 린달이 제작했다. 이 앨범은 2012년 7월 10일에 홍보용 싱글로 처음 발매되었고, 한 달 후에 앨범의 두 번째 싱글로 발매되었다. 이후 영국에서 차트 1위를 차지했으며, 첫 주 판매량 11,598장의 프로모션 싱글로 처음 30위에 올랐고, 싱글로 발매된 후 영국 싱글 차트에서 22위에 오르며 입지를 강화했다. 빌보드의 리듬 에어플레이 차트에서, 이 싱글은 비버에게 미국 공중파 음악 차트에서 첫 번째 싱글 1위를 안겨주었다. 빌보드 핫 100에서 6위로 정점을 찍었다. 빌보드의 댄스/믹스 쇼 에어플레이 차트에서도 1위에 올랐으며, 비버는 2011년 드라게트의 "Hello"를 피처링한 마틴 솔빅에 이어 다섯 번째 캐나다 아티스트가 되었다. 이 곡은 2012년 12월 미국에서 224만 장이 팔렸다. 뮤직비디오에는 배우 마이클 매드슨이 등장한다.',
    },
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
              <Button onClick={() => deleteElement(el.id)}>Delete</Button>
            </FeedBackBox>
          ))}
        </FeedBackList>
        {/* <Doughnut data={data} /> */}
      </FeedBackContainer>
    );
  };

  const TextBox = () => {
    const [id, setId] = useState(0);

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
        {console.log(id)}
        <TextField>{dummyData.translate_data[id].input_data}</TextField>
        <TextField className="TranslateField" onClick={dragAndSelect}>
          <Highlighter
            // activeIndex={(selectedText.indexStart, selectedText.indexEnd)}
            highlightClassName="TranslateField"
            searchWords={[selectedText[nextId.current].text]}
            autoEscape={true}
            textToHighlight={dummyData.translate_data[id].output_data}
          />
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
      <Button onClick={onLogOutClick}>press here to logout</Button>
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

const ChangeButton = styled.button`
  width: 30px;
  height: 30px;
  border-radius: 100px;
  border: 1px solid grey;
  :focus {
    outline: none;
  }
`;
