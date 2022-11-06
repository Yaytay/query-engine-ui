import './Nav.css';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Parameters from './Parameters.js';
import Modal from 'react-modal';
import QeIcon from './QeIcon';

import AppBar from '@mui/material/AppBar';
import ArrowDropDown from '@mui/icons-material/ArrowDropDown';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import SvgIcon from '@mui/material/SvgIcon';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';

import {NestedMenuItem} from 'mui-nested-menu';

var [modalIsOpen, setIsOpen] = [false, null];
var [anchorElNav, setAnchorElNav] = [null, null];
var [anchorElData, setAnchorElData] = [null, null];
var pipeline = { "name": "None" };
var [args, setArgs] = [{}, null];

function displayParameters(event, item) {
  setAnchorElNav(null);
  setAnchorElData(null);
  console.log(item);
  pipeline = item;

  var ta = {
    '_fmt': pipeline.destinations[0].name
  }
  if (pipeline.arguments) {
    pipeline.arguments.forEach(arg => {
      ta[arg.name] = arg.defaultValue ?? '';
    });
  }
  setArgs(ta);

  setIsOpen(true);
}

function closeModal() {
  setIsOpen(false);
}

function submitModal(values) {
  console.log(values);
  setIsOpen(false);
}

function QueryMenuItem(props) {
  return (
    <MenuItem onClick={e => displayParameters(e, props.item)}>
      {props.item.title ?? props.item.name}
    </MenuItem>
  );
}

function QueryFolderLevel(props) {
  var children = props.items;

  return (
    <>
      {children.map((value, index) => {
        if (value.children) {
          return (
            <NestedMenuItem key={value.path} parentMenuOpen={props.parentMenuOpen} label={value.name}>
              <QueryFolderLevel items={value.children} parentMenuOpen={props.parentMenuOpen}></QueryFolderLevel>
            </NestedMenuItem>
          );
        } else {
          return (
            <QueryMenuItem key={value.path} item={value} />
          );
        }
      })}
    </>
  );
}

function Nav(props) {

  [anchorElNav, setAnchorElNav] = useState(null);
  const navOpen = Boolean(anchorElNav);

  [anchorElData, setAnchorElData] = useState(null);
  const dataOpen = Boolean(anchorElData);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleOpenDataMenu = (e) => setAnchorElData(e.currentTarget);
  const handleCloseDataMenu = () => setAnchorElData(null);

  [modalIsOpen, setIsOpen] = useState(false);
  [args, setArgs] = useState({});

  Modal.setAppElement('#root');

  const pages = ['Design', 'Test', 'Demo', 'Settngs', 'Help'];

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      transform: 'translate(-50%, -50%)',
      padding: '0px',
      margin: '0px'
    },
  };

  return (
    <>
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={customStyles}>
        <Parameters onRequestClose={closeModal} onRequestSubmit={submitModal} pipeline={pipeline} values={args} >
        </Parameters>
      </Modal>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Link to="/">
              <QeIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1}}/>
            </Link>
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={navOpen}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                <Link to="/Design">
                  <MenuItem key='Design' onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">Design</Typography>
                  </MenuItem>
                </Link>
                <Link to="/Test">
                  <MenuItem key='Test' onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">Test</Typography>
                  </MenuItem>
                </Link>
                <NestedMenuItem parentMenuOpen={navOpen} label={'Data'}>
                  <QueryFolderLevel items={props.available.children} parentMenuOpen={navOpen} />
                </NestedMenuItem>
                <Link to="/Test">
                  <MenuItem key='Help' onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">Help</Typography>
                  </MenuItem>
                </Link>
              </Menu>
            </Box>
            <QeIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
            <Typography
              variant="h5"
              noWrap
              component="a"
              href=""
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'fanwood, times',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              Query Engine
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                <Link to="/Design">
                  <Button key='Design' sx={{ my: 2, color: 'white' }} onClick={handleCloseNavMenu}>
                    Design
                  </Button>
                </Link>
                <Link to="/Test">
                  <Button key='Test' sx={{ my: 2, color: 'white' }} onClick={handleCloseNavMenu}>
                    Test
                  </Button>
                </Link>
                <Button key='Data' sx={{ my: 2, color: 'white' }} onClick={handleOpenDataMenu} endIcon={<ArrowDropDown />}>
                  Data
                </Button>
                <Menu anchorEl={anchorElData} open={dataOpen} onClose={handleCloseDataMenu}>
                  <QueryFolderLevel items={props.available.children} parentMenuOpen={dataOpen} />
                </Menu>
                <Link to="/Test">
                  <Button key='Help' sx={{ my: 2, color: 'white' }} onClick={handleCloseNavMenu}>
                    Help
                  </Button>
                </Link>
            </Box>

          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
}

export default Nav;