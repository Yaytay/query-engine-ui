

export function mapPossibleValues(input : any) {
  let result = []
  if (Array.isArray(input)) {
    result = input.map(i => {
      if (i.value) {
        if (i.label) {
          return i;
        } else {
          return {value: i.value, label: i.value};
        }
      } else if (i.label) {
        return {value: i.label, label: i.label};
      } else if (typeof(i.value) === 'object') {
        return {value: JSON.stringify(i), label: JSON.stringify(i)};
      } else {
        return {value: i, label: i};
      }
    })
  }
  return result
}

export function getOption(possibleValues : any, multi : boolean | undefined, value : any) {
  function lookupValue(v : any) {
    if (Array.isArray(possibleValues)) {
      return possibleValues.find(o => o.value === v);
    }
  }

  let result = [];
  if (value) {
    if (Array.isArray(value)) {
      result = value.map(element => lookupValue(element))
    } else {
      result = [lookupValue(value)];
    }
  }
  if (!multi) {
    result = (Array.isArray(result) && result.length == 0) ? null : result[0];
  }
  return result
}
