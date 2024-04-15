

interface LeftRightChevronsProps {
  left : boolean
}
function LeftRightChevrons(props : LeftRightChevronsProps) {

  if (props.left) {
    return (
      <svg fill="none" fillRule="evenodd" stroke="black" strokeWidth="0.501" strokeLinejoin="bevel" strokeMiterlimit="10" version="1.1" overflow="visible" width="16pt" height="12pt" viewBox="310 -625 10 60">
        <g id="Layer 1" transform="scale(1 -1)">
          <path d="M 280.642,613.588 L 254.868,587.815" fill="none" strokeWidth="8" strokeLinejoin="round" strokeLinecap="round" />
          <path d="M 280.642,562.042 L 254.868,587.815" fill="none" strokeWidth="8" strokeLinejoin="round" strokeLinecap="round" />
          <path d="M 328.523,613.588 L 302.749,587.815" fill="none" strokeWidth="8" strokeLinejoin="round" strokeLinecap="round" />
          <path d="M 328.523,562.042 L 302.749,587.815" fill="none" strokeWidth="8" strokeLinejoin="round" strokeLinecap="round" />
          <path d="M 304.523,613.588 L 278.749,587.815" fill="none" strokeWidth="8" strokeLinejoin="round" strokeLinecap="round" />
          <path d="M 304.523,562.042 L 278.749,587.815" fill="none" strokeWidth="8" strokeLinejoin="round" strokeLinecap="round" />
        </g>
      </svg>

    );
  } else {
    return (
      <svg fill="none" fillRule="evenodd" stroke="black" strokeWidth="0.501" strokeLinejoin="bevel" strokeMiterlimit="10" version="1.1" overflow="visible" width="16pt" height="12pt" viewBox="310 -625 10 60">
        <g id="Layer 1" transform="scale(1 -1)">
          <path d="M 302.75,613.588 L 328.524,587.815" fill="none" strokeWidth="8" strokeLinejoin="round" strokeLinecap="round" />
          <path d="M 302.75,562.042 L 328.524,587.815" fill="none" strokeWidth="8" strokeLinejoin="round" strokeLinecap="round" />
          <path d="M 254.869,613.588 L 280.643,587.815" fill="none" strokeWidth="8" strokeLinejoin="round" strokeLinecap="round" />
          <path d="M 254.869,562.042 L 280.643,587.815" fill="none" strokeWidth="8" strokeLinejoin="round" strokeLinecap="round" />
          <path d="M 278.869,613.588 L 304.643,587.815" fill="none" strokeWidth="8" strokeLinejoin="round" strokeLinecap="round" />
          <path d="M 278.869,562.042 L 304.643,587.815" fill="none" strokeWidth="8" strokeLinejoin="round" strokeLinecap="round" />
        </g>
      </svg>
    );
  }

}


export default LeftRightChevrons;
