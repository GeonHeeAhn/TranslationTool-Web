import { authService, firebaseInstance } from '../fbase';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { BodyContainer, Title, TextLabel } from './userInfoModal';
import { Input, Button } from '@nextui-org/react';

/*global Kakao*/
export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState('');

  const onChange = (e) => {
    const {
      target: { name, value },
    } = e;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const labelOnClick = () => {
    window.alert('알맞은 링크를 연결해주세요. ');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      let data;
      if (newAccount) {
        data = await authService.createUserWithEmailAndPassword(
          email,
          password
        );
      } else {
        data = await authService.signInWithEmailAndPassword(email, password);
      }
      console.log(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const toggleAccount = () => setNewAccount((prev) => !prev);
  const redirectUri = 'http://localhost:3000';
  const onClickToAuthorize = () => {
    Kakao.Auth.login({
      success: async (auth) => {
        console.log('success', auth);
        //error: "invalid_client", email bad formatting
        // const data = await authService.signInWithEmailAndPassword(
        //     email, password
        // );
        //"auth/email-already-in-use"
        const data = await authService.createUserWithEmailAndPassword(
          email,
          password
        );
        console.log(data);
        //post erro-400
        // firebaseInstance.auth().signInWithCustomToken(Kakao.Auth.getAccessToken())
        //     .then((userCredential) => {
        //     // Signed in
        //     var user = userCredential.user;
        //     console.log(user);
        // })
        // .catch((error) => {
        // var errorCode = error.code;
        // var errorMessage = error.message;
        // });
      },
      fail: (err) => {
        console.log(error);
      },
    });
    // Kakao.Auth.authorize({
    //     redirectUri: redirectUri
    // },
    // {
    //     scope: 'account_email'
    // });
    // Kakao.Auth.setAccessToken(Kakao.Auth.getAccessToken());
    // firebaseInstance.auth().signInWithCustomToken(Kakao.Auth.getAccessToken())
    //     .then((userCredential) => {
    //         // Signed in
    //         var user = userCredential.user;
    //         // ...
    //     })
    //     .catch((error) => {
    //     var errorCode = error.code;
    //     var errorMessage = error.message;
    //     // ...
    // });
  };

  const onSocialClick = async (event) => {
    const {
      target: { name },
    } = event; //es6
    let provider;
    if (name === 'Google') {
      provider = new firebaseInstance.auth.GoogleAuthProvider();
    } else if (name === 'FaceBook') {
      provider = new firebaseInstance.auth.FacebookAuthProvider();
    } else if (name === 'KakaoTalk') {
    }
    const data = await authService.signInWithPopup(provider);
    console.log(data);
  };

  useEffect(() => {
    const authorizeCodeFromKakao = window.location.search.split('=')[1];
    if (authorizeCodeFromKakao !== undefined) {
      console.log(`authorizeCodeFromKakao : ${authorizeCodeFromKakao}`);

      const body = {
        grant_type: 'authorization_code',
        client_id: process.env.REACT_APP_REST_API_KEY,
        redirect_uri: redirectUri,
        code: authorizeCodeFromKakao,
      };

      const queryStringBody = Object.keys(body)
        .map((k) => encodeURIComponent(k) + '=' + encodeURI(body[k]))
        .join('&');

      fetch('https://kauth.kakao.com/oauth/token', {
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
        body: queryStringBody,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
        });
    } else {
      console.log('No AuthorizeCodeFromKakao');
    }
  }, []);

  return (
    <StyledContainer>
      <Title>환영합니다</Title>
      <LoginForm onSubmit={onSubmit}>
        <StyledTextLabel>email</StyledTextLabel>
        <Input
          name="email"
          type="email"
          size="large"
          width="250px"
          placeholder="your email"
          required
          value={email}
          onChange={onChange}
        />
        <StyledTextLabel>password</StyledTextLabel>
        <Input
          name="password"
          type="password"
          size="large"
          width="250px"
          placeholder="your password"
          required
          value={password}
          onChange={onChange}
        />
        <span
          style={{
            width: '250px',
            textAlign: 'left',
            marginTop: '10px',
            color: 'grey',
          }}
          onClick={toggleAccount}
        >
          {newAccount ? 'click here to login' : 'click here to create account'}
        </span>
        <Spacer />

        <Button flat color="primary" rounded type="submit" width="300px">
          {newAccount ? 'CreateAccount' : 'Login'}
        </Button>
        <div style={{ textAlign: 'center' }}>{error}</div>
      </LoginForm>
      <LinkedTextLabel onClick={labelOnClick}>Forgot password?</LinkedTextLabel>
      <LinkedTextLabel onClick={labelOnClick}>Privacy</LinkedTextLabel>
      {/* <ContinueWith>
        <ContinueWithButton name="Google" onClick={onSocialClick}>
          Continue with Google
        </ContinueWithButton>
        <ContinueWithButton name="FaceBook" onClick={onSocialClick}>
          Continue with Facebook
        </ContinueWithButton>
        <ContinueWithButton name="KaKaoTalk" onClick={onClickToAuthorize}>Continue with KakaoTalk</ContinueWithButton>
      </ContinueWith> */}
    </StyledContainer>
  );
}

const StyledContainer = styled(BodyContainer)`
  box-shadow: 0 0 25px rgba(0, 0, 0, 0.25);
  width: 400px;
  height: 500px;
  background-color: white;
  border-radius: 50px;
  align-items: center;
  justify-content: flex-start;
`;

const StyledTextLabel = styled(TextLabel)`
  text-align: left;
  width: 250px;
`;

const ContinueWith = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 10px;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 285px;
`;
const ContinueWithButton = styled.button`
  border-radius: 10px;
  border: none;
  padding: 5px;
  margin: 5px;
`;

const Spacer = styled.div`
  height: 20px;
`;

const LinkedTextLabel = styled.button`
  font-size: 16px;
  font-weight: 500;
  background-color: transparent;
  border: none;
  margin-bottom: 7px;
  color: rgb(22, 35, 148);
  width: 250px;
  text-align: left;
`;
