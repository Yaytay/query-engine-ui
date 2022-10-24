import React, { useState, useRef, useEffect } from 'react';

function InlineEdit(props) {

  var [value, setValue] = useState(props.value);
  var input = useRef(null);

  function handleInputChange(e) {    
    console.log('InputString: ' + e.target.value);
    setValue(e.target.value);
    props.onChange && props.onChange(e.target.value);
  }

  if (!props.disabled) {
    console.log(input)
    input.current.focus()
  }

  // const classes = "bg-transparent appearance-none w-full py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline";
  const classes = "bg-transparent appearance-none w-full py-2 text-gray-700 leading-tight";

  return (
    <input className={classes}
      id={props.id} 
      type="text" 
      placeholder={props.prompt} 
      value={value} 
      onChange={handleInputChange} 
      disabled={props.disabled ?? true}
      ref={input}
      />
  )
}

export default InlineEdit;