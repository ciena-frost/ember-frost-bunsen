import {expect} from 'chai'
import Ember from 'ember' // eslint-disable-line
const {$} = Ember // eslint-disable-line
import {$hook} from 'ember-hook'

import {
  expectBunsenInputNotToHaveError,
  expectBunsenInputToHaveError,
  expectLabel
} from './common'

const assign = Object.assign || Ember.assign || Ember.merge // eslint-disable-line

/**
 * Check whether or not input box is disabled/enabled as expected
 * @param {jQuery} $renderer - jQuery instance of renderer DOM (wrapper tag)
 * @param {Boolean} disabled - whether or not input should be disabled
 */
function expectDisabledInput ($renderer, disabled) {
  const determinerPlusVerb = disabled ? 'a disabled' : 'an enabled'

  expect(
    $renderer.find('input'),
    `renders ${determinerPlusVerb} date input`
  )
    .to.have.prop('disabled', disabled)
}

/**
 * Check that property is renderer as a boolean with expected state
 * @param {String} bunsenId - bunsen ID for property rendered as boolean
 * @param {Object} state - expected state of boolean renderer
 */
export function expectWithState (bunsenId, state) {
  const hook = state.hook || 'bunsenForm'
  const hookName = `${hook}-${bunsenId}`
  const $renderer = $hook(hookName).first()

  const defaults = {
    disabled: false,
    hasValue: false
  }

  state = assign(defaults, state)

  expect(
    $renderer,
    'has expected class'
  )
    .to.have.class('frost-bunsen-input-date')

  expectDisabledInput($renderer, state.disabled)

  if (state.label) {
    expectLabel($renderer, state.label)
  }

  if (state.hasValue) {
    expect($renderer).to.have.class('frost-bunsen-has-value')
  } else {
    expect($renderer).to.not.have.class('frost-bunsen-has-value')
  }

  if (state.error) {
    expectBunsenInputToHaveError(bunsenId, state.error, hook)
  } else {
    expectBunsenInputNotToHaveError(bunsenId, hook)
  }
}

// Helpers taken from ember-pickaday

/**
 * Open the renderer's date picker
 * @param {String} bunsenId - the bunsen ID for the property
 * @param {String} hook - the hook for the form
 * @returns {Object} an object than can selectDate
 */
export function openDatepicker (bunsenId, hook) {
  hook = hook || 'bunsenForm'

  const hookName = `${hook}-${bunsenId}-datePicker-input`
  const $input = $hook(hookName)
  $input.click()

  return PikadayInteractor
}

const PikadayInteractor = {
  selectorForMonthSelect: '.pika-lendar:visible .pika-select-month',
  selectorForYearSelect: '.pika-lendar:visible .pika-select-year',
  selectDate: function (date) {
    var day = date.getDate()
    var month = date.getMonth()
    var year = date.getFullYear()
    var selectEvent = 'ontouchend' in document ? 'touchend' : 'mousedown'

    $(this.selectorForYearSelect).val(year)
    triggerNativeEvent($(this.selectorForYearSelect)[0], 'change')
    $(this.selectorForMonthSelect).val(month)
    triggerNativeEvent($(this.selectorForMonthSelect)[0], 'change')

    triggerNativeEvent($('td[data-day="' + day + '"] button:visible')[0], selectEvent)
  },
  selectedDay: function () {
    return $('.pika-single td.is-selected button').html()
  },
  selectedMonth: function () {
    return $(this.selectorForMonthSelect + ' option:selected').val()
  },
  selectedYear: function () {
    return $(this.selectorForYearSelect + ' option:selected').val()
  },
  minimumYear: function () {
    return $(this.selectorForYearSelect).children().first().val()
  },
  maximumYear: function () {
    return $(this.selectorForYearSelect).children().last().val()
  }
}

function triggerNativeEvent (element, eventName) {
  if (document.createEvent) {
    var event = document.createEvent('Events')
    event.initEvent(eventName, true, false)
    element.dispatchEvent(event)
  } else {
    element.fireEvent('on' + eventName)
  }
}
