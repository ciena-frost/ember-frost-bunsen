import _ from 'lodash'
import Ember from 'ember'
const {A, get} = Ember
import {getModelPath} from 'bunsen-core/utils'

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
  integer: 'frost-bunsen-input-number',
  link: 'frost-bunsen-input-link',
  'multi-select': 'frost-bunsen-input-multi-select',
  number: 'frost-bunsen-input-number',
  password: 'frost-bunsen-input-password',
  'property-chooser': 'frost-bunsen-input-property-chooser',
  select: 'frost-bunsen-input-select',
  string: 'frost-bunsen-input-text',
  textarea: 'frost-bunsen-input-textarea',
  url: 'frost-bunsen-input-url'
}

export function deemberify (emberObject) {
  if (emberObject === null || emberObject === undefined) {
    return emberObject
  }

  if (_.isFunction(emberObject.serialize)) {
    return emberObject.serialize()
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

  return {
    children: [cell],
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

export function getRendererComponentName (rendererName) {
  return builtInRenderers[rendererName] || rendererName
}

/**
 * Determine if last segment of a bunsen model path is required
 * @param {String} path - path to property in bunsen model
 * @param {BunsemModel} bunsenModel - bunsen model
 * @returns {Boolean} whether or not last path is required
 */
export function isLastSegmentRequired (path, bunsenModel) {
  const segments = path.split('.')
  const lastSegment = segments.pop()

  // Make sure we get the correct bunsen model for nested properties
  if (segments.length !== 0) {
    bunsenModel = get(bunsenModel, getModelPath(segments.join('.')))
  }

  // Determine if last segment is marked as required by it's parent in the bunsen model
  return bunsenModel.required && bunsenModel.required.indexOf(lastSegment) !== -1
}

/**
 * Determine whether or not cell contains required inputs
 * @param {BunsenCell} cell - bunsen view cell
 * @param {Object<String, BunsenCell>} cellDefinitions - list of cell definitions
 * @param {BunsenModel} bunsenModel - bunsen model
 * @returns {Boolean} whether or not cell contains required inputs
 */
export function isRequired (cell, cellDefinitions, bunsenModel) {
  cell = getMergedConfig(cell, cellDefinitions)

  // If the view cell doesn't contain children we can just determine if the model property is required
  if (!cell.children) {
    return isLastSegmentRequired(cell.model, bunsenModel)
  }

  // If the cell has a model defined, that model is applied to all children cells and thus we need to get
  // the sub-model of the current bunsenModel that represents this scoped/nested model
  if (cell.model) {
    const modelPath = getModelPath(cell.model)

    // NOTE: Under some scenarios the bunsen  model is already scoped hence the or condition below.
    // FIXME: We should figure out why we sometimes feed the frost-bunsen-cell instance a scoped model and other times not
    // and clean it up to always pass in the unscoped model. At which point this or condition can and should be removed.
    bunsenModel = get(bunsenModel, modelPath) || bunsenModel
  }

  // If any child view cell is required then the parent cell should be labeled as required in the UI
  return cell.children
    .some((child) => isRequired(child, cellDefinitions, bunsenModel))
}

export function recursiveObjectCreate (object) {
  if (_.isPlainObject(object)) {
    let newObj = {}
    _.forEach(object, function (value, key) {
      newObj[key] = recursiveObjectCreate(value)
    })

    return Ember.Object.create(newObj)
  } else if (_.isArray(object)) {
    let newArray = []
    _.forEach(object, function (value) {
      newArray.push(recursiveObjectCreate(value))
    })

    return A(newArray) // eslint-disable-line new-cap
  }

  return object
}

export function validateRenderer (owner, rendererName) {
  return rendererName in builtInRenderers || owner.hasRegistration(`component:${rendererName}`)
}
