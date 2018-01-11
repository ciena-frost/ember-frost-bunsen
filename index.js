/* eslint-env node */
'use strict'

module.exports = {
  name: 'ember-frost-bunsen',

  /* eslint-disable complexity */
  init: function (app) {
    this.options = this.options || {}
    this.options.babel = this.options.babel || {}
    this.options.babel.optional = this.options.babel.optional || []

    if (this.options.babel.optional.indexOf('es7.decorators') === -1) {
      this.options.babel.optional.push('es7.decorators')
    }

    /* eslint-disable no-unused-expressions */
    this._super.init && this._super.init.apply(this, arguments)
    /* eslint-enable no-unused-expressions */
  }
  /* eslint-enable complexity */
}
