import OASObjectEditor from './OASObjectEditor';

import { components } from "../Query-Engine-Schema";

interface PipelineEditorProps {
  pipeline : components["schemas"]["PipelineFile"]
  , schema : any
  , onHelpChange : () => {}
  , onChange : (p: any) => {}
}

function PipelineEditor({ pipeline, schema, onHelpChange, onChange } : PipelineEditorProps) {

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
