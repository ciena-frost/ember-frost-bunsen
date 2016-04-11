import 'ember-frost-bunsen/typedefs'

import _ from 'lodash'

import dereference from '../dereference'
import {aggregateResults, ensureJsonObject, addWarningResult, validateRequiredAttribute} from './utils'
import containerValidatorFactory from './container'
import viewSchema from './view-schema'
import {default as validateValue} from './value'

const builtinRenderers = {
  PropertyChooser: 'frost-bunsen-property-chooser'
}

/**
 * Make sure the rootContainers (if specified) are valid
 * @param {BunsenView} view - the schema to validate
 * @param {BunsenModel} model - the JSON schema that the containers will reference
 * @param {ContainerValidator} containerValidator - the validator instance for a container in the current view
 * @returns {BunsenValidationResult} the result of validating the rootContainers
 */
function _validateRootContainers (view, model, containerValidator) {
  // We should already have the error for it not existing at this point, so just fake success
  // this seems wrong, but I'm not sure of a better way to do it - ARM
  if (!view.rootContainers) {
    return {
      errors: [],
      warnings: []
    }
  }

  const results = _.map(view.rootContainers, (rootContainer, index) => {
    const path = `#/rootContainers/${index}`
    const containerId = rootContainer.container
    const containerIndex = _.findIndex(view.containers, {id: containerId})
    const container = view.containers[containerIndex]
    const containerPath = `#/containers/${containerIndex}`
    const rootContainerResults = [
      validateRequiredAttribute(rootContainer, path, 'label'),
      validateRequiredAttribute(rootContainer, path, 'container', _.pluck(view.containers, 'id'))
    ]

    if (container !== undefined) {
      rootContainerResults.push(
        containerValidator.validate(containerPath, container)
      )
    }

    return aggregateResults(rootContainerResults)
  })

  return aggregateResults(results)
}

/**
 * Validate the root attributes of the view
 * @param {BunsenView} view - the view to validate
 * @param {BunsenModel} model - the JSON schema that the containers will reference
 * @param {ContainerValidator} containerValidator - the validator instance for a container in the current view
 * @returns {BunsenValidationResult} any errors found
 */
function _validateRootAttributes (view, model, containerValidator) {
  const results = [
    _validateRootContainers(view, model, containerValidator)
  ]

  const knownAttributes = ['version', 'type', 'rootContainers', 'containers']
  const unknownAttributes = _.difference(_.keys(view), knownAttributes)
  results.push({
    errors: [],
    warnings: _.map(unknownAttributes, (attr) => {
      return {
        path: '#',
        message: `Unrecognized attribute "${attr}"`
      }
    })
  })

  return aggregateResults(results)
}

/**
 * Validate the given view
 * @param {String|View} view - the view to validate (as an object or JSON string)
 * @param {BunsenModel} model - the JSON schema that the containers will reference
 * @param {String[]} renderers - the list of available custom renderers to validate renderer references against
 * @returns {BunsenValidationResult} the results of the view validation
 */
export default function validate (view, model, renderers = Object.keys(builtinRenderers)) {
  let strResult = null
  const temp = ensureJsonObject(view)
  view = temp[0]
  strResult = temp[1]

  if (view === undefined) {
    return {
      errors: [{path: '#', message: 'Invalid JSON'}],
      warnings: []
    }
  }

  if (model === undefined) {
    return {
      errors: [{path: '#', message: 'Invalid Model'}],
      warnings: []
    }
  }

  const derefModel = dereference(model).schema

  const containerValidator = containerValidatorFactory(view.containers, derefModel, renderers)

  const schemaResult = validateValue(view, viewSchema, true)
  if (schemaResult.errors.length !== 0) {
    return schemaResult
  }

  const results = [
    schemaResult,
    _validateRootAttributes(view, derefModel, containerValidator)
  ]

  const allContainerPaths = _.map(view.containers, (container, index) => {
    return `#/containers/${index}`
  })

  const validatedPaths = containerValidator.containersValidated
  const missedPaths = _.difference(allContainerPaths, validatedPaths)
  missedPaths.forEach((path) => {
    addWarningResult(results, path, 'Unused container was not validated')
  })

  if (strResult !== null) {
    results.push(strResult)
  }

  return aggregateResults(results)
}

// convenience exports so everything can be consumed from this entry point
export {default as validateModel} from './model'
export {default as validateValue} from './value'
