import React, { useState } from 'react';

import DragBar from './components/DragBar'

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

import ReactMarkdown from 'react-markdown'

function Help(props) {

  const [doc, setDoc] = useState(null);
 
  const [drawerWidth, setDrawerWidth] = useState(250)
  const [displayDrawer, setDisplayDrawer] = useState(true)

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
  AddToNodeMap(props.docs);

  function fileSelected(e, nodeIds) {
    console.log(nodeIds);
    let url = new URL(props.baseUrl + 'api/docs/' + nodeIds);
    fetch(url)
      .then(r => r.text())
      .then(b => {
        setDoc(b)
      })
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
    if (w > 200) {
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
              <Tabs value={0} >
                <Tab label="Files" />
              </Tabs>
            </Box>
            <TabPanel value={0} index={0}>
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
                  {props.docs.children.map((node) => renderTree(node))}
                </TreeView>
              </Box>
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
        <ReactMarkdown children={doc} className="prose max-w-full" />
      </Box>
    </div>);
}

export default Help;