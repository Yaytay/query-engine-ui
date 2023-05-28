import { components } from "../Query-Engine-Schema";

export interface InputStdProps {
  value : any
  , arg : components["schemas"]["Argument"]
  , id : string
  , type : string
  , prompt : string
  , onFocus : React.ReactEventHandler
  , disabled : boolean
  , onChange: (x : any) => void
}
