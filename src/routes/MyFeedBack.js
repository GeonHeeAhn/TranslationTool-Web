import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import {
  StyledChart,
  StyledContainer,
  TextContainer,
  FeedBackContainer,
  TextField,
  FeedBackList,
  FeedBackBox,
  ChangeButton,
  Box,
  InputContainer,
  SelectBox,
  UnderLabel,
  InputBox,
  Button,
} from 'routes/Translate.js';
import { dbService, authService } from 'fbase.js';
import dummyData from 'dummyData.js';
import { wrapper } from 'text-wrapper';
import { SpaceContext } from 'antd/lib/space';
import { Student } from 'routes/Student.js';
import { Route, Link } from 'react-router-dom';
import { Translate } from 'routes/Translate';

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

const StudentVersion = ({ match, myName, history, myTask, myScriptList }) => {
  const [myScript, setMyScript] = useState('loading');
  const [originalScript, setOriginalScript] = useState();
  const [feedBackList, setFeedBackList] = useState([]);
  const [wrappedOriginalScript, setWrappedOriginalScript] = useState('loading');
  const [wrappedTranslatedScript, setWrappedTranslatedScript] =
    useState('loading');
  const [chartValue, setChartValue] = useState([]);
  const [options, setOptions] = useState([]);
  const [critique, setCritique] = useState('loading');
  const [indexNum, setIndexNum] = useState(0);
  const [translatedTask, setTranslatedTask] = useState([]);
  const [whichCase, setWhichCase] = useState(0);
  const [changedTask, setChangedTask] = useState(wrappedTranslatedScript);
  const [DocID, setDocID] = useState();
  let translated = [];
  let scriptList = [];
  let i = 1;
  let j = 1;

  const isMyTaskEmpty = () => {
    translated = myTask.filter((el) => el.script_ID === match.params.id);
    setTranslatedTask(translated);
    console.log('translated', translated);
    console.log('length', translatedTask.length);
    if (translated.length === 0) {
      sortingFunction();
    }
  };

  const sortingFunction = () => {
    if (scriptList === undefined) {
      setWhichCase(2);
    } else {
      setWhichCase(1);
      const dummy = [{ feedBack: [], general_critique: '' }];
      setTranslatedTask(dummy);
    }
  };

  const getMyScript = () => {
    scriptList = myScriptList.find((el) => el.scriptID === match.params.id);
    if (scriptList === undefined) {
      sortingFunction();
    } else {
      setDocID(scriptList.docID);
      setMyScript(scriptList.translate_txt);
    }
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

  const isFeedBackEmpty = () => {
    if (translatedTask.length === 0) {
      return 'loading';
    } else {
      setCritique(translatedTask[indexNum].general_critique);
      setFeedBackList(translatedTask[indexNum].feedBack);
      if (translatedTask[indexNum].feedBack) {
        let arr = translatedTask[indexNum].feedBack.map((a) => a.feedBack);
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
    // sortingFunction();
    isMyTaskEmpty();
    findScript();
  }, []);

  useEffect(() => {
    isMyScriptEmpty();
    changeValue();
  }, [myScript]);

  useEffect(() => {
    isFeedBackEmpty();
  }, [critique, indexNum, translatedTask]);

  useEffect(() => {
    isOriginalScriptEmpty();
  }, [originalScript]);

  const plusId = () => {
    if (indexNum === translatedTask.length - 1) {
      alert('더 이상 뒤로 갈 수 없습니다.');
    } else {
      setIndexNum(indexNum + 1);
    }
  };

  const minusId = () => {
    if (indexNum === 0) {
      alert('더 이상 앞으로 갈 수 없습니다.');
    } else {
      setIndexNum(indexNum - 1);
    }
  };
  const changeValue = () => {
    setChangedTask(myScript);
  };

  const handleChange = (e) => {
    e.preventDefault();
    setChangedTask(e.target.value);
  };

  const taskUpdate = () => {
    if (!DocID) {
      window.alert('loading');
    } else {
      dbService.collection('student').doc(DocID).update({
        translate_txt: changedTask,
      });
      window.alert('수정완료');
    }
  };

  const changeBody = () => {
    if (whichCase === 0) {
      return (
        <Box>
          <TextContainer>
            <ChangeButton onClick={minusId}>-</ChangeButton>
            <TextField>
              {wrappedOriginalScript.split('\n').map((line) => {
                return (
                  <>
                    {line !== '' ? (
                      <span>
                        {i++} : {line}
                        <br />
                      </span>
                    ) : (
                      <span>
                        {line} <br />
                      </span>
                    )}
                  </>
                );
              })}
            </TextField>
            <TextField>
              {wrappedTranslatedScript.split('\n').map((line) => {
                return (
                  <>
                    {line !== '' ? (
                      <span>
                        {j++} : {line}
                        <br />
                      </span>
                    ) : (
                      <span>
                        {line} <br />
                      </span>
                    )}
                  </>
                );
              })}
            </TextField>
            <ChangeButton onClick={plusId}>+</ChangeButton>
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
          <SpaceContainer />
        </Box>
      );
    } else if (whichCase === 1) {
      return (
        <Box>
          <OnlyTextContainer>
            <OnlyText>{wrappedOriginalScript}</OnlyText>
            <TextUpdate value={changedTask} onChange={handleChange}>
              {changedTask}
            </TextUpdate>
          </OnlyTextContainer>
          <UpdateButton onClick={taskUpdate}>
            Click here to update your task
          </UpdateButton>
        </Box>
      );
    } else {
      return <Student match={match} history={history} />;
    }
  };

  return <StyledContainer>{changeBody()}</StyledContainer>;
};

const ProfVersion = ({ myName, match, history, setStudentID, studentID }) => {
  const [myScript, setMyScript] = useState('loading');
  const [originalScript, setOriginalScript] = useState();
  const [feedBackList, setFeedBackList] = useState([]);
  const [wrappedOriginalScript, setWrappedOriginalScript] = useState('loading');
  const [wrappedTranslatedScript, setWrappedTranslatedScript] =
    useState('loading');
  const [chartValue, setChartValue] = useState([]);
  const [options, setOptions] = useState([]);
  const [critique, setCritique] = useState('loading');
  const [indexNum, setIndexNum] = useState(0);
  const [isMyUID, setIsMyUID] = useState();
  const [professorFeedBack, setProfessorFeedBack] = useState([]);
  const [isModifying, setIsModifying] = useState(false);
  let i = 1;
  let j = 1;
  const getMyScript = async () => {
    const dbScript = await dbService.collection('student').get();
    const arr = [];
    for (const document of dbScript.docs) {
      arr.push(document.data());
    }
    const Arr = arr.filter((el) => el.scriptID === match.params.id);
    const myscript = Arr.find((el) => el.studentID === myName);
    console.log('studentScript', myScript);
    if (myscript) {
      setMyScript(myscript.translate_txt);
      setStudentID(myscript.userID);
    }
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

  const getMyFeedBack = async () => {
    const arr = [];
    const dbScript = await dbService.collection('professorTest').get();
    for (const document of dbScript.docs) {
      arr.push(document.data());
    }
    const Arr = arr.filter((el) => el.script_ID === match.params.id);
    const fb = Arr.filter((el) => el.student_name === myName);
    setProfessorFeedBack(fb);
    const professorID = fb.map((a) => a.professor_ID);
    setIsMyUID(professorID);
    const TotalCritique = fb.map((a) => a.general_critique);
    setCritique(TotalCritique);
    if (fb.length === 0) {
      window.alert('해당 과제에 대한 피드백이 존재하지 않습니다. ');
      history.goBack();
    }
  };

  const isFeedBackEmpty = () => {
    if (professorFeedBack.length === 0) {
      return 'loading';
    } else {
      setFeedBackList(professorFeedBack[indexNum].feedBack);
      if (professorFeedBack[indexNum].feedBack) {
        let fbList = professorFeedBack[indexNum].feedBack.map(
          (a) => a.feedBack
        );
        const set = fbList.filter((element, index) => {
          return fbList.indexOf(element) === index;
        });
        setOptions(set);
        let Array = [];
        for (let i = 0; i < set.length; i++) {
          Array[i] = 0;
        }
        for (let i = 0; i < fbList.length; i++) {
          for (let j = 0; j < set.length; j++) {
            if (fbList[i] === set[j]) {
              Array[j]++;
              break;
            }
          }
        }
        setChartValue(Array);
      }
    }
  };

  const plusId = () => {
    if (indexNum === professorFeedBack.length - 1) {
      alert('더 이상 뒤로 갈 수 없습니다.');
    } else {
      setIndexNum(indexNum + 1);
    }
  };

  const minusId = () => {
    if (indexNum === 0) {
      alert('더 이상 앞으로 갈 수 없습니다.');
    } else {
      setIndexNum(indexNum - 1);
    }
  };

  const isMyFeedBack = () => {
    if (!isMyUID) {
      return;
    } else if (isMyUID[indexNum] === authService.currentUser.uid) {
      return (
        <>
          <Link
            to={{
              pathname: `/forprofessor/${match.params.id}`,
              state: {
                fromWhere: 'modify',
                studentID: studentID,
              },
            }}
          >
            <UpdateButton onClick={modifyOnClick}>피드백 수정하기</UpdateButton>
          </Link>
        </>
      );
    }
  };

  const modifyOnClick = () => {
    setIsModifying(true);
  };

  useEffect(() => {
    getMyScript();
    findScript();
    isOriginalScriptEmpty();
    getMyFeedBack();
  }, []);

  useEffect(() => {
    isMyScriptEmpty();
  }, [myScript]);

  useEffect(() => {
    isFeedBackEmpty();
  }, [feedBackList, indexNum, professorFeedBack]);

  useEffect(() => {
    isOriginalScriptEmpty();
  }, [originalScript]);

  return (
    <StyledContainer>
      <Box>
        <TextContainer>
          <ChangeButton onClick={minusId}>-</ChangeButton>
          <TextField>
            {wrappedOriginalScript.split('\n').map((line) => {
              return (
                <>
                  {line !== '' ? (
                    <span>
                      {i++} : {line}
                      <br />
                    </span>
                  ) : (
                    <span>
                      {line} <br />
                    </span>
                  )}
                </>
              );
            })}
          </TextField>
          <TextField>
            {wrappedTranslatedScript.split('\n').map((line) => {
              return (
                <>
                  {line !== '' ? (
                    <span>
                      {j++} : {line}
                      <br />
                    </span>
                  ) : (
                    <span>
                      {line} <br />
                    </span>
                  )}
                </>
              );
            })}
          </TextField>
          <ChangeButton onClick={plusId}>+</ChangeButton>
        </TextContainer>
        <FeedBackContainer style={{ marginTop: '15px' }}>
          <FeedBackList>
            {feedBackList &&
              feedBackList.map((el) => (
                <FeedBackBox key={el.id}>
                  <div>
                    {el.id} . {el.feedBack} : {el.comment}
                  </div>
                  <div>{el.selectedText.text}</div>
                </FeedBackBox>
              ))}
          </FeedBackList>
          <Chart options={options} chartValue={chartValue} />
        </FeedBackContainer>
        <Label>총평</Label>
        <CritiqueContainer>{critique[indexNum]}</CritiqueContainer>
        {isMyFeedBack()}
        <SpaceContainer />
      </Box>
    </StyledContainer>
  );
};

const MyFeedBack = ({
  match,
  myName,
  history,
  myTask,
  myScriptList,
  isStudent,
}) => {
  const [studentID, setStudentID] = useState();
  return (
    <>
      {isStudent ? (
        <StudentVersion
          match={match}
          myName={myName}
          history={history}
          myTask={myTask}
          myScriptList={myScriptList}
          isStudent={isStudent}
        />
      ) : (
        <>
          <ProfVersion
            myName={myName}
            match={match}
            history={history}
            setStudentID={setStudentID}
            studentID={studentID}
          />
          <Route path={`/forprofessor/:id`} component={Translate} />
        </>
      )}
    </>
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

const SpaceContainer = styled.div`
  height: 200px;
`;

const OnlyText = styled.div`
  width: 40%;
  height: 500px;
  border-radius: 15px;
  overflow-y: scroll;
  padding: 10px;
  background-color: #f9f9f9;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const TextUpdate = styled.textarea`
  width: 40%;
  height: 500px;
  border-radius: 15px;
  overflow-y: scroll;
  padding: 10px;
  background-color: #f9f9f9;
  border: 1px solid #dadada;
  ::-webkit-scrollbar {
    display: none;
  }
  :focus {
    outline: none;
  }
`;

const OnlyTextContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
`;

const UpdateButton = styled.button`
  padding: 15px;
  border-radius: 17px;
  border: none;
  width: 300px;
  background-color: #f3f3f3;
  :hover {
    box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.07);
    border: none;
  }
  a:active {
    border: none;
  }
`;
