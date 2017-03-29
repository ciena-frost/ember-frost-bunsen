import Ember from 'ember'
const {$, get, guidFor, run} = Ember
import computed, {readOnly} from 'ember-computed-decorators'
import {PropTypes} from 'ember-prop-types'
import moment from 'moment'

import AbstractInput from './abstract-input'
import layout from 'ember-frost-bunsen/templates/components/frost-bunsen-input-when'

export const DATE_VALUE = 'DATE'

export default AbstractInput.extend({
  // == Component Properties ===================================================

  classNameBindings: ['value:frost-bunsen-has-value'],

  classNames: [
    'frost-bunsen-input-when',
    'frost-field'
  ],

  layout,

  propTypes: {
    // private
    date: PropTypes.string,
    dateValue: PropTypes.string,
    firstButtonValue: PropTypes.string,
    selectedValue: PropTypes.string,
    storedDateTimeValue: PropTypes.string,
    time: PropTypes.string
  },

  getDefaultProps () {
    return {
      dateValue: DATE_VALUE
    }
  },

  // == Computed Properties ====================================================

  @readOnly
  @computed()
  /**
   * A unique ID to be used in order to find the date-picker to enable/disable
   * @returns {String} unique ID for the date-time-picker
   */
  dateId () {
    return guidFor(this) + '_dateId'
  },

  @readOnly
  @computed('cellConfig')
  /**
   * The date format to be used in the date-time-picker
   * @param {Object} cellConfig - contains the dateFormat "string" property (a valid moment format)
   * @see {@link https://momentjs.com/docs/#/displaying/format}
   * @returns {String} the date format
   */
  dateFormat (cellConfig) {
    return get(cellConfig, 'renderer.dateFormat') || 'YYYY-MM-DD'
  },

  @readOnly
  @computed('cellConfig')
  /**
   * The time format to be used in the date-time-picker
   * @param {Object} cellConfig - contains the timeFormat "string" property (a valid moment format)
   * @see {@link https://momentjs.com/docs/#/displaying/format}
   * @returns {String} the time format
   */
  timeFormat (cellConfig) {
    return get(cellConfig, 'renderer.timeFormat') || 'HH:mm:ss'
  },

  @readOnly
  @computed('cellConfig')
  /**
   * The date time format to be used for formating the value sent to the bunsen model
   * @param {Object} cellConfig - contains the dateTimeFormat "string" property (a valid moment format)
   * @see {@link https://momentjs.com/docs/#/displaying/format}
   * @returns {String} the date time format
   */
  dateTimeFormat (cellConfig) {
    return get(cellConfig, 'renderer.dateTimeFormat') || 'YYYY-MM-DDTHH:mm:ssZ'
  },

  @readOnly
  @computed()
  /**
   * The unique "Id" for the radio group
   * @returns {String} the unique id
   */
  groupId () {
    return guidFor(this) + '_radioGroup'
  },

  @readOnly
  @computed('cellConfig')
  /**
   * The size to be used for the radio buttons
   * @param {Object} cellConfig - contains the size "string" property (a valid frost-radio-button size)
   * @returns {String} the radio button size
   */
  size (cellConfig) {
    return get(cellConfig, 'renderer.size') || 'small'
  },

  // == Functions ==============================================================

  /**
   * Initializes the component properties, sets the first radio button as selected and
   * sets the bunsen model to the value of the first radio button
   * @returns {undefined}
   */
  init () {
    this._super(...arguments)

    const currentDateTime = moment()
    const date = moment(currentDateTime).format(this.get('dateFormat'))
    const time = moment(currentDateTime).format(this.get('timeFormat'))
    const firstButtonValue = get(this, 'cellConfig.renderer.value')

    this.setProperties({
      date,
      firstButtonValue,
      selectedValue: firstButtonValue,
      storedDateTimeValue: moment(currentDateTime).format(this.get('dateTimeFormat')),
      time
    })

    run.later(() => {
      this.onChange(this.get('bunsenId'), firstButtonValue)
    })
  },

  /**
   * Disables the date-time-picker "<inputs>" upon startup
   * @returns {undefined}
   */
  didInsertElement () {
    this._super(...arguments)

    this._setDisabled(true)
  },

  /**
   * Enables/disables the date-time-picker "<inputs>"
   * @param {Boolean} state - whether to enable or disable the date-time-picker
   * @returns {undefined}
   */
  _setDisabled (state) {
    const id = this.get('dateId')

    this.$(`#${id} input`).each(function () {
      $(this).prop('disabled', state)
    })
  },

  // == Actions ===============================================================

  actions: {
    /**
     * Manages which radio button is selected and sets the bunsen model to the value
     * of the selected button or value of the date-picker selection
     * @param {Object} event - the event object of the selection
     * @returns {undefined}
     */
    selectedButton (event) {
      const firstButtonValue = this.get('firstButtonValue')

      // Set which button is selected.
      // Needed because clicking in the date-time-picker changes the event object.
      if (event.target.value === DATE_VALUE || event.target.value === firstButtonValue) {
        this.set('selectedValue', event.target.value)
      }

      // Set the bunsen model to the value of the selected button
      this.onChange(
        this.get('bunsenId'),
        (event.target.value === firstButtonValue) ? firstButtonValue : this.get('storedDateTimeValue')
      )

      // Disable the date-time-picker when it's radio button is not selected
      this._setDisabled(event.target.value === firstButtonValue)
    },

    /**
     * Sets the user's selected date and time to the bunsen model and stores it in the
     * case that the user selects away from the date-time picker radio button but then returns
     * @param {Object} value - the users selected date/time moment() object
     * @returns {undefined}
     */
    selectDate (value) {
      const datetime = value.format(this.get('dateTimeFormat'))

      this.set('storedDateTimeValue', datetime)
      this.onChange(this.get('bunsenId'), datetime)
    }
  }
})
