import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  StyledChart,
  StyledContainer,
  TextContainer,
  FeedBackContainer,
  TextField,
  FeedBackList,
  FeedBackBox,
  FinalComment,
  Box,
} from 'routes/Translate.js';
import { dbService } from 'fbase.js';
import dummyData from 'dummyData.js';
import { wrapper } from 'text-wrapper';

const Chart = ({ options, chartValue }) => {
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
  const data = {
    labels: options,
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
    pieceLabel: {
      mode: 'label',
      position: 'default',
      fontSize: '11',
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
    />
  );
};

const MyFeedBack = ({ match, myName, history }) => {
  const [myScript, setMyScript] = useState('loading');
  const [myFeedBack, setMyFeedBack] = useState([]);
  const [originalScript, setOriginalScript] = useState();
  const [feedBackList, setFeedBackList] = useState([]);
  const [wrappedOriginalScript, setWrappedOriginalScript] = useState('loading');
  const [wrappedTranslatedScript, setWrappedTranslatedScript] =
    useState('loading');
  const [chartValue, setChartValue] = useState([]);
  const [options, setOptions] = useState([]);
  const [critique, setCritique] = useState('loading');
  // const translatedTask = myTask.find((el) => el.scriptID === match.params.id);
  //   const getYourFeedBack = async () => {
  //     const script = await dbService.collection('studentTest').get();
  //     const arr = [];
  //     for (const document of script.docs) {
  //       arr.push(document.data());
  //     }
  //     let Arr = [];
  //     Arr = arr.filter((el) => el.student_ID === authService.currentUser.uid);
  //     if (Arr.length === 0) {
  //       Arr.push({
  //         scriptID: '작성한 과제가 없습니다.',
  //       });
  //     }
  //     console.log(Arr);
  //     setMyTask(Arr);
  //   };

  const getMyFeedBack = async () => {
    const arr = [];
    const dbScript = await dbService.collection('professor').get();
    for (const document of dbScript.docs) {
      arr.push(document.data());
    }
    const Arr = arr.filter((el) => el.script_ID === match.params.id);
    const fb = Arr.find((el) => el.student_ID === myName);
    setMyFeedBack(fb);
    if (fb === undefined) {
      window.alert('해당 과제에 대한 피드백이 존재하지 않습니다. ');
      history.goBack();
    }
  };

  const isFeedBackEmpty = () => {
    if (!myFeedBack) {
      return 'loading';
    } else {
      setCritique(myFeedBack.general_critique);
      setFeedBackList(myFeedBack.feedBack);
      if (myFeedBack.feedBack) {
        let arr = myFeedBack.feedBack.map((a) => a.feedBack);
        const set = arr.filter((element, index) => {
          return arr.indexOf(element) === index;
        });
        setOptions(set);
        let Array = [];
        for (let i = 0; i < set.length; i++) {
          Array[i] = 0;
        }
        for (let i = 0; i < arr.length; i++) {
          for (let j = 0; j < set.length; j++) {
            if (arr[i] === set[j]) {
              Array[j]++;
              break;
            }
          }
        }
        setChartValue(Array);
      }
    }
  };

  const getMyScript = async () => {
    const dbScript = await dbService.collection('student').get();
    const arr = [];
    for (const document of dbScript.docs) {
      arr.push(document.data());
    }
    const Arr = arr.filter((el) => el.scriptID === match.params.id);
    const myTask = Arr.find((el) => el.studentID === myName);
    setMyScript(myTask.translate_txt);
  };

  const isMyScriptEmpty = () => {
    if (!myScript) {
      return 'loading';
    } else {
      setWrappedTranslatedScript(
        wrapper(myScript, {
          wrapOn: 38,
          continuationIndent: '\n',
        })
      );
    }
  };

  const findScript = () => {
    setOriginalScript(
      dummyData.student_data.find((el) => el.id === match.params.id).script
    );
  };

  const isOriginalScriptEmpty = () => {
    if (!originalScript) {
      return 'loading';
    } else {
      setWrappedOriginalScript(
        wrapper(originalScript, {
          wrapOn: 38,
          continuationIndent: '\n',
        })
      );
    }
  };

  useEffect(() => {
    getMyScript();
    getMyFeedBack();
    findScript();
  }, []);

  useEffect(() => {
    isMyScriptEmpty();
  }, [myScript]);

  useEffect(() => {
    isFeedBackEmpty();
  }, [myFeedBack, critique]);

  useEffect(() => {
    isOriginalScriptEmpty();
  }, [originalScript]);

  return (
    <StyledContainer>
      <Box>
        <TextContainer>
          <TextField>
            {wrappedOriginalScript.split('\n').map((line) => {
              return (
                <span>
                  {line}
                  <br />
                </span>
              );
            })}
          </TextField>
          <TextField>
            {wrappedTranslatedScript.split('\n').map((line) => {
              return (
                <span>
                  {line}
                  <br />
                </span>
              );
            })}
          </TextField>
        </TextContainer>
        <FeedBackContainer style={{ marginTop: '15px' }}>
          <FeedBackList>
            {feedBackList &&
              feedBackList.map((el) => (
                <FeedBackBox key={el.id}>
                  <div>
                    {el.id} . {el.feedBack} : {el.comment}
                  </div>
                  <div>
                    {el.selectedText.indexNum}번째 줄 : {el.selectedText.text}
                  </div>
                </FeedBackBox>
              ))}
          </FeedBackList>
          <Chart options={options} chartValue={chartValue} />
        </FeedBackContainer>
        <Label>총평</Label>
        <CritiqueContainer>{critique}</CritiqueContainer>
      </Box>
    </StyledContainer>
  );
};

export default MyFeedBack;

const Label = styled.div`
  width: 100%;
  line-height: 40px;
  margin-top: 15px;
  margin-left: 10px;
`;

const CritiqueContainer = styled.div`
  margin-bottom: 20px;
  border: none;
  border-radius: 25px;
  width: 98%;
  padding: 15px;
  min-height: 80px;
  background-color: #f6f6f6;
`;
