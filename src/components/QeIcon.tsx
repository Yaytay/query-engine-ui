/// <reference types="vite-plugin-svgr/client" />
import SvgIcon from '@mui/material/SvgIcon';
import { ReactComponent as Logo  } from './qe.svg';
import { SxProps } from '@mui/material';

interface QeIconProps {
  sx: SxProps<any>
};

function QeIcon(props : QeIconProps) {

  return (
    <SvgIcon sx={props.sx}>
      <Logo className='h=8'/>
    </SvgIcon>
  );
}

export default QeIcon;