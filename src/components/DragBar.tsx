import {useState} from 'react';

interface DragBarProps {
  onChange: (x : number) => void
}
function DragBar(props : DragBarProps) {

  var [dragging, setDragging] = useState(false);

  function dragStart(e : React.PointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
  }

  function dragMove(e : React.PointerEvent<HTMLDivElement>) {
    if (dragging) {
      props.onChange && props.onChange(e.pageX);
    }
  }

  function dragStop(e : React.PointerEvent<HTMLDivElement>) {
    e.currentTarget.releasePointerCapture(e.pointerId);
    setDragging(false);
  }

  return (
    <div className="w-1 cursor-col-resize border-l-2 h-full"
      onPointerDown={dragStart} 
      onPointerMove={dragMove} 
      onPointerUp={dragStop} 
      >
    </div>
  );
}

export default DragBar;