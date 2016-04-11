/* global require, module */
var EmberAddon = require('ember-cli/lib/broccoli/ember-addon')

module.exports = function (defaults) {
  var app = new EmberAddon(defaults, {
    babel: {
      optional: ['es7.decorators']
    },
    'ember-cli-mocha': {
      useLintTree: false
    },
    'ember-prism': {
      components: ['json'],
      plugins: ['line-highlight'],
      theme: 'tomorrow'
    },
    sassOptions: {
      includePaths: [
      ]
    }
  })

  switch (app.env) {
    case 'test':
      app.import('bower_components/ember-template-compiler/index.js')
      break
  }

  app.import('bower_components/sinonjs/sinon.js')

  /*
    This build file specifes the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */

  return app.toTree()
}
