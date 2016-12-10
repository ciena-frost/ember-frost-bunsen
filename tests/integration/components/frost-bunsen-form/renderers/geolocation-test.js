import {expect} from 'chai'

import {
  expectBunsenGeolocationRendererWithState
} from 'dummy/tests/helpers/ember-frost-bunsen'

import Ember from 'ember'
import {initialize} from 'ember-hook'
import {setupComponentTest} from 'ember-mocha'
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

describe('Integration: Component | frost-bunsen-form | renderer | geolocation', function () {
  setupComponentTest('frost-bunsen-form', {
    integration: true
  })

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
    expect(props.onChange.callCount, 'does not trigger onChange').to.equal(0)
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

        expect(props.onChange.callCount, 'does not trigger onChange').to.equal(0)
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

        expect(props.onChange.callCount, 'does not trigger onChange').to.equal(0)
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

        expect(props.onChange.callCount, 'does not trigger onChange').to.equal(0)
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

          expect(
            props.onChange.lastCall.args[0],
            'calls onChange with expected value'
          )
            .to.eql({
              address: {
                latitude: '37.4274795',
                longitude: '-122.152378'
              }
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

          expect(
            props.onChange.lastCall.args[0],
            'calls onChange with expected value'
          )
            .to.eql({
              address: {
                latitude: '37.4274795',
                longitude: '-122.152378',
                country: 'US',
                state: 'CA',
                city: 'Stanford',
                postalCode: '94305-7100',
                address: '99 Abrams Ct'
              }
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

        expect(
          props.onChange.lastCall.args[0],
          'calls onChange with expected value'
        )
          .to.eql({
            address: {
              address: '99 Abrams Ct',
              city: 'Stanford',
              country: 'US',
              postalCode: '94305-7100',
              state: 'CA'
            }
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

        expect(
          props.onChange.lastCall.args[0],
          'calls onChange with expected value'
        )
          .to.eql({
            address: {
              address: '99 Abrams Ct',
              city: 'Stanford',
              country: 'US',
              postalCode: '94305-7100',
              state: 'CA',
              latitude: '37.4274795',
              longitude: '-122.152378'
            }
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

        expect(
          props.onChange.lastCall.args[0],
          'calls onChange with expected value'
        )
          .to.eql({
            address: {
              latitude: '37.4274795',
              longitude: '-122.152378'
            }
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

        expect(
          props.onChange.lastCall.args[0],
          'calls onChange with expected value'
        )
          .to.eql({
            address: {
              latitude: '37.4274795',
              longitude: '-122.152378',
              country: 'US',
              state: 'CA',
              city: 'Stanford',
              postalCode: '94305-7100',
              address: '99 Abrams Ct'
            }
          })
      })
    })
  })

  describe('when latitude and longitude are number type', function () {
    beforeEach(function () {
      this.set('bunsenModel', {
        properties: {
          address: {
            properties: {
              address: {type: 'string'},
              city: {type: 'string'},
              country: {type: 'string'},
              latitude: {type: 'number'},
              longitude: {type: 'number'},
              postalCode: {type: 'string'},
              state: {type: 'string'}
            },
            type: 'object'
          }
        },
        type: 'object'
      })
    })

    it('renders as expected', function () {
      expectBunsenGeolocationRendererWithState('address', {})
      expect(props.onChange.callCount, 'does not trigger onChange').to.equal(0)
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

          expect(props.onChange.callCount, 'does not trigger onChange').to.equal(0)
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

          expect(props.onChange.callCount, 'does not trigger onChange').to.equal(0)
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

          expect(props.onChange.callCount, 'does not trigger onChange').to.equal(0)
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

            expect(
              props.onChange.lastCall.args[0],
              'calls onChange with expected value'
            )
              .to.eql({
                address: {
                  latitude: 37.4274795,
                  longitude: -122.152378
                }
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

            expect(
              props.onChange.lastCall.args[0],
              'calls onChange with expected value'
            )
              .to.eql({
                address: {
                  latitude: 37.4274795,
                  longitude: -122.152378,
                  country: 'US',
                  state: 'CA',
                  city: 'Stanford',
                  postalCode: '94305-7100',
                  address: '99 Abrams Ct'
                }
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

          expect(
            props.onChange.lastCall.args[0],
            'calls onChange with expected value'
          )
            .to.eql({
              address: {
                address: '99 Abrams Ct',
                city: 'Stanford',
                country: 'US',
                postalCode: '94305-7100',
                state: 'CA'
              }
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

          expect(
            props.onChange.lastCall.args[0],
            'calls onChange with expected value'
          )
            .to.eql({
              address: {
                address: '99 Abrams Ct',
                city: 'Stanford',
                country: 'US',
                postalCode: '94305-7100',
                state: 'CA',
                latitude: 37.4274795,
                longitude: -122.152378
              }
            })
        })
      })
    })

    describe('press reverse lookup button', function () {
      beforeEach(function () {
        this.set('value', {
          address: {
            latitude: 37.4274795,
            longitude: -122.152378
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

          expect(
            props.onChange.lastCall.args[0],
            'calls onChange with expected value'
          )
            .to.eql({
              address: {
                latitude: 37.4274795,
                longitude: -122.152378
              }
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

          expect(
            props.onChange.lastCall.args[0],
            'calls onChange with expected value'
          )
            .to.eql({
              address: {
                latitude: 37.4274795,
                longitude: -122.152378,
                country: 'US',
                state: 'CA',
                city: 'Stanford',
                postalCode: '94305-7100',
                address: '99 Abrams Ct'
              }
            })
        })
      })
    })
  })

  describe('when refs are different names', function () {
    beforeEach(function () {
      this.setProperties({
        bunsenModel: {
          properties: {
            address: {
              properties: {
                street: {type: 'string'},
                hometown: {type: 'string'},
                overlord: {type: 'string'},
                lat: {type: 'string'},
                lon: {type: 'string'},
                zip: {type: 'string'},
                babysitter: {type: 'string'}
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
                      address: '${./street}',
                      city: '${./hometown}',
                      country: '${./overlord}',
                      latitude: '${./lat}',
                      longitude: '${./lon}',
                      postalCode: '${./zip}',
                      state: '${./babysitter}'
                    }
                  }
                }
              ]
            }
          ],
          type: 'form',
          version: '2.0'
        }
      })
    })

    it('renders as expected', function () {
      expectBunsenGeolocationRendererWithState('address', {})
      expect(props.onChange.callCount, 'does not trigger onChange').to.equal(0)
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

          expect(props.onChange.callCount, 'does not trigger onChange').to.equal(0)
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

          expect(props.onChange.callCount, 'does not trigger onChange').to.equal(0)
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

          expect(props.onChange.callCount, 'does not trigger onChange').to.equal(0)
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

            expect(
              props.onChange.lastCall.args[0],
              'calls onChange with expected value'
            )
              .to.eql({
                address: {
                  lat: '37.4274795',
                  lon: '-122.152378'
                }
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

            expect(
              props.onChange.lastCall.args[0],
              'calls onChange with expected value'
            )
              .to.eql({
                address: {
                  lat: '37.4274795',
                  lon: '-122.152378',
                  overlord: 'US',
                  babysitter: 'CA',
                  hometown: 'Stanford',
                  zip: '94305-7100',
                  street: '99 Abrams Ct'
                }
              })
          })
        })
      })
    })

    describe('press lookup button', function () {
      beforeEach(function () {
        this.set('value', {
          address: {
            street: '99 Abrams Ct',
            hometown: 'Stanford',
            overlord: 'United States of America',
            zip: '94305-7100',
            babysitter: 'CA'
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

          expect(
            props.onChange.lastCall.args[0],
            'calls onChange with expected value'
          )
            .to.eql({
              address: {
                street: '99 Abrams Ct',
                hometown: 'Stanford',
                overlord: 'US',
                zip: '94305-7100',
                babysitter: 'CA'
              }
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

          expect(
            props.onChange.lastCall.args[0],
            'calls onChange with expected value'
          )
            .to.eql({
              address: {
                street: '99 Abrams Ct',
                hometown: 'Stanford',
                overlord: 'US',
                zip: '94305-7100',
                babysitter: 'CA',
                lat: '37.4274795',
                lon: '-122.152378'
              }
            })
        })
      })
    })

    describe('press reverse lookup button', function () {
      beforeEach(function () {
        this.set('value', {
          address: {
            lat: '37.4274795',
            lon: '-122.152378'
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

          expect(
            props.onChange.lastCall.args[0],
            'calls onChange with expected value'
          )
            .to.eql({
              address: {
                lat: '37.4274795',
                lon: '-122.152378'
              }
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

          expect(
            props.onChange.lastCall.args[0],
            'calls onChange with expected value'
          )
            .to.eql({
              address: {
                lat: '37.4274795',
                lon: '-122.152378',
                overlord: 'US',
                babysitter: 'CA',
                hometown: 'Stanford',
                zip: '94305-7100',
                street: '99 Abrams Ct'
              }
            })
        })
      })
    })
  })
})
