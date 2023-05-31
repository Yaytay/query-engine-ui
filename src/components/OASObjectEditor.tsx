
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

  function handleInputChange(changedField : string, value : any) {
    var rep={...object}
    rep[changedField] = value
    onChange(field, rep)
  }

  if (schema[type].discriminator) {
    const d = schema[type].discriminator;
    if (object && object[d.propertyName] && d.mapping[object[d.propertyName]]) {
      type = d.mapping[object[d.propertyName]]
    }
  }

  return (
    <div className="grow">
      { schema[type].sortedProperties.map((f,i) => { 
        return (<OASFieldEditor
          id={f}
          key={f}
          bg={bg + (i % 2)}
          object={object}
          schema={schema}
          type={schema[type].name}
          onHelpChange={onHelpChange}
          onChange={handleInputChange}
          parentType={type}
          visible={visible || !schema[type].hasRequired}
          field={f}
          index={index}
          onDrop={i === 0 && schema[type].hasRequired ? () => setVisible(!visible) : null}
          onMoveUp={i === 0 && onMoveUp ? onMoveUp : null}
          onMoveDown={i === 0 && onMoveDown ? onMoveDown : null}
          onRemove={i === 0 && onRemove ? onRemove : null}
          />)
      }) }
    </div>
  )
}


export default OASObjectEditor;