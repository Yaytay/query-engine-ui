import './App.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Suspense, lazy, useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import Home from './Home';
import Demo from './Demo';
import Test from './Test';
import Help from './Help';
import { Manage, ManagementEndpointType } from './Manage';
import CssBaseline from '@mui/material/CssBaseline';
import { components } from "./Query-Engine-Schema";

const Design = lazy(() => import('./Design'))

function App() {

  var defaultState = {
    "available":( {name: '', path: '', children: [] } as components["schemas"]["PipelineDir"])
    , "docs": ( {name: '', path: '', children: [] } as components["schemas"]["DocDir"])
    , "designMode": false
  };

  const [available, setAvailable] = useState(defaultState.available);
  const [designMode, setDesignMode] = useState(defaultState.designMode);
  const [docs, setDocs] = useState(defaultState.docs);
  const [managementEndpoints, setManagementEndpoints] = useState(null as ManagementEndpointType[] | null);

  function buildApiBaseUrl() : string {
    if (import.meta.env.MODE == 'development') {
      console.log(import.meta.env)
      if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
      } else {
        return 'http://localhost:8000/';
      }
    } else {
      var url = window.location.href
      url = url.replace(/\/ui\/?.*$/,'')
      if (url.endsWith('/')) {
        return url
      } else {
        return url + '/'
      }
    }
  }

  const baseUrl =  buildApiBaseUrl()
  console.log("API URL: " + baseUrl)

  useEffect(() => {
    let url = new URL(baseUrl + 'api/info/available');
    fetch(url)
      .then(r => r.json())
      .then(j => {
        setAvailable(j);
      })
    let docurl = new URL(baseUrl + 'api/docs');
    fetch(docurl)
      .then(r => r.json())
      .then(j => {
        setDocs(j);
      })
      let dmurl = new URL(baseUrl + 'api/design/enabled');
      fetch(dmurl)
        .then(r => {
          setDesignMode(r.ok)
        })
      let murl = new URL(baseUrl + 'manage');
      fetch(murl)
        .then(r => r.json())
        .then(j => {
          setManagementEndpoints(j);
        })
    }, []);

  const refresh = function() {
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
      <div className="flex-none">
        <Nav available={available} designMode={designMode} managementEndpoints={managementEndpoints} />
      </div>        
      <Routes>
        <Route index element={<Home designMode={designMode} managementEndpoints={managementEndpoints} />}></Route>
        <Route index path='/ui' element={<Home designMode={designMode} managementEndpoints={managementEndpoints} />}></Route>
        <Route path='/ui/design' element={
          <Suspense>
            <Design baseUrl={baseUrl} onChange={refresh} />
          </Suspense>
          }></Route>
        <Route path='/ui/test' element={<Test available={available} baseUrl={baseUrl} window={window} />}></Route>
        <Route path='/ui/demo' element={<Demo />}></Route>
        <Route path='/ui/help' element={<Help docs={docs} baseUrl={baseUrl} />}></Route>
        <Route path='/ui/help/:stub' element={<Help docs={docs} baseUrl={baseUrl} />}></Route>
        <Route path='/ui/help/:parent/:stub' element={<Help docs={docs} baseUrl={baseUrl} />}></Route>
        <Route path='/ui/manage' element={<Manage endpoints={managementEndpoints} />}></Route>
        <Route path='/ui/manage/:stub' element={<Manage endpoints={managementEndpoints} />}></Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
