import { useState, useEffect } from 'react';

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

import DOMPurify from 'dompurify';
import { components } from "./Query-Engine-Schema"
import { useParams, useNavigate } from 'react-router-dom'

interface HelpProps {
  docs: components["schemas"]["DocDir"]
  , baseUrl: string
}

function Help(props : HelpProps) {

  const [drawerWidth, setDrawerWidth] = useState(250)
  const [displayDrawer, setDisplayDrawer] = useState(true)
  const [helpUrl, setHelpUrl] = useState(props.baseUrl + 'api/docs/Introduction.html')
  const { parent, stub } = useParams()
  const navigate = useNavigate()

  function getDocFromStub() {
    if (stub) {
      if (parent) {
        return parent + '/' + stub
      } else {
        return stub
      }
    }  
    return 'Introduction.html'
  }

  const path =  getDocFromStub()
  console.log(path)

  useEffect(() => {
    if (path) {
      setHelpUrl(props.baseUrl + 'api/docs/' + path)
    }
  }, [path])

  interface TabPanelProps {
    children: any
    , value: number
    , index: number
  }

  function TabPanel(props : TabPanelProps) {
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

  const nodeMap = {} as any
  const expanded = [] as string[]

  function AddToNodeMap(node : components["schemas"]["DocNode"]) {
    if (Array.isArray(node.children)) {
      node.children.forEach(n => AddToNodeMap(n));
      expanded.push(node.path);
    } else {
      nodeMap[node.path] = node;
    }
  }
  AddToNodeMap(props.docs);

  function fileSelected(_ : any, path : string) {
    navigate('/ui/help/' + path);
  }

  const isDocFile = (n : components["schemas"]["DocNode"]) : n is components["schemas"]["DocFile"] => {
    return ! Array.isArray(n.children);
  }

  const renderTree = (node : components["schemas"]["DocNode"]) => {
    if (isDocFile(node)) {
      if (node.title) {
        return (
          <TreeItem key={node.name} nodeId={node.path} label={node.title ?? node.name} />
        )
      }
    } else {
      return (
        <TreeItem key={node.name} nodeId={node.path} label={node.name} >
          { node.children && node.children.map((child) => renderTree(child)) }
        </TreeItem>
      )
    }
  };

  function drawerWidthChange(w : number) {
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
                  {props.docs.children && props.docs.children.map((node) => renderTree(node))}
                </TreeView>
              </Box>
            </TabPanel>
          </div>
          <DragBar onChange={drawerWidthChange} />
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
        sx={{ flexGrow: 1, p: 0, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <iframe src={helpUrl}  width={'100%'} height={'100%'} ></iframe>
      </Box>
    </div>);
}

export default Help;