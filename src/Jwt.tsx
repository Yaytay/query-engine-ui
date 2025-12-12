import Button from "@mui/material/Button";
import Box from "@mui/system/Box";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface JwtProps {
  baseUrl: string 
}

export function Jwt(props : JwtProps) {

  const [jwt, setJwt] = useState('')

  const navigate = useNavigate()


  function submit() : void {
    const strippedJwt = jwt.replace(/\s+/g, "");
    console.log(strippedJwt)
    const url = props.baseUrl + "login/forcejwt";
    fetch(url, { method: 'PUT', body: strippedJwt, credentials: 'include', headers: {'Content-Type': 'application/octet-stream'} })
      .then(r => {
        if (!r.ok) {
          return r.text().then(t => {
            throw Error(t)
          })
        } else {
          navigate("/ui/")
        }
      })
      .catch(e => {
        console.log(e)
      })

  }


  return (
    <div>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: '10px 10px 10px 10px' }}
      >
        <p>
          This is a test endpoint to allow you to directly enter a JWT that will be used by the Query Engine.
        </p>
        <p>
          This does nothing to alter the validation required of the JWT, it just avoids the need for test environments to
          configure a full OpenID login round trip.
        </p>
        <textarea 
            placeholder="Paste JWT Here"
            rows={20}
            value={jwt}
            onChange={e => setJwt(e.target.value)}
            style={{
              border: '2px inset #ccc',
              padding: '8px',
              width: '100%',
              resize: 'vertical',
              fontSize: '1rem',
              boxSizing: 'border-box'
            }}

        />
      </Box>
      <Button onClick={() => submit()}>
        Submit
      </Button>
    </div>
  )
}


export default Jwt;
