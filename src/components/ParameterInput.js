import React, { useState } from 'react';
import InputString from './InputString.js';
import InputDate from './InputDate.js';
import InputNumber from './InputNumber.js';
import InputSelect from './InputSelect.js';
import InputAsyncSelect from './InputAsyncSelect.js';
import InputStringMulti from './InputStringMulti.js';


function ParameterInput(props) {

  var [value, setValue] = useState(props.value);

  function handleInputChange(e) {
    setValue(e);
    props.onChange(e);
  }

  var labelClassName = 
    props.highlight 
    ? "text-red-600 text-base font-bold leading-tight tracking-normal"
    : "text-gray-800 text-base font-bold leading-tight tracking-normal"
    ;

  return (
    <div className="break-inside-avoid-column mb-2">
      <label htmlFor={props.arg.name} className={labelClassName}>
        {props.arg.title ?? props.arg.name}
        {props.arg.optional || " *"}
      </label>
      <div className='text-sm'>{props.arg.description}</div>
      {(() => {
        switch (props.arg.type) {
          case 'String':
            if (props.arg.possibleValues.length > 0) {
              return (<InputSelect arg={props.arg} value={value} onChange={handleInputChange} />);
            } else if(props.arg.possibleValuesUrl) {
              return (<InputAsyncSelect arg={props.arg} value={value} onChange={handleInputChange} />);
            } else if (props.arg.multiValued) {
              return (<InputStringMulti arg={props.arg} value={value} onChange={handleInputChange} />);
            } else {
              return (<InputString arg={props.arg} value={value} onChange={handleInputChange} />);
            }
          case 'Date':
          case 'DateTime':
          case 'Time':
            return (<InputDate arg={props.arg} value={value} onChange={handleInputChange} />);
          case 'Integer':
          case 'Long':
          case 'Double':
            return (<InputNumber arg={props.arg} value={value} onChange={handleInputChange} />);
          default:
            return (<input className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id={props.arg.name} type="text" placeholder={props.arg.promp} value={value} onChange={e => handleInputChange(e.target.value)} />);
        }
      })()}
    </div>
  );
}

export default ParameterInput;
