import { useState } from 'react';
import { InputStdProps } from './InputStdProps';
import Creatable  from 'react-select/creatable';

interface ValueType {
  value: string
  , label: string
}

function InputStringMulti(props : InputStdProps) {

  function makeValue(v : any) : ValueType {
    if (v.value) {
      return {"value": v.value, "label": v.value};
    } else {
      return {"value": v, "label": v};
    }
  }

  function appendValue(current : ValueType[] | ValueType | null, newValue : any) : ValueType[] {
    let newArray = current === null ? []  : Array.isArray(current) ? current : [current];
    return newArray.concat(makeValue(newValue))
  }

  var defaultValue : (ValueType[] | ValueType | null) = [];
  if (props.value) {
    if (Array.isArray(props.value)) {
      props.value.forEach(element => {
        defaultValue = appendValue(defaultValue, element)
      });
    } else {
      defaultValue = appendValue(defaultValue, props.value)
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
    let result = value === null ? []  : Array.isArray(value) ? value : [value];
    result = result.concat(makeValue(inputValue))
    switch (event.key) {
      case 'Enter':
      case 'Tab':
        handleChange(appendValue(value, inputValue));
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
 