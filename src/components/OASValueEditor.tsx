import { useEffect, useRef } from 'react';
import Textarea from 'react-expanding-textarea'
import OASObjectEditor from './OASObjectEditor';
import IconButton from '@mui/material/IconButton';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import RemoveIcon from '@mui/icons-material/Remove';
import Tooltip from '@mui/material/Tooltip';

import { ObjectTypeMap, PropertyType } from "../SchemaType";

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
function OASValueEditor({ id, schema, bg, value, onChange, onHelpChange, onFocus, field, propertyType } : OASValueEditorProps) {

  const colours = [' bg-white', ' bg-slate-50', ' bg-slate-100', ' bg-slate-200', ' bg-slate-300']

  const help = onHelpChange ?? function () { }

  const input = useRef(null);

  const bgcol = (bg < colours.length) ? colours[bg] : colours[0]

  function handleChange(newValue : any) {
    onChange(newValue);
  }

  const classes = "grow bg-transobject appearance-none px-1 text-gray-700 leading-tight font-mono overflow-wrap resize";

  function updateHelpText() {
    let text
    if (propertyType.description) {
      text = '<h3>' + field + '</h3>' + propertyType.description
    }
    if (propertyType.ref) {
      const s = schema[propertyType.ref]
      if (s) {
        text = '<h3>' + s.name + '</h3>' + s.description
      }
    }
    if (propertyType.discriminatorDocs && propertyType.discriminatorDocs.has(value)) {
      text = text + '<br><h2>' + value + '</h2>' + propertyType.discriminatorDocs.get(value)
    }

    if (text) {
      help(text)
    }
  }

  useEffect(() => {
    if (propertyType.discriminatorDocs) {
      updateHelpText()
    }
  }, [value])

  if (propertyType.enum) {
    // Enum/select field
    return (
      <select
        id={id}
        className={bgcol}
        aria-placeholder={propertyType.title ?? propertyType.name}
        defaultValue={value}
        onChange={e => handleChange(e.target.value)}
        onFocus={onFocus}
        ref={input}
      >
        {
          propertyType.enum.map(v => {
            return (<option key={field+v} id={v} value={v}>{v}</option>)
          })
        }
      </select>
    ) 
  } else if (propertyType.type === 'boolean') {
    // Boolean field
    return (
      <select
        id={id}
        aria-placeholder={propertyType.title ?? propertyType.name}
        defaultValue={value ? 1 : 0}
        className={bgcol}
        onChange={e => { handleChange(e.target.value ? true : false) }}
        onFocus={onFocus}
        ref={input}
      >
        <option value="1" key={field +  1}>true</option>
        <option value="0" key={field +  0}>false</option>
        <option value="" key={field + 'null'}></option>
      </select>
    )
  } else if (propertyType.type === 'integer') {
    // Integer field
    let placeholder = (propertyType.title ?? propertyType.name)
    if (placeholder && propertyType.default) {
      placeholder = placeholder + ' (default ' + propertyType.default + ')'
    }
    return (
      <input className={classes + bgcol}
        id={id}
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
        onFocus={onFocus}
        ref={input}
      />
    )
  } else if (propertyType.type === 'string') {
    let placeholder = (propertyType.title ?? propertyType.name)
    if (placeholder && propertyType.default) {
      placeholder = placeholder + ' (default ' + propertyType.default + ')'
    }
    if (propertyType.maxLength && propertyType.maxLength <= 1000) {
      // Short text field
      return (
        <input className={classes + bgcol}
          id={id}
          type='text'
          defaultValue={value}
          onChange={e => handleChange(e.target.value)}
          onKeyUp={(e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              e.currentTarget.blur();
            }            
          })}
          onFocus={onFocus}
          ref={input}
          placeholder={placeholder}
        />
      )
    } else {
      // Long text field
      return (
        <Textarea className={classes + ' h-6' + bgcol}
          id={id}
          placeholder={propertyType.title ?? propertyType.name}
          defaultValue={value}
          onChange={e => handleChange(e.target.value)}
          onFocus={onFocus}
          ref={input}
        />
      )
    }
  } else if (propertyType.type === 'array' && propertyType.items) {
    // Array field
    const itemType : PropertyType = propertyType.items
    const itemTypeLabel = itemType.ref || itemType.type
    return (
      <div className={bgcol}>
        {value && value.map((v : any, i : number) => {
          return (
            <div className="flex grow" key={field + i}>
              <div className="">
                &nbsp;&nbsp;-
              </div>
              <OASValueEditor
                id={field + i}
                value={v}
                propertyType={itemType}
                schema={schema}
                field={field}
                onHelpChange={help}
                bg={bg}
                index={i}
                onChange={(v) => {
                  const newArr = [...value];
                  newArr[i] = v;
                  handleChange(newArr);
                }}
                onFocus={onFocus}
              />
              <div className="flex-col">
                { i > 0 && 
                  <div className="inline-block">
                    <IconButton sx={{ 'borderRadius': '20%', padding: '1px' }} size="small" onClick={() => {
                      const newArr = [...value];
                      const item = newArr.splice(i, 1);
                      newArr.splice(i - 1, 0, item[0]);
                      onChange(newArr);
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
                      onChange(newArr);
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
  } else if (propertyType.type === 'object' && propertyType.ref) {
    // Single object field
    let ref = propertyType.ref
    if (propertyType.ref && schema[propertyType.ref].discriminator) {
      const discriminatorProperty = schema[propertyType.ref].discriminator?.propertyName
      const discriminatorMapping = schema[propertyType.ref].discriminator?.mapping
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
                index={0}
                object={value}
                schema={schema}
                field={field}
                bg={bg}
                onHelpChange={help}
                objectSchema={schema[ref]}
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
    console.log('Don\'t know how to render ', field)
  }

}

export default OASValueEditor;