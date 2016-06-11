import _ from 'lodash'

import viewSchema from './view-schema'

/**
 * Get the default values for properties on a Cell
 * @returns {Object} - the defaults for a Cell
 */
export function getCellDefaults () {
  const cellSchema = viewSchema.definitions.cell

  const cellDefaults = {}

  _.forIn(cellSchema.properties, (value, key) => {
    const defaultValue = value['default']
    if (defaultValue !== undefined) {
      cellDefaults[key] = defaultValue
    }
  })

  return cellDefaults
}
