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
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
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
    ENV.rootURL = '/'
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
