import React, { useState, useEffect, useCallback } from 'react';
import { dbService } from 'fbase.js';
import { Route, Link } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import 'boxicons';
import Select from 'react-select';
import TaskList from './TaskList';
// import { doc, deleteDoc } from 'firebase/firestore';

const classOptions = [
  { value: 'all', label: '전체' },
  { value: '2021-02', label: '2021학년도 2학기' },
  { value: '2022-01', label: '2022학년도 1학기' },
  { value: '2022-02', label: '2022학년도 2학기' },
];

const ButtonGroup = ({
  subject,
  classNum,
  originalList,
  isDelete,
  setIsDelete,
}) => {
  const deleteSubj = () => {
    const deleteItem = originalList.filter(
      (item) => item.subjectName === subject && item.classNum === classNum
    );
    // await deleteDoc(doc(dbService, 'subject', deleteItem.docID));
    dbService
      .collection('subject')
      .doc(deleteItem.docID)
      .delete()
      .then(() => {
        console.log('Document successfully deleted!');
      })
      .catch((error) => {
        console.error('Error removing document: ', error);
      });
    setIsDelete(isDelete++);
  };

  return (
    <BtnGroup>
      <IconBtn style={{ marginLeft: 10 }}>
        <box-icon name="user" type="solid" size="sm" animation="tada-hover" />
      </IconBtn>
      <IconBtn>
        <box-icon type="solid" name="pencil" size="sm" animation="tada-hover" />
      </IconBtn>
      <IconBtn onClick={deleteSubj}>
        <box-icon type="solid" name="trash" size="sm" animation="tada-hover" />
      </IconBtn>
    </BtnGroup>
  );
};

const SubjectList = () => {
  const [subjectList, setSubjectList] = useState([]);
  const [originalList, setOriginalList] = useState([]);
  const [isDelete, setIsDelete] = useState(0);
  const [classValue, setClassValue] = useState({ value: 'all' });
  const getSubj = async () => {
    const dbsubj = await dbService.collection('subject').get();
    const subjects = [];
    for (const document of dbsubj.docs) {
      const data = { ...document.data(), docID: document.id };
      subjects.push(data);
    }
    setSubjectList(subjects);
    setOriginalList(subjects);
  };

  const sortSubjList = () => {
    if (classValue.value === 'all') {
      setSubjectList(originalList);
    } else {
      const arr = originalList.filter(
        (item) => item.semester === classValue.value
      );
      setSubjectList(arr);
    }
  };

  const handleChange = useCallback(
    (inputValue) => setClassValue(inputValue),
    []
  );

  useEffect(() => {
    getSubj();
  }, [isDelete]);

  useEffect(() => {
    sortSubjList();
  }, [classValue]);

  return (
    <>
      <GlobalStyle />
      <StyledContainer>
        <Spacer />
        <Spacer />
        <Select
          options={classOptions}
          value={classValue}
          onChange={handleChange}
          placeholder="연도/학기 "
        />
        <Spacer />
        <SubjListContainer>
          {subjectList.map((item) => (
            // <Link
            //   to={{
            //     pathname: `${match.url}/${item.classNum}`,
            //   }}
            // >
            <StyledButton>
              <InnerBtnContainer>
                <div style={{ width: 200, textAlign: 'left' }}>
                  {item.subjectName}
                </div>
                <ButtonGroup
                  originalList={originalList}
                  subject={item.subjectName}
                  classNum={item.classNum}
                  isDelete={isDelete}
                  setIsDelete={setIsDelete}
                />
              </InnerBtnContainer>
            </StyledButton>
            // </Link>
          ))}
        </SubjListContainer>
        <Link to="/createsubject">
          <AddSubjContainer>
            <IconBtn>
              <box-icon name="plus-circle" type="solid" size="sm"></box-icon>
            </IconBtn>
            <Spacer />
            과목 추가
          </AddSubjContainer>
        </Link>
        <Spacer />
      </StyledContainer>
    </>
  );
};

// const SubjList = ({ match }) => {
//   return (
//     <>
//       <Route exact path={match.path} component={SubjectList} />
//       <Route path={`${match.path}/:id`} component={TaskList} />
//     </>
//   );
// };

export default SubjectList;

const GlobalStyle = createGlobalStyle`
.css-g1d714-ValueContainer{
    width: 400px;
}
.css-yk16xz-control{
    height: 50px;
}
.css-1pahdxg-control{
    height: 50px;
}
`;

const StyledContainer = styled.div`
  width: 600px;
  height: 500px;
  justify-content: flex-start;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 15px;
  box-shadow: 0 0 25px rgba(0, 0, 0, 0.25);
  overflow-y: auto;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const StyledButton = styled.button`
  width: 500px;
  border-radius: 20px;
  color: black;
  flex-direction: row;
  height: 70px;
  margin-bottom: 30px;
  background: #f9f9f9;
  font-weight: 500;
  font-size: 1rem;
  line-height: 1.5rem;
  text-align: center;
  border: none;
  :hover {
    box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.07);
    color: black;
  }
`;

const InnerBtnContainer = styled.div`
  margin-bottom: 0;
  font-weight: 600;
  font-size: 18px;
  width: auto;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const IconBtn = styled.button`
  border: none;
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2px;
  margin: 0;
`;

const BtnGroup = styled.div`
  display: flex;
  width: auto;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const Spacer = styled.div`
  height: 30px;
  width: 10px;
`;

const AddSubjContainer = styled.button`
  width: 500px;
  border: none;
  background: transparent;
  height: 50px;
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 18px;
  color: black;
`;

const SubjListContainer = styled.div`
  width: 100%;
  overflow-y: auto;
  padding-left: 50px;
  -ms-overflow-style: none;
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none;
  }
`;
