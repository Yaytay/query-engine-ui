import { components } from "../Query-Engine-Schema";

export interface InputStdProps {
  value : any
  , arg : components["schemas"]["Argument"]
  , onChange: (x : any) => void
}
