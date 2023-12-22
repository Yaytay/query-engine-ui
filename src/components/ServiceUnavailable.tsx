import QeIcon from './QeIcon';

import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from 'react-modal';

interface ServiceUnavailableProps {
  baseUrl: string
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
function ServiceUnavailable(props: ServiceUnavailableProps) {

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
        <h3>Service Unavailable</h3>
        The service is not available at {props.baseUrl}.          
        <br/>
        Please make the service available and refresh this page.
      </Box>
    </Modal>
  );
}

export default ServiceUnavailable;