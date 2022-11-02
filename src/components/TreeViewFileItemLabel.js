import React, { useEffect, useState, useRef } from 'react';

import Box from '@mui/material/Box';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import EnhancedEncryptionIcon from '@mui/icons-material/EnhancedEncryption';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import PostAddIcon from '@mui/icons-material/PostAdd';
import Tooltip from '@mui/material/Tooltip';

import DeleteIcon from '@mui/icons-material/Delete';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

function TreeViewFileItemLabel(props) {

  var [name, setName] = useState(props.node.name);
  var [disabled, setDisabled] = useState(true);

  var [anchorMenu, setAnchorMenu] = useState(null);
  const menuOpen = Boolean(anchorMenu);

  const input = useRef(null);

  function renameClick(e) {
    setAnchorMenu(null)
    setDisabled(false)
    input.current.focus()
  }

  const handleOpenMenu = (e) => {
    e.stopPropagation()
    setAnchorMenu(e.currentTarget);
  };

  const handleCloseNavMenu = (e) => {
    e.stopPropagation()
    setAnchorMenu(null)
  };

  function handleInputChange(e) {
    setName(e.target.value)
  }

  function handleDelete(e) {
    props.onDelete && props.onDelete(props.node)
  }

  function siblingExists(node, newName) {
    return node.parent && (node.parent.children.find(n => n.name === newName) === undefined ? false : true);
  }

  function loseFocus(e) {
    if (name === props.node.name) {
      setDisabled(true)
    } else if (siblingExists(props.node, name)) {
      console.log('has sibling')
      input.current.focus()
    } else {
      setDisabled(true)
      props.onRename && props.onRename(props.node, name)
    }
  }

  function keyPress(e) {
    if (e.keyCode === 13) {
      input.current.blur();
    } else if (e.keyCode === 27) {
      name = props.node.name
      setName(props.node.name);
      input.current.blur();
    }
  }

  useEffect(() => {
    input.current.focus()
  }, [disabled])

  const menuItems = []
  if (Array.isArray(props.node.children)) {
    menuItems.push(
      <MenuItem key="newfolder" onClick={e => { e.stopPropagation(); props.onNewFolder && props.onNewFolder(props.node) }}>
        <CreateNewFolderIcon fontSize="small" className="mr-2" /> New folder
      </MenuItem>
    )
    menuItems.push(
      <MenuItem key="newpipeline" onClick={e => { e.stopPropagation(); props.onNewFolder && props.onNewPipeline(props.node) }}>
        <PostAddIcon fontSize="small" className="mr-2" /> New pipeline
      </MenuItem>
    )
    if (props.node.children.find(n => n.name === 'permissions.jexl') === null) {
      menuItems.push(
        <MenuItem key="newpermissions" onClick={e => { e.stopPropagation(); props.onNewFolder && props.onNewPermissions(props.node) }}>
          <EnhancedEncryptionIcon fontSize="small" className="mr-2" /> New permissions
        </MenuItem>
      )
    }
  }
  if (props.node.path !== '') {
    menuItems.push(
      <MenuItem key="rename" onClick={e => { e.stopPropagation(); renameClick() }}>
        <DriveFileRenameOutlineIcon fontSize="small" className="mr-2" /> Rename
      </MenuItem>
    )
    if (!props.node.children || props.node.children.length === 0) {
      menuItems.push(
        <MenuItem key="delete" onClick={handleDelete}>
          <DeleteIcon fontSize="small" className="mr-2" /> Delete
        </MenuItem>
      )
    }
  }

  return (
    <Box className="flex items-center align-middle">
      <Box className='flex-auto'>
        <input className="bg-transparent appearance-none w-full py-2 text-gray-700 leading-tight focus:outline-none border-b-2 disabled:border-transparent"
          id={props.id}
          type="text"
          value={name}
          onChange={handleInputChange}
          onClick={e => { if (!disabled) e.stopPropagation() }}
          onBlur={e => { e.stopPropagation(); loseFocus() }}
          onKeyUp={keyPress}
          disabled={disabled}
          ref={input}
        />
      </Box>
      <Box className='flex-none'>
        <Tooltip title={Array.isArray(props.node.children) ? 'Folder operations' : 'File operations'}>
          <IconButton
            className="flex-right"
            sx={{ 'borderRadius': '20%' }}
            onClick={e => { e.stopPropagation(); handleOpenMenu(e) }}
          >
            <MenuIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Menu
          id={"menu-" + props.node.path}
          anchorEl={anchorMenu}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          open={menuOpen}
          onClose={handleCloseNavMenu}
          children={menuItems}
        >
        </Menu>
      </Box>
    </Box>

  )
}

export default TreeViewFileItemLabel;