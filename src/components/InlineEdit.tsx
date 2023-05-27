import React, { useState, useRef, useEffect } from 'react';

function InlineEdit(props) {

  var [value, setValue] = useState(props.value);
  var input = useRef(null);

  function handleInputChange(e) {    
    console.log('InputString: ' + e.target.value);
    setValue(e.target.value);
    props.onChange && props.onChange(e.target.value);
  }

  // const classes = "bg-transparent appearance-none w-full py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline";
  const classes = "grow bg-transparent appearance-none px-1 text-gray-700 leading-tight font-mono overflow-wrap resize";

  if (props.type === 'textarea') {
    return (
      <textarea className={classes}
        id={props.id} 
        placeholder={props.prompt} 
        value={props.value} 
        onChange={handleInputChange} 
        onFocus={props.onFocus ?? null}
        disabled={props.disabled ?? true}
        ref={input}
        />
    )
  } else {
    return (
      <input className={classes}
        id={props.id} 
        type={props.type ?? "text"} 
        placeholder={props.prompt} 
        value={props.value} 
        onChange={handleInputChange} 
        onFocus={props.onFocus ?? null}
        disabled={props.disabled ?? true}
        ref={input}
        />
    )  
  }
}

export default InlineEdit;