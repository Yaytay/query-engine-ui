import React, { useState } from 'react';
import Creatable  from 'react-select/creatable';

function InputStringMulti(props) {

  function makeValue(v) {
    if (v.value) {
      return {"value": v.value, "label": v.value};
    } else {
      return {"value": v, "label": v};
    }
  }

  var defaultValue = [];
  if (props.value) {
    if (Array.isArray(props.value)) {
      props.value.forEach(element => {
        defaultValue = [...defaultValue, makeValue(element)];
      });
    } else {
      defaultValue = [...defaultValue, makeValue(props.value)];
    }
  }
  if (!props.arg.multiValued) {
    defaultValue = (defaultValue === []) ? null : defaultValue[0];
  }

  var [value, setValue] = useState(defaultValue);
  var [inputValue, setInputValue] = useState('');

  function handleChange(e) {    
    console.log('InputStringMulti: ' + JSON.stringify(e));
    setValue(e);
    setInputValue('');
    if (Array.isArray(e)) {
      props.onChange(e.map(v => v.value));
    } else {
      props.onChange(e.value);
    }
  }

  function handleInputChange(inputValue) {
    setInputValue(inputValue);
  };

  function handleKeyDown(event) {
    if (!inputValue) return;
    switch (event.key) {
      case 'Enter':
      case 'Tab':
        handleChange([...value, {"value": inputValue, "label": inputValue}]);
        event.preventDefault();
        break;
      default:
    }
  };

  return (
    <Creatable
            id={props.arg.name}
            inputValue={inputValue}
            value={value}
            components={{"DropdownIndicator": null}}
            isMulti={true}
            menuIsOpen={false}
            onChange={handleChange}
            onInputChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={props.arg.prompt}
            />
  );
}

export default InputStringMulti;
 