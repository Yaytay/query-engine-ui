import { useEffect, useRef, useState } from 'react';
import OASObjectEditor from './OASObjectEditor';
import IconButton from '@mui/material/IconButton';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import RemoveIcon from '@mui/icons-material/Remove';
import Tooltip from '@mui/material/Tooltip';

import { ObjectTypeMap, PropertyType } from "../SchemaType";
import { AutoResizeTextArea } from './AutoResizeTextArea';

interface OASValueEditorProps {
  id : string
  , value : any
  , schema : ObjectTypeMap
  , field : string
  , propertyType : PropertyType
  , bg : number // row number for background formatting
  , onHelpChange : (help : string) => void
  , onChange : (newValue : any) => void
  , onFocus : (e : React.SyntheticEvent<any>) => void
  , index : number
}
function OASValueEditor(props : OASValueEditorProps) {

  const colours = [' bg-white', ' bg-slate-50', ' bg-slate-100', ' bg-slate-200', ' bg-slate-300']

  const help = props.onHelpChange ?? function () { }

  const input = useRef(null)

  const [value, setValue] = useState<any>()

  const bgcol = (props.bg < colours.length) ? colours[props.bg] : colours[0]

  function handleChange(newValue : any) {
    props.onChange(newValue);
  }

  const classes = "grow bg-transobject appearance-none px-1 text-gray-700 leading-tight font-mono overflow-wrap resize";

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

  useEffect(() => {
    if (props.propertyType.discriminatorDocs) {
      updateHelpText()
    }
    setValue(props.value)
  }, [props.value])

  if (props.propertyType.enum) {
    // Enum/select field
    return (
      <select
        id={props.id}
        className={bgcol}
        aria-placeholder={props.propertyType.title ?? props.propertyType.name}
        value={value}
        onChange={e => handleChange(e.target.value)}
        onFocus={props.onFocus}
        ref={input}
      >
        {
          props.propertyType.enum.map(v => {
            return (<option key={props.field+v} id={v} value={v}>{v}</option>)
          })
        }
      </select>
    ) 
  } else if (props.propertyType.type === 'boolean') {
    // Boolean field
    return (
      <select
        id={props.id}
        aria-placeholder={props.propertyType.title ?? props.propertyType.name}
        defaultValue={value ? 1 : 0}
        className={bgcol}
        onChange={e => { handleChange(e.target.value ? true : false) }}
        onFocus={props.onFocus}
        ref={input}
      >
        <option value="1" key={props.field +  1}>true</option>
        <option value="0" key={props.field +  0}>false</option>
        <option value="" key={props.field + 'null'}></option>
      </select>
    )
  } else if (props.propertyType.type === 'integer') {
    // Integer field
    let placeholder = (props.propertyType.title ?? props.propertyType.name)
    if (placeholder && props.propertyType.default) {
      placeholder = placeholder + ' (default ' + props.propertyType.default + ')'
    }
    return (
      <input className={classes + bgcol}
        id={props.id}
        type='text'
        placeholder={placeholder}
        defaultValue={value}
        onChange={e => handleChange(e.target.value)}
        onKeyUp={(e => {
          if (e.key === 'Enter') {
            e.preventDefault();
            e.currentTarget.blur();
          }            
        })}
        onFocus={props.onFocus}
        ref={input}
      />
    )
  } else if (props.propertyType.type === 'string') {
    let placeholder = (props.propertyType.title ?? props.propertyType.name)
    if (placeholder && props.propertyType.default) {
      placeholder = placeholder + ' (default ' + props.propertyType.default + ')'
    }
    if (props.propertyType.maxLength && props.propertyType.maxLength <= 1000) {
      // Short text field
      return (
        <input className={classes + bgcol}
          id={props.id}
          type='text'
          defaultValue={value}
          onChange={e => handleChange(e.target.value)}
          onKeyUp={(e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              e.currentTarget.blur();
            }            
          })}
          onFocus={props.onFocus}
          ref={input}
          placeholder={placeholder}
        />
      )
    } else {
      // Long text field
      return (
        <AutoResizeTextArea className={classes + ' h-6' + bgcol}
          id={props.id}
          value={value}
          placeholder={props.propertyType.title ?? props.propertyType.name}
          defaultValue={value}
          onChange={e => handleChange(e.target.value)}
          onFocus={props.onFocus}
        />
      )
    }
  } else if (props.propertyType.type === 'array' && props.propertyType.items) {
    // Array field
    const itemType : PropertyType = props.propertyType.items
    const itemTypeLabel = itemType.ref || itemType.type
    return (
      <div className={bgcol}>
        {value && value.map((v : any, i : number) => {
          return (
            <div className="flex grow" key={props.field + i}>
              <div className="">
                &nbsp;&nbsp;-
              </div>
              <OASValueEditor
                id={props.field + i}
                value={v}
                propertyType={itemType}
                schema={props.schema}
                field={props.field}
                onHelpChange={help}
                bg={props.bg}
                index={i}
                onChange={(v) => {
                  const newArr = [...value];
                  newArr[i] = v;
                  handleChange(newArr);
                }}
                onFocus={props.onFocus}
              />
              <div className="flex-col">
                { i > 0 && 
                  <div className="inline-block">
                    <IconButton sx={{ 'borderRadius': '20%', padding: '1px' }} size="small" onClick={() => {
                      const newArr = [...value];
                      const item = newArr.splice(i, 1);
                      newArr.splice(i - 1, 0, item[0]);
                      props.onChange(newArr);
                    }}>
                      <Tooltip title={'Move this ' + itemTypeLabel + ' to position ' + (i - 1)}>
                        <ArrowUpwardIcon fontSize="inherit" />
                      </Tooltip>
                    </IconButton>
                  </div>
                }
                { i < value.length - 1 && 
                  <div className="inline-block">
                    <IconButton sx={{ 'borderRadius': '20%', padding: '1px' }} size="small" onClick={() => {
                      const newArr = [...value];
                      const item = newArr.splice(i, 1);
                      newArr.splice(i + 1, 0, item[0]);
                      props.onChange(newArr);
                    }}>
                      <Tooltip title={'Move this ' + itemTypeLabel + ' to position ' + (i + 1)}>
                        <ArrowDownwardIcon fontSize="inherit" />
                      </Tooltip>
                    </IconButton>
                  </div>
                }
                <div className="inline-block">
                  <IconButton sx={{ 'borderRadius': '20%', padding: '1px' }} size="small" onClick={() => {
                    const newArr = [...value];
                    newArr.splice(i, 1);
                    handleChange(newArr);
                  }}>
                    <Tooltip title={'Delete this ' + itemTypeLabel}>
                      <RemoveIcon fontSize="inherit" />
                    </Tooltip>
                  </IconButton>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  } else if (props.propertyType.type === 'object' && props.propertyType.ref) {
    // Single object field
    let ref = props.propertyType.ref
    if (props.propertyType.ref && props.schema[props.propertyType.ref].discriminator) {
      const discriminatorProperty = props.schema[props.propertyType.ref].discriminator?.propertyName
      const discriminatorMapping = props.schema[props.propertyType.ref].discriminator?.mapping
      if (discriminatorProperty && discriminatorMapping && value) {
        const discriminatorValue = value[discriminatorProperty]
        if (discriminatorValue) {
          const subRef = discriminatorMapping[discriminatorValue]
          if (subRef) {
            // Change the type to the sub type indicated by the discriminator
            ref = subRef
          }
        }
      }
    }

    return (
      <div className={"flex grow flex-col" + bgcol}>
        <div className="flex">
          <div className="">
            &nbsp;&nbsp;
          </div>
          <div className="grow flex flex-col">
            <div className="flex" >
              <OASObjectEditor
                index={props.index}
                parentId={props.id + '.'}
                object={value}
                schema={props.schema}
                field={props.field}
                bg={props.bg}
                onHelpChange={help}
                objectSchema={props.schema[ref]}
                onChange={(_, v) => {
                  handleChange(v);
                }}
              />
            </div>
          </div>
        </div>
      </div>

    )
  } else {
    console.log('Don\'t know how to render ', props.field, props.propertyType)
  }

}

export default OASValueEditor;