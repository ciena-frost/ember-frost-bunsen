/* eslint-env node */
const EmberAddon = require('ember-cli/lib/broccoli/ember-addon')

module.exports = function (defaults) {
  var app = new EmberAddon(defaults, {

    babel: {
      optional: ['es7.decorators']
    },
    codemirror: {
      modes: ['javascript', 'handlebars', 'markdown'],
      themes: ['mdn-like']
    },
    'ember-cli-babel': {
      includePolyfill: true
    },
    'ember-cli-mocha': {
      useLintTree: false
    },
    'ember-prism': {
      components: ['javascript'],
      theme: 'coy'
    },
    sassOptions: {
      includePaths: [
      ]
    }
  })

  app.import('bower_components/sinonjs/sinon.js')
  // client-side template compilation for the abstract-input demo page
  app.import(app.project.addonPackages['ember-source']
  ? 'vendor/ember/ember-template-compiler.js' : 'bower_components/ember/ember-template-compiler.js')

  /*
    This build file specifes the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */

  return app.toTree()
}
