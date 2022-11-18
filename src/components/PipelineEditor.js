import React from 'react';
import OASObjectEditor from './OASObjectEditor.js';

function PipelineEditor({ pipeline, schema, onHelpChange, onChange }) {

  const help = onHelpChange ?? function () { };

  return (
    <form className="font-mono overflow-y-auto">
      <OASObjectEditor
        object={pipeline}
        schema={schema}
        onHelpChange={help}
        field='pipeline'
        type='Pipeline'
        bg={0}
        defaultVisible='true'
        onChange={(_,p) => {onChange && onChange(p)}}
      />
    </form >
  );

}

export default PipelineEditor;
