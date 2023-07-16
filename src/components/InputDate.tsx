import { useState } from 'react';
import { InputStdProps } from './InputStdProps';

function InputDate(props : InputStdProps) {

  var [value, setValue] = useState(props.value);

  function handleInputChange(e : React.ChangeEvent<HTMLInputElement>) {    
    console.log(e.target.value);
  
    console.log('InputDate: ' + e.target.value);
    setValue(e.target.value);
    props.onChange(e.target.value);
  }

  var inputType;

  switch (props.arg.type) {
    case 'Date':
      inputType = "date";
      break;
    case 'DateTime':
      inputType = "datetime-local";
      break;
    case 'Time':
      inputType = "time";
      break;
    default:
  }

  return (
    <input 
      className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
      id={props.arg.name} 
      type={inputType} 
      placeholder={props.arg.prompt} 
      value={value} 
      onChange={handleInputChange}
      />
  );
}

export default InputDate;
