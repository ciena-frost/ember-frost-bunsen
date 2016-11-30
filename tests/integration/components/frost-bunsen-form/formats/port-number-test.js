import customFormatTests from './common'

const invalidValues = [
  'test',
  '0.5',
  '-1',
  '0',
  '65536'
]

const validValues = [
  '1',
  '65535'
]

customFormatTests('port-number', invalidValues, validValues)
