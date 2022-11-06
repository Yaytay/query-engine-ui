import React, { useRef } from 'react';
import Textarea from 'react-expanding-textarea'


function PipelineEditorField({ id, parentSchema, name, parent, visible, onChange, onHelpChange }) {

  const field = parentSchema['properties'][name]
  const help = onHelpChange ?? function () { }

  var input = useRef(null);

  if (!field) {
    console.log("Field " + name + " not found in " + JSON.stringify(parentSchema))
    return (<div />)
  }

  function handleInputChange(e) {
    onChange(name, e.target.value);
  }

  function onFocus() {
    help('<h3>' + name + '</h3>' + field.description)
  }

  const classes = "grow bg-transparent appearance-none px-1 text-gray-700 leading-tight font-mono overflow-wrap resize";

  var input;
  if (!field) {
    input = (<div />)
  } else if (field.type === 'boolean') {
    input = (
      <select
        id={id}
        placeholder={field.prompt}
        value={parent[name] ? 1 : 0}
        onChange={e => { onChange(name, (e.target.value > 0) ? true : false) }}
        onFocus={onFocus ?? null}
        ref={input}
        pattern={field.pattern}
      >
        <option value="1">true</option>
        <option value="0">false</option>
      </select>
    )
  } else if (field.type === 'integer') {
    input = (
      <input className={classes}
        id={id}
        type='text'
        placeholder={field.prompt}
        value={parent[name]}
        onChange={handleInputChange}
        onFocus={onFocus ?? null}
        ref={input}
        pattern={field.pattern}
      />
    )
  } else if (field.maxLength) {
    input = (
      <input className={classes}
        id={id}
        type='text'
        placeholder={field.prompt}
        value={parent[name]}
        onChange={handleInputChange}
        onFocus={onFocus ?? null}
        ref={input}
        pattern={field.pattern}
      />
    )
  } else if (field.enum) {
    input = (
      <select
        id={id}
        placeholder={field.prompt}
        value={parent[name]}
        onChange={onChange}
        onFocus={onFocus ?? null}
        ref={input}
        pattern={field.pattern}
      >
        {
          field.enum.map(v => {
            return (<option id={v} value={v}>{v}</option>)
          })
        }
      </select>
    )
  } else {
    input = (
      <Textarea className={classes + ' h-6'}
        id={id}
        placeholder={field.prompt}
        value={parent[name]}
        onChange={handleInputChange}
        onFocus={onFocus ?? null}
        ref={input}
      />
    )
  }

  if (visible
    || (parentSchema.required && parentSchema.required.includes(name))
    || (parent[name] && parent[name] != (field.default))
  ) {
    return (
      <div className="flex" onClick={onFocus}>
        <label className="px-1 text-blue-500">{name}:</label>
        {input}
      </div>
    )
  } else {
    return (<div />)
  }
}

export default PipelineEditorField;