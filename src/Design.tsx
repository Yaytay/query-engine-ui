import { useEffect, useState, useCallback } from 'react';
import * as React from 'react';

import DragBar from './components/DragBar'
import PipelineEditor from './components/PipelineEditor'
import TreeViewFileItemLabel from './components/TreeViewFileItemLabel'

import Article from '@mui/icons-material/Article';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import Folder from '@mui/icons-material/Folder';
import FolderOpen from '@mui/icons-material/FolderOpen';
import IconButton from '@mui/material/IconButton';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import SaveIcon from '@mui/icons-material/Save';
import Snackbar from '@mui/material/Snackbar';
import Tooltip from '@mui/material/Tooltip';
import { SimpleTreeView } from '@mui/x-tree-view//SimpleTreeView'
import { TreeItem } from '@mui/x-tree-view/TreeItem'

import { components } from "./Query-Engine-Schema";
import { ObjectTypeMap, buildSchema } from "./SchemaType";

let onChange = () => {};

interface DesignProps {
  onChange :  () => void
  , baseUrl : string
}
function Design(props : DesignProps) {

  const [files, setFiles] = useState(null as components["schemas"]["DesignNode"] | null)
  const [nodeMap, setNodeMap] = useState(null as Map<string, components["schemas"]["DesignNode"]> | null)

  const [snackOpen, setSnackOpen] = useState(false)
  const [snackMessage, setSnackMessage] = useState(null as string | null)

  const [fileDrawerWidth, setFileDrawerWidth] = useState(360)
  const [displayFileDrawer, setDisplayFileDrawer] = useState(true)

  const [helpDrawerWidth, setHelpDrawerWidth] = useState(360)
  const [displayHelpDrawer, setDisplayHelpDrawer] = useState(true)

  const [schema, setSchema] = useState(null as ObjectTypeMap | null)
  const [openapi, setOpenApi] = useState({} as any)

  const [fileContents, setFileContents] = useState(null as components["schemas"]["Pipeline"] | null)
  const [fileContentsString, setFileContentsString] = useState(null as string | null)

  const [helpText, setHelpText] = useState('')

  const outerBox = React.useRef<HTMLDivElement>(null)

  if (props.onChange !== undefined) {
    onChange = props.onChange
  }

  const isDirectory = (n : components["schemas"]["DesignNode"]) : n is components["schemas"]["DesignDir"] => {
    return Array.isArray(n.children);
  }

  const isFile = (n : components["schemas"]["DesignNode"]) : n is components["schemas"]["DesignFile"] => {
    return ! Array.isArray(n.children);
  }

  const buildNodeMap = useCallback((root : components["schemas"]["DesignDir"]) => {
    const nm = new Map<string, components["schemas"]["DesignNode"]>();
    function addToNodeMap(node : components["schemas"]["DesignNode"] ) {
      nm.set(node.path, node)
      if (Array.isArray(node.children)) {
        node.children.forEach(n => addToNodeMap(n))
      }
    }
    addToNodeMap(root);
    return nm;
  }, [])

  const handleResponse = useCallback((p : Promise<Response>) => {
    function setParents(node : any) {
      node.children.forEach((n : any) => {
        n.parent = node
        if (Array.isArray(n.children)) {
          setParents(n)
        }
      })
    }
      
    return p
      .then((r : Response) => {
        if (!r.ok) {
          return r.text().then(t => {
            throw Error(t)
          })
        } else {
          return r.json()
        }
      })
      .then((j : any) => {
        setFiles(j)
        setParents(j)
        setNodeMap(buildNodeMap(j))
        onChange()
        return j
      })
      .catch(e => {
        console.log(e)
        setSnackMessage(e.message)
        setSnackOpen(true)
      })
  }, [setFiles, setNodeMap, buildNodeMap])

  const [defaulExpanded, _] = useState(() => {
    const saved = localStorage.getItem("design-dir-state")
    return saved ? JSON.parse(saved) : saved
  })

  const [expanded, setExpanded] = useState([] as string[])
  const [selected, setSelected] = useState('')

  useEffect(() => {
    localStorage.setItem("design-dir-state", JSON.stringify(expanded));
  }, [expanded]);

  useEffect(() => {
    const getAllDirs = (root : components["schemas"]["DesignDir"]) => {
      const arr : string[] = []
  
      function addToDirs(node : components["schemas"]["DesignNode"]) {
        if (isDirectory(node)) {
          arr.push(node.path)
          node.children.forEach((n) => addToDirs(n))
        }
      }
      addToDirs(root)
      return arr
    }
    
    const url = new URL(props.baseUrl + 'api/design/all');
    handleResponse(fetch(url, {credentials: 'include'}))
      .then(j => {
        const dirs = getAllDirs(j)
        if (defaulExpanded) {
          setExpanded(dirs.filter(value => defaulExpanded.includes(value)))
        } else {
          setExpanded(dirs) 
        }
      })
    const openApiUrl = new URL(props.baseUrl + 'openapi.json');
    fetch(openApiUrl, {credentials: 'include'})
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
        setOpenApi(j)
        setSchema(buildSchema(j))
      })
      .catch(e => {
        console.log(e)
        setSnackMessage(e.message)
        setSnackOpen(true)
      })

  }, [props.baseUrl, handleResponse])

  const [currentFile, setCurrentFile] = useState(null as  components["schemas"]["DesignFile"] | null);

  function validateFile() {
    const url = new URL(props.baseUrl + 'api/design/validate');
    console.log(fileContents)

    fetch(url, { method: 'POST', body: JSON.stringify(fileContents), credentials: 'include', headers: {'Content-Type': 'application/json'} })
      .then(r => {
        if (!r.ok) {
          return r.text().then(t => {
            throw Error(t)
          })
        } else {
          return r.text()
        }
      })
      .then(t => {
        setSnackMessage(t)
        setSnackOpen(true)
      })
      .catch(e => {
        console.log(e)
        setSnackMessage(e.message)
        setSnackOpen(true)
      })
  }

  function saveFile() {
    if (!currentFile) {
      return
    }    
    const url = new URL(props.baseUrl + 'api/design/file/' + currentFile.path)
    let contents : string;
    if (currentFile.path.endsWith('.jexl')) {
      contents = fileContentsString || ''
    } else {
      contents = JSON.stringify(fileContents)
    }
    fetch(url, { method: 'PUT', body: contents, credentials: 'include', headers: {'Content-Type': 'application/json'} })
      .then(r => {
        if (!r.ok) {
          return r.text().then(t => {
            throw Error(t)
          })
        } else {
          onChange()
          return r.text()
        }
      })
      .catch(e => {
        console.log(e)
        setSnackMessage(e.message)
        setSnackOpen(true)
      })
  }

  function fileSelected(nodeId : string) {
    const node = nodeMap && nodeMap.get(nodeId)
    if (node && isFile(node)) {
      setCurrentFile(node);
      setHelpText('');
      const nodeUrl = new URL(props.baseUrl + 'api/design/file/' + node.path);
      fetch(nodeUrl, { credentials: 'include', headers: { 'Accept' : 'application/json, */*;q=0.8' } })
        .then(r => {
          if (!r.ok) {
            return r.text().then(t => {
              throw Error(t)
            })
          } else {
            return r.text()
          }
        })
        .then(j => {
          if (node && node.name === 'permissions.jexl') {
            setHelpText(permissionsHtml + (openapi ? openapi.components.schemas.Condition.description : ''))
            setFileContents(null)
            setFileContentsString(j)
          } else {
            let p = JSON.parse(j)
            if (!p) {
              p = {}
            }
            setFileContents(p)
            setFileContentsString(null)
          }
        })
        .catch(e => {
          console.log(e)
          setSnackMessage(e.message)
          setSnackOpen(true)
        })
    } else {
      setCurrentFile(null)
      setFileContents(null)
      setFileContentsString('')
    }
  }

  function onRename(node : components["schemas"]["DesignNode"], newName : string) {
    const oldPath = node.path;
    const newPath = node.path.substring(0, node.path.lastIndexOf("/") + 1) + newName;
    console.log("Rename from " + oldPath + " to " + newPath)
    const url = new URL(props.baseUrl + 'api/design/rename/' + node.path + '?name=' + encodeURIComponent(newName));
    handleResponse(fetch(url, { method: 'POST', credentials: 'include' }))
      .then((_ : any) => {
        const idx = expanded.findIndex(p => p === oldPath);
        if (idx >= 0) {
          expanded[idx] = newPath;
          setExpanded(expanded);
        }
      })
  }

  function childExists(node : components["schemas"]["DesignDir"], newName : string) {
    return node.children.find(n => n.name === newName) === undefined ? false : true;
  }

  function onNewFolder(node : components["schemas"]["DesignDir"]) {
    let name;
    for (let i = 1; (name = 'NewFolder' + i) && childExists(node, name) && i < 10; ++i)
      ;
    const parentPath = node.path === '' ? '' : node.path + '/'
    const url = new URL(props.baseUrl + 'api/design/file/' + parentPath + name);
    if (expanded.find(n => n === node.path) === undefined) {
      expanded.push(node.path);
    }
    handleResponse(fetch(url, { method: 'PUT', credentials: 'include', headers: { 'Content-Type': 'inode/directory' }}));
  }

  function onNewPipeline(node : components["schemas"]["DesignDir"]) {
    let name;
    for (let i = 1; (name = 'NewPipeline' + i + '.yaml') && childExists(node, name) && i < 10; ++i)
      ;
    const parentPath = node.path === '' ? '' : node.path + '/'
    const url = new URL(props.baseUrl + 'api/design/file/' + parentPath + name);
    if (expanded.find(n => n === node.path) === undefined) {
      expanded.push(node.path);
    }
    const newPipeline = '{"source":{"type":"TEST"},"formats":[{"type":"Delimited"}]}'
    handleResponse(fetch(url, { method: 'PUT', body: newPipeline, credentials: 'include', headers: { 'Content-Type': 'application/json' } }));
  }

  function onNewPermissions(node : components["schemas"]["DesignDir"]) {
    const name = 'permissions.jexl';
    const parentPath = node.path === '' ? '' : node.path + '/'
    const url = new URL(props.baseUrl + 'api/design/file/' + parentPath + name);
    if (expanded.find(n => n === node.path) === undefined) {
      expanded.push(node.path);
    }
    handleResponse(fetch(url, { method: 'PUT', credentials: 'include', headers: { 'Content-Type': 'application/jexl' }, body: '' }));
  }

  function onDelete(node: components["schemas"]["DesignNode"]) {
    const url = new URL(props.baseUrl + 'api/design/file/' + node.path);
    handleResponse(fetch(url, { method: 'DELETE', credentials: 'include' }));
  }

  const handleToggle = (_: React.SyntheticEvent, nodeIds: string[]) => {
    setExpanded(nodeIds)
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

  function fileDrawerWidthChange(w : number) {
    if (w > 400) {
      setFileDrawerWidth(w)
    }
  }

  function fileDrawerHide() {
    setDisplayFileDrawer(!displayFileDrawer)
  }

  function helpDrawerWidthChange(w : number) {
    if (outerBox.current) {
      w = outerBox.current.clientWidth - w
      if (w > 300) {
        setHelpDrawerWidth(w)
      }

    }
  }

  function helpDrawerHide() {
    setDisplayHelpDrawer(!displayHelpDrawer)
  }

  const snackClose = () => {
    setSnackOpen(false);
  };

  const renderTree = (node : components["schemas"]["DesignNode"]) => {
    const label = (
      <TreeViewFileItemLabel
        id={'lbl_' + node.path}
        node={node}
        onRename={onRename}
        onNewFolder={onNewFolder}
        onNewPipeline={onNewPipeline}
        onNewPermissions={onNewPermissions}
        onDelete={onDelete}
      />
    )
    const children = Array.isArray(node.children) ? node.children.map((child) => renderTree(child)) : null
    return (
      <TreeItem key={node.name} itemId={node.path} label={label}>
        {children}
      </TreeItem>
    )
  };

  return (
    <div className="h-full flex-auto flex flex-row overflow-hidden" ref={outerBox}>
      {displayFileDrawer && (
        <>
          <div style={{ width: fileDrawerWidth }} className="box-border " >
            <div style={{ borderColor: 'divider' }} className="flex border-b">
              <div className="flex-auto p-3">
                FILES
              </div>
              <div className="flex-none">
                <IconButton sx={{ 'borderRadius': '20%' }} onClick={fileDrawerHide} >
                  <KeyboardDoubleArrowLeftIcon fontSize="small" />
                </IconButton>
              </div>
            </div>
            <div className="grow flex flex-col">
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
                sx={{ height: '100%', flexGrow: 1, maxWidth: '100%', overflowY: 'auto' }}
              >
                {files && renderTree(files)}
              </SimpleTreeView>
            </div>
          </div>
          <DragBar onChange={fileDrawerWidthChange} />
        </>
      )}
      {displayFileDrawer || (
        <div className="grow max-w-max border-r-2 align-top">
          <div>
            <IconButton sx={{ 'borderRadius': '20%' }} onClick={fileDrawerHide}>
              <KeyboardDoubleArrowRightIcon fontSize="small" />
            </IconButton>
          </div>
        </div>
      )}

      <div className="grow flex flex-col overflow-hidden">
        <div className="flex border-b">
          <div style={{ borderColor: 'divider' }} className="flex p-3 grow">
            <div className="grow">
              {currentFile == null ? 'No file selected' : currentFile.path}
            </div>
          </div>
          <div>
            <Tooltip title="Validate">
              <IconButton sx={{ 'borderRadius': '20%' }} onClick={validateFile}>
                <FactCheckIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Save">
              <IconButton sx={{ 'borderRadius': '20%' }} onClick={saveFile}>
                <SaveIcon />
              </IconButton>
            </Tooltip>
          </div>
        </div>
        {(fileContents && schema) ?
          (<PipelineEditor
            schema={schema}
            onHelpChange={ (help : string) => { setHelpText(help) } }
            pipeline={fileContents}
            onChange={ (p :  components["schemas"]["Pipeline"] )  => { setFileContents(p) } }
          />)
          :
          (<textarea 
            className="grow font-mono p-3" 
            value={fileContentsString ?? ''} 
            disabled={fileContentsString === null} 
            onChange={(e  : any) => setFileContentsString(e.currentTarget.value)} />)
        }
        <Snackbar open={snackOpen} autoHideDuration={10000} message={snackMessage} onClose={snackClose} />
      </div>

      {displayHelpDrawer || (
        <div className="grow-0 w-10 border-l-2 align-top">
          <div>
            <IconButton sx={{ 'borderRadius': '20%' }} onClick={helpDrawerHide}>
              <KeyboardDoubleArrowLeftIcon fontSize="small" />
            </IconButton>
          </div>
        </div>
      )}
      {displayHelpDrawer && (
        <>
          <DragBar onChange={helpDrawerWidthChange} />
          <div style={{ width: helpDrawerWidth }} className="flex flex-col overflow-hidden" >
            <div style={{ borderColor: 'divider' }} className="flex-none border-b flex">
              <div className="flex-none">
                <IconButton sx={{ 'borderRadius': '20%' }} onClick={helpDrawerHide} >
                  <KeyboardDoubleArrowRightIcon fontSize="small" />
                </IconButton>
              </div>
              <div className="flex-auto p-3">
                HELP
              </div>
            </div>
            <div className="flex-auto w-full overflow-y-auto p-3 prose"
              dangerouslySetInnerHTML={{ __html: helpText }} >
            </div>
          </div>
        </>
      )}
    </div>);
}

const permissionsHtml = `
<H2>Permissions Files</H2>
<P>
You are editing a permissions file.
At runtime the expression in this file will be evaluated and the operation will only be permitted to access the directory if the expression evaluates to true.
</P>
<P>
Permissions files are evaluated at every level of the directory hierarchy.
</P>
<P>
The expression in the permission file is treated as a standard Query Engine condition expression.
</P>
`

export default Design;