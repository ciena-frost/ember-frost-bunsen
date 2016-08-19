import customFormatTests from './common'

const invalidValues = [
  'test',
  '0.5',
  '-129',
  '128'
]

const validValues = [
  '-128',
  '127'
]

customFormatTests('int8', invalidValues, validValues)
