import OASObjectEditor from './OASObjectEditor';

import { SchemaMapType } from "../SchemaType";
import { components } from "../Query-Engine-Schema";

interface PipelineEditorProps {
  pipeline : components["schemas"]["Pipeline"]
  , schema : SchemaMapType
  , onHelpChange : (help : string) => void
  , onChange : (p :  components["schemas"]["Pipeline"]) => void
}

function PipelineEditor({ pipeline, schema, onHelpChange, onChange } : PipelineEditorProps) {

  const help = onHelpChange ?? function (_ : string) { };

  console.log(pipeline)

  return (
    <form className="font-mono overflow-y-auto">
      <OASObjectEditor
        object={pipeline}
        schema={schema}
        onHelpChange={help}
        field='pipeline'
        type='Pipeline'
        bg={0}
        index={0}
        defaultVisible={true}
        onChange={(_, pipeline : components["schemas"]["Pipeline"]) => {
          console.log(pipeline)
          onChange && onChange(pipeline)
        }}
      />
    </form >
  );

}

export default PipelineEditor;
