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
import { ArgsToArgs } from '../Test';

var [modalIsOpen, setModalIsOpen] = [null as boolean | null, (_ : any) => {}]
var [args, setArgs] = [null, (_ : any) => {}]

var pipeline : components["schemas"]["PipelineFile"]

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    padding: '0px',
    margin: '0px',
    height: 'fit-content',
    width: 'fit-content',
    overflow: 'visible'
  },
};

function closeModal() {
  setModalIsOpen(false);
}

interface NavProps {
  designMode: boolean
  , baseUrl: string
  , apiUrl: string | null
  , available: components["schemas"]["PipelineDir"] | null
  , managementEndpoints: ManagementEndpointType[] | null
  , window: Window
  , profile: components["schemas"]["Profile"] | null
  , docs: components["schemas"]["DocDir"] | null
  , accessToken: string | null
}

function Nav(props : NavProps) {

  [modalIsOpen, setModalIsOpen] = useState(false);
  [args, setArgs] = useState({} as any);
  const navigate = useNavigate()
  
  const handleCloseMenu = () => {
    console.log('handleCloseMenu');
  };

  function submitModal(values : any): Promise<void> {
    console.log("Submitted: ", values);
    if (!pipeline) {
      return Promise.resolve()
    }
    var query = ArgsToArgs(pipeline, values);
    var url = props.baseUrl + 'query/' + pipeline.path + (query == null ? '' : ('?' + query))
    console.log(url)
  
    if (!values) {
      return Promise.resolve()
    }
    console.log('submit', values)
    setArgs(values)
    var w = props.window.open(url, pipeline.path)
    if (window.location.href.startsWith(props.baseUrl)) {
      return new Promise(function(resolve, _) {
        if (w) {
          w.onload = (event: Event) => {
            console.log("Load:", event)
            resolve()
            setModalIsOpen(false);
            return null
          }
        }
      }); 
    } else {
      return Promise.resolve()
    }
  }

  if (process.env.NODE_ENV !== 'test') {
    Modal.setAppElement('#root');
  }
  
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

  if (props.available && props.available.name === '') {
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
    if (props.available) {
      items.push(dataMenuItems(props.available))
    }
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

  var columns = 1
  if (pipeline && pipeline.arguments) {
    if (pipeline.arguments.length > 9) {
      columns = 4;
    } else if (pipeline.arguments.length > 6) {
      columns = 3;
    } else if (pipeline.arguments.length > 3) {
      columns = 2;
    }
  }

  return (
    <>
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={customStyles}>
        <Parameters 
            baseUrl={props.baseUrl} 
            onRequestClose={closeModal} 
            onRequestSubmit={submitModal} 
            pipeline={pipeline} 
            values={args} 
            closeable={true} 
            columns={columns}
            displayUrl={true}
            accessToken={props.accessToken}
            />
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
                { props.available && 
                  <Link to="/ui/test">
                    <Button key='Test' sx={{ my: 2, color: 'white' }} onClick={handleCloseMenu}>
                      Test
                    </Button>
                  </Link>
                }
                { props.available && 
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
                }
                { props.managementEndpoints && 
                  <Link to="/ui/manage">
                    <Button key='Manage' sx={{ my: 2, color: 'white' }} onClick={handleCloseMenu}>
                      Manage
                    </Button>
                  </Link>
                }
                { props.docs &&
                  <Link to="/ui/help">
                    <Button key='Help' sx={{ my: 2, color: 'white' }} onClick={handleCloseMenu}>
                      Help
                    </Button>
                  </Link>
                }
                { props.apiUrl && 
                  <Link to="/ui/api">
                    <Button key='API' sx={{ my: 2, color: 'white' }} onClick={handleCloseMenu}>
                      API
                    </Button>
                  </Link>
                }
            </Box>
            {
              props.profile &&
              <Box sx={{ 	alignSelf: 'flex-end', my: 2, color: 'white', p: '6px' }}>
                {props.profile.fullname || props.profile.username}
              </Box>
            }
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
}

export default Nav;