import React from 'react';
import PipelineArgumentEditor from './PipelineArgumentEditor.js';
import PipelineEditorField from './PipelineEditorField.js';

function PipelineEditor({ pipeline, openapi, onHelpChange, onChange }) {

  const help = onHelpChange ?? function () { };

  function onFieldChange(field, value) {
    var newPipeline = { ...pipeline }
    newPipeline[field] = value
    onChange && onChange(newPipeline)
  }

  function onArgumentChange(index, value) {
    var newPipeline = { ...pipeline }
    newPipeline.arguments[index] = value
    onChange && onChange(newPipeline)
  }

  return (
    <form className="font-mono overflow-y-auto">
      <PipelineEditorField
        name={'title'}
        parentSchema={openapi.components.schemas.Pipeline}
        parent={pipeline}
        onHelpChange={help}
        onChange={onFieldChange}
        visible={true}
      />
      <PipelineEditorField
        name={'description'}
        parentSchema={openapi.components.schemas.Pipeline}
        parent={pipeline}
        onHelpChange={help}
        onChange={onFieldChange}
        visible={true}
      />
      <PipelineEditorField
        name={'condition'}
        parentSchema={openapi.components.schemas.Pipeline}
        parent={pipeline}
        onHelpChange={help}
        onChange={onFieldChange}
        visible={true}
      />

      <div className="">
        <label className="px-1 text-blue-500">arguments:</label>
        {
          pipeline.arguments && pipeline.arguments.map((a, i) => {
            return (
              <div className="flex">
                <div className="">
                  &nbsp;&nbsp;-
                </div>
                <PipelineArgumentEditor
                  argument={a}
                  openapi={openapi}
                  onHelpChange={help}
                  onChange={newArg => onArgumentChange(i, newArg)}
                />
              </div>
            )
          }
          )
        }
      </div>
    </form >
  );

}

export default PipelineEditor;
