import { useState } from 'react'
import Select from 'react-select'
import { InputStdProps } from './InputStdProps';
import { mapPossibleValues, getOption } from './SelectHelpers';

function InputSelect(props : InputStdProps) {

  const possibleValues = mapPossibleValues(props.arg.possibleValues);

  var value = useState(getOption(possibleValues, props.arg.multiValued, props.value))

  function handleInputChange(e : React.ChangeEvent<HTMLSelectElement>) {    
      console.log('InputSelect: ' + JSON.stringify(e));
    if (Array.isArray(e)) {
      props.onChange(e.map(v => v.value));
    } else {
      props.onChange(e.currentTarget.value);
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
