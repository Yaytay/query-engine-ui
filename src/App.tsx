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
import History from './History';
import Jwt from './Jwt';
import Test from './Test';
import Help from './Help';
import Api from './Api';
import Manage, { ManagementEndpointType } from './Manage';
import CssBaseline from '@mui/material/CssBaseline';
import { components } from "./Query-Engine-Schema";
import ServiceUnavailable from './components/ServiceUnavailable';
import equal from 'fast-deep-equal/es6/react';

const Design = lazy(() => import('./Design'))

const fetchConfig = {credentials: 'include' as RequestCredentials}

function App() {

  const defaultState = {
    "available": null as components["schemas"]["PipelineDir"] | null
    , "docs": null as components["schemas"]["DocDir"] | null
    , "designMode": false
    , "profile": null as components["schemas"]["Profile"] | null
    , "authConfigs": [] as components["schemas"]["AuthConfig"][] 
  };

  const [baseUrl] = useState(buildApiBaseUrl())
  const [available, setAvailable] = useState(defaultState.available)
  const [designMode, setDesignMode] = useState(defaultState.designMode)
  const [docs, setDocs] = useState(defaultState.docs)
  const [managementEndpoints, setManagementEndpoints] = useState(null as ManagementEndpointType[] | null)
  const [apiUrl, setApiUrl] = useState(null as string | null)
  const [profile, setProfile] = useState(defaultState.profile)
  const [authConfigs, setAuthConfigs] = useState(defaultState.authConfigs)
  const [displayAuthSelection, setDisplayAuthSelection] = useState(false)
  const [displayServiceUnavailable, setDisplayServiceUnavailable] = useState(false)

  function buildApiBaseUrl(): string {
    let url = ''
    if (import.meta.env.VITE_API_URL) {
      url = import.meta.env.VITE_API_URL
    } else if (import.meta.env.MODE == 'development') {
      url = 'http://localhost:8000/';
    } else {
      url = window.location.href
      url = url.replace(/\/ui\/?.*$/, '')
      if (!url.endsWith('/')) {
        url = url + '/'
      }
    }
    return url
  }

  function doLogin(configs: components["schemas"]["AuthConfig"][]): undefined {
    console.log("Doing login with one of", configs)
    setDisplayAuthSelection(true)
  }

  function clearProfile() : void {
    setProfile(null)
  }

  useEffect(() => {
    function performProfileFetch(profurl: URL, resolve: (_value: unknown) => void) {
      fetch(profurl, fetchConfig)
        .then(r => {
          console.log('Profile fetch result: ', r);
          if (r.status === 401) {
            doLogin(authConfigs);
          } else if (r.ok) {
            setDisplayAuthSelection(false);
            return r.json();
          } else {
            setDisplayServiceUnavailable(true);
            resolve(false);
          }
        })
        .catch(() => {
          setDisplayServiceUnavailable(true);
          resolve(false);
        })
        .then(j => {
          console.log('Got profile: ', j);
          setProfile(j);
          resolve(true);
        });
    }

    const profurl = new URL(baseUrl + 'api/session/profile')
    console.log('Getting profile')

    new Promise(resolve => {
      console.log("authConfigs: ", authConfigs)
      if (authConfigs.length) {
        performProfileFetch(profurl, resolve);
      } else {
        const authurl = new URL(baseUrl + 'api/auth-config');
        fetch(authurl, fetchConfig)
          .then(r => {
            if (r.ok) {
              setDisplayServiceUnavailable(false);
              return r.json();
            } else {
              setDisplayServiceUnavailable(true);
              resolve(false)
            }
          })
          .catch(() => {
            setDisplayServiceUnavailable(true);
            resolve(false)
          })
          .then(ac => {
            if (!equal(ac, authConfigs)) {
              console.log("Setting auth configs to", ac);
              setAuthConfigs(ac);
            }
            performProfileFetch(profurl, resolve);
          });
      }
    })
    .then(good => {
        if (good) {
          const url = new URL(baseUrl + 'api/info/available')
          fetch(url, fetchConfig)
            .then(r => {
              if (r.ok) {
                return r.json()
              } else {
                return;
              }
            })
            .then(j => {
              setAvailable(j);
            })
          const docurl = new URL(baseUrl + 'api/docs');
          fetch(docurl, fetchConfig)
            .then(r => {
              if (r.ok) {
                return r.json()
              } else {
                return;
              }
            })
            .then(j => {
              setDocs(j);
            })
          const dmurl = new URL(baseUrl + 'api/design/enabled');
          fetch(dmurl, fetchConfig)
            .then(r => {
              setDesignMode(r.ok)
            })
          const murl = new URL(baseUrl + 'manage');
          fetch(murl, fetchConfig)
            .then(r => {
              if (r.ok) {
                return r.json()
              } else {
                return;
              }
            })
            .then(j => {
              if (j.location) {
                fetch(j.location, fetchConfig)
                  .then(r => r.json())
                  .then(j => {
                    setManagementEndpoints(j);
                  })
              } else {
                setManagementEndpoints(j);
              }
            })
          const apidocurl = new URL(baseUrl + 'openapi');
          fetch(apidocurl, fetchConfig)
            .then(r => {
              if (r.ok) {
                setApiUrl(baseUrl + 'openapi');
              }
            })
        }
      })
  }, [baseUrl, authConfigs]);

  const refresh = function () {
    const url = new URL(baseUrl + 'api/info/available');
    fetch(url, fetchConfig)
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

  const loginFn = (authConfigs?.at(0)) ? () => doLogin(authConfigs) : null;

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
          apiUrl={apiUrl}
          profile={profile}
          clearProfile={clearProfile}
          login={loginFn}
        />
      </div>
      {displayServiceUnavailable ?
        <div style={{ width: '100%', height: '100%' }}>
          <ServiceUnavailable baseUrl={baseUrl} />
        </div>
        :
        displayAuthSelection && (authConfigs || designMode) ?
          <div style={{ width: '100%', height: '100%' }}>
            <Login baseUrl={baseUrl} authConfigs={authConfigs} />
          </div>
          :
          <Routes>
            <Route index element={<Home designMode={designMode} managementEndpoints={managementEndpoints} apiUrl={apiUrl} docs={docs} available={available} profile={profile} />}></Route>
            <Route index path='/ui' element={<Home designMode={designMode} managementEndpoints={managementEndpoints} apiUrl={apiUrl} docs={docs} available={available} profile={profile} />}></Route>
            {designMode && 
              <Route path='/ui/design' element={
                <Suspense>
                  <Design baseUrl={baseUrl} onChange={refresh} />
                </Suspense>
              }></Route>
            }
            {available &&
              <Route path='/ui/test' element={<Test available={available} baseUrl={baseUrl} window={window} />}></Route>
            }
            <Route path='/ui/demo' element={<Demo />}></Route>
            <Route path='/ui/history' element={<History baseUrl={baseUrl} />}></Route>
            <Route path='/ui/manage' element={<Manage endpoints={managementEndpoints} />}></Route>
            <Route path='/ui/manage/:stub' element={<Manage endpoints={managementEndpoints} />}></Route>
            {docs &&
              <Route path='/ui/help' element={<Help docs={docs} baseUrl={baseUrl} />}></Route>
            }
            {docs &&
              <Route path='/ui/help/:stub' element={<Help docs={docs} baseUrl={baseUrl} />}></Route>
            }
            {docs &&
              <Route path='/ui/help/:parent/:stub' element={<Help docs={docs} baseUrl={baseUrl} />}></Route>
            }
            {apiUrl &&
              <Route path='/ui/api' element={<Api url={apiUrl} />}></Route>
            }
            <Route path='/ui/jwt' element={<Jwt baseUrl={baseUrl} />}></Route>
          </Routes>
      }
    </ThemeProvider>
  );
}

export default App;
