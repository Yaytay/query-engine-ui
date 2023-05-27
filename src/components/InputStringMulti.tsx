import { useState } from 'react';
import { InputStdProps } from './InputStdProps';
import Creatable  from 'react-select/creatable';

interface ValueType {
  value: string
  , label: string
}

function InputStringMulti(props : InputStdProps) : ValueType {

  function makeValue(v : any) {
    if (v.value) {
      return {"value": v.value, "label": v.value};
    } else {
      return {"value": v, "label": v};
    }
  }

  var defaultValue : (ValueType[] | ValueType | null) = [];
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
    defaultValue = Array.isArray(defaultValue) ? defaultValue[0] : null;
  }

  var [value, setValue] = useState(defaultValue);
  var [inputValue, setInputValue] = useState('');

  function handleChange(e : any) {    
    console.log('InputStringMulti: ' + JSON.stringify(e));
    setValue(e);
    setInputValue('');
    if (Array.isArray(e)) {
      props.onChange(e.map(v => v.value));
    } else {
      props.onChange(e.value);
    }
  }

  function handleInputChange(inputValue : any) {
    setInputValue(inputValue);
  };

  function handleKeyDown(event : any) {
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
 