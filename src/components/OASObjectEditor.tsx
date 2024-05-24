
import { useState } from 'react';
import OASFieldEditor from './OASFieldEditor';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import { ObjectTypeMap, ObjectType } from "../SchemaType";

interface OASObjectEditorProps {
  object: any
  , schema: ObjectTypeMap
  , field: string
  , bg: number // row number for background formatting
  , onHelpChange: (help: string) => void
  , onChange: (changedField: string, value: any) => void
  , objectSchema: ObjectType
  , index: number
  , defaultDropped?: boolean
}
function OASObjectEditor({ object, schema, field, bg, onHelpChange, onChange, objectSchema, index, defaultDropped }: OASObjectEditorProps) {

  const [dropped, setDropped] = useState(defaultDropped)

  if (!object) {
    object = {}
  }

  if (!objectSchema) {
    console.log("No schema", field, object)
    return;
  }

  function handleInputChange(changedField: string, value: any) {
    // console.log('Changed ' + objectSchema.name + '[' + changedField + '] = ' + JSON.stringify(value))
    const rep = { ...object }
    rep[changedField] = value
    if (objectSchema.discriminator) {
      if (changedField === objectSchema.discriminator.propertyName) {
        setDropped(true)
      }
    }
    onChange(field, rep)
  }

  if (objectSchema.discriminator) {
    const d = objectSchema.discriminator;
    if (object && d && object[d.propertyName]) {
      const newType = d.mapping[object[d.propertyName]]
      if (newType) {
        const newSchema = schema[newType]
        if (newSchema) {
          objectSchema = newSchema
        }
      }
    }
  }

  return (
    <div className="grow flex">
      <div className="flex-col grow">
      {objectSchema.sortedProperties.map((f, i) => {
        return (
          <OASFieldEditor
            id={f}
            key={f}
            bg={bg + (i % 2)}
            value={object[f]}
            schema={schema}
            propertyType={objectSchema.collectedProperties[f]}
            onHelpChange={onHelpChange}
            onChange={handleInputChange}
            visible={dropped || !objectSchema.hasRequired}
            field={f}
            index={index}
          />
        )
      })}
      </div>
      {objectSchema.sortedProperties.length > 1 && 
        <div className="flex-col">
        {dropped ||
          <IconButton sx={{ 'borderRadius': '20%', padding: '1px' }} size="small" onClick={() => { setDropped(true) }}>
            <Tooltip title={'Show all ' + objectSchema.name + ' fields'}>
              <KeyboardDoubleArrowDownIcon fontSize="inherit" />
            </Tooltip>
          </IconButton>
        }
        {dropped &&
          <IconButton sx={{ 'borderRadius': '20%', padding: '1px' }} size="small" onClick={() => { setDropped(false) }}>
            <Tooltip title={'Hide default and optional ' + objectSchema.name + ' fields'}>
              <KeyboardDoubleArrowLeftIcon fontSize="inherit" />
            </Tooltip>
          </IconButton>
        }
        </div>
      }
    </div>
  )
}


export default OASObjectEditor;