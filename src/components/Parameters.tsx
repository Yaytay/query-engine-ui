import { useState, useEffect } from 'react';
import {Form} from '@formio/react';
import { components } from "../Query-Engine-Schema";
import { ArgsToArgs } from '../Test';


interface ParametersProps {
  baseUrl : string
  , closeable : boolean
  , onRequestSubmit: (values : any[]) => void
  , onRequestClose: () => void  
  , pipeline: components["schemas"]["PipelineFile"]
  , values: any
  , columns: number
  , displayUrl: boolean
}

function Parameters(props : ParametersProps) {

  var [form, setForm] = useState({})
  var [urlStr, setUrlStr] = useState('')
  var [values, _] = useState(props.values)

  var formObject : any

  console.log('Props: ', props)
  console.log('Values: ', values)

  useEffect(() => {
    fetch(props.baseUrl + 'api/formio/' + props.pipeline.path + '?columns=' + props.columns)
      .then((response) => response.json())
      .then((data) => {
        setForm(data);
      });
  }, []);

  function onSubmit(submission: any) {
    console.log('onSubmit:', submission)

    props.onRequestSubmit(submission.data);

    if (formObject) {
      formObject.emit('submitDone', submission)
    }
  }

  function onSubmitDone(submission: any) {
    console.log('onSubmitDone:', submission)
  }

  function onChange(submission: any) {
    console.log('Changed:', submission)
    if (props.displayUrl) {
      const query = ArgsToArgs(props.pipeline, submission.data);
      setUrlStr(props.baseUrl + 'query/' + props.pipeline.path + (query == null ? '' : ('?' + query)))
    }
  }

  function onError(submission: any) {
    console.log('onError:', submission)
  }

  function onRender(submission: any) {
    console.log('onRender:', submission)
  }

  function onCustomEvent(submission: any) {
    console.log('onCustomEvent:', submission)
    if (submission.component.key === '_cancel') {
      props.onRequestClose();
    }
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
      <div className="relative py-1 px-4 md:px-10 bg-white shadow-md rounded border border-gray-400" >
        <Form 
          form={form}
          submission={values}
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
        {
          props.displayUrl && (
            <div>
              <a href={urlStr} target="_blank">Direct Link</a>
            </div>
          )
        }
      </div>
    </>
  );
}

export default Parameters;
