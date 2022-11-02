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
      "name": "",
      "children": [
        {
          "name": "demo",
          "children": [
            {
              "name": "FeatureRichExample",
              "path": "demo/FeatureRichExample",
              "title": "Feature Rich Example",
              "description": "A complex pipeline that tries to demonstrate as many features as I can cram into a single pipeline.\n",
              "arguments": [
                {
                  "type": "Date",
                  "name": "minDate",
                  "title": "Start Date",
                  "prompt": "start date",
                  "description": "The earliest date that the row must have.",
                  "defaultValue": "1971-06-05",
                  "optional": true,
                  "multiValued": false,
                  "possibleValues": []
                },
                {
                  "type": "Long",
                  "name": "maxLong",
                  "title": "Maximum Long Value",
                  "prompt": "max long",
                  "description": "The largest value for the longValue.",
                  "optional": true,
                  "multiValued": false,
                  "possibleValues": []
                },
                {
                  "type": "String",
                  "name": "textLike",
                  "title": "Text value",
                  "prompt": "text",
                  "description": "Match for the textValue, may use SQL patterns.",
                  "optional": true,
                  "multiValued": false,
                  "possibleValues": []
                },
                {
                  "type": "String",
                  "name": "refValue",
                  "title": "Required Reference",
                  "description": "Reference value that must be had by the row.",
                  "optional": false,
                  "defaultValue": "5",
                  "multiValued": false,
                  "possibleValues": [
                    {
                      "value": "1"
                      , "label": "alpha"
                    }
                    ,
                    {
                      "value": "2"
                      , "label": "beta"
                    }
                    ,
                    {
                      "value": "3"
                      , "label": "gamma"
                    }
                    ,
                    {
                      "value": "4"
                      , "label": "delta"
                    }
                    ,
                    {
                      "value": "5"
                      , "label": "epsilon"
                    }
                    ,
                    {
                      "value": "6"
                      , "label": "zeta"
                    }
                    ,
                    {
                      "value": "7"
                      , "label": "eta"
                    }
                    ,
                    {
                      "value": "8"
                      , "label": "theta"
                    }
                    ,
                    {
                      "value": "9"
                      , "label": "iota"
                    }
                  ]
                },
                {
                  "type": "DateTime",
                  "name": "minDateTime",
                  "title": "Start Point",
                  "prompt": "start point",
                  "description": "This value isn't used, but is mandatory.",
                  "optional": false,
                  "multiValued": false,
                  "possibleValues": []
                },
                {
                  "type": "Time",
                  "name": "minTime",
                  "title": "Start Time",
                  "prompt": "start time",
                  "description": "This value isn't used.",
                  "optional": true,
                  "multiValued": false,
                  "possibleValues": []
                },
                {
                  "type": "String",
                  "name": "multiString",
                  "title": "Sample Multi Valued String",
                  "prompt": "multi string",
                  "description": "This value isn't used.",
                  "optional": true,
                  "defaultValue": "Fred",
                  "multiValued": true,
                  "possibleValues": []
                },
                {
                  "type": "Double",
                  "name": "double",
                  "title": "Sample Double Value",
                  "prompt": "double",
                  "description": "This value isn't used.",
                  "optional": true,
                  "multiValued": true,
                  "possibleValues": []
                },
                {
                  "type": "String",
                  "name": "multiRef",
                  "title": "Sample Multi Valued Lookup",
                  "prompt": "ref",
                  "description": "This value isn't used.",
                  "optional": true,
                  "defaultValue": "3",
                  "multiValued": true,
                  "possibleValues": [
                    {
                      "value": "1"
                      , "label": "one"
                    }
                    ,
                    {
                      "value": "2"
                      , "label": "two"
                    }
                    ,
                    {
                      "value": "3"
                      , "label": "three"
                    }
                    ,
                    {
                      "value": "4"
                      , "label": "four"
                    }
                    ,
                    {
                      "value": "5"
                      , "label": "five"
                    }
                    ,
                    {
                      "value": "6"
                      , "label": "six"
                    }
                    ,
                    {
                      "value": "7"
                      , "label": "seven"
                    }
                    ,
                    {
                      "value": "8"
                      , "label": "eight"
                    }
                    ,
                    {
                      "value": "9"
                      , "label": "nine"
                    }
                  ]
                },
                {
                  "type": "Integer",
                  "name": "maxInteger",
                  "title": "Sample Integer Value",
                  "prompt": "integer",
                  "description": "This value isn't used.",
                  "optional": true,
                  "multiValued": false,
                  "possibleValues": []
                }
              ],
              "destinations": [
                {
                  "type": "JSON",
                  "name": "json",
                  "extension": "json",
                  "mediaType": {

                  }
                },
                {
                  "type": "XLSX",
                  "name": "xlsx",
                  "extension": "xlsx",
                  "mediaType": {

                  }
                },
                {
                  "type": "CSV",
                  "name": "tab",
                  "extension": "tsv",
                  "mediaType": {

                  },
                  "delimiter": "\t",
                  "openQuote": "\"",
                  "closeQuote": "\"",
                  "newline": "\n"
                },
                {
                  "type": "CSV",
                  "name": "csv",
                  "extension": "csv",
                  "mediaType": {

                  },
                  "delimiter": ",",
                  "openQuote": "\"",
                  "closeQuote": "\"",
                  "newline": "\r\n"
                },
                {
                  "type": "HTML",
                  "name": "table",
                  "extension": "html",
                  "mediaType": {

                  }
                }
              ],
              "leaf": true
            },
            {
              "name": "LookupValues",
              "path": "demo/LookupValues",
              "title": "Lookup Values",
              "description": "Extract values to use for the demo/FeatureRichExample.",
              "arguments": [

              ],
              "destinations": [
                {
                  "type": "JSON",
                  "name": "json",
                  "extension": "json",
                  "mediaType": {

                  }
                }
              ],
              "leaf": true
            }
          ],
          "path": "demo",
          "leaf": false
        },
      ],
      "path": "",
      "leaf": false
    }
  };

  const [available, setAvailable] = useState(defaultState.available);

  const baseUrl = 'http://localhost:8000/';

  useEffect(() => {
    let url = new URL(baseUrl + 'api/info/available');
    fetch(url)
      .then(r => r.json())
      .then(j => {
        setAvailable(j);
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
          <Nav available={available} />
        </div>        
        <Routes>
          <Route index element={<Home />}></Route>
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
