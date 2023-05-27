import React, { useState } from 'react'
import Select from 'react-select'
import { mapPossibleValues, getOption } from './SelectHelpers';

function InputSelect(props) {

  const possibleValues = mapPossibleValues(props.arg.possibleValues);

  var value = useState(getOption(possibleValues, props.arg.multiValued, props.value))

  function handleInputChange(e) {
    console.log('InputSelect: ' + JSON.stringify(e));
    if (Array.isArray(e)) {
      props.onChange(e.map(v => v.value));
    } else {
      props.onChange(e.value);
    }
  }

  return (
    <Select 
      id={props.arg.name}
      options={possibleValues}
      menuPortalTarget={document.body}
      isMulti={props.arg.multiValued}
      onChange={handleInputChange}
      defaultValue={value}
    />
  );
}

export default InputSelect;
