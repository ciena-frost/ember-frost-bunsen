import _ from 'lodash'
import Ember from 'ember'
const {typeOf} = Ember
import config from 'ember-get-config'

const assign = Ember.assign || Object.assign || Ember.merge

/**
 * @typedef {Object} Facet
 * @property {String} label - label to use for facet
 * @property {String} model - model property to generate facet for
 * @property {BunsenRenderer} [renderer] - renderer to use for facet
 */

export const builtInRenderers = {
  boolean: 'frost-bunsen-input-boolean',
  'button-group': 'frost-bunsen-input-button-group',
  'checkbox-array': 'frost-bunsen-input-checkbox-array',
  hidden: 'frost-bunsen-input-hidden',
  integer: 'frost-bunsen-input-number',
  json: 'frost-bunsen-input-json',
  link: 'frost-bunsen-input-link',
  'multi-select': 'frost-bunsen-input-multi-select',
  number: 'frost-bunsen-input-number',
  password: 'frost-bunsen-input-password',
  'property-chooser': 'frost-bunsen-input-property-chooser',
  select: 'frost-bunsen-input-select',
  static: 'frost-bunsen-input-static',
  string: 'frost-bunsen-input-text',
  textarea: 'frost-bunsen-input-textarea',
  url: 'frost-bunsen-input-url'
}

/* eslint-disable complexity */
export function deemberify (emberObject) {
  if (emberObject === null || emberObject === undefined) {
    return emberObject
  }

  if (typeOf(emberObject.serialize) === 'function') {
    return emberObject.serialize({includeId: true})
  }

  if (emberObject.content) {
    return emberObject.content.map((contentObject) => {
      return JSON.parse(JSON.stringify(contentObject._data))
    })
  }

  if (emberObject._prevContent) {
    return emberObject._prevContent.map((contentObject) => {
      return JSON.parse(JSON.stringify(contentObject._data))
    })
  }

  return JSON.parse(JSON.stringify(emberObject))
}
/* eslint-enable complexity */

/**
 * Generate label from bunsen model
 * @param {String} model - bunsen model/property path
 * @returns {String} model converted to label
 */
export function generateLabelFromModel (model) {
  const property = model.split('.').pop()
  const dasherizedName = Ember.String.dasherize(property).replace('-', ' ')
  return Ember.String.capitalize(dasherizedName)
}

/**
 * Generate cell for a facet
 * @param {Facet} facet - facet to generate cell for
 * @returns {BunsenCell} bunsen cell for facet
 */
export function generateFacetCell (facet) {
  const cell = {
    model: facet.model
  }

  if (facet.renderer) {
    cell.renderer = facet.renderer
  }

  const renderersToHideClearButtonFor = [
    'multi-select'
  ]

  const clearable = (
    !facet.renderer ||
    renderersToHideClearButtonFor.indexOf(facet.renderer.name) === -1
  )

  return {
    children: [cell],
    clearable,
    collapsible: true,
    label: facet.label || generateLabelFromModel(facet.model)
  }
}

/**
 * Generate bunsen view for facets
 * @param {Facet[]} facets - facets to generate view for
 * @returns {BunsenView} bunsen view for facets
 */
export function generateFacetView (facets) {
  return {
    cells: [
      {
        children: facets.map(generateFacetCell)
      }
    ],
    type: 'form',
    version: '2.0'
  }
}

/**
 * Get merged definition for current cell
 * @param {BunsenCell} cellConfig - current cell
 * @param {Object<String, BunsenCell>} cellDefinitions - list of cell definitions
 * @returns {BunsenCell} current merged cell definition
 */
export function getMergedConfig (cellConfig, cellDefinitions) {
  if (!cellConfig.extends) {
    return _.cloneDeep(cellConfig)
  }

  const superCell = getMergedConfig(cellDefinitions[cellConfig.extends], cellDefinitions)
  const mergedConfig = assign(superCell, cellConfig)

  delete mergedConfig.extends

  return mergedConfig
}

/**
 * Merges the cellConfig recursively
 * @param {BunsenCell} cellConfig - top-level cell
 * @param {Object<String, BunsenCell>} cellDefinitions - list of cell definitions
 * @returns {BunsenCell} merged cell definition
 */
export function getMergedConfigRecursive (cellConfig, cellDefinitions) {
  const mergedConfig = getMergedConfig(cellConfig, cellDefinitions)

  // recursive object case
  if (mergedConfig.children) {
    const mergedChildConfigs = []
    mergedConfig.children.forEach((childConfig) => {
      mergedChildConfigs.push(getMergedConfigRecursive(childConfig, cellDefinitions))
    })
    mergedConfig.children = mergedChildConfigs
  }

  // recursive array case
  if (mergedConfig.arrayOptions && mergedConfig.arrayOptions.itemCell) {
    mergedConfig.arrayOptions.itemCell = getMergedConfigRecursive(mergedConfig.arrayOptions.itemCell, cellDefinitions)
  }

  return mergedConfig
}

