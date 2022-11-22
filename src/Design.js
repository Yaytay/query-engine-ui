import React, { useEffect, useState, useCallback, useRef } from 'react';

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
import TreeItem from '@mui/lab/TreeItem';
import TreeView from '@mui/lab/TreeView';

var onChange;

function Design(props) {

  const [files, setFiles] = useState({ children: [], path: '' })
  const [expanded, setExpanded] = useState([])
  const [nodeMap, setNodeMap] = useState({})

  const [snackOpen, setSnackOpen] = useState(false)
  const [snackMessage, setSnackMessage] = useState()

  const [fileDrawerWidth, setFileDrawerWidth] = useState(360)
  const [displayFileDrawer, setDisplayFileDrawer] = useState(true)

  const [helpDrawerWidth, setHelpDrawerWidth] = useState(360)
  const [displayHelpDrawer, setDisplayHelpDrawer] = useState(true)

  const [openapi, setOpenapi] = useState()
  const [schema, setSchema] = useState()

  const [fileContents, setFileContents] = useState(null)
  const [fileIsPipeline, setFileIsPipeline] = useState(false)

  const [helpText, setHelpText] = useState('')

  const outerBox = useRef(null)

  if (props.onChange !== undefined && onChange === undefined) {
    onChange = props.onChange
  }

  const setParents = useCallback(node => {
    node.children.forEach(n => {
      n.parent = node
      if (Array.isArray(n.children)) {
        setParents(n)
      }
    })
  }, [])

  const getAllDirs = useCallback(root => {
    var arr = []
    function addToDirs(node) {
      if (Array.isArray(node.children)) {
        arr.push(node.path)
        node.children.forEach(n => addToDirs(n))
      }
    }
    addToDirs(root)
    return arr
  }, [])

  const buildNodeMap = useCallback(root => {
    var nm = {}
    function addToNodeMap(node) {
      if (Array.isArray(node.children)) {
        nm[node.path] = node
        node.children.forEach(n => addToNodeMap(n))
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
        if (onChange) {
          onChange()
        }
        return j
      })
      .catch(e => {
        console.log(e)
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
    let openApiUrl = new URL(props.baseUrl + 'openapi.json');
    fetch(openApiUrl)
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
        setOpenapi(j)
        setSchema(buildSchema(j))
      })
      .catch(e => {
        console.log(e)
        setSnackMessage(e.message)
        setSnackOpen(true)
      })

  }, [props.baseUrl, handleResponse, getAllDirs])

  const [currentFile, setCurrentFile] = useState(null);

  const fieldOrders = {
    Pipeline: ['title', 'description', 'condition', 'arguments', 'sourceEndpoints', 'dynamicEndpoints', 'source', 'processors', 'destinations']
    , Argument: ['name', 'type', 'title', 'prompt', 'description', 'optional', 'multiValued', 'ignored', 'dependsUpon', 'defaultValue', 'minimumValue', 'maximumValue', 'possibleValues', 'possibleValuesUrl', 'permittedValuesRegex']
    , ArgumentValue: ['value', 'label']
    , Condition: ['expression']
    , Destination: ['type', 'name', 'mediaType']
    , Processor: ['type']
    , Source: ['type']
  }

  function buildSchema(openapi) {
    console.log(openapi)
    function typeFromRef(arg) {
      var lastPos = arg.lastIndexOf('/')
      if (lastPos > 0) {
        return arg.substring(lastPos + 1);
      } else {
        return arg;
      }
    }

    function collectProperties(schema) {
      var props = {}
      if (schema.properties) {
        props = { ...schema.properties }
      }
      Object.keys(props).forEach(pp => {
        if (props[pp].type === 'array' && props[pp].minItems > 0) {
          props[pp].required = true
        }
      })
      if (schema.allOf) {
        schema.allOf.forEach(ao => {
          if (ao.$ref) {
            var parentProps = collectProperties(openapi.components.schemas[typeFromRef(ao.$ref)])
            Object.keys(parentProps).forEach(pp => {
              if (props[pp]) {
                Object.assign(props[pp], parentProps[pp])
              } else {
                props[pp] = { ...parentProps[pp] }
              }
            })
          } else if (ao.properties) {
            Object.keys(ao.properties).forEach(pp => {
              if (props[pp]) {
                Object.assign(props[pp], ao.properties[pp])
              } else {
                props[pp] = { ...ao.properties[pp] }
              }
            })
          }
        })
      }
      if (schema.required) {
        schema.required.forEach(req => {
          props[req].required = true
        })
      }
      console.log(props)
      return props
    }

    var result = {}
    Object.keys(openapi.components.schemas).forEach(k => {
      const schema = openapi.components.schemas[k]
      var simpleSchema = { description: schema.description ?? '', name: k }

      if (schema.discriminator) {
        simpleSchema['discriminator'] = { propertyName: schema.discriminator.propertyName, mapping: {} }
        Object.keys(schema.discriminator.mapping).forEach(dk => {
          simpleSchema.discriminator.mapping[dk] = typeFromRef(schema.discriminator.mapping[dk])
        })
      }

      simpleSchema.collectedProperties = collectProperties(schema)

      simpleSchema.sortedProperties = []
      if (fieldOrders[k]) {
        fieldOrders[k].forEach(f => {
          if (simpleSchema.collectedProperties[f]) {
            simpleSchema.sortedProperties.push(f)
          }
        })
      }
      Object.keys(simpleSchema.collectedProperties).forEach(f => {
        if (simpleSchema.collectedProperties[f].required && !simpleSchema.sortedProperties.includes(f)) {
          simpleSchema.sortedProperties.push(f)
        }
      })
      Object.keys(simpleSchema.collectedProperties).forEach(f => {
        if (!simpleSchema.collectedProperties[f].required && !simpleSchema.sortedProperties.includes(f)) {
          simpleSchema.sortedProperties.push(f)
        }
      })

      result[k] = simpleSchema
    })

    console.log(result)
    return result
  }

  function validateFile() {
    const url = new URL(props.baseUrl + 'api/design/validate');
    console.log(fileContents)
    fetch(url, { method: 'POST', body: JSON.stringify(fileContents), headers: { 'Content-Type': 'application/json' } })
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
        console.log(t)
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
    const url = new URL(props.baseUrl + 'api/design/file/' + currentFile.path);
    console.log(fileContents)
    fetch(url, { method: 'PUT', body: JSON.stringify(fileContents), headers: { 'Content-Type': 'application/json' } })
      .then(r => {
        if (!r.ok) {
          return r.text().then(t => {
            throw Error(t)
          })
        } else {
          return r.text()
        }
      })
      .catch(e => {
        console.log(e)
        setSnackMessage(e.message)
        setSnackOpen(true)
      })
  }

  function fileSelected(e, nodeIds) {
    console.log(nodeIds)
    var node = nodeMap[nodeIds]
    console.log(node)
    if (node && !Array.isArray(node.children)) {
      setCurrentFile(node);
      setHelpText('');
      let nodeUrl = new URL(props.baseUrl + 'api/design/file/' + node.path);
      console.log(nodeUrl)
      fetch(nodeUrl, { headers: { 'Accept': 'application/json, */*;q=0.8' } })
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
          console.log(j)
          if (node.name === 'permissions.jexl') {
            setHelpText(permissionsHtml + (openapi ? openapi.components.schemas.Condition.description : ''))
            setFileContents(j)
            setFileIsPipeline(false)
          } else {
            var p = JSON.parse(j)
            if (!p) {
              p = {}
            }
            console.log(p)
            setFileContents(p)
            setFileIsPipeline(true)
          }
        })
        .catch(e => {
          console.log(e)
          setSnackMessage(e.message)
          setSnackOpen(true)
        })
    } else {
      setFileContents(null)
      setFileIsPipeline(false)
    }
  }

  function onRename(node, newName) {
    const oldPath = node.path;
    const newPath = node.path.substring(0, node.path.lastIndexOf("/") + 1) + newName;
    console.log("Rename from " + oldPath + " to " + newPath)
    let url = new URL(props.baseUrl + 'api/design/rename/' + node.path + '?name=' + encodeURIComponent(newName));
    handleResponse(fetch(url, { method: 'POST' }))
      .then(j => {
        const idx = expanded.findIndex(p => p === oldPath);
        if (idx >= 0) {
          expanded[idx] = newPath;
          setExpanded(expanded);
        }
      })
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

  function fileDrawerWidthChange(w) {
    console.log(w)
    if (w > 400) {
      setFileDrawerWidth(w)
    }
  }

  function fileDrawerHide() {
    setDisplayFileDrawer(!displayFileDrawer)
  }

  function helpDrawerWidthChange(w) {
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

  const snackClose = (event, reason) => {
    setSnackOpen(false);
  };

  const renderTree = (node) => {
    const icon = Array.isArray(node.children) && node.children.length === 0 ? (<FolderOpen />) : null
    const label = (
      <TreeViewFileItemLabel
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
      <TreeItem key={node.name} nodeId={node.path} icon={icon} label={label} children={children} />
    )
  };

  return (
    <div className="flex-auto flex flex-row overflow-hidden" ref={outerBox}>
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
              <TreeView
                aria-label="file system navigator"
                multiSelect={false}
                defaultCollapseIcon={<FolderOpen />}
                defaultExpandIcon={<Folder />}
                defaultEndIcon={<Article />}
                expanded={expanded}
                onNodeSelect={fileSelected}
                onNodeToggle={nodeToggled}
                sx={{ height: '100%', flexGrow: 1, maxWidth: '100%', overflowY: 'auto' }}
              >
                {renderTree(files)}
              </TreeView>
            </div>
          </div>
          <DragBar className='grow' onChange={fileDrawerWidthChange} />
        </>
      )}
      {true || displayFileDrawer || (
        <div className="grow w-10 border-r-2 align-top">
          <div>
            <IconButton sx={{ 'borderRadius': '20%' }} onClick={fileDrawerHide}>
              <KeyboardDoubleArrowRightIcon fontSize="small" />
            </IconButton>
          </div>
        </div>
      )}

      <div className="grow flex flex-col overflow-hidden">
        <div style={{ borderColor: 'divider' }} className="flex border-b p-3">
          <div className="grow">
            {currentFile == null ? 'No file selected' : currentFile.path}
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
        {(fileIsPipeline) ?
          (<PipelineEditor
            schema={schema}
            onHelpChange={h => setHelpText(h)}
            pipeline={fileContents}
            onChange={p => { p.v = (p.v ?? 0) + 1; setFileContents(p); console.log(p) }}
          />)
          :
          (<textarea className="grow font-mono p-3" value={fileContents ?? ''} disabled={fileContents === null} />)
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
          <DragBar className='' onChange={helpDrawerWidthChange} />
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