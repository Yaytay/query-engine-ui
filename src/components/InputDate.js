import React, { useState } from 'react';
import Datetime from 'react-datetime';
import 'moment';

function InputDate(props) {

  var [value, setValue] = useState(props.value);

  function handleInputChange(e) {
    var formattedTimestamp
    switch (props.arg.type) {
      case 'Date':
        formattedTimestamp = e.format('YYYY-MM-DD');
        break;
      case 'DateTime':
        formattedTimestamp = e.format();
        break;
      case 'Time':
        formattedTimestamp = e.format('HH:mm:ss');
        break;
      default:
    }
  
    console.log('InputDate: ' + formattedTimestamp);
    setValue(formattedTimestamp);
    props.onChange(formattedTimestamp);
  }

  var dateFormat;
  var timeFormat;

  switch (props.arg.type) {
    case 'Date':
      dateFormat = 'YYYY-MM-DD';
      timeFormat = false;
      break;
    case 'DateTime':
      dateFormat = 'YYYY-MM-DD';
      timeFormat = 'HH:mm:ss';
      break;
    case 'Time':
      dateFormat = false;
      timeFormat = 'HH:mm:ss';
      break;
    default:
  }

  return (
    <Datetime inputProps={{ "placeholder": props.arg.prompt, "className": "appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" }}
      initialValue={value}
      dateFormat={dateFormat}
      timeFormat={timeFormat}
      closeOnSelect={true}    
      id={props.arg.name} placeholder={props.arg.promp} onChange={handleInputChange} />
  );
}

export default InputDate;
