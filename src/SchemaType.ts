0/*
 * A bunch of overrides for the sorting of fields, these will always come first.
 */
const fieldOrders = new Map<string, string[]>([
  ['Pipeline', ['title', 'description', 'condition', 'arguments', 'sourceEndpoints', 'dynamicEndpoints', 'source', 'processors', 'destinations']]
  , ['Argument', ['name', 'type', 'title', 'prompt', 'description', 'optional', 'multiValued', 'ignored', 'dependsUpon', 'defaultValue', 'minimumValue', 'maximumValue', 'possibleValues', 'possibleValuesUrl', 'permittedValuesRegex']]
  , ['ArgumentValue', ['value', 'label']]
  , ['Condition', ['expression']]
  , ['Destination', ['type', 'name', 'mediaType']]
  , ['Processor', ['type']]
  , ['Source', ['type']]
])

export interface PropertyType {
  name: string
  , type: string
  , description: string
  , default: string
  , maxLength: number
  , ref: string
  , required: boolean
  , minItems: number
  , title: string
  , 'x-prompt': string
  , enum: string[]
}

export interface PropertyMapType {
  [key: string]: PropertyType
}


// Determine type by enum
export interface DiscriminatorType {
  propertyName: string
  , mapping: Map<string, string>
}

export interface SchemaType {

  name: string
  , description: string
  , collectedProperties: PropertyMapType
  , sortedProperties: string[]
  , discriminator?: DiscriminatorType
  , hasRequired: boolean

}

export interface SchemaMapType {
  [key: string]: SchemaType
}

export function buildSchema(openapi: any): SchemaMapType {
  function typeFromRef(arg : string) {
    var lastPos = arg.lastIndexOf('/')
    if (lastPos > 0) {
      return arg.substring(lastPos + 1);
    } else {
      return arg;
    }
  }

  function collectProperties(schema : any) {
    var props : PropertyMapType = {}
    if (schema.properties) {
      props = { ...schema.properties }
    }
    Object.keys(props).forEach(pp => {
      if (props[pp].type === 'array' && props[pp].minItems > 0) {
        props[pp].required = true
      }
    })
    if (schema.allOf) {
      schema.allOf.forEach((ao : any) => {
        if (ao.$ref) {
          var parentProps = collectProperties(openapi.components.schemas[typeFromRef(ao.$ref)])
          Object.keys(parentProps).forEach(pp => {
            if (props[pp]) {
              Object.assign(props[pp], parentProps[pp])
            } else {
              props[pp] = { ...parentProps[pp] }
            }
          })
        } else if (ao.properties) {
          Object.keys(ao.properties).forEach(pp => {
            if (props[pp]) {
              Object.assign(props[pp], ao.properties[pp])
            } else {
              props[pp] = { ...ao.properties[pp] }
            }
          })
        }
      })
    }
    if (schema.required) {
      schema.required.forEach((req : string) => {
        props[req].required = true
      })
    }
    return props
  }

  function sortProperties(name : string, collectedProperties: PropertyMapType) : string[] {
    var sortedProperties : string[] = []
    var fieldsOrdersFields = fieldOrders.get(name)
    if (fieldsOrdersFields) {
      fieldsOrdersFields.forEach(f => {
        if (collectedProperties[f]) {
          sortedProperties.push(f)
        }
      })
    }
    Object.keys(collectedProperties).forEach((f : string) => {
      if (collectedProperties[f].required && !sortedProperties.includes(f)) {
        sortedProperties.push(f)
      }
    })
    Object.keys(collectedProperties).forEach(f => {
      if (!collectedProperties[f].required && !sortedProperties.includes(f)) {
        sortedProperties.push(f)
      }
    })
    return sortedProperties
  }

  function buildDiscriminator(schema : any) : DiscriminatorType | undefined {
    if (schema.discriminator) {
      var discriminator : DiscriminatorType
      discriminator = { propertyName: schema.discriminator.propertyName, mapping: new Map<string, string>() }
      Object.keys(schema.discriminator.mapping).forEach(dk => {
        discriminator.mapping.set(dk, typeFromRef(schema.discriminator.mapping[dk]))
      })
      return discriminator
    }
  }

  var result = {} as SchemaMapType
  Object.keys(openapi.components.schemas).forEach(k => {
    const schema = openapi.components.schemas[k]
    var simpleSchema: SchemaType;

    var collectedProperties: PropertyMapType = collectProperties(schema)

    simpleSchema = { 
      description: schema.description ?? ''
      , name: k 
      , collectedProperties: collectedProperties
      , sortedProperties: sortProperties(k, collectedProperties)
      , hasRequired: schema.required && schema.required.length > 0
      , discriminator: buildDiscriminator(schema)
    }

    result[k] = simpleSchema
  })

  console.log('OpenAPI schema:', openapi)
  console.log('Built schema:', result)
  return result
}
