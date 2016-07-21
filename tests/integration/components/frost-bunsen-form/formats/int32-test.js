import customFormatTests from './common'

const invalidValues = [
  'test',
  '0.5',
  '-2147483649',
  '2147483648'
]

const validValues = [
  '-2147483648',
  '2147483647'
]

customFormatTests('int32', invalidValues, validValues)
