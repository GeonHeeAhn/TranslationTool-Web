import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import CreatableSelect from 'react-select/creatable';
import { wrapper } from 'text-wrapper';
import dummyData from '../dummyData.js';
import { dbService, authService } from 'fbase.js';
import { Container, IdInput, StyledButton } from 'routes/Student.js';
import { Doughnut } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import 'chartjs-plugin-labels';

const Chart = ({ options, chartValue }) => {
  // Doughnut.plugins.register(ChartDataLabels);
  let rankColor = [
    '#283A61',
    '#A3B8E6',
    '#5B86E0',
    '#454E61',
    '#4767AD',
    '#A8D0E6',
    '#2A4E61',
    '#4A8AAD',
    '#475861',
  ];
  let optionsArray = [];
  optionsArray = options.map((el) => el.label);
  const data = {
    labels: optionsArray,
    datasets: [
      {
        backgroundColor: rankColor,
        borderColor: rankColor,
        borderWidth: 1,
        hoverBackgroundColor: rankColor,
        hoverBorderColor: rankColor,
        data: chartValue,
      },
    ],
  };

  const graphOption = {
    legend: {
      display: false,
    },
    parsing: {
      key: 'data',
    },
    plugins: {
      legend: {
        display: true,
      },
      datalabels: {
        display: true,
        color: 'white',
        render: 'label',
      },
      labels: {
        fontSize: 11,
        fontColor: '#fff',
        position: 'default',
        render: 'label',
      },
    },
    animation: {
      duration: 0,
    },
    maintainAspectRatio: false,
    responsive: false,
  };

  return (
    <StyledChart
      data={data}
      width={300}
      height={300}
      options={graphOption}
      aspectRatio={1}
      // plugins={[ChartDataLabels]}
    />
  );
};

const BottomContainer = ({
  studentScript,
  profId,
  feedBack,
  finalComment,
  setFinalComment,
  setProfId,
  history,
}) => {
  const CommentOnChange = (e) => {
    e.preventDefault();
    setFinalComment(e.target.value);
  };

  const onSubmit = async () => {
    await dbService.collection('professor').add({
      // student_Name: studentScript[0].studentID,
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

const TextBox = ({
  studentScript,
  setIndexNumber,
  num,
  nextId,
  setSelectedText,
  selectedText,
  originalScript,
  setNum,
  isOriginalScriptEmpty,
  IsStudentScriptEmpty,
}) => {
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

const SelectBox = ({
  setValue,
  setOptions,
  options,
  value,
  nextId,
  selectedText,
}) => {
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

const FeedBack = ({
  id,
  setFeedBack,
  feedBack,
  FBId,
  options,
  chartValue,
  setChartValue,
}) => {
  const deleteElement = (id, comment) => {
    console.log(id, comment, chartValue, options, setChartValue);
    deleteChart(comment, chartValue, options, setChartValue);
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
              <Button
                onClick={() =>
                  deleteElement(
                    el.id,
                    el.feedBack,
                    chartValue,
                    options,
                    setChartValue
                  )
                }
              >
                Delete
              </Button>
            </div>
          </FeedBackBox>
        ))}
      </FeedBackList>
      <Chart options={options} chartValue={chartValue} />
    </FeedBackContainer>
  );
};

const StudentInfoBox = ({ IsStudentNameEmpty }) => {
  return <StudentName>제출자 : {IsStudentNameEmpty()}</StudentName>;
};

const deleteChart = (comment, chartValue, options, setChartValue) => {
  let arr = chartValue;
  const targetIdx = options.findIndex((item) => {
    return item.label === comment;
  });
  arr[targetIdx] -= 1;
  setChartValue(arr);
};

function Translate({ match, history }) {
  const [inputText, setInputText] = useState('');
  const [studentScript, setstudentScript] = useState([]);
  const [num, setNum] = useState(0);
  const [profId, setProfId] = useState('');
  const [indexNumber, setIndexNumber] = useState();
  const [originalScript, setOriginalScript] = useState([]);
  const [finalComment, setFinalComment] = useState('');
  const [value, setValue] = useState();
  const [options, setOptions] = useState(dummyData.options);
  const [chartValue, setChartValue] = useState([0, 0, 0, 0, 0, 0, 0, 0]);
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

  const IsStudentNameEmpty = () => {
    if (studentScript.length === 0) {
      return 'loading';
    } else {
      return studentScript[num].studentID;
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
    IsStudentNameEmpty();
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
      console.log(value.value);
      FBId.current += 1;
      console.log(feedBack);
      updateChart(value.value);
      setInputText('');
    }
  };

  const updateChart = (value1) => {
    let arr = chartValue;
    const targetIdx = options.findIndex((item) => {
      return item.label === value1;
    });
    if (targetIdx <= 7) {
      arr[targetIdx] += 1;
    } else {
      if (arr.length > targetIdx) {
        arr[targetIdx] += 1;
      } else {
        arr.push(1);
      }
    }
    setChartValue(arr);
  };

  const InputLayout = () => {
    const onChange = (e) => {
      e.preventDefault();
      setInputText(e.target.value);
    };

    return (
      <InputContainer>
        <SelectBox
          setValue={setValue}
          setOptions={setOptions}
          options={options}
          value={value}
          nextId={nextId}
          selectedText={selectedText}
        />
        <UnderLabel>
          새로운 항목을 원하실 경우, 위 항목선택박스에 항목이름을 직접 입력한
          뒤, 엔터를 눌러주세요.
        </UnderLabel>
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

  return (
    <>
      <GlobalStyle />
      <StyledContainer>
        <Box>
          <StudentInfoBox IsStudentNameEmpty={IsStudentNameEmpty} />
          <TextBox
            studentScript={studentScript}
            setIndexNumber={setIndexNumber}
            num={num}
            nextId={nextId}
            setSelectedText={setSelectedText}
            selectedText={selectedText}
            originalScript={originalScript}
            setNum={setNum}
            isOriginalScriptEmpty={isOriginalScriptEmpty}
            IsStudentScriptEmpty={IsStudentScriptEmpty}
          />
          {InputLayout()}
          <FeedBack
            list={feedBack}
            setFeedBack={setFeedBack}
            feedBack={feedBack}
            FBId={FBId}
            options={options}
            chartValue={chartValue}
            setChartValue={setChartValue}
          />
          {BottomContainer({
            studentScript,
            profId,
            feedBack,
            finalComment,
            setFinalComment,
            setProfId,
            history,
          })}
        </Box>
      </StyledContainer>
    </>
  );
}

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

const StyledChart = styled(Doughnut)`
  width: 400px;
  height: 400px;
  margin-right: 150px;
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
  justify-content: space-between;
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
  width: 50%;
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

const StudentName = styled.div`
  padding: 5px;
  text-align: center;
`;

const UnderLabel = styled.div`
  text-align: left;
  margin: 10px;
  font-size: 8px;
`;

export {
  Translate,
  StyledChart,
  StyledContainer,
  TextContainer,
  FeedBackContainer,
  TextField,
  FeedBackList,
  FeedBackBox,
  Box,
};
