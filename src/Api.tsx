import Box from '@mui/material/Box';

interface ApiUiProps {
  url: string | null
}

function Api(props : ApiUiProps) {

  return (
    <div className="h-full flex">
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 0, width: '100%;' }}
      >
        {
          props.url && <iframe src={props.url} width={'100%'} height={'100%'} ></iframe>
        }
      </Box>
    </div>);
}

export default Api;