import 'ember-frost-bunsen/typedefs'

import _ from 'lodash'

import dereference from './dereference'

/**
 * Get a unique container name starting with name
 * @param {String} id - the ID to start with
 * @param {BunsenContainer[]} containers - the existing containers (used to avoid duplicates)
 * @returns {String} the unique ID
 */
function getContainerId (id, containers) {
  if (_.find(containers, {id}) === undefined) {
    return id
  }

  let count = 0
  let uniqueId = ''

  do {
    count += 1
    uniqueId = `${id}-${count}`
  } while (_.find(containers, {id: uniqueId}) !== undefined)

  return uniqueId
}

/**
 * Take the properties of an object and put primitive types above non-primitive types
 * @param {BunsenModelSet} properties - the properties for the model (key-value)
 * @returns {String[]} an array of property names in the order we should display them
 */
function getPropertyOrder (properties) {
  const primitiveProps = []
  const complexProps = []

  _.forIn(properties, (prop, propName) => {
    if (prop.type === 'object' || prop.type === 'array') {
      complexProps.push(propName)
    } else {
      primitiveProps.push(propName)
    }
  })

  return primitiveProps.concat(complexProps)
}

/**
 * Add a model container for the given model
 * @param {String} propertyName - the name of the property that holds the model
 * @param {BunsenModel} model - the model to add a container for
 * @param {BunsenContainer[]} containers - the containers set to add the model container to
 * @returns {String} the container name
 */
function addModelContainer (propertyName, model, containers) {
  const containerId = getContainerId(propertyName, containers)
  const container = {
    id: containerId,
    rows: []
  }

  containers.push(container)

  const props = getPropertyOrder(model.properties)
  props.forEach((propName) => {
    // we have a circular dependency
    /* eslint-disable no-use-before-define */
    addModel(propName, model.properties[propName], container.rows, containers)
    /* eslint-enable no-use-before-define */
  })

  if (model.dependencies) {
    _.forIn(model.dependencies, (dep, depName) => {
      const depProps = getPropertyOrder(dep.properties)
      depProps.forEach((propName) => {
        // we have a circular dependency
        /* eslint-disable no-use-before-define */
        addDependentModel(propName, depName, dep.properties[propName], container.rows, containers)
        /* eslint-enable no-use-before-define */
      })
    })
  }

  return containerId
}

/**
 * Add a property to default layout
 * @param {String} propertyName - the name of the property that holds this model
 * @param {BunsenModel} model - the actual model
 * @param {BunsenRow[]} rows - the rows we're adding the given model wrapper to
 * @param {BunsenContainer[]} containers - the set of all containers
 */
function addModel (propertyName, model, rows, containers) {
  const cell = {
    model: propertyName
  }

  const isObject = (model.type === 'object')
  const isArray = (model.type === 'array') && (model.items.type === 'object')

  if (isObject || isArray) {
    const subModel = isArray ? model.items : model
    const containerId = addModelContainer(propertyName, subModel, containers)
    if (isArray) {
      cell.item = {container: containerId}
    } else {
      cell.container = containerId
    }
  }
  rows.push([cell])
}

/**
 * Add a property to default layout
 * @param {String} propertyName - the name of the property that holds this model
 * @param {String} dependencyName - the name of the dependency of this model
 * @param {BunsenModel} model - the actual model
 * @param {BunsenRow[]} rows - the rows we're adding the given model wrapper to
 * @param {BunsenContainer[]} containers - the set of all containers
 */
function addDependentModel (propertyName, dependencyName, model, rows, containers) {
  const cell = {
    model: propertyName,
    dependsOn: dependencyName
  }

  const isObject = (model.type === 'object')
  const isArray = (model.type === 'array') && (model.items.type === 'object')

  if (isObject || isArray) {
    const subModel = isArray ? model.items : model
    const containerId = addModelContainer(propertyName, subModel, containers)
    if (isArray) {
      cell.item = {container: containerId}
    } else {
      cell.container = containerId
    }
  }
  rows.push([cell])
}

/**
 * Generate a default view for a JSON schema model
 * @param {BunsenModel} schema - the schema to generate a default view for
 * @returns {BunsenView} the generated view
 */
export function getDefaultView (schema) {
  const model = dereference(schema || {}).schema

  const view = {
    version: '1.0',
    type: 'form',
    rootContainers: [{label: 'Main', container: 'main'}],
    containers: [
      {
        id: 'main',
        rows: []
      }
    ]
  }

  const props = getPropertyOrder(model.properties)
  props.forEach((propName) => {
    addModel(propName, model.properties[propName], view.containers[0].rows, view.containers)
  })

  return view
}
