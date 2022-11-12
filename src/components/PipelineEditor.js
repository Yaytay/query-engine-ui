import React from 'react';
import OASObjectEditor from './OASObjectEditor.js';

function PipelineEditor({ pipeline, openapi, onHelpChange, onChange }) {

  const fieldOrders = {
    Pipeline: ['title', 'description', 'condition', 'arguments', 'sourceEndpoints', 'dynamicEndpoints', 'source', 'processors', 'destinations']
    , Argument: ['name', 'type', 'title', 'prompt', 'description', 'optional', 'multiValued', 'ignored', 'dependsUpon', 'defaultValue', 'minimumValue', 'maximumValue', 'possibleValues', 'possibleValuesUrl', 'permittedValuesRegex']
    , ArgumentValue: ['value', 'label']
    , Condition: ['expression']
    , Destination: ['mediaType', 'name', 'type']
    , Processor: ['type']
    , Source: ['type']
  }

  const fieldTypes = {
    Source: {
      SQL: 'SourceSQL'
      , HTML: 'SourceHTML'
    }
    , Processor: {
      LIMIT: 'ProcessorLimit'
      , GROUP_CONCAT: 'ProcessorGroupConcat'
      , DYNAMIC_FIELD: 'ProcessorDynamicField'
      , SCRIPT: 'ProcessorScript'
    }
    , Destination: {
      JSON: 'DestinationJson'
      , HTML: 'DestinationHtml'
      , XLSX: 'DestinationXlsx'
      , Delimited: 'DestinationDelimited'
    }
  }

  const help = onHelpChange ?? function () { };

  return (
    <form className="font-mono overflow-y-auto">
      <OASObjectEditor
        object={pipeline}
        openapi={openapi}
        fieldOrders={fieldOrders}
        onHelpChange={help}
        field='pipeline'
        type='Pipeline'
        onChange={(_,p) => {onChange && onChange(p)}}
      />
    </form >
  );

}

export default PipelineEditor;
