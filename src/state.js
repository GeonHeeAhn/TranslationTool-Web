import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';

const inputTextState = atom({
  key: 'inputTextState',
  default: '',
});

const studentScriptState = atom({
  key: 'studentScriptState',
  default: [],
});

const selectedState = atom({
  key: 'selectedState',
  default: '',
});

const isToggledState = atom({
  key: 'isToggledState',
  default: false,
});

const inputValueState = atom({
  key: 'inputValueState',
  default: '',
});

const studentDataState = atom({
  key: 'studentDataState',
  //   default: '',
});

const selectedTextState = atom({
  key: 'selectedTextState',
  default: [
    {
      id: '',
      indexNum: '',
      text: '',
    },
  ],
});

const feedBackState = atom({
  key: 'feedBackState',
  default: [
    {
      id: '',
      feedBack: '',
      comment: '',
      selectedText: '',
    },
  ],
});

export {
  inputTextState,
  studentScriptState,
  selectedState,
  isToggledState,
  inputValueState,
  studentDataState,
  selectedTextState,
  feedBackState,
};
