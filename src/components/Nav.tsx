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

import { ManagementEndpointType } from '../Manage';
import { ArgsToArgs } from '../Test';
import NestableMenu, { NestableMenuItemData } from './nested-menu/NestableMenu';

let pipeline : components["schemas"]["PipelineFile"]

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

interface NavProps {
  designMode: boolean
  , baseUrl: string
  , apiUrl: string | null
  , available: components["schemas"]["PipelineDir"] | null
  , managementEndpoints: ManagementEndpointType[] | null
  , window: Window
  , profile: components["schemas"]["Profile"] | null
  , docs: components["schemas"]["DocDir"] | null
}

function Nav(props : NavProps) {

  const [dataMenuAnchor, setDataMenuAnchor] = useState<HTMLElement|null>(null)
  const [topMenuAnchor, setTopMenuAnchor] = useState<HTMLElement|null>(null)
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [args, setArgs] = useState({} as any);
  const [pipelineDetails, setPipelineDetails] = useState<components["schemas"]["PipelineDetails"] | null>();
  const navigate = useNavigate()
  
  function closeModal() {
    setModalIsOpen(false);
  }

  const handleCloseMenu = () => {
    console.log('handleCloseMenu');
    setDataMenuAnchor(null)
    setTopMenuAnchor(null)
  };

  function submitModal(values : any): Promise<void> {
    console.log("Submitted: ", values);
    if (!pipeline) {
      return Promise.resolve()
    }
    const query = ArgsToArgs(pipeline, values);
    const url = props.baseUrl + 'query/' + pipeline.path + (query == null ? '' : ('?' + query))
    console.log(url)
  
    if (!values) {
      return Promise.resolve()
    }
    console.log('submit', values)
    setArgs(values)
    const w = props.window.open(url, pipeline.path)
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

    const pipelinedetailsurl = props.baseUrl + 'api/info/details/' + item.path
    fetch(pipelinedetailsurl, {credentials: 'include'})
      .then((response) => response.json())
      .then((data) => {
        setPipelineDetails(data)
        setArgs({});
        setModalIsOpen(true);
      });
  
  }  

  if (props.available && props.available.name === '') {
    props.available.name = 'Data';
  }

  function topMenuItems() : NestableMenuItemData[] {    
    const items : NestableMenuItemData[] = []
    if (props.designMode) {
      items.push({ key: 'design', caption: 'Design', callback: () => {
        navigate('/ui/design')
      }})
    }
    items.push({ key: 'test', caption: 'Test', callback: () => {
      navigate('/ui/test')
    }})
    if (props.available) {
      items.push(dataMenuItems(props.available, 'data'))
    }
    if (props.managementEndpoints) {
      items.push({ key: 'manage', caption: 'Manage', callback: () => {
        navigate('/ui/manage')
      }})
    }
    items.push({ key: 'help', caption: 'Help', callback: () => {
      navigate('/ui/help')
    }})
    items.push({ key: 'api', caption: 'API', callback: () => {
      navigate('/ui/api')
    }})
    return items;
  }

  function dataMenuItems(node: components["schemas"]["PipelineNode"], parent: string) : NestableMenuItemData {    
    const key = parent + '->' + node.name
    if (node.children) {
      const items : NestableMenuItemData[] = []
      for (const idx in node.children) {
        items.push(dataMenuItems(node.children[idx], key))
      }
      return { key: key, caption: node.name, callback: (event, item) => console.log('Data clicked', event, item), items: items}
    } else {
      return { key: key, caption: node.name, callback: () => {
        setDataMenuAnchor(null)
        displayParameters(node)
      }}
    }
  }

  let columns = 1
  if (pipelineDetails && pipelineDetails.arguments) {
    if (pipelineDetails.arguments.length > 9) {
      columns = 4;
    } else if (pipelineDetails.arguments.length > 6) {
      columns = 3;
    } else if (pipelineDetails.arguments.length > 3) {
      columns = 2;
    }
  }

  return (
    <>
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={customStyles}>
        {pipelineDetails && 
          <Parameters 
              baseUrl={props.baseUrl} 
              onRequestClose={closeModal} 
              onRequestSubmit={submitModal} 
              pipelineDetails={pipelineDetails} 
              values={args} 
              closeable={true} 
              columns={columns}
              displayUrl={true}
              />
        }
      </Modal>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Link to="/">
              <QeIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1}}/>
            </Link>            
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <NestableMenu
                menuItems={topMenuItems()}
                anchor={topMenuAnchor}
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
                <div>
                  <Button key='Data' sx={{ my: 2, color: 'white' }} onClick={(event) => {
                    setDataMenuAnchor(event.currentTarget)
                  }}>
                    Data
                  </Button>
                  <NestableMenu menuItems={dataMenuItems(props.available, 'Data').items || []}
                      anchor={dataMenuAnchor}
                      onClose={() => {
                        setDataMenuAnchor(null)
                      }}
                   >
                  </NestableMenu>
                  </div>
                }
                { props.profile && 
                  <Link to="/ui/history">
                    <Button key='History' sx={{ my: 2, color: 'white' }} onClick={handleCloseMenu}>
                      History
                    </Button>
                  </Link>
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