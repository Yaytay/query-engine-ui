import { useState, useEffect } from 'react';
import {Form} from '@formio/react';
import { components } from "../Query-Engine-Schema";

interface ParametersProps {
  baseUrl : string
  , closeable : boolean
  , onRequestSubmit: (values : any[]) => void
  , onRequestClose: () => void  
  , pipeline: components["schemas"]["PipelineFile"]
  , values: any
  , columns: number
}

function Parameters(props : ParametersProps) {

  var [values, setValues] = useState(props.values)
  var [highlight, setHighlight] = useState({})
  var [rootStyle, setRootStyle] = useState({})

  var [form, setForm] = useState({})
  var [curlStr, setCurlStr] = useState('')

  var formObject : any

  useEffect(() => {
    fetch(props.baseUrl + 'api/formio/' + props.pipeline.path + '?columns=' + props.columns)
      .then((response) => response.json())
      .then((data) => {
        setForm(data);
      });
  }, []);

  const closeable = props.closeable ?? true;

  var curlStr : string;

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

  function onSubmit(submission: any, arg2: any, arg3: any) {
    console.log('onSubmit:', submission, arg2, arg3)
    if (formObject) {
      formObject.emit('submitDone', submission)
    }
  }

  function onSubmitDone(submission: any) {
    console.log('onSubmitDone:', submission)
  }

  function onChange(submission: any) {
    console.log('Changed:', submission)
  }

  function onError(submission: any) {
    console.log('onError:', submission)
  }

  function onRender(submission: any) {
    console.log('onRender:', submission)
  }

  function onCustomEvent(submission: any) {
    console.log('onCustomEvent:', submission)
  }

  function onPrevPage(submission: any) {
    console.log('onPrevPage:', submission)
  }

  function onNextPage(submission: any) {
    console.log('onNextPage:', submission)
  }

  function formReady(webform2: any) {
    console.log('formReady:', webform2)
    formObject = webform2
  }

  return (
    <>
      <div className="relative py-1 px-4 md:px-10 bg-white shadow-md rounded border border-gray-400" style={rootStyle} >
        <Form 
          form={form}
          onSubmit={onSubmit}
          onSubmitDone={onSubmitDone}
          onChange={onChange}
          onError={onError}
          onRender={onRender}
          onCustomEvent={onCustomEvent}
          onPrevPage={onPrevPage}
          onNextPage={onNextPage}
          formReady={formReady}
          />
      </div>
      <div>
        {curlStr}
      </div>
    </>
  );
}

export default Parameters;
