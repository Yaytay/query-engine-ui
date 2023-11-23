import QeIcon from './QeIcon';

import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { components } from "../Query-Engine-Schema";
import Modal from 'react-modal';

interface LoginProps {
  authConfigs: components["schemas"]["AuthConfig"][]
  , baseUrl: string
}

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    padding: '0px',
    margin: '0px',
    height: 'fit-content',
    width: '300px',
    overflow: 'hidden',
  },
};
function Login(props: LoginProps) {

  const theme = useTheme()

  return (
    <Modal isOpen={true} style={customStyles}>
      <Box bgcolor={theme.palette.primary.main} sx={{ padding: '8px', height: 'fit-content', width: '100%' }}>
        <Box sx={{width: 'fit-content', padding: 'audo'}}>
          <QeIcon sx={{ mr: 1, float: 'left' }} />
          <Typography
            variant="h5"
            noWrap
            component="div"
            sx={{
              fontFamily: 'fanwood, times',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: theme.palette.background.paper,
            }}
          >
            Query Engine
          </Typography>
          </Box>
        </Box>
      <Box style={{
        display: 'grid',
        placeItems: 'center',
        paddingTop: '10px',
        paddingBottom: '20px',
        }}>
        Log in to continue
          {props.authConfigs.map(ac => (
            <Button
              key={ac.name}
              variant="outlined"
              href={props.baseUrl + "login?provider=" + ac.name + "&return=" + window.location.href}
              size="large"
              style={{ minWidth: "200px", marginTop: '10px', marginBottom: '10px' }}
              startIcon={
                <img src={ac.logo} style={{
                  width: '24px'
                  , height: '24px'
                }} />
              }
            >
              {ac.name}
            </Button>
          ))}
      </Box>
    </Modal>
  );
}

export default Login;