import './App.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import Home from './Home';
import Design from './Design';
import Demo from './Demo';
import Test from './Test';
import CssBaseline from '@mui/material/CssBaseline';



function App() {

  var defaultState = {
    "available":
    {
    }
    , "designMode": false
  };

  const [available, setAvailable] = useState(defaultState.available);
  const [designMode, setDesignMode] = useState(defaultState.designMode);

  const baseUrl = 'http://localhost:8000/';

  useEffect(() => {
    let url = new URL(baseUrl + 'api/info/available');
    fetch(url)
      .then(r => r.json())
      .then(j => {
        setAvailable(j);
      })
    let dm = new URL(baseUrl + 'api/design/enabled');
    fetch(dm)
        .then(r => {
          setDesignMode(r.ok)
          console.log(r)
        })
    }, []);

  const refresh = function() {
    console.log('refresh');
    let url = new URL(baseUrl + 'api/info/available');
    fetch(url)
      .then(r => r.json())
      .then(j => {
        setAvailable(j);
      })
  }

  const theme = createTheme({
    palette: {
      type: 'light',
      primary: {
        main: '#3f51b5',
      },
      secondary: {
        main: '#f50057',
      },
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="flex-none">
          <Nav available={available} designMode={designMode} />
        </div>        
        <Routes>
          <Route index element={<Home designMode={designMode} />}></Route>
          <Route exact path='/design' element={
            <Design available={available} baseUrl={baseUrl} onChange={refresh} />
          }></Route>
          <Route exact path='/test' element={<Test available={available} baseUrl={baseUrl} window={window} />}></Route>
          <Route exact path='/demo' element={<Demo available={available} />}></Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
