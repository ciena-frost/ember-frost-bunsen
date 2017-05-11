import {utils} from 'bunsen-core'
import {set} from 'bunsen-core/immutable-utils'
const {getSubModel, parseVariables} = utils
import Ember from 'ember'
const {Logger, get, inject, run, typeOf} = Ember
import computed, {readOnly} from 'ember-computed-decorators'
import config from 'ember-get-config'
import {PropTypes} from 'ember-prop-types'
import _ from 'lodash'
import immutable from 'seamless-immutable'

import AbstractInput from './abstract-input'
import countries from 'ember-frost-bunsen/fixtures/countries'
import addressView from 'ember-frost-bunsen/fixtures/geolocation-address-view'
import locationView from 'ember-frost-bunsen/fixtures/geolocation-location-view'
import subFormModel from 'ember-frost-bunsen/fixtures/geolocation-model'
import layout from 'ember-frost-bunsen/templates/components/frost-bunsen-input-geolocation'

const {keys} = Object

const MAPQUEST_API_KEY = get(config, 'ember-frost-bunsen.MAPQUEST_API_KEY')
const LOOKUP_ENDPOINT = 'http://www.mapquestapi.com/geocoding/v1/address'
const REVERSE_LOOKUP_ENDPOINT = 'http://www.mapquestapi.com/geocoding/v1/reverse'

const subFormValueShape = {
  address: PropTypes.string,
  city: PropTypes.string,
  country: PropTypes.string,
  latitude: PropTypes.string,
  longitude: PropTypes.string,
  postalCode: PropTypes.string,
  state: PropTypes.string
}

/**
 * Get bunsen path from a reference
 * i.e. convert '${./foo/bar}' to 'foo.bar'
 * @param {String} ref - reference
 * @returns {String} bunsen path
 */
