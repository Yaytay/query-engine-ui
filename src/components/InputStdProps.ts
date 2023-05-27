import { Types } from './QueryEngineTypes';

export interface InputStdProps {
  value : any
  , arg : Types.ArgumentDefn
  , id : string
  , type : string
  , prompt : string
  , onFocus : React.ReactEventHandler
  , disabled : boolean
  , onChange: (x : any) => void
}
