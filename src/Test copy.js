import Nav from './components/Nav.js';
import React, { useState } from 'react';
import DragBar from './components/DragBar.js';
import LeftRightChevrons from './components/LeftRightChevrons.js';

function Test(props) {

  var [showFiles, setShowFiles] = useState(true);

  var [stylePanelWidth, setStylePanelWidth] = useState({ width: '250px' });
  var [panelChevronsLeft, setPanelChevronsLeft] = useState(true);

  function dragPanelChange(w) {
    if (w < 250) {
      w = 250;
    }
    setStylePanelWidth({ width: '' + w + 'px' });
    setPanelChevronsLeft(w > 70);
  }

  function panelChevronClick() {
    if (panelChevronsLeft) {
      setPanelChevronsLeft(false);
      setStylePanelWidth({ width: '26px' });
    } else {
      setPanelChevronsLeft(true);
      setStylePanelWidth({ width: '250px' });
    }
  }

  function clickFilesOrProperties(files) {
    setShowFiles(files);
  }

  return (
    <>
      <div className='flex flex-row h-full w-full'>
        <div id="panel" className="h-full border border-gray-500" style={stylePanelWidth}>
          <div id="panelTitle" className='bg-gray-100 flex flex-wrap-reverse w-full overflow-hidden align-top'>
            <div className='flex-shrink-0'>
              <nav class="flex flex-col sm:flex-row">
                <button
                  class={(showFiles ? "text-blue-500 border-b-2 font-medium border-blue-500" : "text-gray-600") + " py-4 px-6 block hover:text-blue-500 focus:outline-none"}
                  onClick={() => clickFilesOrProperties(true)}
                >
                  Files
                </button>
                <button
                  class={(!showFiles ? "text-blue-500 border-b-2 font-medium border-blue-500" : "text-gray-600") + " py-4 px-6 block hover:text-blue-500 focus:outline-none"}
                  onClick={() => clickFilesOrProperties(false)}
                >
                  Properties
                </button>
              </nav>
            </div>
            <div className='flex-grow' />
            <div className='flex-shrink-1' onClick={panelChevronClick}>
              <LeftRightChevrons left={panelChevronsLeft} />
            </div>
          </div>
          <div>
            <div className={showFiles ? "display" : "hidden" }>
              Files
            </div>
            <div className={!showFiles ? "display" : "hidden" }>
              Properties
            </div>
          </div>
        </div>
        <DragBar id="drag" onChange={dragPanelChange} />
        <div id="results" className="h-full flex-grow border border-gray-500">
          Results
        </div>
      </div>
    </>
  );
}

export default Test;