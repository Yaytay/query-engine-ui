import { useRef } from 'react';
import Textarea from 'react-expanding-textarea'


interface PipelineEditorFieldProps {
  id : string
  , parentSchema : any
  , name : string
  , parent : any
  , visible : boolean
  , onChange : (field : string, newValue : any) => void
  , onHelpChange : (help : string) => void
}

function PipelineEditorField({ id, parentSchema, name, parent, visible, onChange, onHelpChange } : PipelineEditorFieldProps) {

  const field = parentSchema['properties'][name]
  const help = onHelpChange ?? function () { }

  var input = useRef(null);

  if (!field) {
    console.log("Field " + name + " not found in " + JSON.stringify(parentSchema))
    return (<div />)
  }

  function handleInputChange(e : React.ChangeEvent<HTMLInputElement>) {
    onChange(name, e.currentTarget.value);
  }

  function onFocus() {
    help('<h3>' + name + '</h3>' + field.description)
  }

  const classes = "grow bg-transparent appearance-none px-1 text-gray-700 leading-tight font-mono overflow-wrap resize";

  var ctrl;
  if (!field) {
    ctrl = (<div />)
  } else if (field.type === 'boolean') {
    ctrl = (
      <select
        id={id}
        placeholder={field.prompt}
        value={parent[name] ? 1 : 0}
        onChange={e => { onChange(name, (e.target.value !== '0') ? true : false) }}
        onFocus={onFocus ?? null}
        ref={input}
      >
        <option value="1">true</option>
        <option value="0">false</option>
      </select>
    )
  } else if (field.type === 'integer') {
    ctrl = (
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
    ctrl = (
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
    ctrl = (
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
    ctrl = (
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
        {ctrl}
      </div>
    )
  } else {
    return (<div />)
  }
}

export default PipelineEditorField;