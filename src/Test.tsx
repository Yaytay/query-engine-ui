import { useState } from 'react';

import DragBar from './components/DragBar'
import Parameters from './components/Parameters';

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
import { components } from "./Query-Engine-Schema";

interface TestProps {
  available: components["schemas"]["PipelineDir"]
  , baseUrl: string
  , window: Window
}

function Test(props : TestProps) {

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
  const [currentFile, setCurrentFile] = useState(null as components["schemas"]["PipelineFile"] | null);
  const [args, setArgs] = useState(null as any);
  const [data, setData] = useState(emptyTable as any);
  const [rawHtml, setRawHtml] = useState(null as string | null);

  const [drawerWidth, setDrawerWidth] = useState(360)
  const [displayDrawer, setDisplayDrawer] = useState(true)

  const handleChange = (_ : any, newTabIndex : number) => {
    setTabPanel(newTabIndex);
  };

  function ArgsToArgs(args : any) {
    if (args == null) {
      return null;
    }
    var result = [] as any[];
    Object.keys(args).forEach(k => {
      if (args[k] !== '') {
        result.push(k + '=' + encodeURIComponent(args[k]));
      }
    });
    return result.join('&');
  }


  interface TabPanelProps {
    children: any
    , value: number
    , index: number    
  }

  function TabPanel({ children, value, index, ...other } : TabPanelProps) {
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

  function AddToNodeMap(node : components["schemas"]["PipelineNode"]) {
    if (Array.isArray(node.children)) {
      node.children.forEach(n => AddToNodeMap(n));
      expanded.push(node.path);
    } else {
      nodeMap[node.path] = node;
    }
  }
  AddToNodeMap(props.available);

  function fileSelected(_ : any, path : string) {
    console.log(path);
    if (nodeMap[path]) {
      setCurrentFile(nodeMap[path]);
      const ta = {} as any
      if (nodeMap[path].arguments) {
        nodeMap[path].arguments.forEach((arg : any) => {
          ta[arg.name] = arg.defaultValue ?? '';
        });
        ta['_fmt'] = nodeMap[path].destinations[0].name;
      }
      setArgs(ta);
      setTabPanel(1);
    }
  }

  function findDestination(fmt : string) : components["schemas"]["Format"] | null{
    if (currentFile && currentFile.destinations) {
      for (var i of currentFile.destinations) {
        if (i.name === fmt) {
          return i;
        }
      }
    } 
    return null;
  }

  function submit() {
    if (!currentFile) {
      return 
    }
    var query = ArgsToArgs(args);
    var url = props.baseUrl + 'query/' + currentFile.path + (query == null ? '' : ('?' + query))
    console.log(url)

    if (!args) {
      return
    }
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

  const isPipelineFile = (n : components["schemas"]["PipelineNode"]) : n is components["schemas"]["PipelineFile"] => {
    return ! Array.isArray(n.children);
  }

  const renderTree = (node : components["schemas"]["PipelineNode"]) => {
    if (isPipelineFile(node)) {
      return (<TreeItem key={node.name} nodeId={node.path} label={node.title ?? node.name}/>)
    } else {
      return (
        <TreeItem key={node.name} nodeId={node.path} label={node.name} >
          {node.children && node.children.map((child) => renderTree(child))}
        </TreeItem>
      )
    }
  };

  function drawerWidthChange(w : number) {
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
              { currentFile && (<Parameters onRequestSubmit={submit} closeable={false} pipeline={currentFile} values={args} onRequestClose={() => {}} />) }
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
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <pre className="whitespace-pre-wrap">{data}</pre>
        {rawHtml && (<div className="rawHtmlData" dangerouslySetInnerHTML={{ __html: rawHtml }}></div>)}
      </Box>
    </div>);
}

export default Test;