import SvgIcon from '@mui/material/SvgIcon';
import { ReactComponent as Logo } from './qe.svg';

function QeIcon(props) {

  return (
    <SvgIcon sx={props.sx}>
      <Logo className='h=8'/>
    </SvgIcon>
  );
}

export default QeIcon;