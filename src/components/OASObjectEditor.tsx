
import { useState } from 'react';
import OASFieldEditor from './OASFieldEditor';

import { SchemaMapType } from "../SchemaType";

interface OASObjectEditorProps {
  object : any
  , schema : SchemaMapType
  , field : string
  , bg : number // row number for background formatting
  , onHelpChange : (help : string) => void
  , onChange : (changedField : string, value : any) => void
  , type : string
  , index : number
  , defaultVisible? : boolean
  , onMoveUp? : any
  , onMoveDown? : any
  , onRemove? : any
}
function OASObjectEditor({object, schema, field, bg, onHelpChange, onChange, type, index, defaultVisible, onMoveUp, onMoveDown, onRemove} : OASObjectEditorProps) {

  const [visible, setVisible] = useState(defaultVisible)

  var objectSchema = schema[type]

  function handleInputChange(changedField : string, value : any) {
    var rep={...object}
    rep[changedField] = value
    onChange(field, rep)
  }

  if (objectSchema.discriminator) {
    const d = objectSchema.discriminator;
    if (object && d && object[d.propertyName]) {
      var newType = d.mapping.get(object[d.propertyName])
      if (newType) {
        type = newType
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
          object={object}
          schema={schema}
          onHelpChange={onHelpChange}
          onChange={handleInputChange}
          parentType={type}
          visible={visible || !objectSchema.hasRequired}
          field={f}
          index={index}
          onDrop={i === 0 && objectSchema.hasRequired ? () => setVisible(!visible) : null}
          onMoveUp={i === 0 && onMoveUp ? onMoveUp : null}
          onMoveDown={i === 0 && onMoveDown ? onMoveDown : null}
          onRemove={i === 0 && onRemove ? onRemove : null}
          />)
      }) }
    </div>
  )
}


export default OASObjectEditor;