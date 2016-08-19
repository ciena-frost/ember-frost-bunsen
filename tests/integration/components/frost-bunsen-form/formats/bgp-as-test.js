import customFormatTests from './common'

const invalidValues = [
  'test',
  '-1',
  '0',
  '0.5',
  '65535',
  '4294967295',
  '4294967296'
]

const validValues = [
  '1',
  '65534',
  '65536',
  '4294967294'
]

customFormatTests('bgp-as', invalidValues, validValues)
