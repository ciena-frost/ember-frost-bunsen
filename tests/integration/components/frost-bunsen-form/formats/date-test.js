import customFormatTests from './common'

const invalidValues = [
  'a'
  // '0.5' FIXME: enable this when https://github.com/ciena-blueplanet/bunsen-core/issues/30 is fixed (ARM 2016-09-07)
]

const validValues = [
  'August 03 2015', // MMMM DD YYYY
  'August 3 2015', // MMMM D YYYY
  'Aug 03 2015', // MMM DD YYYY
  'Aug 3 2015', // MMM D YYYY
  '08 03 2015', // MM DD YYYY
  '08 3 2015', // MM D YYYY
  '08 03 15', // MM DD YY
  '08 3 15', // MM D YY
  '8 03 2015', // M DD YYYY
  '8 3 2015', // M D YYYY
  '8 03 15', // M DD YY
  '8 3 15', // M D YY
  '08/03/2015', // MM/DD/YYYY
  '08/3/2015', // MM/D/YYYY
  '08/03/15', // MM/DD/YY
  '08/3/15', // MM/D/YY
  '8/03/2015', // M/DD/YYYY
  '8/3/2015', // M/D/YYYY
  '8/03/15', // M/DD/YY
  '8/3/15' // M/D/YY
]

customFormatTests('date', invalidValues, validValues)
