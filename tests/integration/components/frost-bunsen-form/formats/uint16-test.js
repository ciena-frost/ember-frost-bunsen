import customFormatTests from './common'

const invalidValues = [
  'test',
  '0.5',
  '-1',
  '65536'
]

const validValues = [
  '0',
  '65535'
]

customFormatTests('uint16', invalidValues, validValues)
