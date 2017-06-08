import Ember from 'ember'
const {get} = Ember
import computed, {readOnly} from 'ember-computed-decorators'
import AbstractInput from './abstract-input'
import layout from 'ember-frost-bunsen/templates/components/frost-bunsen-input-table'

export default AbstractInput.extend({
  // == Component Properties ===================================================

  classNames: [
    'frost-bunsen-input-table',
    'frost-field'
  ],

  hook: 'ember-frost-bunsen-table',

  layout,

  /**
   * _getColumnsFromConfig - use cellConfig's "columns" attr to derive columns
   * @param  {Object[]} columns the column config from the cellConfig for this cell
   * @returns {Object[]} an ember-frost-table "columns" property
   */
  _getColumnsFromConfig (columns) {
    return columns.map((col) => {
      return {
        label: col.label ? col.label : col,
        propertyName: col.key ? col.key : col
      }
    })
  },

  /**
   * _getColumnsFromValue - use the value's data to derive columns
   * @param {Object} value the value of the attribute assigned to this cell
   * @returns {Object[]} ember-frost-table "columns" property
   */
  _getColumnsFromValue (value) {
    const exampleValue = value[0]
    const columnNames = Object.keys(exampleValue)
    return columnNames.map((name) => {
      return {
        label: name,
        propertyName: name
      }
    })
  },

  @readOnly
  @computed('value', 'cellConfig')
  /**
   * get the columns from the cellConfig and value
   * @param {Object} value the value attribute associated with this cell in the view
   * @param {Object} cellConfig the config attached to this cell in the view
   * @returns {Object[]} a list of ember-frost-table compatible 'columns'
   */
  columns (value, cellConfig) {
    const columns = get(cellConfig, 'renderer.columns')
    return columns ? this._getColumnsFromConfig(columns) : this._getColumnsFromValue(value)
  },

  @readOnly
  @computed('value')
  items (value) {
    return value
  }
})
