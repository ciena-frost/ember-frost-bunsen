import Ember from 'ember'
const {get, merge, typeOf} = Ember
import config from 'ember-get-config'
import _ from 'lodash'
import immutable from 'seamless-immutable'

const {keys} = Object

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
  date: 'frost-bunsen-input-date',
  datetime: 'frost-bunsen-input-datetime',
  form: 'frost-bunsen-input-form',
  geolocation: 'frost-bunsen-input-geolocation',
  hidden: 'frost-bunsen-input-hidden',
  image: 'frost-bunsen-input-image',
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
  table: 'frost-bunsen-input-table',
  textarea: 'frost-bunsen-input-textarea',
  url: 'frost-bunsen-input-url',
  when: 'frost-bunsen-input-when',
  object: 'frost-bunsen-input-form'
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
    model: facet.model,
    hideLabel: true
  }

  if (facet.renderer) {
    cell.renderer = facet.renderer
  }

  const renderersToHideClearButtonFor = [
    'multi-select'
  ]

  const renderersToShowCollapseHandleFor = [
    'checkbox-array',
    'geolocation',
    'json',
    'textarea'
  ]

  const clearable = Boolean(
    !facet.renderer ||
    renderersToHideClearButtonFor.indexOf(facet.renderer.name) === -1
  )

  const collapsible = Boolean(
    facet.renderer &&
    renderersToShowCollapseHandleFor.indexOf(facet.renderer.name) !== -1
  )

  return {
    children: [cell],
    clearable,
    collapsible,
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
    return cellConfig
  }

  const superCell = Object.assign({}, getMergedConfig(cellDefinitions[cellConfig.extends], cellDefinitions))
  const mergedConfig = merge(superCell, cellConfig)

  delete mergedConfig.extends

  return mergedConfig
}

/**
 * Merges the cellConfig recursively
 * @param {BunsenCell} cellConfig - top-level cell
 * @param {Object<String, BunsenCell>} cellDefinitions - list of cell definitions
 * @returns {BunsenCell} merged cell definition
 */
/* eslint-disable complexity */
export function getMergedConfigRecursive (cellConfig, cellDefinitions) {
  let mergedConfig = getMergedConfig(cellConfig, cellDefinitions)

  // recursive object case
  if (mergedConfig.children) {
    let childrenChanged = false
    const children = mergedConfig.children.map((childConfig) => {
      const mergedConfig = getMergedConfigRecursive(childConfig, cellDefinitions)
      if (mergedConfig !== childConfig) {
        childrenChanged = true
      }
      return Object.assign({}, mergedConfig)
    })

    if (childrenChanged) {
      mergedConfig = Object.assign({}, mergedConfig, {children})
    }
  }

  // recursive array case
  if (mergedConfig.arrayOptions) {
    if (mergedConfig.arrayOptions.itemCell) {
      let itemCell = mergedConfig.arrayOptions.itemCell
      let itemCellChanged = false
      if (Array.isArray(itemCell)) {
        itemCell = mergedConfig.arrayOptions.itemCell.map((_itemCell) => {
          const mergedConfig = getMergedConfigRecursive(_itemCell, cellDefinitions)
          if (_itemCell !== mergedConfig) {
            itemCellChanged = true
          }
          return mergedConfig
        })
      } else {
        itemCell = getMergedConfigRecursive(mergedConfig.arrayOptions.itemCell, cellDefinitions)
        itemCellChanged = itemCell !== mergedConfig.arrayOptions.itemCell
      }

      if (itemCellChanged) {
        const arrayOptions = Object.assign({}, mergedConfig.arrayOptions, {itemCell})
        mergedConfig = Object.assign({}, mergedConfig, {arrayOptions})
      }
    }
    if (mergedConfig.arrayOptions.tupleCells) {
      let tupleCellChanged = false
      const tupleCells = mergedConfig.arrayOptions.tupleCells.map((tupleCell) => {
        const mergedConfig = getMergedConfigRecursive(tupleCell, cellDefinitions)
        if (tupleCell !== mergedConfig) {
          tupleCellChanged = true
        }
        return mergedConfig
      })
      if (tupleCellChanged) {
        const arrayOptions = Object.assign({}, mergedConfig.arrayOptions, {tupleCells})
        mergedConfig = Object.assign({}, mergedConfig, {arrayOptions})
      }
    }
  }

  return mergedConfig
}
/* eslint-enable complexity */

/**
 * Determine if model is registered with Ember Data
 * @param {String} modelName - name of model to check Ember Data registry for
 * @returns {Boolean} whether or not model is registered with Ember Data
 */
