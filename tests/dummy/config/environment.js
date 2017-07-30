/* eslint-env node */

module.exports = function (environment) {
  var ENV = {
    modulePrefix: 'dummy',
    podModulePrefix: 'dummy/pods',
    environment: environment,
    rootURL: '/',
    locationType: 'hash',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    'ember-frost-bunsen': {
      MAPQUEST_API_KEY: process.env.MAPQUEST_API_KEY
    },

    'ember-prop-types': {
      spreadProperty: 'options',
      throwErrors: true,
      validateOnUpdate: true
    }
  }

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true
    // ENV.APP.LOG_ACTIVE_GENERATION = true
    // ENV.APP.LOG_TRANSITIONS = true
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true
    // ENV.APP.LOG_VIEW_LOOKUPS = true
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none'

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false
    ENV.APP.LOG_VIEW_LOOKUPS = false

    // Don't log multiline stack-traces for deprecation warnings
    ENV.EmberENV.LOG_STACKTRACE_ON_DEPRECATION = false

    ENV.APP.rootElement = '#ember-testing'
  }

  if (environment === 'production') {
    ENV.rootURL = '/ember-frost-bunsen'
    ENV.isDemo = true
    ENV.mirageNamespace = 'https://ciena-frost.github.io'
    ENV['ember-cli-mirage'] = {
      enabled: true
    }
  }

  return ENV
}
