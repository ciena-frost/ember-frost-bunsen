import {findValue, getSubModel, populateQuery} from 'bunsen-core/utils'
import Ember from 'ember'
const {RSVP, get, getWithDefault, isPresent} = Ember
import computed, {readOnly} from 'ember-computed-decorators'
import {task, timeout} from 'ember-concurrency'
import {AbstractInput} from 'ember-frost-bunsen'
import layout from 'ember-frost-bunsen/templates/components/frost-bunsen-input-form'
import {HookMixin} from 'ember-hook'
import {PropTypes} from 'ember-prop-types'
import _ from 'lodash'

export default AbstractInput.extend(HookMixin, {
  // == Dependencies ==========================================================

  // == Keyword Properties ====================================================
  classNames: ['frost-bunsen-input-form'],
  layout,

  // == PropTypes =============================================================

  propTypes: {
    // options

    // state
    formValue: PropTypes.object,
    internalBunsenModel: PropTypes.object,
    internalBunsenView: PropTypes.object,
    internalBunsenValue: PropTypes.object,
    internalPlugins: PropTypes.object,
    internalValidators: PropTypes.array,
    propagateValidation: PropTypes.bool,
    validationResult: PropTypes.object
  },

  /** @returns {Object} the default property values when not provided by consumer */
  getDefaultProps () {
    return {
      formValue: {},
      internalBunsenValue: {},
      internalValidators: [],
      propagateValidation: false,
      validationResult: {
        errors: [],
        warnings: []
      }
    }
  },

  // == Computed Properties ===================================================

  @readOnly
  @computed('localError')
  renderErrorMessage (localError) {
    return localError ? `Form renderer error encountered: ${localError}` : ''
  },

  @readOnly
  @computed('internalBunsenModel', 'getSchemaTask.isIdle')
  isSchemaLoaded (internalBunsenModel, isIdle) {
    return isPresent(internalBunsenModel) && isIdle
  },

  /**
   * Loads the internal form schemas from the given plugin
   */
  getSchemaTask: task(function * () {
    const model = this._getLocalModel()
    const {plugins, validators} = this.get('getRootProps')()
    const plugin = get(this.get('cellConfig'), 'renderer.plugin')

    if (!plugin) {
      return RSVP.resolve({
        model,
        validators,
        plugins,
        propagateValidation: false
      })
    }

    let expandedArgs = {}
    if (plugin.args) {
      expandedArgs = populateQuery(this.get('formValue'), plugin.args, this.get('bunsenId'))
    }

    const requirementsMet = isPresent(expandedArgs)
    if (requirementsMet) {
      try {
        return yield this._getPlugin(plugin, model, validators, expandedArgs)
      } catch (error) {
        return RSVP.reject(
          new Error(`plugin (${plugin.name}) failed to execute - ${error.message}`)
        )
      }
    }

    return RSVP.resolve({})
  }),

  @readOnly
  @computed('focusedInput')
  internalFocusedInput (focusedInput) {
    if (!focusedInput) return

    let bunsenId = this.get('bunsenId')

    const parentSegments = bunsenId.split('.')
    return focusedInput.split('.').slice(parentSegments.length).join('.')
  },

  // == Functions =============================================================

  init () {
    this._super(...arguments)
    this.registerForFormValueChanges(this)
    if (this.registerValidator) {
      this.registerValidator(this)
    }
    this._updateInternalSchemas()
  },

  /**
   * Form value change hook
   * @param {Object} value - the new form value
   */
  formValueChanged (value) {
    const newValue = value.asMutable !== undefined ? value.asMutable({deep: true}) : value
    const formValue = this.get('formValue')
    const bunsenId = this.get('bunsenId')

    if (_.isEqual(formValue, newValue)) return

    this.set('formValue', newValue)

    if (!_.isEqual(get(formValue, bunsenId), get(newValue, bunsenId))) {
      let internalBunsenValue = get(value, bunsenId)
      this.set('internalBunsenValue', internalBunsenValue)
    }

    this.get('debounceTask').perform(() => {
      if (this._hasDependentChanges(formValue, newValue)) {
        this._updateInternalSchemas()
      }
    }, 1000)
  },

  debounceTask: task(function * (callback, debounceInterval) {
    callback()

    yield timeout(debounceInterval)
  }),

  /**
   * Renderer validation hook
   * @returns {ValidationResult} results from the internal bunsen validation
   */
  validate () {
    const validationResult = _.cloneDeep(this.get('validationResult'))
    const emptyResult = {
      errors: [],
      warnings: []
    }

    const bunsenPath = this.get('bunsenId').split('.')
    // replace path with correct bunsen ids since our model scoped
    ;['errors', 'warnings'].forEach((type) => {
      if (!(type in validationResult)) return
      validationResult[type].forEach((result) => {
        // remove #/
        const internalBunsenPath = result.path.split('/').slice(1)
        const validatePath = bunsenPath.concat(internalBunsenPath).join('/')

        result.path = `#/${validatePath}`
      })
    })

    return RSVP.resolve({
      value: this.get('propagateValidation') ? validationResult : emptyResult
    })
  },

  /**
   * Retrieves the schemas from the given plugin
   * @param {String} plugin - the plugin name
   * @param {Object} [model] - the local model schema
   * @param {Function[]} [validators] - list of validators passed into Bunsen
   * @param {Object} [args] - key/value arguments
   * @returns {RSVP.Promise} the result of executing the plugin
   */
  _getPlugin (plugin, model = {}, validators = [], args = {}) {
    const {plugins} = this.get('getRootProps')()
    const chosenPlugin = plugins[plugin.name]

    if (!chosenPlugin) {
      return RSVP.reject(new Error(`Could not find plugin (${plugin.name})`))
    }

    return chosenPlugin(args).then((pluginInfo) => {
      // default plugin settings
      pluginInfo.validators = validators.concat(pluginInfo.validators || [])
      pluginInfo.propagateValidation = isPresent(pluginInfo.model)
      pluginInfo.model = pluginInfo.model || model
      pluginInfo.plugins = plugins
      return pluginInfo
    })
  },

  /**
   * Gets the model schema passed into the view
   * @returns {Object} the model
   */
  _getLocalModel () {
    const {model: rootModel} = this.get('getRootProps')()
    let bunsenId = this.get('bunsenId')
    let schema = getSubModel(rootModel, bunsenId)

    if (schema.type !== 'object') {
      throw new Error('Model referenced must be of type object to use the form renderer')
    }

    return schema
  },

  /**
   * Mutates the internal bunsen schemas based on the action to take
   */
  _updateInternalSchemas () {
    this.get('getSchemaTask').perform()
      .then(({model, view, plugins, validators, propagateValidation}) => {
        this.setProperties({
          propagateValidation,
          validationResult: {}
        })

        if (model && !_.isEqual(this.get('internalBunsenModel'), model)) {
          this.set('internalBunsenModel', model)
        }

        if (view && !_.isEqual(this.get('internalBunsenView'), view)) {
          this.set('internalBunsenView', view)
        }

        this.setProperties({
          internalValidators: validators,
          internalPlugins: plugins
        })
      })
      .catch((err) => {
        this.set('localError', err.message)
      })
  },

  /**
   * Determines if changes have occurred that would alter the schema
   * @param {Object} oldFormValue - the previous form value
   * @param {Object} newFormValue - the new form value
   * @returns {Boolean} true if there were changes in the form we're concerned about
   */
  _hasDependentChanges (oldFormValue, newFormValue) {
    const args = getWithDefault(this.get('cellConfig'), 'renderer.plugin.args', {})

    const paths = this._getVariables(args)
    return paths.some((path) => {
      const oldValue = findValue(oldFormValue, path, this.get('bunsenId'))
      const newValue = findValue(newFormValue, path, this.get('bunsenId'))

      return !_.isEqual(oldValue, newValue)
    })
  },

  /**
   * Parses the argument object and returns the variable names referenced
   * @param {Object} args - key/value arguments
   * @returns {String[]} list of variables referenced
   */
  _getVariables (args) {
    // return all matches for ${foo}
    const token = /\$\{(.*?)\}/g
    // replaces all ${} in ${foo} to get foo
    const tokenReplace = /\$\{(.*?)\}/

    let deps = {}
    Object.keys(args).forEach((argKey) => {
      const matches = args[argKey].match(token)

      if (matches) {
        matches.forEach((s) => {
          const name = s.replace(tokenReplace, '$1')
          deps[name] = true
        })
      }
    })

    return Object.keys(deps)
  },

  // == DOM Events ============================================================

  // override to prevent default behavior
  focusIn () {
  },

  // override to prevent default behavior
  focusOut () {
  },

  // == Lifecycle Hooks =======================================================

  // == Actions ===============================================================

  actions: {
    formChange (value) {
      this.set('internalBunsenValue', value.asMutable())

      const bunsenId = this.get('bunsenId')
      // update form value here to avoid duplicate work from formValueChanged
      _.set(this.get('formValue'), bunsenId, value)
      this.onChange(bunsenId, value)
    },

    /**
     * Triggers the onChange during validation since a validation follows all on change events
     * and makes it unncessary to trigger validation manually from this component
     * @param {Object} result - validation result
     */
    formValidation (result) {
      if (!_.isEqual(result, this.get('validationResult'))) {
        this.set('validationResult', result)
        if (this.get('triggerValidation')) {
          this.get('triggerValidation')()
        }
      }
    },

    handleFocusIn (bunsenId) {
      let fqBunsenId = `${this.get('bunsenId')}.${bunsenId}`

      this.get('onFocusIn')(fqBunsenId)
    }
  }
})
