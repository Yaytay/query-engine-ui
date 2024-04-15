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
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView'
import { TreeItem } from '@mui/x-tree-view/TreeItem'

import { useParams, useNavigate } from 'react-router-dom'

export interface ManagementEndpointType {
  name: string
  , url: string
}

interface ManagementProps {
  endpoints: ManagementEndpointType[] | null
}

export function Manage(props : ManagementProps) {

  const [drawerWidth, setDrawerWidth] = useState(250)
  const [displayDrawer, setDisplayDrawer] = useState(true)
  const { parent, stub } = useParams()
  const [endpoint, setEndpoint] = useState(null as ManagementEndpointType | null)
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

  const path = getDocFromStub()
  console.log(path)

  useEffect(() => {
    if (path) {
      if (props.endpoints) {
        props.endpoints.forEach(e => {
          if (e.name === path) {
            setEndpoint(e);
          }
        })
      }
    }
  }, [path, props.endpoints])

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

  function fileSelected(_ : any, name : string | null) {
    if (name) {
      navigate('/ui/manage/' + name);
    }
  }

  const renderTree = (node : ManagementEndpointType) => {
      return (
        <TreeItem key={node.name} itemId={node.name} label={node.name} />
      )
    }

  function drawerWidthChange(w : number) {
    if (w > 200) {
      setDrawerWidth(w)
    }
  }

  function drawerHide() {
    setDisplayDrawer(!displayDrawer)
  }

  console.log(props)
  return (
    <div className="h-full flex">
      {displayDrawer && (
        <>
          <div style={{ width: drawerWidth }} className="h-full box-border " >
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={0} >
                <Tab label="Endpoints" />
              </Tabs>
            </Box>
            <TabPanel value={0} index={0}>
              <Box>
                <SimpleTreeView
                  aria-label="file system navigator"
                  slots={{
                    collapseIcon: FolderOpen
                    , expandIcon: Folder
                    , endIcon: Article
                  }}
                  onSelectedItemsChange={fileSelected}
                  sx={{ height: '100%', flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
                >
                  {props.endpoints && props.endpoints.map((node) => renderTree(node))}
                </SimpleTreeView>
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
        <iframe src={endpoint?.url}  width={'100%'} height={'100%'} ></iframe>
      </Box>
    </div>);
}

export default Manage;