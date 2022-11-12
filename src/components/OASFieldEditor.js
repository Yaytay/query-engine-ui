import React, { useRef } from 'react';
import Textarea from 'react-expanding-textarea'
import OASObjectEditor from './OASObjectEditor';


function OASFieldEditor({ id, openapi, field, fieldOrders, object, visible, onChange, onHelpChange, parentType }) {

  const parentSchema = openapi.components.schemas[parentType]
  const fieldSchema = parentSchema.properties[field]
  const help = onHelpChange ?? function () { }

  var input = useRef(null);

  function typeFromRef(arg) {
    var lastPos = arg.lastIndexOf('/')
    if (lastPos > 0) {
      return arg.substring(lastPos + 1);
    } else {
      return arg;
    }
  }

  if (!fieldSchema) {
    console.log("Field " + field + " not found in " + JSON.stringify(openapi))
    return (<div f={field}/>)
  }

  function handleChange(newValue) {
    onChange(field, newValue);
  }

  function onFocus() {
    help('<h3>' + field + '</h3>' + fieldSchema.description)
  }

  const classes = "grow bg-transobject appearance-none px-1 text-gray-700 leading-tight font-mono overflow-wrap resize";

  var input;
  var hidden=' hidden';
  if (visible
    || (parentSchema.required && parentSchema.required.includes(field))
    || (object[field] && object[field] != (fieldSchema.default))
  ) {
    hidden = ''
  }

  if (!fieldSchema) {
    return (
      <div className={"flex" + hidden} onClick={onFocus}>
        <label className="px-1 text-blue-500">{field}:</label>
        <div className="grow">Unknown field {field}</div>
      </div>
    )
  } else if (fieldSchema.type === 'boolean') {
    return (
      <div className={"flex" + hidden} onClick={onFocus}>
        <label className="px-1 text-blue-500">{field}:</label>
        <select
          id={id}
          placeholder={field.prompt}
          value={object[field] ? 1 : 0}
          onChange={e => { handleChange((e.target.value > 0) ? true : false) }}
          onFocus={onFocus ?? null}
          ref={input}
          pattern={field.pattern}
        >
          <option value="1">true</option>
          <option value="0">false</option>
        </select>
      </div>
    )
  } else if (fieldSchema.type === 'integer') {
    return (
      <div className={"flex" + hidden} onClick={onFocus}>
        <label className="px-1 text-blue-500">{field}:</label>
        <input className={classes}
          id={id}
          type='text'
          placeholder={field.prompt}
          value={object[field]}
          onChange={e => handleChange(e.target.value)}
          onFocus={onFocus ?? null}
          ref={input}
          pattern={field.pattern}
        />
      </div>
    )
  } else if (fieldSchema.maxLength) {
    return (
      <div className={"flex" + hidden} onClick={onFocus}>
        <label className="px-1 text-blue-500">{field}:</label>
        <input className={classes}
          id={id}
          type='text'
          placeholder={field.prompt}
          value={object[field]}
          onChange={e => handleChange(e.target.value)}
          onFocus={onFocus ?? null}
          ref={input}
          pattern={field.pattern}
        />
      </div>
    )
  } else if (fieldSchema.enum) {
    return (
      <div className={"flex" + hidden} onClick={onFocus}>
        <label className="px-1 text-blue-500">{field}:</label>
        <select
          id={id}
          placeholder={fieldSchema.prompt}
          value={object[field]}
          onChange={e => handleChange(e.target.value)}
          onFocus={onFocus ?? null}
          ref={input}
          pattern={fieldSchema.pattern}
        >
          {
            fieldSchema.enum.map(v => {
              return (<option id={v} value={v}>{v}</option>)
            })
          }
        </select>
        </div>
    )
  } else if (fieldSchema.items && fieldSchema.items['$ref']) {
    return (
      <div className={hidden}>
        <label className="px-1 text-blue-500" onClick={onFocus}>{field}:</label>
        { object[field] && object[field].map((v, i) => {
          return (
              <div className="flex">
                <div className="">
                  &nbsp;&nbsp;-
                </div>
                <OASObjectEditor
                  object={v}
                  openapi={openapi}
                  field={field}
                  fieldOrders={fieldOrders}
                  onHelpChange={help}
                  type={typeFromRef(fieldSchema.items['$ref'])}
                  onChange={(f,v) => {
                    var newArr = [...object[field]];
                    newArr[i] = v;
                    handleChange(newArr);
                  }}
                />
              </div>
            )
          })}
      </div>
    )
  } else if (fieldSchema['$ref']) {
    return (
      <div className={"flex" + hidden} onClick={onFocus}>
        <label className="px-1 text-blue-500">{field}:</label>
        <div>Object</div>
      </div>
    )
  } else if (fieldSchema.additionalProperties) {
    return (
      <div className={"flex" + hidden} onClick={onFocus}>
        <label className="px-1 text-blue-500">{field}:</label>
        <div>Map</div>
      </div>
    )
  } else {
    return (
      <div className={"flex" + hidden} onClick={onFocus}>
        <label className="px-1 text-blue-500">{field}:</label>
        <Textarea className={classes + ' h-6'}
          id={id}
          placeholder={field.prompt}
          value={object[field]}
          onChange={e => handleChange(e.target.value)}
          onFocus={onFocus ?? null}
          ref={input}
        />
      </div>
    )
  }

}

export default OASFieldEditor;