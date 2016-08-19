import customFormatTests from './common'

const invalidValues = [
  'a',
  '1'
]

const validValues = [
  'https://domain.com',
  'https://subdomain.domain.com',
  'https://www.domain.com',
  'https://www.subdomain.domain.com'
]

customFormatTests('url', invalidValues, validValues)
