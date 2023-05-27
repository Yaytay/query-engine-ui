import React, { useState } from 'react';

function InputNumber(props) {

  var [value, setValue] = useState(props.value);

  function handleInputChange(e) {    
    console.log('InputNumber: ' + e.target.value);
    setValue(e.target.value);
    props.onChange(e.target.value);
  }

  return (
    <input className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
            id={props.arg.name} type="number" placeholder={props.arg.prompt} value={value} onChange={handleInputChange}/>
  );
}

export default InputNumber;
 