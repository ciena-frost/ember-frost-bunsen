import 'ember-frost-bunsen/typedefs'

import _ from 'lodash'

/**
 * Validate a given required attribute (identified by path)
 * @param {Object} object - the object to validate
 * @param {String} path - the path to the given object in the schema
 * @param {String} attribute - the name of the required attribute on object
 * @param {Object[]} [possibleValues] - the possible values for the attribute
 * @returns {BunsenValidationResult} any errors found
 */
export function validateRequiredAttribute (object, path, attribute, possibleValues) {
  const errors = []

  const value = _.get(object, attribute)

  if (value === undefined) {
    errors.push({
      path,
      message: `Missing required attribute "${attribute}"`
    })
  } else if (possibleValues !== undefined && !_.includes(possibleValues, value)) {
    let message = `Invalid value "${value}" for "${attribute}" `
    message += `Valid options are ${JSON.stringify(possibleValues)}`
    errors.push({path, message})
  }

  return {
    errors,
    warnings: []
  }
}

/**
 * Aggregate an array of ValidationResults into a single one
 * @param {BunsenValidationResult[]} results - the array of individual results
 * @returns {BunsenValidationResult} the aggregated result
 */
export function aggregateResults (results) {
  return {
    errors: _(results).pluck('errors').flatten().compact().value(),
    warnings: _(results).pluck('warnings').flatten().compact().value()
  }
}

/**
 * Add an error result to the given array of ValidationResults
 * @param {BunsenValidationResult[]} results - the Array to mutate
 * @param {String} path - the path for the BunsenValidationError to add
 * @param {String} message - the mesage for the BunsenValidationError to add
 */
export function addErrorResult (results, path, message) {
  if (path === undefined) {
    throw new Error('path is required')
  }
  results.push({
    errors: [{path, message}],
    warnings: []
  })
}

/**
 * Add a warning result to the given array of ValidationResults
 * @param {BunsenValidationResult[]} results - the Array to mutate
 * @param {String} path - the path for the BunsenValidationWarning to add
 * @param {String} message - the mesage for the BunsenValidationWarning to add
 */
export function addWarningResult (results, path, message) {
  results.push({
    errors: [],
    warnings: [{path, message}]
  })
}

/**
 * Validate the JSON string vs. the parsed JSON object
 * This will allow us to detect things like duplicate keys which would otherwise go unnoticed
 * @param {String} jsonStr - the raw JSON string
 * @param {Object} jsonObj - the parsed JSON object
 * @returns {BunsenValidationResult} the result of validating the JSON string
 */
export function validateJsonString (jsonStr, jsonObj) {
  const result = {
    errors: [],
    warnings: []
  }

  const entered = jsonStr.replace(/\t/g, '  ')
  const stringified = JSON.stringify(jsonObj, null, 4)
  if (entered.length !== stringified.length) {
    result.warnings.push({
      path: '',
      message: 'The parsed JSON did not equal the entered JSON. You may have a duplicate key, etc.'
    })
  }

  return result
}

/**
 *  Make sure passed json is a parsed JSON object, and validate it if not
 * @param {String|Object} json - the JSON string or object
 * @returns {[Object, ValidationResult]} the JSON object (or undefined on error) and the validation result
 */
export function ensureJsonObject (json) {
  let strResult = null
  if (_.isString(json)) {
    const jsonStr = json
    try {
      json = JSON.parse(jsonStr)
      strResult = validateJsonString(jsonStr, json)
    } catch (e) {
      return [
        undefined,
        {
          errors: [{path: '', message: 'Invalid JSON'}],
          warnings: []
        }
      ]
    }
  }

  return [json, strResult]
}
