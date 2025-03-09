import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import Tooltip from '@mui/material/Tooltip';


import OASValueEditor from './OASValueEditor';
import { PropertyType, ObjectTypeMap } from '../SchemaType';
import { useEffect, useState } from 'react';


interface OASFieldEditorProps {
  id: string
  , value: any
  , schema: ObjectTypeMap
  , field: string
  , bg: number // row number for background formatting
  , onHelpChange: (help: string) => void
  , onChange: (field: string, newValue: any) => void
  , index: number
  , visible: boolean
  , propertyType: PropertyType
}
function OASFieldEditor(props: OASFieldEditorProps) {

  const [value, setValue] = useState<any>()

  useEffect(() => {
    setValue(props.value)
  }, [props.value])

  const colours = [' bg-white', ' bg-slate-50', ' bg-slate-100', ' bg-slate-200', ' bg-slate-300']

  const help = props.onHelpChange ?? function () { }

  const bgcol = (props.bg < colours.length) ? colours[props.bg] : colours[0]

  if (!props.propertyType) {
    console.log("Field " + props.field + " not found in " + JSON.stringify(props.schema))
    return (<div data-field={props.field} />)
  }

  function updateHelpText() {
    let text
    if (props.propertyType.description) {
      text = '<h3>' + props.field + '</h3>' + props.propertyType.description
    }
    if (props.propertyType.ref) {
      const s = props.schema[props.propertyType.ref]
      if (s) {
        text = '<h3>' + s.name + '</h3>' + s.description
      }
    }
    if (props.propertyType.discriminatorDocs && props.propertyType.discriminatorDocs.has(value)) {
      text = text + '<br><h2>' + value + '</h2>' + props.propertyType.discriminatorDocs.get(value)
    }

    if (text) {
      help(text)
    }
  }

  function onFocus(e: React.SyntheticEvent<any>) {
    updateHelpText()
    e.preventDefault()
  }

  if (
    !props.visible
    && !(props.propertyType && props.propertyType.required)
    && !(value !== props.propertyType.default)
  ) {
    return (<div className='hidden'></div>)
  }

  if (props.propertyType.type === 'object') {
    // Single value
    return (
      <div className={"align-top" + bgcol}>
        <label className="px-1 text-blue-500 reflabel" onClick={onFocus}>{props.field}:</label>
        <div className="grow flex flex-col">
          <OASValueEditor
            id={props.id}
            key={props.id}
            bg={props.bg + (props.index % 2)}
            value={value}
            propertyType={props.propertyType}
            schema={props.schema}
            onHelpChange={props.onHelpChange}
            onChange={(v) => { 
              props.onChange(props.field, v)
            }}
            onFocus={onFocus}
            field={props.field}
            index={props.index}
          />
        </div>
      </div>
    )
  } else if (props.propertyType.type === 'array' && props.propertyType.items) {
    // Array
    const itemType : PropertyType = props.propertyType.items
    const itemTypeLabel = itemType.ref || itemType.type
    return (
      <div className={"align-top" + bgcol}>
        <div className='flex'>
          <label className="px-1 text-blue-500 flex" onClick={onFocus}>{props.field}:</label>
          <div className='grow'></div>
          <div className=''>
            <IconButton sx={{ 'borderRadius': '20%', padding: '1px' }} size="small" onClick={() => {
              const newArr = value ? [...value] : [];
              if (itemType.ref) {
                newArr.push({});
              } else {
                newArr.push('');
              }
              props.onChange(props.field, newArr);
            }}>
              <Tooltip title={'Create a new ' + itemTypeLabel}>
                <AddIcon fontSize="inherit" />
              </Tooltip>
            </IconButton>
          </div>
        </div>
        <OASValueEditor
          id={props.id}
          key={props.id}
          bg={props.bg + (props.index % 2)}
          value={value}
          propertyType={props.propertyType}
          schema={props.schema}
          onHelpChange={props.onHelpChange}
          onChange={(v) => { props.onChange(props.field, v) }}
          onFocus={onFocus}
          field={props.field}
          index={props.index}
        />
      </div>
    )
  } else {
    // Primitive
    return (
      <div className={"flex align-top" + bgcol}>
        <label className="px-1 text-blue-500 stdlabel" onClick={onFocus}>{props.field}:</label>
        <OASValueEditor
          id={props.id}
          key={props.id}
          bg={props.bg + (props.index % 2)}
          value={value}
          propertyType={props.propertyType}
          schema={props.schema}
          onHelpChange={props.onHelpChange}
          onChange={(v) => { props.onChange(props.field, v) }}
          onFocus={onFocus}
          field={props.field}
          index={props.index}
        />
      </div>
    )
  }
}

export default OASFieldEditor;