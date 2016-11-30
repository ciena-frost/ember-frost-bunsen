module.exports = {
  disable_watching: true,
  framework: 'mocha',
  launch_in_ci: [
    'Firefox'
  ],
  launch_in_dev: [
    'Chrome'
  ],
  test_page: 'tests/index.html?hidepassed'
}
