export function disabledTests (ctx) {
  describe('when store.disabled is true', function () {
    beforeEach(function () {
      ctx.component.set('store.disabled', true)
    })

    describe('when cellConfig.disabled is true', function () {
      beforeEach(function () {
        ctx.component.set('cellConfig.disabled', true)
      })

      it('disables input', function () {
        expect(ctx.component.get('disabled')).to.be.true
      })
    })

    describe('when cellConfig.disabled is false', function () {
      beforeEach(function () {
        ctx.component.set('cellConfig.disabled', false)
      })

      it('disables input', function () {
        expect(ctx.component.get('disabled')).to.be.true
      })
    })
  })

  describe('when store.disabled is false', function () {
    beforeEach(function () {
      ctx.component.set('store.disabled', false)
    })

    describe('when cellConfig.disabled is true', function () {
      beforeEach(function () {
        ctx.component.set('cellConfig.disabled', true)
      })

      it('disables input', function () {
        expect(ctx.component.get('disabled')).to.be.true
      })
    })

    describe('when cellConfig.disabled is false', function () {
      beforeEach(function () {
        ctx.component.set('cellConfig.disabled', false)
      })

      it('does not disable input', function () {
        expect(ctx.component.get('disabled')).to.be.false
      })
    })
  })
}

export function renderErrorMessageTests (ctx) {
  describe('renderErrorMessage when error message present', function () {
    let errorMessage

    beforeEach(function () {
      errorMessage = 'Things are borked'
      ctx.component.set('errorMessage', errorMessage)
    })

    describe('when store.showAllErrors is true', function () {
      beforeEach(function () {
        ctx.component.set('store.showAllErrors', true)
      })

      it('returns error messages when showErrorMessage is true', function () {
        ctx.component.set('showErrorMessage', true)
        expect(ctx.component.get('renderErrorMessage')).to.equal(errorMessage)
      })

      it('returns error messages when showErrorMessage is false', function () {
        ctx.component.set('showErrorMessage', false)
        expect(ctx.component.get('renderErrorMessage')).to.equal(errorMessage)
      })
    })

    describe('when store.showAllErrors is false', function () {
      beforeEach(function () {
        ctx.component.set('store.showAllErrors', false)
      })

      it('returns error messages when showErrorMessage is true', function () {
        ctx.component.set('showErrorMessage', true)
        expect(ctx.component.get('renderErrorMessage')).to.equal(errorMessage)
      })

      it('returns null when showErrorMessage is false', function () {
        ctx.component.set('showErrorMessage', false)
        expect(ctx.component.get('renderErrorMessage')).to.be.null
      })
    })
  })
}
