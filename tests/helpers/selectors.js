export default {
  error: '.error',
  frost: {
    checkbox: {
      input: {
        disabled: '.frost-checkbox input[type="checkbox"]:disabled',
        enabled: '.frost-checkbox input[type="checkbox"]:not(:disabled)'
      }
    },
    error: '.frost-field .error',
    not: {
      text: {
        error: '.frost-field .error:not(.frost-text)'
      }
    },
    number: {
      input: {
        disabled: '.frost-text input[type="number"]:disabled',
        enabled: '.frost-text input[type="number"]:not(:disabled)'
      }
    },
    password: {
      input: {
        disabled: '.frost-password input:disabled',
        enabled: '.frost-password input:not(:disabled)'
      }
    },
    text: {
      error: '.frost-text.error',
      input: {
        disabled: '.frost-text input[type="text"]:disabled',
        enabled: '.frost-text input[type="text"]:not(:disabled)'
      }
    },
    textarea: {
      input: {
        disabled: '.frost-textarea textarea:disabled',
        enabled: '.frost-textarea textarea:not(:disabled)'
      }
    }
  }
}
