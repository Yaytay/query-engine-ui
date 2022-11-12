
import OASFieldEditor from './OASFieldEditor.js';

function OASObjectEditor({object, openapi, fieldOrders, field, onHelpChange, onChange, type }) {

  function handleInputChange(changedField, value) {
    var rep={...object}
    rep[changedField] = value
    onChange(field, rep)
  }

  if (!fieldOrders[type]) {
    return (<div>The type {type} has not been configured yet</div>)
  } else {
    return (
      <div className="grow">
        { fieldOrders[type].map(f => { 
          return (<OASFieldEditor
            id={f}
            object={object}
            openapi={openapi}
            fieldOrders={fieldOrders}
            onHelpChange={onHelpChange}
            onChange={handleInputChange}
            parentType={type}
            field={f}
          />)
        }) }
      </div>
    )
  }
}


export default OASObjectEditor;