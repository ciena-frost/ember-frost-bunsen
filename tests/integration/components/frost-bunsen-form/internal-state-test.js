import {expect} from 'chai'
import {$hook} from 'ember-hook'
import wait from 'ember-test-helpers/wait'
import {beforeEach, describe, it} from 'mocha'

import {expectSelectWithState} from 'dummy/tests/helpers/ember-frost-core'
import selectors from 'dummy/tests/helpers/selectors'
import {setupFormComponentTestWithSelectOutlet} from 'dummy/tests/helpers/utils'

describe('Integration: Component / frost-bunsen-form / internal state', function () {
  setupFormComponentTestWithSelectOutlet({
    bunsenModel: {
      properties: {
        _internal: {
          properties: {
            langGroup: {
              enum: [
                'Server',
                'Web'
              ],
              type: 'string'
            }
          },
          type: 'object'
        },
        lang: {
          type: 'string'
        }
      },
      type: 'object'
    },
    bunsenView: {
      cells: [
        {
          children: [
            {
              model: '_internal.langGroup'
            },
            {
              conditions: [
                {
                  if: [
                    {
                      '_internal.langGroup': {equals: 'Web'}
                    }
                  ]
                }
              ],
              model: 'lang',
              renderer: {
                data: [
                  {label: 'CSS', value: 'css'},
                  {label: 'HTML', value: 'html'},
                  {label: 'JavaScript', value: 'js'}
                ],
                name: 'select'
              }
            },
            {
              conditions: [
                {
                  if: [
                    {
                      '_internal.langGroup': {equals: 'Server'}
                    }
                  ]
                }
              ],
              model: 'lang',
              renderer: {
                data: [
                  {label: 'Express', value: 'express'},
                  {label: 'Python', value: 'py'},
                  {label: 'Ruby', value: 'rb'}
                ],
                name: 'select'
              }
            }
          ]
        }
      ],
      type: 'form',
      version: '2.0'
    }
  })

  it('renders as expected', function () {
    expect(
      this.$(selectors.bunsen.renderer.select),
      'only renders one bunsen select input'
    )
      .to.have.length(1)

    expectSelectWithState($hook('bunsenForm-_internal.langGroup').find('.frost-select'), {
      text: ''
    })
  })

  describe('when state select expanded/opened', function () {
    beforeEach(function () {
      $hook('bunsenForm-_internal.langGroup').find('.frost-select').click()
      return wait()
    })

    it('renders as expected', function () {
      expectSelectWithState($hook('bunsenForm-_internal.langGroup').find('.frost-select'), {
        items: ['Server', 'Web'],
        opened: true,
        text: ''
      })
    })

    describe('when first option selected', function () {
      beforeEach(function () {
        $hook('bunsenForm-_internal.langGroup-item', {index: 0}).trigger('mousedown')
        return wait()
      })

      it('renders as expected', function () {
        expectSelectWithState($hook('bunsenForm-_internal.langGroup').find('.frost-select'), {
          text: 'Server'
        })

        expectSelectWithState($hook('bunsenForm-lang').find('.frost-select'), {
          text: ''
        })
      })

      describe('when language select expanded/opened', function () {
        beforeEach(function () {
          $hook('bunsenForm-lang').find('.frost-select').click()
          return wait()
        })

        it('renders as expected', function () {
          expectSelectWithState($hook('bunsenForm-_internal.langGroup').find('.frost-select'), {
            text: 'Server'
          })

          expectSelectWithState($hook('bunsenForm-lang').find('.frost-select'), {
            items: ['Express', 'Python', 'Ruby'],
            opened: true,
            text: ''
          })
        })

        describe('select first language', function () {
          beforeEach(function () {
            $hook('bunsenForm-lang-item', {index: 0}).trigger('mousedown')
            return wait()
          })

          it('renders as expected', function () {
            expectSelectWithState($hook('bunsenForm-_internal.langGroup').find('.frost-select'), {
              text: 'Server'
            })

            expectSelectWithState($hook('bunsenForm-lang').find('.frost-select'), {
              text: 'Express'
            })
          })

          describe('when state select expanded/opened', function () {
            beforeEach(function () {
              $hook('bunsenForm-_internal.langGroup').find('.frost-select').click()
              return wait()
            })

            it('renders as expected', function () {
              expectSelectWithState($hook('bunsenForm-_internal.langGroup').find('.frost-select'), {
                items: ['Server', 'Web'],
                opened: true,
                text: 'Server'
              })

              expectSelectWithState($hook('bunsenForm-lang').find('.frost-select'), {
                text: 'Express'
              })
            })

            describe('when second option selected', function () {
              beforeEach(function () {
                $hook('bunsenForm-_internal.langGroup-item', {index: 1}).trigger('mousedown')
                return wait()
              })

              it('renders as expected', function () {
                expectSelectWithState($hook('bunsenForm-_internal.langGroup').find('.frost-select'), {
                  text: 'Web'
                })

                expectSelectWithState($hook('bunsenForm-lang').find('.frost-select'), {
                  text: ''
                })
              })

              describe('when language select expanded/opened', function () {
                beforeEach(function () {
                  $hook('bunsenForm-lang').find('.frost-select').click()
                  return wait()
                })

                it('renders as expected', function () {
                  expectSelectWithState($hook('bunsenForm-_internal.langGroup').find('.frost-select'), {
                    text: 'Web'
                  })

                  expectSelectWithState($hook('bunsenForm-lang').find('.frost-select'), {
                    items: ['CSS', 'HTML', 'JavaScript'],
                    opened: true,
                    text: ''
                  })
                })
              })
            })
          })
        })

        describe('select second language', function () {
          beforeEach(function () {
            $hook('bunsenForm-lang-item', {index: 1}).trigger('mousedown')
            return wait()
          })

          it('renders as expected', function () {
            expectSelectWithState($hook('bunsenForm-_internal.langGroup').find('.frost-select'), {
              text: 'Server'
            })

            expectSelectWithState($hook('bunsenForm-lang').find('.frost-select'), {
              text: 'Python'
            })
          })
        })

        describe('select third language', function () {
          beforeEach(function () {
            $hook('bunsenForm-lang-item', {index: 2}).trigger('mousedown')
            return wait()
          })

          it('renders as expected', function () {
            expectSelectWithState($hook('bunsenForm-_internal.langGroup').find('.frost-select'), {
              text: 'Server'
            })

            expectSelectWithState($hook('bunsenForm-lang').find('.frost-select'), {
              text: 'Ruby'
            })
          })
        })
      })
    })

    describe('when second option selected', function () {
      beforeEach(function () {
        $hook('bunsenForm-_internal.langGroup-item', {index: 1}).trigger('mousedown')
        return wait()
      })

      it('renders as expected', function () {
        expectSelectWithState($hook('bunsenForm-_internal.langGroup').find('.frost-select'), {
          text: 'Web'
        })

        expectSelectWithState($hook('bunsenForm-lang').find('.frost-select'), {
          text: ''
        })
      })

      describe('when language select expanded/opened', function () {
        beforeEach(function () {
          $hook('bunsenForm-lang').find('.frost-select').click()
          return wait()
        })

        it('renders as expected', function () {
          expectSelectWithState($hook('bunsenForm-_internal.langGroup').find('.frost-select'), {
            text: 'Web'
          })

          expectSelectWithState($hook('bunsenForm-lang').find('.frost-select'), {
            items: ['CSS', 'HTML', 'JavaScript'],
            opened: true,
            text: ''
          })
        })

        describe('select first language', function () {
          beforeEach(function () {
            $hook('bunsenForm-lang-item', {index: 0}).trigger('mousedown')
            return wait()
          })

          it('renders as expected', function () {
            expectSelectWithState($hook('bunsenForm-_internal.langGroup').find('.frost-select'), {
              text: 'Web'
            })

            expectSelectWithState($hook('bunsenForm-lang').find('.frost-select'), {
              text: 'CSS'
            })
          })
        })

        describe('select second language', function () {
          beforeEach(function () {
            $hook('bunsenForm-lang-item', {index: 1}).trigger('mousedown')
            return wait()
          })

          it('renders as expected', function () {
            expectSelectWithState($hook('bunsenForm-_internal.langGroup').find('.frost-select'), {
              text: 'Web'
            })

            expectSelectWithState($hook('bunsenForm-lang').find('.frost-select'), {
              text: 'HTML'
            })
          })
        })

        describe('select third language', function () {
          beforeEach(function () {
            $hook('bunsenForm-lang-item', {index: 2}).trigger('mousedown')
            return wait()
          })

          it('renders as expected', function () {
            expectSelectWithState($hook('bunsenForm-_internal.langGroup').find('.frost-select'), {
              text: 'Web'
            })

            expectSelectWithState($hook('bunsenForm-lang').find('.frost-select'), {
              text: 'JavaScript'
            })
          })
        })
      })
    })
  })
})