export function isRegisteredEmberDataModel (modelName) {
  return keys(require._eak_seen)
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

/* eslint-disable complexity */
/**
 * Determine if an input is required to submit form
 * @param {String} path - path to property in bunsen model
 * @param {BunsemModel} bunsenModel - bunsen model
 * @param {Object} value - form value
 * @param {Boolean} parentRequired - whether or not parent model is required
 * @returns {Boolean} whether or not last path is required
 */
export function isChildRequiredToSubmitForm (path, bunsenModel, value, parentRequired) {
  const isChildMissing = !get(value || {}, path)

  let isParentPresent, lastSegment

  if (!isModelPathValid(path, bunsenModel)) {
    return false
  }

  if (path.indexOf('.') === -1) {
    isParentPresent = Boolean(value)
    lastSegment = path
  } else {
    const segments = path.split('.')
    lastSegment = segments.pop()
    const relativePath = segments.join('.')
    isParentPresent = Boolean(get(value || {}, relativePath))

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

  const childIsRequiredByParent = bunsenModel.required &&
    bunsenModel.required.indexOf(lastSegment) !== -1

  return (
    childIsRequiredByParent &&
    (isParentPresent || parentRequired) &&
    isChildMissing
  )
}
/* eslint-enable complexity */

/* eslint-disable complexity */
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
    if (!cell.model) return false
    return isChildRequiredToSubmitForm(cell.model, bunsenModel, value, parentRequired)
  }

  // If the cell has a model defined, that model is applied to all children cells and thus we need to get
  // the sub-model of the current bunsenModel that represents this scoped/nested model
  if (cell.model) {
    if (!isModelPathValid(cell.model, bunsenModel)) {
      return false
    }

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

    value = get(value || {}, cell.model)
  }

  // If any child view cell is required then the parent cell should be labeled as required in the UI
  return cell.children
    .some((child) => isRequired(child, cellDefinitions, bunsenModel, value, parentRequired))
}
/* eslint-enable complexity */

export function validateRenderer (owner, rendererName) {
  return rendererName in builtInRenderers || owner.hasRegistration(`component:${rendererName}`)
}

/* eslint-disable complexity */
/**
 * Get an error message from an error Object
 * @param {Object} error - may be an Error, an API response, or anything else (maybe?)
 * @returns {String} the message for the error
 */
export function getErrorMessage (error) {
  let message = 'Unable to parse error object'

  // most common case will be a JSON-API error response from ember-data
  message = get(error || {}, 'responseJSON.errors.0.detail')

  if (!message) {
    // next common is maybe an Error Object
    message = get(error || {}, 'message')
  }

  if (!message && error.toString) {
    // next option is anything else with a .toString() method
    message = error.toString()
  }

  return message
}
/* eslint-enable complexity */

/**
 * Used to sanity check if the path to the model is valid
 * @param {String} path - bunsen model path reference
 * @param {Object} bunsenModel - the bunsen model
 * @returns {Boolean} true if the path is valid
 */
export function isModelPathValid (path, bunsenModel) {
  const segments = path.split('.')

  while (segments.length !== 0 && bunsenModel) {
    const segment = segments.shift()

    if (/^\d+$/.test(segment)) {
      bunsenModel = bunsenModel.items
    } else {
      bunsenModel = bunsenModel.properties[segment]
    }
  }

  return Boolean(bunsenModel)
}

/**
 * Removes nested _internal keys from an object
 *
 * @param {Object} withoutInternal Object to remove nested _internal keys from
 * @returns {Object} Copy of the object with no _internal keys
 */
function removeChildInternals (withoutInternal) {
  return _.chain(withoutInternal)
    .map((item, key) => {
      const withoutInternal = removeInternalValues(item)
      if (withoutInternal !== undefined && withoutInternal !== item) {
        return [key, withoutInternal]
      }
    })
    .filter()
    .fromPairs()
    .value()
}

/**
 * Merges properties from an object into another if the second object has enumerable properties
 *
 * @param {Object} first Object
 * @param {Object} second Object with properties to merge into the first
 * @returns {Object} The merged object if the second object has enumerable properties or the first
 * object otherwise
 */
function maybeMerge (first, second) {
  if (Object.keys(second).length > 0) {
    return Object.assign({}, first, second) // don't mutate the object
  }
  return first
}

/**
 * Removes internal model values.
 *
 * @export
 * @param {any} val Value to check for internal values
 * @returns {any} The value with any _internal properties removed
 */
export function removeInternalValues (val) {
  if (typeof val !== 'object' || val === null) {
    return val
  }

  if (!Array.isArray(val)) {
    let withoutInternal
    let {merge, without} = getMergeFuncs(val)
    withoutInternal = without(val, '_internal')
    const childrenWithoutInternals = removeChildInternals(withoutInternal)
    return merge(withoutInternal, childrenWithoutInternals)
  } else {
    return val.map((item) => {
      return removeInternalValues(item)
    })
  }
}

function getMergeFuncs (val) {
  let merge
  let without

  if (immutable.isImmutable(val)) {
    merge = immutable.merge
    without = immutable.without
  } else if (val._internal !== undefined) {
    merge = Object.assign
    without = _.omit
  } else {
    merge = maybeMerge
    without = _.identity
  }

  return {merge, without}
}
