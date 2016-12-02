module.exports = {
  coverageEnvVar: 'COVERAGE',
  coverageFolder: 'coverage',
  useBabelInstrumenter: true,
  reporters: [
    'html',
    'lcov',
    'text-summary'
  ]
}
