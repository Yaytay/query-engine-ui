
import { useState } from 'react';
import OASFieldEditor from './OASFieldEditor';

import { ObjectTypeMap, ObjectType } from "../SchemaType";

interface OASObjectEditorProps {
  object : any
  , schema : ObjectTypeMap
  , field : string
  , bg : number // row number for background formatting
  , onHelpChange : (help : string) => void
  , onChange : (changedField : string, value : any) => void
  , objectSchema : ObjectType
  , index : number
  , defaultVisible? : boolean
}
function OASObjectEditor({object, schema, field, bg, onHelpChange, onChange, objectSchema, index, defaultVisible} : OASObjectEditorProps) {

  const [visible, setVisible] = useState(defaultVisible)

  if (!object) {
    object = {}
  }

  if (!objectSchema)   {
    console.log("No schema", field, object)
    return ;
  }

  function handleInputChange(changedField : string, value : any) {
    var rep={...object}
    rep[changedField] = value
    onChange(field, rep)
  }

  if (objectSchema.discriminator) {
    const d = objectSchema.discriminator;
    if (object && d && object[d.propertyName]) {
      var newType = d.mapping[object[d.propertyName]]
      if (newType) {
        var newSchema = schema[newType]
        if (newSchema) {
          objectSchema = newSchema
        }
      }
    }
  }

  return (
    <div className="grow">
      { objectSchema.sortedProperties.map((f,i) => { 
        return (<OASFieldEditor
          id={f}
          key={f}
          bg={bg + (i % 2)}
          value={object[f]}
          schema={schema}
          propertyType={objectSchema.collectedProperties[f]}
          onHelpChange={onHelpChange}
          onChange={handleInputChange}
          visible={visible || !objectSchema.hasRequired}
          field={f}
          index={index}
          onDrop={i === 0 && objectSchema.hasRequired ? () => setVisible(!visible) : null}
          />)
      }) }
    </div>
  )
}


export default OASObjectEditor;