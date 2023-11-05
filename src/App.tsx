import './App.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Suspense, lazy, useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import Login from './components/Login';
import Home from './Home';
import Demo from './Demo';
import Test from './Test';
import Help from './Help';
import Api from './Api';
import { Manage, ManagementEndpointType } from './Manage';
import CssBaseline from '@mui/material/CssBaseline';
import { components } from "./Query-Engine-Schema";

const Design = lazy(() => import('./Design'))

function App() {

  var defaultState = {
    "available":( {name: '', path: '', children: [] } as components["schemas"]["PipelineDir"])
    , "docs": ( {name: '', path: '', children: [] } as components["schemas"]["DocDir"])
    , "designMode": false
    , "profile": null as components["schemas"]["Profile"] | null
    , "authConfigs": null as components["schemas"]["AuthConfig"][] | null
  };

  const [baseUrl, _] = useState(buildApiBaseUrl())
  const [available, setAvailable] = useState(defaultState.available)
  const [designMode, setDesignMode] = useState(defaultState.designMode)
  const [docs, setDocs] = useState(defaultState.docs)
  const [managementEndpoints, setManagementEndpoints] = useState(null as ManagementEndpointType[] | null)
  const [apiUrl, setApiUrl] = useState(null as string | null)
  const [profile, setProfile] = useState(defaultState.profile)
  const [authConfigs, setAuthConfigs] = useState(defaultState.authConfigs)
  const [displayAuthSelection, setDisplayAuthSelection] = useState(false)

  function buildApiBaseUrl() : string {
    var url = ''
    if (import.meta.env.VITE_API_URL) {
      url = import.meta.env.VITE_API_URL
    } else if (import.meta.env.MODE == 'development') {
      url = 'http://localhost:8000/';
    } else {
      url = window.location.href
      url = url.replace(/\/ui\/?.*$/,'')
      if (!url.endsWith('/')) {
        url = url + '/'
      }
    }
    console.log("API URL: ", url)
    return url
  }

  function doLogin(configs: components["schemas"]["AuthConfig"][]): undefined {
    console.log("Doing login with one of", configs)
    setDisplayAuthSelection(true)
//      window.location.href = baseUrl + "login?provider=" + configs[0].name
  }

  useEffect(() => {
    let apidocurl = new URL(baseUrl + 'openapi');
    fetch(apidocurl)
      .then(r => {
        if (r.ok) {
          setApiUrl(baseUrl + 'openapi');
        }
      })
    }, [baseUrl]);

  useEffect(() => {
    let url = new URL(baseUrl + 'api/info/available');
    fetch(url)
      .then(r => {
        if (r.ok) {
          return r.json()
        } else {
          return ;
        }
      })
      .then(j => {
        setAvailable(j);
      })
    let profurl = new URL(baseUrl + 'api/session/profile');
    if (authConfigs) {
      fetch(profurl)
        .then(r => {
          if (r.status === 401) {
            doLogin(authConfigs)
          } else {
            return r.json()
          }
        })
        .then(j => {
          setProfile(j);
        })
    } else {
      let authurl = new URL(baseUrl + 'api/auth-config');
      fetch(authurl)
        .then(r => r.json())
        .then(ac => {
          console.log("Setting auth configs to", ac)
          setAuthConfigs(ac)
          fetch(profurl)
          .then(r => {
            if (r.status === 401) {
              doLogin(ac)
            } else {
              return r.json()
            }
          })
          .then(j => {
            setProfile(j);
          })        })
    }
    let docurl = new URL(baseUrl + 'api/docs');
    fetch(docurl)
      .then(r => {
        if (r.ok) {
          return r.json()
        } else {
          return ;
        }
      })
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
      .then(r => {
        if (r.ok) {
          return r.json()
        } else {
          return ;
        }
      })
      .then(j => {
        if (j.location) {
          fetch(j.location)
          .then(r => r.json())
          .then(j => {
            setManagementEndpoints(j);
          })
        } else {
          setManagementEndpoints(j);
        }
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
        <Nav baseUrl={baseUrl} 
            available={available} 
            designMode={designMode} 
            managementEndpoints={managementEndpoints} 
            window={window} 
            docs={docs}
            profile={profile}
            />
      </div>
      { displayAuthSelection && authConfigs ? 
        <div style={{width: '100%', height: '100%'}}>
          <Login baseUrl={baseUrl} authConfigs={authConfigs} />
        </div>
      :
        <Routes>
          <Route index element={<Home designMode={designMode} managementEndpoints={managementEndpoints} apiUrl={apiUrl} docs={docs} available={available} />}></Route>
          <Route index path='/ui' element={<Home designMode={designMode} managementEndpoints={managementEndpoints} apiUrl={apiUrl} docs={docs} available={available} />}></Route>
          <Route path='/ui/design' element={
            <Suspense>
              <Design baseUrl={baseUrl} onChange={refresh} />
            </Suspense>
            }></Route>
          <Route path='/ui/test' element={<Test available={available} baseUrl={baseUrl} window={window} />}></Route>
          <Route path='/ui/demo' element={<Demo />}></Route>
          <Route path='/ui/manage' element={<Manage endpoints={managementEndpoints} />}></Route>
          <Route path='/ui/manage/:stub' element={<Manage endpoints={managementEndpoints} />}></Route>
          <Route path='/ui/help' element={<Help docs={docs} baseUrl={baseUrl} />}></Route>
          <Route path='/ui/help/:stub' element={<Help docs={docs} baseUrl={baseUrl} />}></Route>
          <Route path='/ui/help/:parent/:stub' element={<Help docs={docs} baseUrl={baseUrl} />}></Route>
          <Route path='/ui/api' element={<Api url={apiUrl} />}></Route>
        </Routes>
      }
    </ThemeProvider>
  );
}

export default App;
