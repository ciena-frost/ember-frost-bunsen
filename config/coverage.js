module.exports = {
  coverageEnvVar: 'COVERAGE',
  coverageFolder: 'coverage',
  excludes: [
    /app\/(.*)/,
    /dummy\/(.*)/
  ],
  reporters: [
    'html',
    'lcov',
    'text-summary'
  ],
  useBabelInstrumenter: true
}
