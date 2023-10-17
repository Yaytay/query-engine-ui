import { useState } from 'react';
import {Form} from '@formio/react';
import { components } from "../Query-Engine-Schema";

interface ParametersProps {
  baseUrl : string
  , closeable : boolean
  , onRequestSubmit: (values : any[]) => void
  , onRequestClose: () => void  
  , pipeline: components["schemas"]["PipelineFile"]
  , values: any
}

function Parameters(props : ParametersProps) {

  var [values, setValues] = useState(props.values);
  var [highlight, setHighlight] = useState({});
  var [rootStyle, setRootStyle] = useState({});

  const closeable = props.closeable ?? true;

  function close() {
    props.onRequestClose();
  }

  function submit() {
    var allGood = true;
    let h = {} as any;
    if (props.pipeline.arguments) {
      for (var i = 0; i < props.pipeline.arguments.length; ++i) {
        var arg = props.pipeline.arguments[i];
        if (!values[arg.name] && !arg.optional) {
          h[arg.name] = true;
          allGood = false;
        }
      }
    }

    if (allGood) {
      setHighlight({});
      props.onRequestSubmit(values);
    } else {
      setHighlight(h);
      setRootStyle({ animationName: 'horizontal-shaking', animationIterationCount: '3', animationDuration: '0.05s' });
      setTimeout(() => {
        setRootStyle({});
      }, 500);
    }
  }

  const destOptions = props.pipeline.destinations == null ? [] : props.pipeline.destinations.map((value) => {
    return { value: value.name, label: value.name };
  });

  function getOption(value : any) {
    for (var i in destOptions) {
      if (destOptions[i].value === value) {
        return destOptions[i];
      }
    }
  }

  return (
    <>
      <div className="relative py-8 px-5 md:px-10 bg-white shadow-md rounded border border-gray-400" style={rootStyle} >
        <Form src={ props.baseUrl + 'api/formio/' + props.pipeline.path }
          onSubmit={console.log}
          />
      </div>
    </>
  );
}

export default Parameters;
