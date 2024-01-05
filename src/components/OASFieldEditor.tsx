import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import Tooltip from '@mui/material/Tooltip';


import OASValueEditor from './OASValueEditor';
import { PropertyType, ObjectTypeMap } from '../SchemaType';


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
function OASFieldEditor({ id, schema, field, bg, value, visible, onChange, onHelpChange, propertyType, index }: OASFieldEditorProps) {

  const colours = [' bg-white', ' bg-slate-50', ' bg-slate-100', ' bg-slate-200', ' bg-slate-300']

  const help = onHelpChange ?? function () { }

  const bgcol = (bg < colours.length) ? colours[bg] : colours[0]

  if (!propertyType) {
    console.log("Field " + field + " not found in " + JSON.stringify(schema))
    return (<div data-field={field} />)
  }

  function onFocus(e: React.SyntheticEvent<any>) {
    var text
    if (propertyType.description) {
      text = '<h3>' + field + '</h3>' + propertyType.description
    }
    if (propertyType.ref) {
      var s = schema[propertyType.ref]
      if (s) {
        text = '<h3>' + s.name + '</h3>' + s.description
      }
    }

    if (text) {
      help(text)
    }
    e.preventDefault()
  }

  if (
    !visible
    && !(propertyType && propertyType.required)
    && !(value !== propertyType.default)
  ) {
    return (<div className='hidden'></div>)
  }

  if (propertyType.type === 'object') {
    // Single value
    return (
      <div className={"align-top" + bgcol}>
        <label className="px-1 text-blue-500 reflabel" onClick={onFocus}>{field}:</label>
        <div className="grow flex flex-col">
          <OASValueEditor
            id={id}
            key={id}
            bg={bg + (index % 2)}
            value={value}
            propertyType={propertyType}
            schema={schema}
            onHelpChange={onHelpChange}
            onChange={(v) => { onChange(field, v) }}
            onFocus={onFocus}
            field={field}
            index={index}
          />
        </div>
      </div>
    )
  } else if (propertyType.type === 'array' && propertyType.items) {
    // Array
    const itemType : PropertyType = propertyType.items
    const itemTypeLabel = itemType.ref || itemType.type
    return (
      <div className={"align-top" + bgcol}>
        <div className='flex'>
          <label className="px-1 text-blue-500 flex" onClick={onFocus}>{field}:</label>
          <div className='grow'></div>
          <div className=''>
            <IconButton sx={{ 'borderRadius': '20%', padding: '1px' }} size="small" onClick={() => {
              var newArr = value ? [...value] : [];
              if (itemType.ref) {
                newArr.push({});
              } else {
                newArr.push('');
              }
              onChange(field, newArr);
            }}>
              <Tooltip title={'Create a new ' + itemTypeLabel}>
                <AddIcon fontSize="inherit" />
              </Tooltip>
            </IconButton>
          </div>
        </div>
        <OASValueEditor
          id={id}
          key={id}
          bg={bg + (index % 2)}
          value={value}
          propertyType={propertyType}
          schema={schema}
          onHelpChange={onHelpChange}
          onChange={(v) => { onChange(field, v) }}
          onFocus={onFocus}
          field={field}
          index={index}
        />
      </div>
    )
  } else {
    // Primitive
    return (
      <div className={"flex align-top" + bgcol}>
        <label className="px-1 text-blue-500 stdlabel" onClick={onFocus}>{field}:</label>
        <OASValueEditor
          id={id}
          key={id}
          bg={bg + (index % 2)}
          value={value}
          propertyType={propertyType}
          schema={schema}
          onHelpChange={onHelpChange}
          onChange={(v) => { onChange(field, v) }}
          onFocus={onFocus}
          field={field}
          index={index}
        />
      </div>
    )
  }
}

export default OASFieldEditor;