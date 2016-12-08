import {
  expectBunsenGeolocationRendererWithState
} from 'dummy/tests/helpers/ember-frost-bunsen'

import Ember from 'ember'
import {initialize} from 'ember-hook'
import {describeComponent} from 'ember-mocha'
import wait from 'ember-test-helpers/wait'
import hbs from 'htmlbars-inline-precompile'
import {afterEach, beforeEach, describe, it} from 'mocha'
import Pretender from 'pretender'
import sinon from 'sinon'

const assign = Object.assign || Ember.assign || Ember.merge

const GEOLOCATION_RESPONSE_CODES = {
  PERMISSION_DENIED: 1,
  POSITION_UNAVAILABLE: 2,
  TIMEOUT: 3
}

function json (code, payload) {
  return () => [
    code,
    {
      'Content-Type': 'application/json'
    },
    JSON.stringify(payload)
  ]
}

function stubGetCurrentPosition (sandbox, stub) {
  sandbox.stub(window.navigator.geolocation, 'getCurrentPosition', stub)
}

describeComponent(
  'frost-bunsen-form',
  'Integration: Component | frost-bunsen-form | renderer | geolocation',
  {
    integration: true
  },
  function () {
    let props, sandbox, server

    beforeEach(function () {
      server = new Pretender()
      initialize()
      sandbox = sinon.sandbox.create()

      props = {
        bunsenModel: {
          properties: {
            address: {
              properties: {
                address: {type: 'string'},
                city: {type: 'string'},
                country: {type: 'string'},
                latitude: {type: 'string'},
                longitude: {type: 'string'},
                postalCode: {type: 'string'},
                state: {type: 'string'}
              },
              type: 'object'
            }
          },
          type: 'object'
        },
        bunsenView: {
          cells: [
            {
              children: [
                {
                  model: 'address',
                  renderer: {
                    name: 'geolocation',
                    refs: {
                      address: '${./address}',
                      city: '${./city}',
                      country: '${./country}',
                      latitude: '${./latitude}',
                      longitude: '${./longitude}',
                      postalCode: '${./postalCode}',
                      state: '${./state}'
                    }
                  }
                }
              ]
            }
          ],
          type: 'form',
          version: '2.0'
        },
        disabled: undefined,
        onChange: sandbox.spy(),
        onValidation: sandbox.spy(),
        showAllErrors: undefined,
        value: {}
      }

      this.setProperties(props)

      this.render(hbs`{{frost-bunsen-form
        bunsenModel=bunsenModel
        bunsenView=bunsenView
        disabled=disabled
        onChange=onChange
        onValidation=onValidation
        showAllErrors=showAllErrors
        value=value
      }}`)
    })

    afterEach(function () {
      sandbox.restore()
      server.shutdown()
    })

    it('renders as expected', function () {
      expectBunsenGeolocationRendererWithState('address', {})
    })

    describe('press use current location button', function () {
      describe('when user has blocked geolocation', function () {
        beforeEach(function (done) {
          stubGetCurrentPosition(sandbox, (successCallback, errorCallback) => {
            errorCallback(
              assign(GEOLOCATION_RESPONSE_CODES, {
                code: GEOLOCATION_RESPONSE_CODES.PERMISSION_DENIED
              })
            )

            wait().then(() => {
              done()
            })
          })

          this.$('.frost-bunsen-input-geolocation > .frost-button').click()
        })

        it('renders as expected', function () {
          expectBunsenGeolocationRendererWithState('address', {
            errorMessage: 'Location lookup is currently disabled in your browser.'
          })
        })
      })

      describe('when geolocation lookup fails', function () {
        beforeEach(function (done) {
          stubGetCurrentPosition(sandbox, (successCallback, errorCallback) => {
            errorCallback(
              assign(GEOLOCATION_RESPONSE_CODES, {
                code: GEOLOCATION_RESPONSE_CODES.POSITION_UNAVAILABLE
              })
            )

            wait().then(() => {
              done()
            })
          })

          this.$('.frost-bunsen-input-geolocation > .frost-button').click()
        })

        it('renders as expected', function () {
          expectBunsenGeolocationRendererWithState('address', {
            errorMessage: 'Location information is unavailable.'
          })
        })
      })

      describe('when geolocation lookup times out', function () {
        beforeEach(function (done) {
          stubGetCurrentPosition(sandbox, (successCallback, errorCallback) => {
            errorCallback(
              assign(GEOLOCATION_RESPONSE_CODES, {
                code: GEOLOCATION_RESPONSE_CODES.TIMEOUT
              })
            )

            wait().then(() => {
              done()
            })
          })

          this.$('.frost-bunsen-input-geolocation > .frost-button').click()
        })

        it('renders as expected', function () {
          expectBunsenGeolocationRendererWithState('address', {
            errorMessage: 'The request to get your location timed out.'
          })
        })
      })

      describe('when geolocation lookup succeeds', function () {
        beforeEach(function () {
          stubGetCurrentPosition(sandbox, (successCallback, errorCallback) => {
            successCallback({
              coords: {
                latitude: '37.4274795',
                longitude: '-122.152378'
              }
            })
          })
        })

        describe('when reverse lookup fails', function () {
          beforeEach(function () {
            server.get(
              'http://www.mapquestapi.com/geocoding/v1/reverse',
              json(400, {}, 10)
            )

            this.$('.frost-bunsen-input-geolocation > .frost-button').click()

            return wait()
          })

          it('renders as expected', function () {
            expectBunsenGeolocationRendererWithState('address', {
              latitude: '37.4274795',
              longitude: '-122.152378'
            })
          })
        })

        describe('when reverse lookup succeeds', function () {
          beforeEach(function () {
            const payload = {
              results: [
                {
                  locations: [
                    {
                      adminArea1: 'US',
                      adminArea1Type: 'Country',
                      adminArea3: 'CA',
                      adminArea3Type: 'State',
                      adminArea5: 'Stanford',
                      adminArea5Type: 'City',
                      postalCode: '94305-7100',
                      street: '99 Abrams Ct'
                    }
                  ]
                }
              ]
            }

            server.get(
              'http://www.mapquestapi.com/geocoding/v1/reverse',
              json(200, payload, 10)
            )

            this.$('.frost-bunsen-input-geolocation > .frost-button').click()

            return wait()
          })

          it('renders as expected', function () {
            expectBunsenGeolocationRendererWithState('address', {
              address: '99 Abrams Ct',
              city: 'Stanford',
              country: 'United States of America',
              latitude: '37.4274795',
              longitude: '-122.152378',
              postalCode: '94305-7100',
              state: 'CA'
            })
          })
        })
      })
    })

    describe('press lookup button', function () {
      beforeEach(function () {
        this.set('value', {
          address: {
            address: '99 Abrams Ct',
            city: 'Stanford',
            country: 'United States of America',
            postalCode: '94305-7100',
            state: 'CA'
          }
        })
      })

      describe('when lookup fails', function () {
        beforeEach(function () {
          server.get(
            'http://www.mapquestapi.com/geocoding/v1/address',
            json(400, {}, 10)
          )

          this.$(
            '.frost-bunsen-input-geolocation-action-bar .frost-button:first-child'
          ).click()

          return wait()
        })

        it('renders as expected', function () {
          expectBunsenGeolocationRendererWithState('address', {
            address: '99 Abrams Ct',
            city: 'Stanford',
            country: 'United States of America',
            postalCode: '94305-7100',
            state: 'CA'
          })
        })
      })

      describe('when lookup succeeds', function () {
        beforeEach(function () {
          const payload = {
            results: [
              {
                locations: [
                  {
                    latLng: {
                      lat: '37.4274795',
                      lng: '-122.152378'
                    }
                  }
                ]
              }
            ]
          }

          server.get(
            'http://www.mapquestapi.com/geocoding/v1/address',
            json(200, payload, 10)
          )

          this.$(
            '.frost-bunsen-input-geolocation-action-bar .frost-button:first-child'
          ).click()

          return wait()
        })

        it('renders as expected', function () {
          expectBunsenGeolocationRendererWithState('address', {
            address: '99 Abrams Ct',
            city: 'Stanford',
            country: 'United States of America',
            latitude: '37.4274795',
            longitude: '-122.152378',
            postalCode: '94305-7100',
            state: 'CA'
          })
        })
      })
    })

    describe('press reverse lookup button', function () {
      beforeEach(function () {
        this.set('value', {
          address: {
            latitude: '37.4274795',
            longitude: '-122.152378'
          }
        })
      })

      describe('when reverse lookup fails', function () {
        beforeEach(function () {
          server.get(
            'http://www.mapquestapi.com/geocoding/v1/reverse',
            json(400, {}, 10)
          )

          this.$(
            '.frost-bunsen-input-geolocation-action-bar .frost-button:last-child'
          ).click()

          return wait()
        })

        it('renders as expected', function () {
          expectBunsenGeolocationRendererWithState('address', {
            latitude: '37.4274795',
            longitude: '-122.152378'
          })
        })
      })

      describe('when reverse lookup succeeds', function () {
        beforeEach(function () {
          const payload = {
            results: [
              {
                locations: [
                  {
                    adminArea1: 'US',
                    adminArea1Type: 'Country',
                    adminArea3: 'CA',
                    adminArea3Type: 'State',
                    adminArea5: 'Stanford',
                    adminArea5Type: 'City',
                    postalCode: '94305-7100',
                    street: '99 Abrams Ct'
                  }
                ]
              }
            ]
          }

          server.get(
            'http://www.mapquestapi.com/geocoding/v1/reverse',
            json(200, payload, 10)
          )

          this.$(
            '.frost-bunsen-input-geolocation-action-bar .frost-button:last-child'
          ).click()

          return wait()
        })

        it('renders as expected', function () {
          expectBunsenGeolocationRendererWithState('address', {
            address: '99 Abrams Ct',
            city: 'Stanford',
            country: 'United States of America',
            latitude: '37.4274795',
            longitude: '-122.152378',
            postalCode: '94305-7100',
            state: 'CA'
          })
        })
      })
    })
  }
)