function bunsenPathFromRef (ref) {
  return ref.replace(/^\$\{\.\/(.+)}/g, '.$1').replace(/\//g, '.')
}

/**
 * Convert country code to name
 * Note: If code is missing in countries list just return code
 * @param {String} code - country code
 * @returns {String} country name
 */
function countryCodeToName (code) {
  const country = countries.find((country) => country.code === code)

  if (!country) {
    return code
  }

  return country.name
}

/**
 * Convert country name to code
 * Note: If name is missing in countries list just return name
 * @param {String} name - country name
 * @returns {String} country code
 */
function countryNameToCode (name) {
  const country = countries.find((country) => country.name === name)

  if (!country) {
    return name
  }

  return country.code
}

/**
 * Deserialize property value to format consumer expects
 * @param {String} bunsenId - property key
 * @param {String} value - property value
 * @param {Object} bunsenModel - bunsen model
 * @returns {String|Number} deserialized value
 */
function deserializeProperty (bunsenId, value, bunsenModel) {
  const subModel = getSubModel(bunsenModel, bunsenId)

  switch (subModel.type) {
    case 'integer':
      return parseInt(value)

    case 'number':
      return parseFloat(value)

    default:
      return value
  }
}

/**
 * Serialize form value to be in correct format for sub-forms
 * @param {Object} formValue - unserialized form value
 */
function serializeFormValue (formValue) {
  if (formValue.country) {
    formValue.country = countryCodeToName(formValue.country)
  }

  if (typeOf(formValue.latitude) === 'number') {
    formValue.latitude = `${formValue.latitude}`
  }

  if (typeOf(formValue.longitude) === 'number') {
    formValue.longitude = `${formValue.longitude}`
  }
}

export default AbstractInput.extend({
  // == Dependencies ===========================================================

  ajax: inject.service(),

  // == Component Properties ===================================================

  classNames: [
    'frost-bunsen-input-geolocation',
    'frost-field'
  ],

  layout,

  // == State Properties =======================================================

  propTypes: {
    // private
    addressView: PropTypes.object,
    internalFormValue: PropTypes.shape(subFormValueShape),
    isLoading: PropTypes.bool,
    isLoadingUserLocation: PropTypes.bool,
    locationView: PropTypes.object,
    subFormModel: PropTypes.object
  },

  getDefaultProps () {
    return {
      addressView,
      internalFormValue: {},
      isLoading: false,
      locationView,
      subFormModel
    }
  },

  @readOnly
  @computed('cellConfig', 'value')
  subFormValue (cellConfig, value) {
    const internalFormValue = this.get('internalFormValue')
    const refs = get(cellConfig, 'renderer.refs') || {}
    const stringifiedFormValue = parseVariables(value, JSON.stringify(refs), '', true)

    try {
      const formValue = JSON.parse(stringifiedFormValue)

      keys(subFormValueShape)
        .forEach((key) => {
          if (key in refs) {
            return
          }

          formValue[key] = internalFormValue[key]
        })

      serializeFormValue(formValue)

      return formValue
    } catch (e) {
      return {}
    }
  },

  // == Functions ==============================================================

  /**
   * Get error message for user location lookup error
   * @param {Error} e - error
   * @returns {String} error message
   */
  _getErrorMessage (e) {
    switch (e.code) {
      case e.PERMISSION_DENIED:
        return 'Location lookup is currently disabled in your browser.'

      case e.POSITION_UNAVAILABLE:
        return 'Location information is unavailable.'

      case e.TIMEOUT:
        return 'The request to get your location timed out.'

      default:
        return null
    }
  },

  /**
   * Get location in format necessary for API request
   * @param {Object} value - current address information
   * @returns {String} normalized location string for API
   */
  _getNormalizedLocation (value) {
    const {address, city, country, postalCode, state} = value

    return [
      address,
      city && state ? `${city} ${state}` : city || state || '',
      postalCode,
      country
    ]
      .filter((segment) => typeOf(segment) === 'string' && segment.length !== 0)
      .join(',')
  },

  /**
   * Convert API response key to bunsen model property
   * @param {String} key - API key
   * @returns {String} bunsen model property
   */
  _normalizeKey (key) {
    if (key === 'street') {
      return 'address'
    }

    return key
  },

  /**
   * Handle error from browsers geolocation lookup API
   * @param {Error} e - error
   */
  _onGetCurrentPositionError (e) {
    if (this.isDestroyed || this.isDestroying) return

    let msg = this._getErrorMessage(e)

    if (msg) {
      this.setProperties({
        getUserLocationErrorMessage: msg,
        isLoading: false
      })
    } else {
      this.set('isLoading', false)
      Logger.error('Failed to get users location', e)
    }
  },

  /**
   * Handle success from browsers geolocation lookup API
   */
  _onGetCurrentPositionSuccess ({coords}) {
    if (this.isDestroyed || this.isDestroying) return

    this._updateProperties({
      latitude: coords.latitude,
      longitude: coords.longitude
    })

    this._performReverseLookup(coords.latitude, coords.longitude)
  },

  /**
   * Handle error from lookup API
   * @param {Error} e - error
   */
  _onLookupError (e) {
    if (this.isDestroyed || this.isDestroying) return
    this.set('isLoading', false)
    Logger.error('Failed to perform lookup', e)
  },

  /**
   * Handle success from lookup API
   * @param {Object} resp - lookup response
   */
  _onLookupSuccess (resp) {
    if (this.isDestroyed || this.isDestroying) return

    const location = get(resp, 'results.0.locations.0') || {}

    const props = this._updateAdminAreaProperties(location, false)

    Object.assign(props, {
      latitude: get(location, 'latLng.lat'),
      longitude: get(location, 'latLng.lng')
    })

    ;[
      'postalCode',
      'street'
    ]
      .forEach((key) => {
        if (location[key]) {
          const normalizedKey = this._normalizeKey(key)
          if (this.get(`internalFormValue.${normalizedKey}`)) return
          props[normalizedKey] = location[key]
        }
      })

    this._updateProperties(props)

    this.set('isLoading', false)
  },

  /**
   * Handle error from reverse lookup API
   * @param {Error} e - error
   */
  _onReverseLookupError (e) {
    if (this.isDestroyed || this.isDestroying) return
    this.set('isLoading', false)
    Logger.error('Failed to perform reverse lookup', e)
  },

  /**
   * Handle success from reverse lookup API
   * @param {Object} resp - reverse lookup response
   */
  _onReverseLookupSuccess (resp) {
    if (this.isDestroyed || this.isDestroying) return

    const location = get(resp, 'results.0.locations.0') || {}

    const props = this._updateAdminAreaProperties(location, true)

    ;[
      'postalCode',
      'street'
    ]
      .forEach((key) => {
        if (location[key]) {
          const normalizedKey = this._normalizeKey(key)
          props[normalizedKey] = location[key]
        }
      })

    this._updateProperties(props)

    this.set('isLoading', false)
  },

  /**
   * Lookup street address information from location
   * @param {String} latitude - latitude
   * @param {String} longitude - longitude
   */
  _performReverseLookup (latitude, longitude) {
    const key = this.get('cellConfig.renderer.apiKey') || MAPQUEST_API_KEY
    let url = `${REVERSE_LOOKUP_ENDPOINT}?location=${latitude},${longitude}`

    if (key) {
      url += `&key=${key}`
    }

    this.get('ajax').request(url)
      .then(this._onReverseLookupSuccess.bind(this))
      .catch(this._onReverseLookupError.bind(this))
  },

  /**
   * Update UI to reflect lookup is occurring
   * @param {Boolean} userLocation - are we looking up user's location
   */
  _startLoading (userLocation) {
    this.setProperties({
      isLoading: true,
      isLoadingUserLocation: userLocation,
      getUserLocationErrorMessage: null
    })
  },

  _updateAdminAreaProperties (location, overwrite) {
    const props = {}

    if (!overwrite) return props

    for (let i = 1; i < 7; i++) {
      let type = location[`adminArea${i}Type`]

      if (!type) {
        continue
      }

      type = type.toLowerCase()

      if (['city', 'country', 'state'].indexOf(type) !== -1) {
        props[type] = location[`adminArea${i}`]
      }
    }

    return props
  },

  /* eslint-disable complexity */
  /**
   * Update properties
   * @param {Object} props - properties to update
   */
  _updateProperties (props) {
    const bunsenModel = this.get('bunsenModel')
    const onChange = this.get('onChange')
    const refs = this.get('cellConfig.renderer.refs') || {}
    let internalFormValue = this.get('internalFormValue') || immutable({})

    let value = this.get('value') || immutable({})

    Object.keys(props).forEach((key) => {
      if (refs[key]) {
        let bunsenId = bunsenPathFromRef(refs[key])
        if (bunsenId[0] === '.') bunsenId = bunsenId.substr(1)
        const propValue = deserializeProperty(bunsenId, props[key], bunsenModel)
        value = set(value, bunsenId, propValue)
      } else {
        internalFormValue = set(internalFormValue, key, props[key])
      }
    })

    if (!_.isEqual(value, this.get('value'))) {
      onChange(this.get('bunsenId'), value)
    }

    if (!_.isEqual(internalFormValue, this.get('internalFormValue'))) {
      this.set('internalFormValue', internalFormValue)
    }
  },
  /* eslint-enable complexity */

  // == Actions ================================================================

  actions: {
    handleSubFormChange (formValue) {
      const bunsenModel = this.get('bunsenModel')
      const oldFormValue = this.get('internalFormValue')

      if (formValue.country) {
        const countryCode = countryNameToCode(formValue.country)
        formValue = formValue.set('country', countryCode)
      }

      let value = this.get('value') || immutable({})
      let valueChanged = false

      keys(subFormValueShape)
        .forEach((key) => {
          // We must convert to strings before comparing because we can run
          // into case where one is a number and one is a string
          if (`${oldFormValue[key]}` !== `${formValue[key]}`) {
            const ref = this.get(`cellConfig.renderer.refs.${key}`)

            if (ref) {
              let bunsenId = bunsenPathFromRef(ref)
              if (bunsenId[0] === '.') bunsenId = bunsenId.substr(1)
              const propValue = deserializeProperty(bunsenId, formValue[key], bunsenModel)
              value = set(value, bunsenId, propValue)
              valueChanged = true
            }
          }
        })

      if (valueChanged) {
        run.next(() => {
          const currentValue = this.get('value')
          const changes = Object.keys(value).some((key) => `${get(value, key)}` !== `${get(currentValue, key)}`)

          if (changes) {
            this.get('onChange')(this.get('bunsenId'), value)
          }
        })
      }

      if (!_.isEqual(formValue, oldFormValue)) {
        this.set('internalFormValue', formValue)
      }
    },

    /**
     * Lookup street address from lat/lon
     */
    lookupAddress () {
      this._startLoading(false)

      const latitude = this.get('internalFormValue.latitude')
      const longitude = this.get('internalFormValue.longitude')

      this._performReverseLookup(latitude, longitude)
    },

    /**
     * Lookup lat/lon from street address
     */
    lookupLocation () {
      const key = this.get('cellConfig.renderer.apiKey') || MAPQUEST_API_KEY
      const formValue = this.get('internalFormValue')
      const location = this._getNormalizedLocation(formValue)

      let url = `${LOOKUP_ENDPOINT}?location=${location}`

      if (key) {
        url += `&key=${key}`
      }

      this.get('ajax').request(url)
        .then(this._onLookupSuccess.bind(this))
        .catch(this._onLookupError.bind(this))
    },

    useCurrentLocation () {
      this._startLoading(true)

      navigator.geolocation.getCurrentPosition(
        this._onGetCurrentPositionSuccess.bind(this),
        this._onGetCurrentPositionError.bind(this)
      )
    }
  }
})
