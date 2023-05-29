import { useRef } from 'react';
import Textarea from 'react-expanding-textarea'
import OASObjectEditor from './OASObjectEditor';
import IconButton from '@mui/material/IconButton';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Tooltip from '@mui/material/Tooltip';

import { components } from "../Query-Engine-Schema";

interface OASFieldEditorProps {
  id : string
  , object : any
  , schema : any
  , fieldOrders : any
  , field : any
  , bg : any
  , onHelpChange : any
  , onChange : any
  , type : any
  , index : number
  , visible : boolean
  , parentType : any
  , onDrop : any
  , onMoveUp : any
  , onMoveDown : any
  , onRemove : any
}
function OASFieldEditor({ id, schema, field, fieldOrders, bg, object, visible, onChange, onHelpChange, parentType, onDrop, index, onMoveUp, onMoveDown, onRemove } : OASFieldEditorProps) {

  const colours = [' bg-white', ' bg-slate-50', ' bg-slate-100', ' bg-slate-200', ' bg-slate-300']
  const parentSchema = schema[parentType]
  const fieldSchema = parentSchema.collectedProperties[field]
  const help = onHelpChange ?? function () { }

  var input = useRef(null);

  const bgcol = (bg < colours.length) ? colours[bg] : colours[0]

  function typeFromRef(arg) {
    var lastPos = arg.lastIndexOf('/')
    if (lastPos > 0) {
      return arg.substring(lastPos + 1);
    } else {
      return arg;
    }
  }

  if (!fieldSchema) {
    console.log("Field " + field + " not found in " + JSON.stringify(schema))
    return (<div f={field} />)
  }

  if (!object) {
    // console.log("Null object of type " + JSON.stringify(fieldSchema) + ' from ' + parentType)
    object = {}
  }

  function handleChange(newValue) {
    onChange(field, newValue);
  }

  function onFocus(e) {
    var text = '<h3>' + field + '</h3>' + fieldSchema.description
    var ref;
    if (fieldSchema.items && fieldSchema.items['$ref']) {
      ref = fieldSchema.items['$ref']
    } else if (fieldSchema['$ref']) {
      ref = fieldSchema['$ref']
    } else if (fieldSchema.additionalProperties && fieldSchema.additionalProperties['$ref']) {
      ref = fieldSchema.additionalProperties['$ref']
    }
    console.log(fieldSchema)
    if (ref) {
      ref = typeFromRef(ref)
      var s = schema[ref]
      if (s) {
        text = '<h3>' + s.name + '</h3>' + s.description
      }
    }

    help(text)
    e.preventDefault()
  }

  const dropControl = onDrop ? (
    <div className="flex-none">
      <IconButton sx={{ 'borderRadius': '20%', padding: '1px' }} size="small" onClick={onDrop}>
        {
          visible ? (
            <Tooltip title={'Hide fields that are not required and that have default values'}>
              <KeyboardDoubleArrowLeftIcon fontSize="inherit" />
            </Tooltip>
          ) : (
            <Tooltip title={'Show all fields in this ' + parentType}>
              <KeyboardDoubleArrowDownIcon fontSize="inherit" />
            </Tooltip>
          )
        }
      </IconButton>
    </div>
  ) : null

  const upControl = onMoveUp ? (
    <div className="flex-none">
      <IconButton sx={{ 'borderRadius': '20%', padding: '1px' }} size="small" onClick={onMoveUp}>
        <Tooltip title={'Move this ' + parentType + ' to position ' + (index - 1)}>
          <ArrowUpwardIcon fontSize="inherit" />
        </Tooltip>
      </IconButton>
    </div>
  ) : null

  const downControl = onMoveDown ? (
    <div className="flex-none">
      <IconButton sx={{ 'borderRadius': '20%', padding: '1px' }} size="small" onClick={onMoveDown}>
        <Tooltip title={'Move this ' + parentType + ' to position ' + (index + 1)}>
          <ArrowDownwardIcon fontSize="inherit" />
        </Tooltip>
      </IconButton>
    </div>
  ) : null

  const minusControl = onRemove ? (
    <div className="flex-none">
      <IconButton sx={{ 'borderRadius': '20%', padding: '1px' }} size="small" onClick={onRemove}>
        <Tooltip title={'Delete this ' + parentType}>
          <RemoveIcon fontSize="inherit" />
        </Tooltip>
      </IconButton>
    </div>
  ) : null

  const classes = "grow bg-transobject appearance-none px-1 text-gray-700 leading-tight font-mono overflow-wrap resize";

  var hidden = ' hidden';
  if (visible
    || (fieldSchema && fieldSchema.required)
    || (object && object[field] && object[field] !== (fieldSchema.default))
  ) {
    hidden = ''
  }

  var value = object[field] === undefined ? fieldSchema.default : object[field]

  if (!fieldSchema) {
    // No schema
    return (
      <div className={"flex" + hidden + bgcol}>
        <label className="px-1 text-blue-500">{field}:</label>
        <div className="grow">Unknown field {field}</div>
      </div>
    )
  } else if (fieldSchema.type === 'boolean') {
    // Boolean field
    return (
      <div className={"flex align-top" + hidden + bgcol}>
        <label className="px-1 text-blue-500" onClick={onFocus}>{field}:</label>
        <select
          id={id}
          placeholder={field.prompt}
          value={value ? 1 : 0}
          className={bgcol}
          onChange={e => { handleChange((e.target.value > 0) ? true : false) }}
          onFocus={onFocus}
          ref={input}
          pattern={field.pattern}
        >
          <option value="1" key={field +  1}>true</option>
          <option value="0" key={field +  0}>false</option>
          <option value="" key={field + 'null'}></option>
        </select>
        <div className="grow" />
        {minusControl}{upControl}{downControl}{dropControl}
      </div>
    )
  } else if (fieldSchema.type === 'integer') {
    // Integer field
    return (
      <div className={"flex" + hidden + bgcol}>
        <label className="px-1 text-blue-500" onClick={onFocus}>{field}:</label>
        <input className={classes + bgcol}
          id={id}
          type='text'
          placeholder={field.prompt}
          value={value}
          onChange={e => handleChange(e.target.value)}
          onFocus={onFocus}
          ref={input}
          pattern={field.pattern}
        />
        {minusControl}{upControl}{downControl}{dropControl}
      </div>
    )
  } else if (fieldSchema.maxLength) {
    // Short text field
    return (
      <div className={"flex align-top" + hidden + bgcol}>
        <label className="px-1 text-blue-500" onClick={onFocus}>{field}:</label>
        <input className={classes + bgcol}
          id={id}
          type='text'
          value={value}
          onChange={e => handleChange(e.target.value)}
          onFocus={onFocus}
          ref={input}
          pattern={fieldSchema.pattern}
          placeholder={fieldSchema['x-prompt']}
        />
        {minusControl}{upControl}{downControl}{dropControl}
      </div>
    )
  } else if (fieldSchema.enum) {
    // Enum/select field
    return (
      <div className={"flex" + hidden + bgcol}>
        <label className="px-1 text-blue-500" onClick={onFocus}>{field}:</label>
        <select
          id={id}
          className={bgcol}
          placeholder={fieldSchema.prompt}
          value={value}
          onChange={e => handleChange(e.target.value)}
          onFocus={onFocus}
          ref={input}
          pattern={fieldSchema.pattern}
        >
          {
            fieldSchema.enum.map(v => {
              return (<option key={field+v} id={v} value={v}>{v}</option>)
            })
          }
        </select>
        <div className="grow" />
        {minusControl}{upControl}{downControl}{dropControl}
      </div>
    )
  } else if (fieldSchema.items && fieldSchema.items['$ref']) {
    // Array field
    return (
      <div className={hidden + bgcol}>
        <div className='flex'>
          <label className="px-1 text-blue-500" onClick={onFocus}>{field}:</label>
          <div className='grow' />
          <IconButton sx={{ 'borderRadius': '20%', padding: '1px' }} size="small" onClick={() => {
            var newArr = object[field] ? [...object[field]] : [];
            newArr.push({});
            handleChange(newArr);
          }}>
            <Tooltip title={'Create a new ' + typeFromRef(fieldSchema.items['$ref'])}>
              <AddIcon fontSize="inherit" />
            </Tooltip>
          </IconButton>
        </div>

        {object[field] && object[field].map((v, i) => {
          return (
            <div className="flex" key={field + i}>
              <div className="">
                &nbsp;&nbsp;-
              </div>
              <OASObjectEditor
                object={v}
                schema={schema}
                field={field}
                fieldOrders={fieldOrders}
                onHelpChange={help}
                bg={bg}
                type={typeFromRef(fieldSchema.items['$ref'])}
                index={i}
                onChange={(f, v) => {
                  var newArr = [...object[field]];
                  newArr[i] = v;
                  handleChange(newArr);
                }}
                onMoveUp={i > 0 ? () => {
                  var newArr = [...object[field]];
                  var item = newArr.splice(i, 1);
                  newArr.splice(i - 1, 0, item[0]);
                  handleChange(newArr);
                } : null}
                onMoveDown={i < object[field].length - 1 ? () => {
                  var newArr = [...object[field]];
                  var item = newArr.splice(i, 1);
                  newArr.splice(i + 1, 0, item[0]);
                  handleChange(newArr);
                } : null}
                onRemove={() => {
                  var newArr = [...object[field]];
                  newArr.splice(i, 1);
                  handleChange(newArr);
                }}
              />
            </div>
          )
        })}
      </div>
    )
  } else if (fieldSchema['$ref']) {
    // Single object field
    return (
      <div className={"flex flex-col" + hidden + bgcol}>
        <label className="px-1 text-blue-500" onClick={onFocus}>{field}:</label>
        <div className="flex">
          <div className="">
            &nbsp;&nbsp;
          </div>
          <div className="grow flex flex-col">
            <div className="flex" >
              <OASObjectEditor
                object={object[field]}
                schema={schema}
                field={field}
                bg={bg}
                fieldOrders={fieldOrders}
                onHelpChange={help}
                type={typeFromRef(fieldSchema['$ref'])}
                onChange={(f, v) => {
                  handleChange(v);
                }}
              />
            </div>
          </div>
          {minusControl}{upControl}{downControl}{dropControl}
        </div>
      </div>

    )
  } else if (fieldSchema.additionalProperties) {
    // Map field
    return (
      <div className={hidden + bgcol}>
        <div className='flex'>
          <label className="px-1 text-blue-500" onClick={onFocus}>{field}:</label>
          <div className='grow' />
          <IconButton sx={{ 'borderRadius': '20%', padding: '1px' }} size="small" onClick={() => {
            var newObj = { ...object[field] }
            var newName = 'new'
            for (var i = 1; newObj.hasOwnProperty(newName); ++i) {
                newName = 'new' + i
            }
            newObj[newName] = {}
            handleChange(newObj)
          }}>
            <Tooltip title={'Create a new ' + typeFromRef(fieldSchema.additionalProperties['$ref'])}>
              <AddIcon fontSize="inherit" />
            </Tooltip>
          </IconButton>
        </div>
        {object[field] && Object.keys(object[field]).map((v, i) => {
          return (
            <div className="flex flex-col" key={field + i}>
              <div className="flex" key={i}>
                <div className="">
                  &nbsp;&nbsp;
                </div>
                <div className="grow flex flex-col">
                  <div className="flex" key={i}>
                    <input className={'bg-transobject appearance-none px-1 text-gray-700 leading-tight font-mono overflow-wrap'}
                      id={id}
                      type='text'
                      value={v}
                      onChange={e => {
                        var newObj = { ...object[field] }
                        newObj[e.target.value] = object[field][v]
                        delete newObj[v]
                        handleChange(newObj)
                      }}
                      onFocus={onFocus}
                      ref={input}
                      pattern={fieldSchema.pattern}
                      placeholder={fieldSchema['x-prompt']}
                    />
                    :
                    <div className='grow' />
                    <div className="flex-none">
                      <IconButton sx={{ 'borderRadius': '20%', padding: '1px' }} size="small" onClick={() => {
                        var newObj = { ...object[field] }
                        delete newObj[v]
                        handleChange(newObj)
                      }}>
                        <Tooltip title={'Delete this ' + typeFromRef(fieldSchema.additionalProperties['$ref'])}>
                          <RemoveIcon fontSize="inherit" />
                        </Tooltip>
                      </IconButton>
                    </div>
                  </div>
                  <div className="flex" >
                    <div className="">
                      &nbsp;&nbsp;
                    </div>
                    <OASObjectEditor
                      object={object[field][v]}
                      schema={schema}
                      field={field}
                      bg={bg}
                      fieldOrders={fieldOrders}
                      onHelpChange={help}
                      type={typeFromRef(fieldSchema.additionalProperties['$ref'])}
                      onChange={(f, v) => {
                        handleChange(v);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  } else {
    // Long text field
    return (
      <div className={"flex" + hidden + bgcol}>
        <label className="px-1 text-blue-500" onClick={onFocus}>{field}:</label>
        <Textarea className={classes + ' h-6' + bgcol}
          id={id}          
          placeholder={field.prompt}
          value={value}
          onChange={e => handleChange(e.target.value)}
          onFocus={onFocus}
          ref={input}
        />
        {dropControl}
      </div>
    )
  }

}

export default OASFieldEditor;