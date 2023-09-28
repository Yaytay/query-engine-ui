import { useState, useEffect } from 'react'
import AsyncSelect from 'react-select/async'
import { mapPossibleValues, getOption } from './SelectHelpers';
import { InputStdProps } from './InputStdProps';

function InputSelect(props : InputStdProps) {

  const [value, setValue] = useState();
  const [defaultValue, setDefaultValue] = useState();

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  function handleInputChange(e : any) {    
    console.log('InputAsyncSelect: ', e);
    setValue(e);
    if (Array.isArray(e)) {
      props.onChange(e.map(v => v.value));
    } else {
      props.onChange(e.value);
    }
  }

  function loadOptions() {
    if (props.arg.possibleValuesUrl) {
      return fetch(props.arg.possibleValuesUrl)
        .then(r => r.json())
        .then(j => {
          console.log(j);
          var pv = mapPossibleValues(j);
          var o = getOption(pv, props.arg.multiValued, props.value);
          setDefaultValue(o);
          return pv;
        })
    }
  }

  return (
    <AsyncSelect 
      id={props.arg.name}
      cacheOptions
      loadOptions={loadOptions}
      menuPortalTarget={document.body}
      isMulti={props.arg.multiValued}
      onChange={handleInputChange}
      value={value}
      defaultOptions
    />
  );
}

export default InputSelect;
