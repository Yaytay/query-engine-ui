import React, {useState, useRef} from 'react';
import DragBar from './components/DragBar.js';
import LeftRightChevrons from './components/LeftRightChevrons.js';

function Test() {

  const minWidth=10;
  const files = useRef(null);
  const props = useRef(null);

  var [styleFilesWidth, setStyleFilesWidth] = useState({width: '250px'});
  var [filesChevronsLeft, setFilesChevronsLeft] = useState(true);
  var [stylePropsWidth, setStylePropsWidth] = useState({width: '300px'});
  var [propsChevronsLeft, setPropsChevronsLeft] = useState(true);

  function drag1Change(w) {
    if (w < 26) {
      w = 26;
    }
    setStyleFilesWidth({width: '' + w + 'px'});
    setFilesChevronsLeft(w > 70);
  }

  function filesChevronClick() {
    if (filesChevronsLeft) {
      setFilesChevronsLeft(false);
      setStyleFilesWidth({width: '26px'});  
    } else {
      setFilesChevronsLeft(true);
      setStyleFilesWidth({width: '250px'});  
    }
  }

  function drag2Change(w) {    
    w = w - props.current.offsetLeft;
    if (w < 26) {
      w = 26;
    }
    setStylePropsWidth({width: '' + w + 'px'});
    setPropsChevronsLeft(w > 70);
  }

  function propsChevronClick() {
    if (propsChevronsLeft) {
      setPropsChevronsLeft(false);
      setStylePropsWidth({width: '26px'});  
    } else {
      setPropsChevronsLeft(true);
      setStylePropsWidth({width: '250px'});  
    }
  }

  return (
    <div className='flex flex-row h-full w-full'>
      <div id="files" ref={files} className="h-full border border-gray-500" style={styleFilesWidth}>
        <div id="filesTitle" className='flex flex-wrap-reverse w-full overflow-hidden'>
          <div className='flex-shrink-0'>
            <h1>Files</h1>
          </div>
          <div className='flex-grow'/>
          <div className='flex-shrink-0' onClick={filesChevronClick}>
            <LeftRightChevrons left={filesChevronsLeft}/>
          </div>
        </div>
      </div>
      <DragBar id="drag1" onChange={drag1Change}/>
      <div id="props" ref={props} className="h-full border border-gray-500" style={stylePropsWidth}>
      <div id="propsTitle" className='flex flex-wrap-reverse w-full overflow-hidden'>
          <div className='flex-shrink-0'>
            <h1>Props</h1>
          </div>
          <div className='flex-grow'/>
          <div className='flex-shrink-0' onClick={propsChevronClick}>
            <LeftRightChevrons left={propsChevronsLeft}/>
          </div>
        </div>
      </div>
      <DragBar id="drag2" onChange={drag2Change}/>
      <div id="results" className="h-full flex-grow border border-gray-500">
        Results
      </div>
    </div>
  );
}

export default Test;