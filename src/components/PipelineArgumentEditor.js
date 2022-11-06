
import PipelineEditorField from './PipelineEditorField.js';

function PipelineArgumentEditor({argument, openapi, onHelpChange, onChange}) {

  const help = onHelpChange ?? function(){};

  function onFieldChange(field, value) {
    var newArg = {...argument}
    newArg[field] = value
    onChange && onChange(newArg)
  }

  return (
    <div className="grow">
      <PipelineEditorField 
        name={'name'}
        parentSchema={openapi.components.schemas.Argument}
        parent={argument}
        onHelpChange={help}
        onChange={onFieldChange}
      />
      <PipelineEditorField 
        name={'type'}
        parentSchema={openapi.components.schemas.Argument}
        parent={argument}
        onHelpChange={help}
        onChange={onFieldChange}
      />
      <PipelineEditorField 
        name={'title'}
        parentSchema={openapi.components.schemas.Argument}
        parent={argument}
        onHelpChange={help}
        onChange={onFieldChange}
      />
      <PipelineEditorField 
        name={'prompt'}
        parentSchema={openapi.components.schemas.Argument}
        parent={argument}
        onHelpChange={help}
        onChange={onFieldChange}
      />
      <PipelineEditorField 
        name={'description'}
        parentSchema={openapi.components.schemas.Argument}
        parent={argument}
        onHelpChange={help}
        onChange={onFieldChange}
      />
      <PipelineEditorField 
        name={'optional'}
        parentSchema={openapi.components.schemas.Argument}
        parent={argument}
        onHelpChange={help}
        onChange={onFieldChange}
      />
      <PipelineEditorField 
        name={'multiValued'}
        parentSchema={openapi.components.schemas.Argument}
        parent={argument}
        onHelpChange={help}
        onChange={onFieldChange}
      />
      <PipelineEditorField 
        name={'ignored'}
        parentSchema={openapi.components.schemas.Argument}
        parent={argument}
        onHelpChange={help}
        onChange={onFieldChange}
      />
      <PipelineEditorField 
        name={'dependsUpon'}
        parentSchema={openapi.components.schemas.Argument}
        parent={argument}
        onHelpChange={help}
        onChange={onFieldChange}
      />
      <PipelineEditorField 
        name={'defaultValue'}
        parentSchema={openapi.components.schemas.Argument}
        parent={argument}
        onHelpChange={help}
        onChange={onFieldChange}
      />
      <PipelineEditorField 
        name={'minimumValue'}
        parentSchema={openapi.components.schemas.Argument}
        parent={argument}
        onHelpChange={help}
        onChange={onFieldChange}
      />
      <PipelineEditorField 
        name={'maximumValue'}
        parentSchema={openapi.components.schemas.Argument}
        parent={argument}
        onHelpChange={help}
        onChange={onFieldChange}
      />
      <PipelineEditorField 
        name={'possibleValues'}
        parentSchema={openapi.components.schemas.Argument}
        parent={argument}
        onHelpChange={help}
        onChange={onFieldChange}
      />
      <PipelineEditorField 
        name={'possibleValuesUrl'}
        parentSchema={openapi.components.schemas.Argument}
        parent={argument}
        onHelpChange={help}
        onChange={onFieldChange}
      />
      <PipelineEditorField 
        name={'permittedValuesRegex'}
        parentSchema={openapi.components.schemas.Argument}
        parent={argument}
        onHelpChange={help}
        onChange={onFieldChange}
      />

    </div>
  )

}

export default PipelineArgumentEditor