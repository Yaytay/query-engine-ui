import React, { useState } from 'react';
import Select from 'react-select';
import ParameterInput from './ParameterInput.js';

function Parameters(props) {

  function close() {
    props.onRequestClose();
  }

  function submit() {    
    console.log(values);
    
    var allGood = true;
    highlight = {};
    for (var i = 0; i < props.pipeline.arguments.length; ++i) {
      var arg = props.pipeline.arguments[i];
      if (!values[arg.name] && !arg.optional) {
        highlight[arg.name] = true;
        allGood = false;
      }
    }

    if (allGood) {
      props.onRequestSubmit(values);
    } else {
      setHighlight(highlight);
      setRootStyle({animationName: 'horizontal-shaking', animationIterationCount: '3', animationDuration: '0.05s'});
      setTimeout(() => {
        setRootStyle({});
      }, 500);
    }
  }

  const options = props.pipeline.destinations == null ? [] : props.pipeline.destinations.map((value, index) => {
    return { value: value.name, label: value.name};
  });


  var [values, setValues] = useState(props.values);
  var [highlight, setHighlight] = useState({});
  var [rootStyle, setRootStyle] = useState({});

  return (
    <>
      <div className="relative py-8 px-5 md:px-10 bg-white shadow-md rounded border border-gray-400" style={rootStyle} >
        <h1 className="text-gray-800 font-lg font-bold tracking-normal leading-tight mb-4">{props.pipeline.title ?? props.pipeline.name}</h1>
        <div className="relative mb-5 mt-2">
        {props.pipeline.description}
        </div>
        <hr className="mb-5"></hr>

        <div className="columns-3xs">
        {props.pipeline.arguments.map((value, index) => {
          const arg = value;
          return (
            <div key={value.name}>
              <ParameterInput arg={arg} highlight={highlight[arg.name]} value={values[arg.name]} onChange={v => {values[arg.name] = v; setValues(values);}} />
            </div>
          )
        })}
        </div>

        {props.pipeline.destinations.length > 1 && 
          <>
            <hr className="mt-2 mb-5"></hr>
            <div className="mb-5">
              <label htmlFor="destination" className="text-gray-800 text-sm font-bold leading-tight tracking-normal">Output</label>
              <Select id="destination" options={options} menuPortalTarget={document.body} defaultValue={options[0]} onChange={e => {values.destination = e.value; setValues(values); console.log(values)}}/>
            </div>
          </>
        }

        <div className="flex items-center justify-start w-full">
          <button className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 transition duration-150 ease-in-out hover:bg-indigo-600 bg-indigo-700 rounded text-white px-8 py-2 text-sm" onClick={submit}>Submit</button>
          <button className="focus:outline-none focus:ring-2 focus:ring-offset-2  focus:ring-gray-400 ml-3 bg-gray-100 transition duration-150 text-gray-600 ease-in-out hover:border-gray-400 hover:bg-gray-300 border rounded px-8 py-2 text-sm" onClick={close}>Cancel</button>
        </div>
        <button className="cursor-pointer absolute top-0 right-0 mt-4 mr-5 text-gray-400 hover:text-gray-600 transition duration-150 ease-in-out rounded focus:ring-2 focus:outline-none focus:ring-gray-600" aria-label="close modal" onClick={() => close()} >
          <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-x" width="20" height="20" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" />
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </>
  );
}

export default Parameters;
