import React, { useEffect, useState } from 'react';

import TreeViewFileItemLabel from './components/TreeViewFileItemLabel'

import Article from '@mui/icons-material/Article';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Folder from '@mui/icons-material/Folder';
import FolderOpen from '@mui/icons-material/FolderOpen';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Toolbar from '@mui/material/Toolbar';
import TreeItem from '@mui/lab/TreeItem';
import TreeView from '@mui/lab/TreeView';


function Design(props) {

  const [files, setFiles] = useState({ children: [] });
  const [expanded, setExpanded] = useState([]);
  const [nodeMap, setNodeMap] = useState({});

  useEffect(() => {
    let url = new URL(props.baseUrl + 'api/design/all');
    fetch(url)
      .then(r => r.json())
      .then(j => {
        setFiles(j);
        AddToNodeMap(j);
        setExpanded(expanded);
      })
  }, []);

  const drawerWidth = 500;

  const [tabPanel, setTabPanel] = useState(0);
  const [currentFile, setCurrentFile] = useState(null);

  const handleChange = (event, newValue) => {
    setTabPanel(newValue);
  };

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

  function AddToNodeMap(node) {
    if (Array.isArray(node.children)) {
      node.children.forEach(n => AddToNodeMap(n));
      expanded.push(node.path);
    } else {
      nodeMap[node.path] = node;
    }
  }

  function fileSelected(e, nodeIds) {
    console.log(nodeIds);
    if (nodeMap[nodeIds]) {
      setCurrentFile(nodeMap[nodeIds]);
    }
  }

  function onRename(node, newName) {
    console.log(node);
    console.log(newName);
  }

  const renderTree = (node) => {
    return (
      <TreeItem key={node.name} 
                nodeId={node.path} 
                icon={Array.isArray(node.children) && node.children.length === 0 ? (<FolderOpen />) : null} 
                label={
                  <TreeViewFileItemLabel 
                    node={node}
                    onRename={onRename}
                    />
                  } >
        {Array.isArray(node.children)
          ? node.children.map((child) => renderTree(child))
          : null}
      </TreeItem>
    )
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        open={true}
        variant='persistent'
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          boxSizing: 'border-box',
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}         >
        <Toolbar></Toolbar>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabPanel} onChange={handleChange} >
            <Tab label="Files" />
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
              sx={{ height: '100%', flexGrow: 1, maxWidth: '100%', overflowY: 'auto' }}
            >
              {files.children.map((node) => renderTree(node))}
            </TreeView>
          </Box>
        </TabPanel>
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar></Toolbar>
      </Box>
    </Box>);
}

export default Design;