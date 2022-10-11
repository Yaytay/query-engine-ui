import { propTypesSelected } from '@material-tailwind/react/types/components/select';
import { getDefaultNormalizer } from '@testing-library/react';
import React, {useState} from 'react';

function DragBar(props) {

  var [dragging, setDragging] = useState(false);

  function dragStart(e) {
    e.target.setPointerCapture(e.pointerId);
    setDragging(true);
  }

  function dragMove(e) {
    if (dragging) {
      props.onChange(e.pageX);
    }
  }

  function dragStop(e) {
    e.target.releasePointerCapture(e.pointerId);
    setDragging(false);
  }

  return (
    <div className="w-1 bg-gray-500 cursor-col-resize"
      onPointerDown={dragStart} 
      onPointerMove={dragMove} 
      onPointerUp={dragStop} 
      >
    </div>
  );
}

export default DragBar;