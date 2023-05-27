import { useState, useRef } from 'react';

interface InlineEditProps {
  value : any
  , id : string
  , type : string
  , prompt : string
  , onFocus : React.ReactEventHandler
  , disabled : boolean
  , onChange: (x : any) => void
} 
function InlineEdit(props : InlineEditProps) {

  var [_, setValue] = useState(props.value);
  var input = useRef(null);

  function handleInputChange(e : (React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>)) {    
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