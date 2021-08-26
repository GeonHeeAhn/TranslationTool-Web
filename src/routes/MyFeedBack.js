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

const MyFeedBack = ({ match, myName, history }) => {
  const [myScript, setMyScript] = useState('loading');
  const [myFeedBack, setMyFeedBack] = useState([]);
  const [originalScript, setOriginalScript] = useState();
  const [feedBackList, setFeedBackList] = useState([]);
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
    console.log(fb);
    if (fb === undefined) {
      window.alert('해당 과제에 대한 피드백이 존재하지 않습니다. ');
      history.goBack();
    }
  };

  const isFeedBackEmpty = () => {
    if (!myFeedBack) {
      return 'loading';
    } else {
      console.log(myFeedBack);
      setFeedBackList(myFeedBack.feedBack);
      console.log(feedBackList);
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

  const findScript = () => {
    setOriginalScript(
      dummyData.student_data.find((el) => el.id === match.params.id).script
    );
  };

  // const isMyScriptEmpty = () => {
  //   if (studentScript.length === 0) {
  //     return 'loading';
  //   } else {
  //     return studentScript[num].translate_txt;
  //   }
  // };

  useEffect(() => {
    getMyScript();
    getMyFeedBack();
    isFeedBackEmpty();
    findScript();
  }, []);

  useEffect(() => {
    isFeedBackEmpty();
  }, [myFeedBack]);

  return (
    <StyledContainer>
      <Box>
        <TextContainer>
          <TextField>{originalScript}</TextField>
          <TextField>{myScript}</TextField>
        </TextContainer>
        <FeedBackContainer>
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
        </FeedBackContainer>
      </Box>
    </StyledContainer>
  );
};

export default MyFeedBack;