/**
 * Determine if model is registered with Ember Data
 * @param {String} modelName - name of model to check Ember Data registry for
 * @returns {Boolean} whether or not model is registered with Ember Data
 */
export function isRegisteredEmberDataModel (modelName) {
  return Object.keys(require._eak_seen)
    .filter((module) => {
      return (
        module.indexOf(`${config.modulePrefix}/models/`) === 0 ||
        module.indexOf(`${config.podModulePrefix}/models/`) === 0
      )
    })
    .map((module) => {
      return module
        .replace(`${config.modulePrefix}/models/`, '')
        .replace(`${config.podModulePrefix}/models/`, '')
    })
    .indexOf(modelName) !== -1
}

export function getRendererComponentName (rendererName) {
  return builtInRenderers[rendererName] || rendererName
}

/**
 * Determine if an input is required to submit form
 * @param {String} path - path to property in bunsen model
 * @param {BunsemModel} bunsenModel - bunsen model
 * @param {Object} value - form value
 * @param {Boolean} parentRequired - whether or not parent model is required
 * @returns {Boolean} whether or not last path is required
 */
export function isChildRequiredToSubmitForm (path, bunsenModel, value, parentRequired) {
  const isChildMissing = !_.get(value, path)

  let isParentPresent, lastSegment

  if (path.indexOf('.') === -1) {
    isParentPresent = Boolean(value)
    lastSegment = path
  } else {
    const segments = path.split('.')
    lastSegment = segments.pop()
    const relativePath = segments.join('.')
    isParentPresent = Boolean(_.get(value, relativePath))

    while (segments.length !== 0) {
      const segment = segments.splice(0, 1)[0]

      parentRequired = Boolean(
        parentRequired &&
        bunsenModel.required &&
        bunsenModel.required.indexOf(segment) !== -1
      )

      if (/^\d+$/.test(segment)) {
        bunsenModel = bunsenModel.items
      } else {
        bunsenModel = bunsenModel.properties[segment]
      }
    }
  }

  const childIsRequiredByParent = bunsenModel.required && bunsenModel.required.indexOf(lastSegment) !== -1

  return (
    childIsRequiredByParent &&
    (isParentPresent || parentRequired) &&
    isChildMissing
  )
}

/**
 * Determine whether or not cell contains required inputs
 * @param {BunsenCell} cell - bunsen view cell
 * @param {Object<String, BunsenCell>} cellDefinitions - list of cell definitions
 * @param {BunsenModel} bunsenModel - bunsen model
 * @param {Object} value - form value
 * @param {Boolean} parentRequired - whether or not parent model is required
 * @returns {Boolean} whether or not cell contains required inputs
 */
export function isRequired (cell, cellDefinitions, bunsenModel, value, parentRequired = true) {
  cell = getMergedConfig(cell, cellDefinitions)

  // If the view cell doesn't contain children we can just determine if the model property is required
  if (!cell.children) {
    return isChildRequiredToSubmitForm(cell.model, bunsenModel, value, parentRequired)
  }

  // If the cell has a model defined, that model is applied to all children cells and thus we need to get
  // the sub-model of the current bunsenModel that represents this scoped/nested model
  if (cell.model) {
    const modelSegments = cell.model.split('.')

    while (modelSegments.length !== 0) {
      const segment = modelSegments.splice(0, 1)[0]

      parentRequired = Boolean(
        parentRequired &&
        bunsenModel.required &&
        bunsenModel.required.indexOf(segment) !== -1
      )

      if (/^\d+$/.test(segment)) {
        bunsenModel = bunsenModel.items
      } else {
        bunsenModel = bunsenModel.properties[segment]
      }
    }

    value = _.get(value, cell.model)
  }

  // If any child view cell is required then the parent cell should be labeled as required in the UI
  return cell.children
    .some((child) => isRequired(child, cellDefinitions, bunsenModel, value, parentRequired))
}

export function validateRenderer (owner, rendererName) {
  return rendererName in builtInRenderers || owner.hasRegistration(`component:${rendererName}`)
}

/**
 * Get an error message from an error Object
 * @param {Object} error - may be an Error, an API response, or anything else (maybe?)
 * @returns {String} the message for the error
 */
export function getErrorMessage (error) {
  let message = 'Unable to parse error object'

  // most common case will be a JSON-API error response from ember-data
  message = _.get(error, 'responseJSON.errors[0].detail')

  if (!message) {
    // next common is maybe an Error Object
    message = _.get(error, 'message')
  }

  if (!message && error.toString) {
    // next option is anything else with a .toString() method
    message = error.toString()
  }

  return message
}
