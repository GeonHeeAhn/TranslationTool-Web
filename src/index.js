import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import firebase from './fbase';
import { CssBaseline } from '@nextui-org/react';
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';

ReactDOM.render(
  <RecoilRoot>
    <React.StrictMode>
      <CssBaseline />
      <App />
    </React.StrictMode>
  </RecoilRoot>,
  document.getElementById('root')
);
