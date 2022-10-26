import React, { useEffect, useState, useCallback } from 'react';

import TreeViewFileItemLabel from './components/TreeViewFileItemLabel'

import Article from '@mui/icons-material/Article';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Folder from '@mui/icons-material/Folder';
import FolderOpen from '@mui/icons-material/FolderOpen';
import Snackbar from '@mui/material/Snackbar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Toolbar from '@mui/material/Toolbar';
import TreeItem from '@mui/lab/TreeItem';
import TreeView from '@mui/lab/TreeView';


function Design(props) {

  const [files, setFiles] = useState({ children: [], path: '' });
  const [expanded, setExpanded] = useState([]);
  const [nodeMap, setNodeMap] = useState({});

  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState();

  const setParents = useCallback(node => {
    node.children.forEach(n => {
      n.parent = node
      if (Array.isArray(n.children)) {
        setParents(n);
      }
    })
  }, [])

  const getAllDirs = useCallback(root => {
    var arr = []
    function addToDirs(node) {
      if (Array.isArray(node.children)) {
        arr.push(node.path);
        node.children.forEach(n => addToDirs(n));
      }
    }
    addToDirs(root);
    return arr
  }, [])

  const buildNodeMap = useCallback(root => {
    var nm = {}
    function addToNodeMap(node) {
      if (Array.isArray(node.children)) {
        nm[node.path] = node;
        node.children.forEach(n => addToNodeMap(n));
      } else {
        nm[node.path] = node;
      }
    }
    addToNodeMap(root);
    return nm;
  }, [])

  const handleResponse = useCallback(p => {
    return p
      .then(r => {
        if (!r.ok) {
          return r.text().then(t => {
            throw Error(t)
          })
        } else {
          return r.json()
        }
      })
      .then(j => {
        console.log(j)
        setFiles(j)
        setParents(j)
        setNodeMap(buildNodeMap(j))
        if (props.onChange) {
          props.onChange()
        }
        return j
      })
      .catch(e => {
        setSnackMessage(e.message)
        setSnackOpen(true)
        console.log(e)
      })
  }, [setFiles, setParents, setNodeMap, buildNodeMap])

  useEffect(() => {
    let url = new URL(props.baseUrl + 'api/design/all');
    handleResponse(fetch(url))
      .then(j => {
        setExpanded(getAllDirs(j));
      })
  }, [props.baseUrl, handleResponse, getAllDirs])

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

  function fileSelected(e, nodeIds) {
    console.log(nodeIds);
    console.log(e);
    if (nodeMap[nodeIds]) {
      setCurrentFile(nodeMap[nodeIds]);
    }
  }

  function onRename(node, newName) {
    let url = new URL(props.baseUrl + 'api/design/rename/' + node.path + '?name=' + encodeURIComponent(newName));
    handleResponse(fetch(url, { method: 'POST' }));
  }

  function childExists(node, newName) {
    return node.children.find(n => n.name === newName) === undefined ? false : true;
  }

  function onNewFolder(node) {
    var name;
    for (var i = 1; (name = 'NewFolder' + i) && childExists(node, name) && i < 10; ++i) {
    }
    const parentPath = node.path === '' ? '' : node.path + '/'
    const url = new URL(props.baseUrl + 'api/design/file/' + parentPath + name);
    if (expanded.find(n => n.path === node.path) === undefined) {
      expanded.push(node.path);
    }
    handleResponse(fetch(url, { method: 'PUT', headers: { 'Content-Type': 'inode/directory' } }));
  }

  function onNewPipeline(node) {
    var name;
    for (var i = 1; (name = 'NewPipeline' + i + '.yaml') && childExists(node, name) && i < 10; ++i) {
    }
    const parentPath = node.path === '' ? '' : node.path + '/'
    const url = new URL(props.baseUrl + 'api/design/file/' + parentPath + name);
    if (expanded.find(n => n.path === node.path) === undefined) {
      expanded.push(node.path);
    }
    handleResponse(fetch(url, { method: 'PUT', headers: { 'Content-Type': 'application/yaml' } }));
  }

  function onNewPermissions(node) {
    var name = 'permissions.jexl';
    const parentPath = node.path === '' ? '' : node.path + '/'
    const url = new URL(props.baseUrl + 'api/design/file/' + parentPath + name);
    if (expanded.find(n => n.path === node.path) === undefined) {
      expanded.push(node.path);
    }
    handleResponse(fetch(url, { method: 'PUT', headers: { 'Content-Type': 'application/jexl' }, body: '' }));
  }

  function onDelete(node) {
    const url = new URL(props.baseUrl + 'api/design/file/' + node.path);
    handleResponse(fetch(url, { method: 'DELETE' }));
  }

  function nodeToggled(e, nodeIds) {
    setExpanded(nodeIds)
  }

  const snackClose = (event, reason) => {
    setSnackOpen(false);
  };
  const renderTree = (node) => {
    return (
      <TreeItem key={node.name}
        nodeId={node.path}
        icon={Array.isArray(node.children) && node.children.length === 0 ? (<FolderOpen />) : null}
        label={
          <TreeViewFileItemLabel
            node={node}
            onRename={onRename}
            onNewFolder={onNewFolder}
            onNewPipeline={onNewPipeline}
            onNewPermissions={onNewPermissions}
            onDelete={onDelete}
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
              onNodeToggle={nodeToggled}
              sx={{ height: '100%', flexGrow: 1, maxWidth: '100%', overflowY: 'auto' }}
            >
              {renderTree(files)}
            </TreeView>
          </Box>
        </TabPanel>
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar></Toolbar>
        <Snackbar
          open={snackOpen}
          autoHideDuration={10000}
          message={snackMessage}
          onClose={snackClose}
        />
      </Box>
    </Box>);
}

export default Design;