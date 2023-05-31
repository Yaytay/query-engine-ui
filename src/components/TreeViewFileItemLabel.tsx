import { useEffect, useState } from 'react';
import * as React from 'react';

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

import { components } from "../Query-Engine-Schema";

interface TreeViewFileItemLabelProps {
  id : string
  , node : components["schemas"]["DesignNode"]
  , onDelete : (node: components["schemas"]["DesignNode"]) => void
  , onRename : (node: components["schemas"]["DesignNode"], newName : string) => void
  , onNewFolder : (node: components["schemas"]["DesignDir"]) => void
  , onNewPipeline : (node: components["schemas"]["DesignDir"]) => void
  , onNewPermissions : (node: components["schemas"]["DesignDir"]) => void
}
function TreeViewFileItemLabel(props : TreeViewFileItemLabelProps) {

  var [name, setName] = useState(props.node.name);
  var [disabled, setDisabled] = useState(true);

  var [anchorMenu, setAnchorMenu] = useState(null as Element | null);
  const menuOpen = Boolean(anchorMenu);

  const input = React.useRef<HTMLInputElement>(null)

  function renameClick() {
    setAnchorMenu(null)
    setDisabled(false)
    input && input.current && input.current.focus()
  }

  const handleOpenMenu = (e : React.MouseEvent<any>) => {
    e.stopPropagation()
    setAnchorMenu(e.currentTarget);
  };

  const handleCloseNavMenu = (e : MouseEvent) => {
    e.stopPropagation()
    setAnchorMenu(null)
  };

  function handleInputChange(e : React.ChangeEvent<HTMLInputElement>) {
    setName(e.currentTarget.value)
  }

  function handleDelete() {
    props.onDelete && props.onDelete(props.node)
  }

  function siblingExists(node : any, sibling : string) {
    return node.parent && (node.parent.children.find((n : components["schemas"]["DesignNode"]) => n.name === sibling) === undefined ? false : true);
  }

  function loseFocus() {
    if (name === props.node.name) {
      setDisabled(true)
    } else if (siblingExists(props.node, name)) {
      input && input.current && input.current.focus()
    } else {
      setDisabled(true)
      props.onRename && props.onRename(props.node, name)
    }
  }

  function keyPress(e : React.KeyboardEvent<HTMLInputElement>) {
    if (e.code === '\r') {
      input && input.current && input.current.blur();
    } else if (e.code === '\t') {
      name = props.node.name
      setName(props.node.name);
      input && input.current && input.current.blur();
    }
  }

  const isDirectory = (n : components["schemas"]["DesignNode"]) : n is components["schemas"]["DesignDir"] => {
    return Array.isArray(n.children);
  }

  useEffect(() => {
    input && input.current && input.current.focus()
  }, [disabled])

  const menuItems = []
  if (Array.isArray(props.node.children)) {
    menuItems.push(
      <MenuItem key="newfolder" onClick={e => { e.stopPropagation(); props.onNewFolder && isDirectory(props.node) && props.onNewFolder(props.node) }}>
        <CreateNewFolderIcon fontSize="small" className="mr-2" /> New folder
      </MenuItem>
    )
    menuItems.push(
      <MenuItem key="newpipeline" onClick={e => { e.stopPropagation(); props.onNewPipeline && isDirectory(props.node) && props.onNewPipeline(props.node) }}>
        <PostAddIcon fontSize="small" className="mr-2" /> New pipeline
      </MenuItem>
    )
    if (!props.node.children.find(n => n.name === 'permissions.jexl')) {
      menuItems.push(
        <MenuItem key="newpermissions" onClick={e => { e.stopPropagation(); props.onNewPermissions && isDirectory(props.node) && props.onNewPermissions(props.node) }}>
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
        />
      </Box>
    </Box>

  )
}

export default TreeViewFileItemLabel;