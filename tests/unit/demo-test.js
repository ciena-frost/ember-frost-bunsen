import {assert} from 'chai'
import {describe, it} from 'mocha'

import steps from 'dummy/pods/tutorial/steps'

function verifyPropertyPresent (steps, property) {
  const stepsMissingSlug = []

  steps
    .forEach((step) => {
      if (!step[property]) {
        stepsMissingSlug.push(step)
      }
    })

  if (stepsMissingSlug.length !== 0) {
    const message = stepsMissingSlug
      .map((step) => JSON.stringify(step, null, 2)) // Convert objects to strings
      .map((stepAsString) => stepAsString.replace(/(^|\n)/g, '$1  ')) // Indent lines using 2 space tabbing
      .join('\n\n') // Join steps strings into one string

    assert(false, `The following tutorial step slugs are missing the required property "${property}": \n\n${message}`)
  }
}

function verifyUniqueSlugs (steps) {
  const duplicates = []

  steps
    .map((step) => step.slug)
    .sort()
    .forEach((slug, index, slugs) => {
      // Ignore first slug and non-defined slugs
      if (index === 0 || !slug) {
        return
      }

      if (slugs[index - 1] === slug) {
        duplicates.push(slug)
      }
    })

  if (duplicates.length !== 0) {
    const msg = `The following tutorial step slugs are used more than once and MUST be unique: ${duplicates.join(', ')}`
    assert(false, msg)
  }
}

describe('demo', function () {
  describe('tutorial steps', function () {
    it('have "component" property', function () {
      verifyPropertyPresent(steps, 'component')
    })

    it('have "props" property', function () {
      verifyPropertyPresent(steps, 'props')
    })

    it('have "slug" property', function () {
      verifyPropertyPresent(steps, 'slug')
    })

    it('does not contain duplicate slugs', function () {
      verifyUniqueSlugs(steps)
    })
  })
})
