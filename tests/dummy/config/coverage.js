module.exports = {
  coverageEnvVar: 'COVERAGE',
  coverageFolder: 'coverage',
  excludes: [
    '**/mirage/**/*',
    '**/dummy/**/*'
  ],
  reporters: [
    'html',
    'json-summary',
    'lcov',
    'text-summary'
  ],
  useBabelInstrumenter: true
}
