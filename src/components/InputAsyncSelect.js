import React, { useState, useEffect } from 'react'
import AsyncSelect from 'react-select/async'
import { mapPossibleValues, getOption } from './SelectHelpers';

function InputSelect(props) {

  const [value, setValue] = useState();
  const [defaultValue, setDefaultValue] = useState();

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  function handleInputChange(e) {
    console.log('InputSelect: ' + JSON.stringify(e));
    setValue(e);
    if (Array.isArray(e)) {
      props.onChange(e.map(v => v.value));
    } else {
      props.onChange(e.value);
    }
  }

  function loadOptions() {
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
