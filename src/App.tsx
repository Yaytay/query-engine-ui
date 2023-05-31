import './App.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import Home from './Home';
import Design from './Design';
import Demo from './Demo';
import Test from './Test';
import Help from './Help';
import CssBaseline from '@mui/material/CssBaseline';
import { components } from "./Query-Engine-Schema";


function App() {

  var defaultState = {
    "available":( {name: '', path: '', children: [] } as components["schemas"]["PipelineDir"])
    , "docs": ( {name: '', path: '', children: [] } as components["schemas"]["DocDir"])
    , "designMode": false
  };

  const [available, setAvailable] = useState(defaultState.available);
  const [designMode, setDesignMode] = useState(defaultState.designMode);
  const [docs, setDocs] = useState(defaultState.docs);

  const baseUrl = 'http://localhost:8000/';

  useEffect(() => {
    let url = new URL(baseUrl + 'api/info/available');
    fetch(url)
      .then(r => r.json())
      .then(j => {
        setAvailable(j);
      })
    let dmurl = new URL(baseUrl + 'api/design/enabled');
    fetch(dmurl)
      .then(r => {
        setDesignMode(r.ok)
      })
    let docurl = new URL(baseUrl + 'api/docs');
    fetch(docurl)
      .then(r => r.json())
      .then(j => {
        setDocs(j);
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
          <Route path='/design' element={
            <Design baseUrl={baseUrl} onChange={refresh} />
          }></Route>
          <Route path='/test' element={<Test available={available} baseUrl={baseUrl} window={window} />}></Route>
          <Route path='/demo' element={<Demo />}></Route>
          <Route path='/help' element={<Help docs={docs} baseUrl={baseUrl} />}></Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
