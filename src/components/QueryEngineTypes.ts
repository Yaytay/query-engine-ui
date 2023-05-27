
export module Types {

  export interface ArgumentValue {
    value: string
    , label: string
  }

  export interface ArgumentDefn {
    type: string
    , name: string
    , title: string
    , prompt: string
    , description: string
    , optional: boolean
    , multiValued: boolean
    , ignored: boolean
    , dependsUpon: string[]
    , defaultValue: string
    , minimumValue: string
    , maximumValue: string
    , possibleValues: ArgumentValue[]
    , possibleValuesUrl: string
    , permittedValuesRegex: string
  }

  export interface QueryFileNode {
    name: string
    , path: string
  }

  export interface QueryFile extends QueryFileNode {

  }

  export interface QueryFileDir extends QueryFileNode {
    children: QueryFile[] | QueryFileDir[]
  }

  export interface DocFileNode {
    name: string
    , path: string
  }

  export interface DocFile extends DocFileNode {

  }

  export interface DocFileDir extends DocFileNode {
    children: DocFile[] | DocFileDir[]
  }

  export interface DesignFileNode {
    name: string
    , path: string
  }

  export interface DesignFile extends DesignFileNode {

  }

  export interface DesignFileDir extends DesignFileNode {
    children: DesignFile[] | DesignFileDir[]
  }


}