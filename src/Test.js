import React, { useState } from 'react';

import DragBar from './components/DragBar'
import Parameters from './components/Parameters.js';

import Article from '@mui/icons-material/Article';
import Box from '@mui/material/Box';
import Folder from '@mui/icons-material/Folder';
import FolderOpen from '@mui/icons-material/FolderOpen';
import IconButton from '@mui/material/IconButton';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TreeItem from '@mui/lab/TreeItem';
import TreeView from '@mui/lab/TreeView';

import DOMPurify from 'dompurify';

function Test(props) {

  const emptyTable = (
    <table className='min-w-full' >
      <thead className='border'>
        <tr>
          <th className='border'>&nbsp;</th><th className='border'>&nbsp;</th><th className='border'>&nbsp;</th><th className='border'>&nbsp;</th><th className='border'>&nbsp;</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className='border'>&nbsp;</td><td className='border'>&nbsp;</td><td className='border'>&nbsp;</td><td className='border'>&nbsp;</td><td className='border'>&nbsp;</td>
        </tr>
        <tr>
        <td className='border'>&nbsp;</td><td className='border'>&nbsp;</td><td className='border'>&nbsp;</td><td className='border'>&nbsp;</td><td className='border'>&nbsp;</td>
        </tr>
      </tbody>
    </table>
  )

  // const [mobileOpen, setMobileOpen] = useState(false);

  const [tabPanel, setTabPanel] = useState(0);
  const [currentFile, setCurrentFile] = useState(null);
  const [args, setArgs] = useState(null);
  const [data, setData] = useState(emptyTable);
  const [rawHtml, setRawHtml] = useState(null);

  const [drawerWidth, setDrawerWidth] = useState(360)
  const [displayDrawer, setDisplayDrawer] = useState(true)

  const handleChange = (event, newValue) => {
    setTabPanel(newValue);
  };

  function ArgsToArgs(args) {
    if (args == null) {
      return null;
    }
    var result = [];
    Object.keys(args).forEach(k => {
      result.push(k + '=' + encodeURIComponent(args[k]));
    });
    return result.join('&');
  }

  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            {children}
          </Box>
        )}
      </div>
    );
  }

  const nodeMap = {}
  const expanded = []

  function AddToNodeMap(node) {
    if (Array.isArray(node.children)) {
      node.children.forEach(n => AddToNodeMap(n));
      expanded.push(node.path);
    } else {
      nodeMap[node.path] = node;
    }
  }
  AddToNodeMap(props.available);

  function fileSelected(e, nodeIds) {
    console.log(nodeIds);
    if (nodeMap[nodeIds]) {
      setCurrentFile(nodeMap[nodeIds]);
      const ta = {}
      if (nodeMap[nodeIds].arguments) {
        nodeMap[nodeIds].arguments.forEach(arg => {
          ta[arg.name] = arg.defaultValue ?? '';
        });
        ta['_fmt'] = nodeMap[nodeIds].destinations[0].name;
      }
      setArgs(ta);
      setTabPanel(1);
    }
  }

  function findDestination(fmt) {
    for (var i in currentFile.destinations) {
      if (currentFile.destinations[i].name === fmt) {
        return currentFile.destinations[i];
      }
    }
  }

  function submit(e) {
    var query = ArgsToArgs(args);
    var url = props.baseUrl + 'query/' + currentFile.path + (query == null ? '' : ('?' + query))
    console.log(url)

    var dest = findDestination(args._fmt);
    if (dest && (dest.type === 'XLSX')) {
      props.window.open(url, "_blank");
    } else {
      fetch(url)
        .then(r => {
          if (r.ok) {
            const type = r.headers.get('Content-Type');
            r.text().then(t => {
              if ("text/html" === type) {
                setRawHtml('<div>' + DOMPurify.sanitize(t) + '</div>');
                setData(null);
              } else {
                setRawHtml(null);
                setData(t);
              }
            })
          } else {
            r.text().then(t => {
              setData(t);
            })
          }
        })
    }

  }

  const renderTree = (node) => {
    return (
      <TreeItem key={node.name} nodeId={node.path} label={node.title ?? node.name} >
        {Array.isArray(node.children)
          ? node.children.map((child) => renderTree(child))
          : null}
      </TreeItem>
    )
  };

  function drawerWidthChange(w) {
    if (w > 360) {
      setDrawerWidth(w)
    }
  }

  function drawerHide() {
    setDisplayDrawer(!displayDrawer)
  }


  return (
    <div className="h-full flex">
      {displayDrawer && (
        <>
          <div style={{ width: drawerWidth }} className="h-full box-border " >
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabPanel} onChange={handleChange} >
                <Tab label="Files" />
                <Tab label="Properties" disabled={!currentFile} />
              </Tabs>
            </Box>
            <TabPanel value={tabPanel} index={0}>
              <Box>
                <TreeView
                  aria-label="file system navigator"
                  defaultCollapseIcon={<FolderOpen />}
                  defaultExpandIcon={<Folder />}
                  defaultEndIcon={<Article />}
                  defaultExpanded={expanded}
                  onNodeSelect={fileSelected}
                  sx={{ height: '100%', flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
                >
                  {props.available.children.map((node) => renderTree(node))}
                </TreeView>
              </Box>
            </TabPanel>
            <TabPanel value={tabPanel} index={1}>
              <Parameters onRequestSubmit={submit} closeable={false} pipeline={currentFile} values={args} >
              </Parameters>
            </TabPanel>
          </div>
          <DragBar className='h-full' onChange={drawerWidthChange} />
        </>
      )}
      {displayDrawer || (
        <div className="h-full w-10 border-r-2 align-top">
          <div>
            <IconButton sx={{ 'borderRadius': '20%' }} onClick={drawerHide}>
              <KeyboardDoubleArrowRightIcon fontSize="small" />
            </IconButton>
          </div>
        </div>
      )}

      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <pre className="whitespace-pre-wrap">{data}</pre>
        <div className="rawHtmlData" dangerouslySetInnerHTML={{ __html: rawHtml }}></div>
      </Box>
    </div>);
}

export default Test;