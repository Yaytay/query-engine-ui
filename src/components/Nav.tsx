import './Nav.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Parameters from './Parameters';
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
import MenuItem from '@mui/material/MenuItem';
import { components } from "../Query-Engine-Schema";

import {NestedMenuItem} from 'mui-nested-menu';
import { ManagementEndpointType } from '../Manage';

var [anchorElNav, setAnchorElNav] = [null, (_ : any) => {}]
var [anchorElData, setAnchorElData] = [null, (_ : any) => {}]

var [modalIsOpen, setIsOpen] = [null as boolean | null, (_ : any) => {}]
var [args, setArgs] = [null, (_ : any) => {}]

var pipeline : components["schemas"]["PipelineFile"]


function displayParameters(item : components["schemas"]["PipelineFile"]) {
  setAnchorElNav(null);
  setAnchorElData(null);
  console.log(item);
  pipeline = item;

  var ta : any = {
    '_fmt': (Array.isArray(pipeline.destinations) ? pipeline.destinations[0].name : null)
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

function submitModal(values : any) {
  console.log(values);
  setIsOpen(false);
}

interface QueryMenuItemProps {
  item: components["schemas"]["PipelineFile"]
} 

function QueryMenuItem(props : QueryMenuItemProps) {
  return (
    <MenuItem onClick={_ => displayParameters(props.item)}>
      {props.item.title ?? props.item.name}
    </MenuItem>
  );
}

interface QueryFolderLevelProps {
  items: components["schemas"]["PipelineNode"][] | undefined
  , parentMenuOpen: boolean
}

function QueryFolderLevel(props : QueryFolderLevelProps) {
  var children = props.items;

  if (children) {
    return (
      <>
        {children.map((value, _) => {
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
  } else {
    return (<div/>)
  }
}

interface NavProps {
  designMode: boolean
  , available: components["schemas"]["PipelineDir"]
  , managementEndpoints: ManagementEndpointType[] | null
}

function Nav(props : NavProps) {

  [modalIsOpen, setIsOpen] = useState(false);
  [args, setArgs] = useState({} as any);  
  
  [anchorElNav, setAnchorElNav] = useState(null);
  const navOpen = Boolean(anchorElNav);

  [anchorElData, setAnchorElData] = useState(null);
  const dataOpen = Boolean(anchorElData);

  const handleOpenNavMenu = (event : React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleOpenDataMenu = (e : React.MouseEvent<HTMLElement>) => setAnchorElData(e.currentTarget);
  const handleCloseDataMenu = () => setAnchorElData(null);

  if (process.env.NODE_ENV !== 'test') {
    Modal.setAppElement('#root');
  }

  // const pages = ['Design', 'Test', 'Demo', 'Settngs', 'Help'];

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
        <Parameters onRequestClose={closeModal} onRequestSubmit={submitModal} pipeline={pipeline} values={args} closeable={true} />
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
                { props.designMode && 
                  <Link to="/ui/design" >
                    <MenuItem key='Design' onClick={handleCloseNavMenu}>
                      <Typography textAlign="center">Design</Typography>
                    </MenuItem>
                  </Link>
                }
                <Link to="/ui/test">
                  <MenuItem key='Test' onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">Test</Typography>
                  </MenuItem>
                </Link>
                <NestedMenuItem parentMenuOpen={navOpen} label={'Data'}>
                  <QueryFolderLevel items={props.available.children} parentMenuOpen={navOpen} />
                </NestedMenuItem>
                { props.managementEndpoints && 
                  <Link to="/ui/manage" >
                  <MenuItem key='Manage' onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">Manage</Typography>
                  </MenuItem>
                </Link>
              }
                <Link to="/ui/help">
                  <MenuItem key='Help' onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">Help</Typography>
                  </MenuItem>
                </Link>
                <Link to="/ui/api">
                  <MenuItem key='API' onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">API</Typography>
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
                { props.designMode && 
                  <Link to="/ui/design">
                    <Button key='Design' sx={{ my: 2, color: 'white' }} onClick={handleCloseNavMenu}>
                      Design
                    </Button>
                  </Link>
                }
                <Link to="/ui/test">
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
                { props.managementEndpoints && 
                  <Link to="/ui/manage">
                    <Button key='Manage' sx={{ my: 2, color: 'white' }} onClick={handleCloseNavMenu}>
                      Manage
                    </Button>
                  </Link>
                }
                <Link to="/ui/help">
                  <Button key='Help' sx={{ my: 2, color: 'white' }} onClick={handleCloseNavMenu}>
                    Help
                  </Button>
                </Link>
                <Link to="/ui/api">
                  <Button key='API' sx={{ my: 2, color: 'white' }} onClick={handleCloseNavMenu}>
                    API
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