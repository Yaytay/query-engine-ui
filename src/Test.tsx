import './Test.css';
import { useState, useEffect } from 'react';

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
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView'
import { TreeItem } from '@mui/x-tree-view/TreeItem'

import DOMPurify from 'dompurify';
import { components } from "./Query-Engine-Schema";

interface TestProps {
  available: components["schemas"]["PipelineDir"]
  , baseUrl: string
  , window: Window
}

export function ArgsToArgs(pipeline: components["schemas"]["PipelineFile"], args : any) {
  if (args == null || !pipeline || !pipeline.arguments) {
    return null;
  }
  const result = [] as any[];
  for (let i = 0; i < pipeline.arguments.length; ++i) {
    const arg = pipeline.arguments[i].name
    if (args[arg]) {
      let value =args[arg]
      if (pipeline.arguments[i].type==='Date' || pipeline.arguments[i].type==='Time' || pipeline.arguments[i].type==='DateTime') {
        if (typeof value === 'string' && value.startsWith('"') && value.endsWith('"')) {
          value = value.substring(1, value.length - 1)
        }
      } 
      
      if (pipeline.arguments[i].multiValued && Array.isArray(value)) {
        value.forEach(v => {
          result.push(arg + '=' + encodeURIComponent(v));
        })
      } else {
        result.push(arg + '=' + encodeURIComponent(args[arg]));
      }
    }
  }
  if (args['_filters']) {
    for (let i = 0; i < args['_filters'].length; ++i) {
      if (args['_filters'][i]['filter'] && args['_filters'][i]['value']) {
        result.push(args['_filters'][i]['filter'] + '=' + encodeURIComponent(args['_filters'][i]['value']));
      }
    }
  }
  if (args['_fmt']) {
    result.push('_fmt=' + encodeURIComponent(args['_fmt']));
  }
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
      style={{ height: 'calc(100% - 55px)', overflowY: 'auto' }}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3, minHeight: 0 }}>
          {children}
        </Box>
      )}
    </div>
  );
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

  const [nodeMap, setNodeMap] = useState({} as any)

  const [defaulExpanded, _] = useState(() => {
    const saved = localStorage.getItem("test-dir-state")
    return saved ? JSON.parse(saved) : saved
  })

  const [expanded, setExpanded] = useState([] as string[])
  const [selected, setSelected] = useState('')

  useEffect(() => {
    localStorage.setItem("test-dir-state", JSON.stringify(expanded));
  }, [expanded]);

  useEffect(() => {
    function AddToNodeMap(nm: any, dirs: string[], node : components["schemas"]["PipelineNode"]) {
      if (Array.isArray(node.children)) {
        node.children.forEach((n : components["schemas"]["PipelineNode"]) => AddToNodeMap(nm, dirs, n));
        dirs.push(node.path)
      } else {
        nm[node.path] = node;
      }
    }
    const nm = {}
    const dirs = [] as string[]
    AddToNodeMap(nm, dirs, props.available);
    setNodeMap(nm)

    if (defaulExpanded) {
      setExpanded(dirs.filter(value => defaulExpanded.includes(value)))
    } else {
      setExpanded(dirs) 
    }
  }, [props.available])

  const handleToggle = (_: React.SyntheticEvent, itemIds: string[]) => {
    setExpanded(itemIds)
  };

  const handleSelect = (_: React.SyntheticEvent, itemId: string | null) => {
    if (itemId) {
      setSelected(itemId)
      fileSelected(itemId)
    } else {
      setSelected('')
      fileSelected('')
    }
  };

  function fileSelected(path : string) {
    if (nodeMap[path]) {
      console.log('Setting current file', nodeMap[path])
      setCurrentFile(nodeMap[path]);
      const ta = {} as any
      if (nodeMap[path].arguments) {
        nodeMap[path].arguments.forEach((arg : any) => {
          if (!arg.hidden) {
            ta[arg.name] = arg.defaultValueExpression ?? '';
          }
        });
        ta['_fmt'] = nodeMap[path].destinations[0].name;
      }
      setArgs(ta);
      setTabPanel(1);
    }
  }

  function findDestination(fmt : string) : components["schemas"]["Format"] | null{
    if (currentFile && currentFile.destinations) {
      for (const i of currentFile.destinations) {
        if (i.name === fmt) {
          return i;
        }
      }
    } 
    return null;
  }

  function submit(values: any) : Promise<void> {
    if (!currentFile) {
      return Promise.resolve()
    }
    const query = ArgsToArgs(currentFile, values);
    const url = props.baseUrl + 'query/' + currentFile.path + (query == null ? '' : ('?' + query))
    console.log(url)

    if (!values) {
      return Promise.resolve()
    }
    setArgs(values)
    const dest = findDestination(values._fmt);

    console.log('submit', values, dest)
    if (dest && (dest.type === 'XLSX')) {
      props.window.open(url, "_blank");
      return Promise.resolve()
    } else {
      return fetch(url, {credentials: 'include'})
        .then(r => {
          if (r.ok) {
            const type = r.headers.get('Content-Type');
            r.text().then(t => {
              if ("text/html" === type) {
                setRawHtml('<div>' + DOMPurify.sanitize(
                  t
                  , {
                      ALLOWED_TAGS: ['table', 'thead', 'tbody', 'tr', 'th', 'td']
                      , ALLOWED_ATTR: ['class']
                    }
                  ) + '</div>');
                setData(null);
              } else if ("application/json" === type) {
                setRawHtml(null)
                const formatted = JSON.stringify(JSON.parse(t), null, 2)
                setData(formatted);
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
      return (<TreeItem key={node.name} itemId={node.path} label={node.title ?? node.name}/>)
    } else {
      const nodeDir = node as components["schemas"]["PipelineDir"]
      return (
        <TreeItem key={nodeDir.name} itemId={nodeDir.path} label={nodeDir.name} >
          {nodeDir.children && nodeDir.children.map((child : components["schemas"]["PipelineNode"]) => renderTree(child))}
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
    <div className="h-full flex qe-test ">
      {displayDrawer && (
        <>
          <div style={{ width: drawerWidth, minHeight: 0 }} className="flex flex-column" >
            <Box className="flex-none" sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabPanel} onChange={handleChange} >
                <Tab label="Files" />
                <Tab label="Properties" disabled={!currentFile} />
              </Tabs>
            </Box>
            <TabPanel value={tabPanel} index={0} >
                <SimpleTreeView
                  aria-label="file system navigator"
                  slots={{
                    collapseIcon: FolderOpen
                    , expandIcon: Folder
                    , endIcon: Article
                  }}
                  expandedItems={expanded}
                  selectedItems={selected}
                  onExpandedItemsChange={handleToggle}
                  onSelectedItemsChange={handleSelect}
                  sx={{ height: '100%', flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
                >
                  {props.available.children.map((node : components["schemas"]["PipelineNode"]) => renderTree(node))}
                </SimpleTreeView>
            </TabPanel>
            <TabPanel value={tabPanel} index={1} >
              { currentFile && (<Parameters 
                  baseUrl={props.baseUrl} 
                  onRequestSubmit={submit} 
                  closeable={false} 
                  pipeline={currentFile} 
                  values={args} 
                  columns={1} 
                  displayUrl={true} 
                  />) }
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
        {data && (<pre className="rawDataWrapper">{data}</pre>)}
        {rawHtml && (<div className="rawHtmlData" dangerouslySetInnerHTML={{ __html: rawHtml }} ></div>)}
      </Box>
    </div>);
}

export default Test;
