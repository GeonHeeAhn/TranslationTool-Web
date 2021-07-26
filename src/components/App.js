import React, {useEffect, useState} from 'react';
import AppRouter from "./Router";
import { authService } from "../fbase";

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);

  return (
    <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100%'}}>
      {init ? <AppRouter isLoggedIn={isLoggedIn} /> : "Initializing..."}
    </div>
  );
}

export default App;