import {setupComponentTest} from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import _ from 'lodash'
import {afterEach, beforeEach} from 'mocha'
import sinon from 'sinon'

/**
 * Get default properties for frost-bunsen-detail test
 * @returns {Object} default properties
 */
export function getDefaultsForDetailComponent () {
  return {
    bunsenModel: undefined,
    bunsenView: undefined,
    hook: 'bunsenDetail', // Note: undefined keeps default from applying
    selectedTabLabel: undefined,
    value: undefined
  }
}

/**
 * Get default properties for frost-bunsen-form test
 * @param {Object} sandbox - sinon sandbox
 * @returns {Object} default properties
 */
export function getDefaultsForFormComponent (sandbox) {
  return {
    autofocus: undefined,
    bunsenModel: undefined,
    bunsenView: undefined,
    disabled: undefined,
    hook: 'bunsenForm', // Note: undefined keeps default from applying
    onChange: sandbox.spy(),
    onValidation: sandbox.spy(),
    selectedTabLabel: undefined,
    showAllErrors: undefined,
    value: undefined
  }
}

/**
 * Render frost-bunsen-detail
 */
export function renderDetailComponent () {
  this.render(hbs`{{frost-bunsen-detail
    bunsenModel=bunsenModel
    bunsenView=bunsenView
    hook=hook
    selectedTabLabel=selectedTabLabel
    value=value
  }}`)
}

/**
 * Render frost-bunsen-form
 */
export function renderFormComponent () {
  this.render(hbs`{{frost-bunsen-form
    autofocus=autofocus
    bunsenModel=bunsenModel
    bunsenView=bunsenView
    disabled=disabled
    hook=hook
    onChange=onChange
    onValidation=onValidation
    selectedTabLabel=selectedTabLabel
    showAllErrors=showAllErrors
    value=value
  }}`)
}

/**
 * Setup integration test for a particular ember-frost-bunsen component
 * @param {Function} defaults - method to get default props
 * @param {String} name - name of component being tested
 * @param {Object} props - properties for test
 * @param {Function} renderer - method to render component
 * @returns {Object} test context information
 */
function setupCommonComponentTest ({defaults, name, props, renderer}) {
  const ctx = {}

  setupComponentTest(name, {
    integration: true
  })

  beforeEach(function () {
    const sandbox = sinon.sandbox.create()

    _.assign(ctx, {
      props: assign(defaults(sandbox), props),
      sandbox
    })

    this.setProperties(ctx.props)
    renderer.call(this)
  })

  afterEach(function () {
    ctx.sandbox.restore()
  })

  return ctx
}

/**
 * Setup integration test for frost-bunsen-detail
 * @param {Object} props - properties for test
 * @returns {Object} test context information
 */
export function setupDetailComponentTest (props) {
  return setupCommonComponentTest({
    defaults: getDefaultsForDetailComponent,
    name: 'frost-bunsen-detail',
    props,
    renderer: renderDetailComponent
  })
}

/**
 * Setup integration test for frost-bunsen-form
 * @param {Object} props - properties for test
 * @returns {Object} test context information
 */
export function setupFormComponentTest (props) {
  return setupCommonComponentTest({
    defaults: getDefaultsForFormComponent,
    name: 'frost-bunsen-form',
    props,
    renderer: renderFormComponent
  })
}
