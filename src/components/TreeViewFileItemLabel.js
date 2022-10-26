import React, { useEffect, useState, useRef } from 'react';

import Box from '@mui/material/Box';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import EnhancedEncryptionIcon from '@mui/icons-material/EnhancedEncryption';
import IconButton from '@mui/material/IconButton';
import PostAddIcon from '@mui/icons-material/PostAdd';
import Tooltip from '@mui/material/Tooltip';

import DeleteIcon from '@mui/icons-material/Delete';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';

function TreeViewFileItemLabel(props) {

  var [name, setName] = useState(props.node.name);
  var [disabled, setDisabled] = useState(true);

  const input = useRef(null);

  function renameClick(e) {
    setDisabled(false)
    input.current.focus()
  }

  function handleInputChange(e) {    
    console.log('InputString: ' + e.target.value);
    setName(e.target.value)
  }

  function siblingExists(node, newName) {
    return node.parent && (node.parent.children.find(n => n.name === newName) === undefined ? false : true);
  }

  function loseFocus(e) {
    if (siblingExists(props.node, name)) {
      console.log('has sibling')
    } else {
      setDisabled(true)
      props.onRename && props.onRename(props.node, name)
    }
  }

  function keyPress(e) {
    if (e.keyCode === 13) {
      input.current.blur();
    }
  }

  useEffect(() => {
    input.current.focus()
  }, [disabled])

  return (
    <Box className="flex items-center align-middle">
    <Box className='flex-1'>
      <input className="bg-transparent appearance-none w-full py-2 text-gray-700 leading-tight focus:outline-none"
        id={props.id} 
        type="text" 
        value={name} 
        onChange={handleInputChange} 
        onClick={e => {if(!disabled) e.stopPropagation()}}
        onBlur={loseFocus}
        onKeyUp={keyPress}
        disabled={disabled}
        ref={input}
        />
    </Box>
    <Box className='flex-none'>
      {Array.isArray(props.node.children)
        ? (
          <>
            <Tooltip title='New folder'>
              <IconButton 
                className="flex-right" 
                sx={{ 'borderRadius': '20%' }}
                onClick={e => { e.stopPropagation(); props.onNewFolder && props.onNewFolder(props.node) }}
                >
                <CreateNewFolderIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title='New pipeline'>
              <IconButton 
                className="flex-right" 
                sx={{ 'borderRadius': '20%' }}
                onClick={e => { e.stopPropagation(); props.onNewPipeline && props.onNewPipeline(props.node) }}
                >
                <PostAddIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            {props.node.children.find(n => n.name === 'permissions.jexl') ? null : (
              <Tooltip title='New permissions file'>
                <IconButton 
                  className="flex-right" 
                  sx={{ 'borderRadius': '20%' }}
                  onClick={e => { e.stopPropagation(); props.onNewPermissions && props.onNewPermissions(props.node) }}
                  >
                  <EnhancedEncryptionIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )
            }
          </>
        )
        : null}
      {
        name === 'permissions.jexl' ? null :
          (
            <Tooltip title='Rename'>
              <IconButton 
                className="flex-right" 
                sx={{ 'borderRadius': '20%' }}
                onClick={e => { e.stopPropagation(); renameClick(e) }}
                >
                <DriveFileRenameOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )
      }
      <Tooltip title='Delete'>
        <IconButton 
          className="flex-right" 
          sx={{ 'borderRadius': '20%' }}
          onClick={e => { e.stopPropagation(); props.onDelete && props.onDelete(props.node) }}
          >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  </Box>

  )
}

export default TreeViewFileItemLabel;