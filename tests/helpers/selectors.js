export default {
  bunsen: {
    renderer: {
      boolean: '.frost-bunsen-input-boolean',
      buttonGroup: '.frost-bunsen-input-button-group',
      multiSelect: '.frost-bunsen-input-multi-select',
      number: '.frost-bunsen-input-number',
      password: '.frost-bunsen-input-password',
      select: '.frost-bunsen-input-select',
      text: '.frost-bunsen-input-text',
      textarea: '.frost-bunsen-input-textarea'
    }
  },
  error: '.error',
  frost: {
    button: {
      input: {
        disabled: '.frost-button:disabled',
        enabled: '.frost-button:not(:disabled)'
      }
    },
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
    multiSelect: {
      input: {
        disabled: '.frost-select.multi input.trigger:disabled',
        enabled: '.frost-select.multi input.trigger:not(:disabled)'
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
    select: {
      input: {
        disabled: '.frost-select input:disabled',
        enabled: '.frost-select input:not(:disabled)'
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
