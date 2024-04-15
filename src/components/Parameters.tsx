import { useState, useEffect, useRef } from 'react';
import { Form } from '@formio/react';
import { Formio }  from 'formiojs';
import { components } from "../Query-Engine-Schema";
import { ArgsToArgs } from '../Test';
import equal from 'fast-deep-equal/es6/react';
import './Parameters.css';

interface ParametersProps {
  baseUrl : string
  , closeable : boolean
  , onRequestSubmit: (values : any[]) => Promise<void>
  , onRequestClose?: () => void | undefined
  , pipeline: components["schemas"]["PipelineFile"]
  , values: any
  , columns: number
  , displayUrl: boolean
}

function Parameters(props : ParametersProps) {

  useEffect(() => {
    console.log('Mounted Parameters')
    return () => {
      console.log("Unmounted Parameters");
    };    
  }, []);  

  Formio.requireLibrary('flatpickr-formio', 'flatpickr-formio', 'https://cdn.jsdelivr.net/npm/flatpickr');

  const [urlStr, setUrlStr] = useState('')
  const [sub, _] = useState({data: props.values})
  const [form, setForm] = useState({})
  
  console.log('Props: ', props)
  console.log('Sub: ', sub)

  const url = useRef(props.baseUrl + 'api/formio/' + props.pipeline.path + '?columns=' + props.columns);
  const formSet = useRef({})

  let webform: any

  useEffect(() => {
    console.log('Fetching form', url)
    fetch(url.current, {credentials: 'include'})
      .then((response) => response.json())
      .then((data) => {
        console.log('Setting form', formSet.current, data)
        if (!equal(formSet.current, data)) {
          console.log("Actually setting form")
          formSet.current = data
          setForm(data)
        }
      });
  }, [props.baseUrl, props.pipeline.path, props.columns]);

  function onSubmit(submission: any) {
    console.log('onSubmit:', submission)
    props.onRequestSubmit(submission.data)
      .then((_) => {
          if (webform) {
            webform.emit('submitDone')
          }
        }
      )
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
    if (submission.component.key === '_cancel' && props.onRequestClose) {
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
    webform = webform2
  }

  console.log('Rendering with', form, sub)
  return (
    <>
      <div className="relative py-1 px-4 md:px-10 bg-white shadow-md rounded border border-gray-400" >
        <Form 
          form={form}
          submission={sub}
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
              <a href={urlStr} target="_blank" rel="noreferrer">Direct Link</a>
            </div>
          )
        }
      </div>
    </>
  );
}

export default Parameters;
