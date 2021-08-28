import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Doughnut } from 'react-chartjs-2';
import {
  StyledChart,
  StyledContainer,
  TextContainer,
  FeedBackContainer,
  TextField,
  FeedBackList,
  FeedBackBox,
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
  const [chartValue, setChartValue] = useState([0, 0, 0, 0, 0, 0, 0, 0]);
  const [options, setOptions] = useState([]);
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
      setFeedBackList(myFeedBack.feedBack);
      console.log(feedBackList);
      let arr = feedBackList.map((a) => a.feedBack);
      const set = new Set(arr);
      setOptions([...set]);
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
  }, [myFeedBack]);

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
                  {console.log(el)}
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
      </Box>
    </StyledContainer>
  );
};

export default MyFeedBack;
