import {utils} from 'bunsen-core'
const {parseVariables} = utils
import Ember from 'ember'
const {get, inject, Logger, typeOf} = Ember
import computed, {readOnly} from 'ember-computed-decorators'
import countries from 'ember-frost-bunsen/fixtures/countries'
import subFormModel from 'ember-frost-bunsen/fixtures/geolocation-model'
import addressView from 'ember-frost-bunsen/fixtures/geolocation-address-view'
import locationView from 'ember-frost-bunsen/fixtures/geolocation-location-view'
import layout from 'ember-frost-bunsen/templates/components/frost-bunsen-input-geolocation'
import config from 'ember-get-config'
import {PropTypes} from 'ember-prop-types'
import AbstractInput from './abstract-input'

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

const areaHandlers = {
  city (value) {
    this._updateProperty('city', value)
  },

  country (value) {
    this._updateProperty('country', value)
  },

  state (value) {
    this._updateProperty('state', value)
  }
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

      Object.keys(subFormValueShape)
        .forEach((key) => {
          if (key in refs) {
            return
          }

          formValue[key] = internalFormValue[key]
        })

      if (formValue.country) {
        formValue.country = countryCodeToName(formValue.country)
      }

      return formValue
    } catch (e) {
      return {}
    }
  },

  // == Functions ==============================================================

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
   * Convert bunsen model property reference to bunsen ID
   * @param {String} ref - bunsen model property reference
   * @returns {String} bunsen ID
   */
  _getRefBunsenId (ref) {
    const bunsenId = this.get('bunsenId')
    return bunsenId + ref.replace(/^\$\{\.\/(.+)}/g, '.$1').replace(/\//g, '.')
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
    let msg

    switch (e.code) {
      case e.PERMISSION_DENIED:
        msg = 'Location lookup is currently disabled in your browser.'
        break

      case e.POSITION_UNAVAILABLE:
        msg = 'Location information is unavailable.'
        break

      case e.TIMEOUT:
        msg = 'The request to get your location timed out.'
        break

      default:
        Logger.error('Failed to get users location', e)
        break
    }

    if (msg) {
      this.set('getUserLocationErrorMessage', msg)
    }

    this._stopLoading()
  },

  /**
   * Handle success from browsers geolocation lookup API
   */
  _onGetCurrentPositionSuccess ({coords}) {
    this._updateProperty('latitude', coords.latitude)
    this._updateProperty('longitude', coords.longitude)
    this._performReverseLookup(coords.latitude, coords.longitude)
  },

  /**
   * Handle error from lookup API
   * @param {Error} e - error
   */
  _onLookupError (e) {
    Logger.error('Failed to perform lookup', e)
  },

  /**
   * Handle success from lookup API
   * @param {Object} resp - lookup response
   */
  _onLookupSuccess (resp) {
    const location = get(resp, 'results.0.locations.0.latLng') || {}

    if (!location) {
      return
    }

    this._updateProperty('latitude', location.lat)
    this._updateProperty('longitude', location.lng)
  },

  /**
   * Handle error from reverse lookup API
   * @param {Error} e - error
   */
  _onReverseLookupError (e) {
    Logger.error('Failed to perform reverse lookup', e)
  },

  /**
   * Handle success from reverse lookup API
   * @param {Object} resp - reverse lookup response
   */
  _onReverseLookupSuccess (resp) {
    const location = get(resp, 'results.0.locations.0') || {}

    for (let i = 1; i < 7; i++) {
      let type = location[`adminArea${i}Type`]

      if (!type) {
        continue
      }

      type = type.toLowerCase()

      if (type in areaHandlers) {
        areaHandlers[type].call(this, location[`adminArea${i}`])
      }
    }

    ;[
      'postalCode',
      'street'
    ]
      .forEach((key) => {
        if (location[key]) {
          const normalizedKey = this._normalizeKey(key)
          this._updateProperty(normalizedKey, location[key])
        }
      })
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
      .finally(() => {
        this._stopLoading()
      })
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

  /**
   * Update UI to reflect that lookup has completed
   */
  _stopLoading () {
    this.set('isLoading', false)
  },

  /**
   * Update the value of one of the address/location properties
   * @param {String} key - property to update
   * @param {String} value - new value to set property to
   */
  _updateProperty (key, value) {
    const onChange = this.get('onChange')
    const refs = this.get('cellConfig.renderer.refs') || {}

    if (refs[key]) {
      onChange(this._getRefBunsenId(refs[key]), value)
    } else {
      this.set(`internalFormValue.${key}`, value)
      // TODO: trigger re-render?
    }
  },

  // == Actions ================================================================

  actions: {
    handleSubFormChange (formValue) {
      const oldFormValue = this.get('internalFormValue')

      if (formValue.country) {
        const countryCode = countryNameToCode(formValue.country)
        formValue = formValue.set('country', countryCode)
      }

      Object.keys(subFormValueShape)
        .forEach((key) => {
          if (oldFormValue[key] !== formValue[key]) {
            const ref = this.get(`cellConfig.renderer.refs.${key}`)

            if (ref) {
              const bunsenId = this._getRefBunsenId(ref)
              this.get('onChange')(bunsenId, formValue[key])
            }
          }
        })

      this.set('internalFormValue', formValue)
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
        .finally(() => {
          this._stopLoading()
        })
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
