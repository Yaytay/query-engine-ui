import './Nav.css';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Parameters from './Parameters';
import Modal from 'react-modal';
import QeIcon from './QeIcon';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { components } from "../Query-Engine-Schema";

import { NestedDropdown, MenuItemData } from 'mui-nested-menu';
import { ManagementEndpointType } from '../Manage';

var [modalIsOpen, setModalIsOpen] = [null as boolean | null, (_ : any) => {}]
var [args, setArgs] = [null, (_ : any) => {}]

var pipeline : components["schemas"]["PipelineFile"]


function displayParameters(item : components["schemas"]["PipelineFile"]) {
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

  setModalIsOpen(true);
}

function closeModal() {
  setModalIsOpen(false);
}

function submitModal(values : any) {
  console.log(values);
  setModalIsOpen(false);
}

interface NavProps {
  designMode: boolean
  , available: components["schemas"]["PipelineDir"]
  , managementEndpoints: ManagementEndpointType[] | null
}

function Nav(props : NavProps) {

  [modalIsOpen, setModalIsOpen] = useState(false);
  [args, setArgs] = useState({} as any);
  const navigate = useNavigate()
  
  const handleCloseMenu = () => {
    console.log('handleCloseMenu');
  };

  if (process.env.NODE_ENV !== 'test') {
    Modal.setAppElement('#root');
  }

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

  if (props.available.name === '') {
    props.available.name = 'Data';
  }

  function topMenuItems() : MenuItemData {
    const items : MenuItemData[] = []
    if (props.designMode) {
      items.push({ label: 'Design', callback: () => {
        navigate('/ui/design')
      }})
    }
    items.push({ label: 'Test', callback: () => {
      navigate('/ui/test')
    }})
    items.push(dataMenuItems(props.available))
    if (props.managementEndpoints) {
      items.push({ label: 'Manage', callback: () => {
        navigate('/ui/manage')
      }})
    }
    items.push({ label: 'Help', callback: () => {
      navigate('/ui/help')
    }})
    items.push({ label: 'API', callback: () => {
      navigate('/ui/api')
    }})
    return { label: '', items: items};
  }

  function dataMenuItems(node: components["schemas"]["PipelineNode"]) : MenuItemData {    
    if (node.children) {
      const items : MenuItemData[] = []
      for (var idx in node.children) {
        items.push(dataMenuItems(node.children[idx]))
      }
      return { label: node.name, callback: (event, item) => console.log('Data clicked', event, item), items: items}
    } else {
      return { label: node.name, callback: () => {
        displayParameters(node)
      }}
    }
  }

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
              <NestedDropdown
                menuItemsData={topMenuItems()}
                MenuProps={
                  {
                    elevation: 3

                  }
                }
                ButtonProps={
                  {
                    variant: 'text'
                    , sx: { my: 2, color: 'white' }
                    , startIcon: <MenuIcon/>
                    , endIcon: <></>
                  }
                }
                onClick={() => console.log('Clicked')}
              /> 
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
                    <Button key='Design' sx={{ my: 2, color: 'white' }} onClick={handleCloseMenu}>
                      Design
                    </Button>
                  </Link>
                }
                <Link to="/ui/test">
                  <Button key='Test' sx={{ my: 2, color: 'white' }} onClick={handleCloseMenu}>
                    Test
                  </Button>
                </Link>
                <NestedDropdown
                  menuItemsData={dataMenuItems(props.available)}
                  MenuProps={{elevation: 3}}
                  ButtonProps={
                    {
                      variant: 'text'
                      , sx: { my: 2, color: 'white' }
                    }
                  }
                  onClick={() => console.log('Clicked')}
                /> 
                { props.managementEndpoints && 
                  <Link to="/ui/manage">
                    <Button key='Manage' sx={{ my: 2, color: 'white' }} onClick={handleCloseMenu}>
                      Manage
                    </Button>
                  </Link>
                }
                <Link to="/ui/help">
                  <Button key='Help' sx={{ my: 2, color: 'white' }} onClick={handleCloseMenu}>
                    Help
                  </Button>
                </Link>
                <Link to="/ui/api">
                  <Button key='API' sx={{ my: 2, color: 'white' }} onClick={handleCloseMenu}>
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