import customFormatTests from './common'

const invalidValues = [
  'test',
  '0.5',
  '-1',
  '4294967296'
]

const validValues = [
  '0',
  '4294967295'
]

customFormatTests('uint32', invalidValues, validValues)
