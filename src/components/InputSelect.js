import React, { useState } from 'react';
import Select from 'react-select'

function InputSelect(props) {

  function lookupValue(v) {
    if (Array.isArray(props.arg.possibleValues)) {
      for (var i = 0; i < props.arg.possibleValues.length; ++i) {
        if (props.arg.possibleValues[i].value === v) {
          return props.arg.possibleValues[i];
        }
      }
    }
    return null;
  }

  var defaultValue = [];
  if (props.value) {
    if (Array.isArray(props.value)) {
      props.value.forEach(element => {
        defaultValue = [...defaultValue, lookupValue(element)];
      });
    } else {
      defaultValue = [...defaultValue, lookupValue(props.value)];
    }
  }
  if (!props.arg.multiValued) {
    defaultValue = (defaultValue === []) ? null : defaultValue[0];
  }

  var [value, setValue] = useState(defaultValue);

  function handleInputChange(e) {    
    console.log('InputSelect: ' + JSON.stringify(e));
    setValue(e);
    if (Array.isArray(e)) {
      props.onChange(e.map(v => v.value));
    } else {
      props.onChange(e.value);
    }
  }

  return (
    <Select id={props.arg.name}
            options={props.arg.possibleValues} 
            menuPortalTarget={document.body} 
            isMulti={props.arg.multiValued}
            onChange={handleInputChange}
            defaultValue={value}
            />
  );
}

export default InputSelect;
 