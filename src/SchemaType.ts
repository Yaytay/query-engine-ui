/*
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

export interface ExternalDocsType {
  description: string
  , url: string
}

export interface DiscriminatorType {
  propertyName: string
  , mapping: {
    [key: string]: string
  }
}

export interface PropertyType {
  name?: string
  , type: string
  , ref?: string
  , description: string | null
  , externalDocs: ExternalDocsType | null
  , default: string | null
  , enum: string[] | null
  , format: string | null
  , items?: PropertyType
  , maxItems: number | null
  , maxLength: number | null
  , minItems: number | null
  , minLength: number | null
  , pattern: string | null
  , required?: boolean 
  , title: string | null
  , uniqueItems: boolean | null
}

export interface PropertyMapType {
  [key: string]: PropertyType
}

export interface ObjectType {
  name: string
  , description: string
  , collectedProperties: PropertyMapType
  , sortedProperties: string[]
  , discriminator?: DiscriminatorType
  , hasRequired: boolean
}

export interface ObjectTypeMap {
  [key: string]: ObjectType
}

// Convert and openapi specification into an ObjectTypeMap
export function buildSchema(openapi: any): ObjectTypeMap {
  function typeFromRef(arg : string) {
    var lastPos = arg.lastIndexOf('/')
    if (lastPos > 0) {
      return arg.substring(lastPos + 1);
    } else {
      return arg;
    }
  }

  function propertyFromSchema(name: string | null, schema: any, required: boolean) : PropertyType {
    var result : PropertyType = { 
      type: schema.$ref ? 'object' : schema.type
      , description: schema.description
      , externalDocs: schema.externalDocs
      , default: schema.default
      , enum: schema.enum
      , format: schema.format
      , maxItems: schema.maxItems
      , maxLength: schema.maxLength
      , minItems: schema.minItems
      , minLength: schema.minLength
      , pattern: schema.pattern
      , title: schema.title
      , uniqueItems: schema.uniqueItems
    }
    if (name) {
      result.name = name
    }
    if (schema.$ref) {
      result.ref = typeFromRef(schema.$ref)
    }
    if (schema.type === 'array') {
      result.items = propertyFromSchema(null, schema.items, schema.minItems && schema.minItems > 0)
    }
    if (required) {
      result.required = true
    }
    return result
  }

  function collectProperties(schema : any) {
    var props : PropertyMapType = {}
    if (schema.properties) {
      Object.keys(schema.properties).forEach((f : string) => {
        props[f] = propertyFromSchema(f, schema.properties[f], schema.required && schema.required.includes(f))
      })
    }
    if (schema.allOf) {
      schema.allOf.forEach((ao : any) => {
        if (ao.$ref) {
          var parentProps = collectProperties(openapi.components.schemas[typeFromRef(ao.$ref)])
          Object.keys(parentProps).forEach(pp => {
            props[pp] = { ...parentProps[pp] }
          })
        } else if (ao.properties) {
          Object.keys(ao.properties).forEach(pp => {
            props[pp] = propertyFromSchema(pp, ao.properties[pp], schema.required && schema.required.includes(pp))
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
      const m : {[key: string]: string} = {}
      Object.keys(schema.discriminator.mapping).forEach((k : string) => {
        m[k] = typeFromRef(schema.discriminator.mapping[k])
      })

      const disc : DiscriminatorType = {
        propertyName: schema.discriminator.propertyName
        , mapping: m
      }
      return disc
    }
  }

  var result = {} as ObjectTypeMap
  Object.keys(openapi.components.schemas).forEach(k => {
    const schema = openapi.components.schemas[k]
    var objectType: ObjectType;

    var collectedProperties: PropertyMapType = collectProperties(schema)

    objectType = { 
      description: schema.description ?? ''
      , name: k 
      , collectedProperties: collectedProperties
      , sortedProperties: sortProperties(k, collectedProperties)
      , hasRequired: schema.required && schema.required.length > 0
      , discriminator: buildDiscriminator(schema)
    }

    result[k] = objectType
  })

  console.log('OpenAPI schema:', openapi)
  console.log('Built schema:', result)
  return result
}
