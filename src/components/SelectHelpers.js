

export function mapPossibleValues(input) {
  var result = []
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
      } else if (typeof(value) === 'object') {
        return {value: JSON.stringify(i), label: JSON.stringify(i)};
      } else {
        return {value: i, label: i};
      }
    })
  }
  return result
}

export function getOption(possibleValues, multi, value) {
  function lookupValue(v) {
    if (Array.isArray(possibleValues)) {
      return possibleValues.find(o => o.value === v);
    }
  }

  var result = [];
  if (value) {
    if (Array.isArray(value)) {
      result = value.map(element => lookupValue(element))
    } else {
      result = [lookupValue(value)];
    }
  }
  if (!multi) {
    result = (result === []) ? null : result[0];
  }
  return result
}
