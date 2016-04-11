import 'ember-frost-bunsen/typedefs'

import _ from 'lodash'

import {getSubModel} from '../utils'
import viewSchema from './view-schema'
import {addErrorResult, addWarningResult, aggregateResults} from './utils'

function createFactory (proto) {
  const factory = function () {
    const obj = Object.create(proto)
    return obj.init.apply(obj, arguments)
  }

  factory.proto = proto

  return factory
}

/**
 * Check if a cell includes a custom renderer
 * @param {BunsenCell} cell - the cell to check
 * @returns {Boolean} true if the cell specifies a custom renderer
 */
function isCustomCell (cell) {
  return (cell.renderer !== undefined) || (cell.itemRenderer !== undefined)
}

/**
 * Check if the given model is an array of objects
 * @param {BunsenModel} model - the model to check
 * @returns {Boolean} true if model is and array of objects
 */
function isObjectArray (model) {
  return (model.type === 'array') && (model.items.type === 'object')
}

/**
 * @alias validator
 */
export default createFactory({

  /** attributes required by every container */
  REQUIRED_CONTAINER_ATTRS: ['id', 'rows'],

  /** optional top-level container attributes */
  OPTIONAL_CONTAINER_ATTRS: ['className', 'defaultClassName'],

  /**
   * Initialize the validator
   * @param {BunsenContainer[]} containers - the Containers to validate container references against
   * @param {BunsenModel} model - the Model to validate model references against
   * @param {String[]} [renderers] - the list of available custom renderers to validate renderer references against
   * @returns {validator} the instance
   */
  init (containers, model, renderers = []) {
    this.containers = containers
    this.model = model
    this.renderers = renderers
    this.containersValidated = []
    return this
  },

  /**
   * Validate the sub-container, giving it it's appropriate sub-model
   * @param {String} path - the path the given row
   * @param {String} containerId - the id of the sub-container
   * @param {BunsenModel} model - the model to use to verify references against
   * @returns {BunsenValidationResult} the results of the sub-container validation
   */
  _validateSubContainer (path, containerId, model) {
    const results = []
    const containerIndex = _.findIndex(this.containers, {id: containerId})
    const container = this.containers[containerIndex]
    if (container === undefined) {
      addErrorResult(results, path, `Invalid container reference "${containerId}"`)
    } else {
      results.push(
        this.validate(`#/containers/${containerIndex}`, container, model)
      )
    }

    return aggregateResults(results)
  },

  /**
   * Validate the given cell, with a custom renderer
   * @param {String} path - the path the given row
   * @param {BunsenCell} cell - the cell to validate
   * @returns {BunsenValidationResult} the results of the cell validation
   */
  _validateCustomCell (path, cell) {
    const results = [
      {
        errors: []
      }
    ]

    let rendererName = cell.renderer
    let rendererPathExt = 'renderer'
    if (rendererName === undefined) {
      rendererName = cell.itemRenderer
      rendererPathExt = 'itemRenderer'
    }
    const rendererPath = `${path}/${rendererPathExt}`

    if (!_.includes(this.renderers, rendererName)) {
      addErrorResult(results, rendererPath, `Invalid renderer reference "${rendererName}"`)
    }

    return aggregateResults(results)
  },

  /**
   * Validate the given cell, with a sub-model
   * @param {String} path - the path the given row
   * @param {BunsenCell} cell - the cell to validate
   * @param {BunsenModel} [model] - the Model to validate model references against
   * @returns {BunsenValidationResult} the results of the cell validation
   */
  _validateArrayCell (path, cell, model) {
    const results = []
    if (cell.container) {
      const msg = 'Containers on arrays not currently supported. Maybe you want it on the item sub-object?'
      addErrorResult(results, path, msg)
    } else if (cell.item.container) {
      results.push(
        this._validateSubContainer(`${path}/item/container`, cell.item.container, model.items)
      )
    }

    return aggregateResults(results)
  },

  /**
   * Validate the given cell, with a sub-model
   * @param {String} path - the path the given row
   * @param {BunsenCell} cell - the cell to validate
   * @param {BunsenModel} subModel - the subModel
   * @returns {BunsenValidationResult} the results of the cell validation
   */
  _validateModelCell (path, cell, subModel) {
    const results = []
    if (subModel === undefined) {
      addErrorResult(results, `${path}/model`, `Invalid model reference "${cell.model}"`)
    } else if (isCustomCell(cell)) {
      results.push(
        this._validateCustomCell(path, cell)
      )
    } else if (isObjectArray(subModel)) {
      results.push(
        this._validateArrayCell(path, cell, subModel)
      )
    } else if (subModel.type === 'object') {
      results.push(
        this._validateSubContainer(`${path}/container`, cell.container, subModel)
      )
    }

    return aggregateResults(results)
  },

  /**
   * Validate the given cell, with a sub-model dependent on another sub model
   * @param {String} path - the path the given row
   * @param {BunsenCell} cell - the cell to validate
   * @param {BunsenModel} [model] - the Model to validate model references against
   * @returns {BunsenValidationResult} the results of the cell validation
   */
  _validateDependentModelCell (path, cell, model) {
    const results = []
    const dependencyModel = getSubModel(model, cell.dependsOn)

    if (dependencyModel === undefined) {
      addErrorResult(results, `${path}/dependsOn`, `Invalid model reference "${cell.dependsOn}"`)
      return aggregateResults(results)
    }

    const subModel = getSubModel(model, cell.model, cell.dependsOn)
    results.push(
      this._validateModelCell(path, cell, subModel)
    )

    return aggregateResults(results)
  },

  /**
   * Validate the given cell
   * @param {String} path - the path the given row
   * @param {BunsenCell} cell - the cell to validate
   * @param {BunsenModel} [model] - the Model to validate model references against
   * @returns {BunsenValidationResult} the results of the cell validation
   */
  _validateCell (path, cell, model) {
    const results = []

    if (cell.dependsOn) {
      results.push(
        this._validateDependentModelCell(path, cell, model)
      )
    } else if (cell.model) {
      const subModel = getSubModel(model, cell.model)
      results.push(
        this._validateModelCell(path, cell, subModel)
      )
    } else if (cell.container) {
      results.push(
        this._validateSubContainer(`${path}/container`, cell.container, model)
      )
    } else {
      addErrorResult(results, path, 'Either "model" or "container" must be defined for each cell.')
    }

    const knownAttributes = _.keys(viewSchema.definitions.cell.properties)
    _.forEach(_.keys(cell), (attr) => {
      if (!_.includes(knownAttributes, attr)) {
        addWarningResult(results, path, `Unrecognized attribute "${attr}"`)
      }
    })

    return aggregateResults(results)
  },

  /**
   * Validate the given row
   * @param {String} path - the path the given row
   * @param {BunsenCell[]} cells - the cells within the row
   * @param {BunsenModel} [model] - the Model to validate model references against
   * @returns {BunsenValidationResult} the results of the row validation
   */
  _validateRow (path, cells, model) {
    if (!_.isArray(cells)) {
      return {
        errors: [
          {
            path,
            message: 'Rows must consist of Arrays of Cells'
          }
        ],
        warnings: []
      }
    }

    const results = _.map(cells, (cell, index) => {
      return this._validateCell(`${path}/${index}`, cell, model)
    })

    return aggregateResults(results)
  },

  /**
   * Validate the given config
   * @param {String} path - the path to the container from the root of the config
   * @param {BunsenContainer} container - the container to validate
   * @param {BunsenModel} [model] - the Model to validate model references against
   * @returns {BunsenValidationResult} the results of the container validation
   */
  validate (path, container, model) {
    // keep track of which paths we've validated
    this.containersValidated.push(path)

    if (model === undefined) {
      model = this.model
    }

    const results = []

    const attrs = _.keys(container)

    const warnings = []
    const knownAttributes = _.union(this.REQUIRED_CONTAINER_ATTRS, this.OPTIONAL_CONTAINER_ATTRS)
    _.forEach(attrs, (attr) => {
      if (!_.includes(knownAttributes, attr)) {
        warnings.push({
          path,
          message: `Unrecognized attribute "${attr}"`
        })
      }
    })

    if (warnings.length > 0) {
      results.push({
        warnings,
        errors: []
      })
    }

    _.forEach(container.rows, (row, index) => {
      results.push(
        this._validateRow(`${path}/rows/${index}`, row, model)
      )
    })

    return aggregateResults(results)
  }
})
