import OASObjectEditor from './OASObjectEditor';

import { ObjectTypeMap } from "../SchemaType";
import { components } from "../Query-Engine-Schema";

interface PipelineEditorProps {
  pipeline : components["schemas"]["Pipeline"]
  , schema : ObjectTypeMap
  , onHelpChange : (help : string) => void
  , onChange : (p :  components["schemas"]["Pipeline"]) => void
}

function PipelineEditor({ pipeline, schema, onHelpChange, onChange } : PipelineEditorProps) {

  const help = onHelpChange ?? function (_ : string) { };

  return (
    <form className="font-mono overflow-y-auto">
      <OASObjectEditor
        object={pipeline}
        schema={schema}
        onHelpChange={help}
        field='pipeline'
        objectSchema={schema['Pipeline']}
        bg={0}
        index={0}
        defaultVisible={true}
        onChange={(_, pipeline : components["schemas"]["Pipeline"]) => {
          onChange && onChange(pipeline)
        }}
      />
    </form >
  );

}

export default PipelineEditor;
