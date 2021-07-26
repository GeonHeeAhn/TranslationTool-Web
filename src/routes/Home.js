import { authService } from '../fbase';
import React from 'react';
import { useHistory } from 'react-router';

export default function Home(){
    const history = useHistory();
    const onLogOutClick =() => {
        authService.signOut();
        history.push("/");
    }
    return(
        <div>
            <button onClick={onLogOutClick}>log out</button>
        </div>
    )
};