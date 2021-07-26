import { authService, firebaseInstance } from '../fbase';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

/*global Kakao*/
export default function Auth (){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAccount, setNewAccount] = useState(true);
    const [error, setError] = useState("");

    const onChange = (e) => {
        const {target: {name, value}} = e;
        if(name === "email"){
            setEmail(value)
        } else if(name === "password"){
            setPassword(value)
        }
    };

    const onSubmit = async(e) => {
        e.preventDefault();
        try{
            let data;
            if(newAccount){
                data = await authService.createUserWithEmailAndPassword(
                    email, password
                );
             } else {
                 data = await authService.signInWithEmailAndPassword(
                     email, password
                 );
             }
             console.log(data);
        } catch(error){
            setError(error.message);
        }
    };

    const toggleAccount = () => setNewAccount((prev) => !prev);
    const redirectUri = "http://localhost:3000"
    const onClickToAuthorize = () =>{
        Kakao.Auth.login({
            success:async(auth)=>{
                console.log("success", auth)
                //error: "invalid_client", email bad formatting
                // const data = await authService.signInWithEmailAndPassword(
                //     email, password
                // );
                //"auth/email-already-in-use"
                const data = await authService.createUserWithEmailAndPassword(
                    email, password
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
            fail:(err) => {
                console.log(error)
            }
        })
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
    }

    const onSocialClick = async(event) => {
        const {target:{name}} = event; //es6
        let provider;
        if(name === "Google"){
            provider = new firebaseInstance.auth.GoogleAuthProvider();
        } else if (name === "FaceBook"){
            provider = new firebaseInstance.auth.FacebookAuthProvider();
        } else if (name === "KakaoTalk"){
           
        }
        const data = await authService.signInWithPopup(provider);
        console.log(data);
    };

    useEffect(()=>{
        const authorizeCodeFromKakao = window.location.search.split("=")[1]
        if(authorizeCodeFromKakao !== undefined){
          console.log(`authorizeCodeFromKakao : ${authorizeCodeFromKakao}`)
          
          const body = {
            grant_type: "authorization_code",
            client_id: process.env.REACT_APP_REST_API_KEY,
            redirect_uri: redirectUri,
            code: authorizeCodeFromKakao
          }
          
          const queryStringBody = Object.keys(body)
            .map(k => encodeURIComponent(k) + "=" + encodeURI(body[k]))
            .join("&")
          
          fetch("https://kauth.kakao.com/oauth/token",{
            method: "POST",
            headers: {
              'content-type' : 'application/x-www-form-urlencoded;charset=utf-8'
            },
            body : queryStringBody
          })
            .then(res => res.json())
            .then((data) => {
              console.log(data)
            })
        }else{
          console.log("No AuthorizeCodeFromKakao")
        }
    },[]);

    return(
        <Container>
            <LoginForm onSubmit={onSubmit}>
                <span onClick={toggleAccount}>{newAccount ? "Sign in": "Create Account"}</span>
                <br/>
                <Input name='email' type="email" placeholder="Email" required value={email} onChange={onChange}/>
                <Input name='password' type="password" placeholder="Password" required value={password} onChange={onChange}/>
                <Button type="submit">{newAccount ? "CreateAccount" : "Log in"}</Button>
                <div style={{textAlign:'center'}}>{error}</div>
            </LoginForm>
            <ContinueWith>
                <ContinueWithButton name="Google" onClick={onSocialClick}>Continue with Google</ContinueWithButton>
                <ContinueWithButton name="FaceBook" onClick={onSocialClick}>Continue with Facebook</ContinueWithButton> 
                <ContinueWithButton name="KaKaoTalk" onClick={onClickToAuthorize}>Continue with KakaoTalk</ContinueWithButton>
            </ContinueWith>
        </Container>
    )
};

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 15px;
    box-shadow: 0 0 25px rgba(0, 0, 0, 0.25);
    width: 350px;
    height: 450px;
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
    justify-content: center;
    align-items: center;
    margin: 10px;
`;
const ContinueWithButton = styled.button`
    border-radius: 10px;
    border:none;
    padding: 5px;
    margin: 5px;

`;
const Input = styled.input`
    width: 200px;
    margin-bottom: 3px;
    border: none;
    background: transparent;
    border-bottom: 0.8px solid;
    &:focus {
        outline: none;
    }
`;
const Button = styled.button`
  background: transparent;
  width: 200px;
  border: none;
  margin-top: 10px;
  margin-left: 0;
  padding-left: 0;
`;