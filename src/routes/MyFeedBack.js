import React from 'react';
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

const MyFeedBack = ({ match, myTask }) => {
  const translatedTask = myTask.find((el) => el.scriptID === match.params.id);
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
  return (
    <StyledContainer>
      <Box>
        <TextContainer>
          <TextField></TextField>
          <TextField>{translatedTask.translate_txt}</TextField>
        </TextContainer>
        <FeedBackContainer>
          <FeedBackList></FeedBackList>
          <StyledChart></StyledChart>
        </FeedBackContainer>
      </Box>
    </StyledContainer>
  );
};

export default MyFeedBack;
