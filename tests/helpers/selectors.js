export default {
  error: '.error',
  frost: {
    input: {
      error: '.frost-field .error',
      not: {
        text: {
          error: '.frost-field .error:not(.frost-text)'
        }
      },
      text: {
        error: '.frost-text.error',
        main: '.frost-text'
      }
    }
  },
  input: {
    text: 'input[type="text"]'
  }
}
