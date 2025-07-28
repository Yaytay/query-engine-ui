import { useState, useEffect, useRef } from 'react';
import { Form, FormType } from '@formio/react';
import { components } from "../Query-Engine-Schema";
import { ArgsToArgs } from '../Test';
import equal from 'fast-deep-equal/es6/react';
import './Parameters.css';

interface ParametersProps {
  baseUrl : string
  , closeable : boolean
  , onRequestSubmit: (values : any[]) => Promise<void>
  , onRequestClose?: () => void | undefined
  , pipelineDetails: components["schemas"]["PipelineDetails"]
  , values: any
  , columns: number
  , displayUrl: boolean
}

function Parameters(props : ParametersProps) {

  const [urlStr, setUrlStr] = useState('')
  const [sub, _] = useState({data: props.values})
  const [form, setForm] = useState<FormType | undefined>()
  const [webform, setWebForm] = useState<any>()

  const formiourl = useRef(props.baseUrl + 'api/formio/' + props.pipelineDetails.path + '?columns=' + props.columns);
  const formSet = useRef({})

  useEffect(() => {
    console.log('Fetching form', formiourl)
    fetch(formiourl.current, {credentials: 'include'})
      .then((response) => response.json())
      .then((data) => {
        if (!equal(formSet.current, data)) {
          formSet.current = data
          setForm(data)
        }
      });
  }, [props.baseUrl, props.pipelineDetails, props.columns]);

  function onSubmit(submission: any) {
    console.log('onSubmit:', submission)
    props.onRequestSubmit(submission.data)
      .then((_) => {
        console.log('Submit finished', webform)
          if (webform) {
            webform.emit('submitDone')
            console.log('Submit done emitted')
          }
        }
      )
  }

  function onSubmitDone(submission: any) {
    console.log('onSubmitDone:', submission)
  }

  function onChange(submission: any) {
    console.log('Changed:', submission)
    if (props.displayUrl && props.pipelineDetails) {
      const query = ArgsToArgs(props.pipelineDetails, submission.data);
      setUrlStr(props.baseUrl + 'query/' + props.pipelineDetails.path + (query == null ? '' : ('?' + query)))
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
    setWebForm(webform2)
  }

  return (
    <>
      <div className="relative py-1 px-4 md:px-10 bg-white shadow-md rounded border border-gray-400" >
        { form && 
        <Form 
          form={form}
          src=""
          submission={sub}
          onSubmit={onSubmit}
          onSubmitDone={onSubmitDone}
          onChange={onChange}
          onError={onError}
          onRender={onRender}
          onCustomEvent={onCustomEvent}
          onPrevPage={onPrevPage}
          onNextPage={onNextPage}
          onFormReady={formReady}
          />
        }
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
