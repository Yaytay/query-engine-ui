
import { useEffect, useState } from 'react';
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
  , parentId: string
}
function OASObjectEditor(props: OASObjectEditorProps) {

  const [dropped, setDropped] = useState(props.defaultDropped)

  const [object, setObject] = useState<any>()
  const [objectSchema, setObjectSchema] = useState<ObjectType>(props.objectSchema)

  useEffect(() => {
    setObject(props.object)
  }, [props.object])

  useEffect(() => {
    let schemaSet = false
    if (props.objectSchema.discriminator) {
      const d = props.objectSchema.discriminator;
      if (object && d && object[d.propertyName]) {
        const newType = d.mapping[object[d.propertyName]]
        if (newType) {
          const newSchema = props.schema[newType]
          if (newSchema) {
            setObjectSchema(newSchema)
            schemaSet = true
          }
        }
      }
    }
    if (!schemaSet) {
      setObjectSchema(props.objectSchema)
    }
  }, [props.objectSchema, object, props.schema])

  if (!props.objectSchema) {
    console.log("No schema", props.field, object)
    return;
  }

  function handleInputChange(changedField: string, value: any) {
    const rep = { ...object }
    rep[changedField] = value
    if (objectSchema.discriminator) {
      if (changedField === objectSchema.discriminator.propertyName) {
        setDropped(true)
      }
    }
    props.onChange(props.field, rep)
  }

  return (
    <div className="grow flex">
      <div className="flex-col grow">
      {object && objectSchema && objectSchema.sortedProperties.map((f, i) => {
        return (
          <OASFieldEditor
            id={props.parentId + f}
            key={f}
            bg={props.bg + (i % 2)}
            value={object[f]}
            schema={props.schema}
            propertyType={objectSchema.collectedProperties[f]}
            onHelpChange={props.onHelpChange}
            onChange={handleInputChange}
            visible={dropped || !objectSchema.hasRequired}
            field={f}
            index={props.index}
          />
        )
      })}
      </div>
      {objectSchema && objectSchema.sortedProperties.length > 1 && 
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