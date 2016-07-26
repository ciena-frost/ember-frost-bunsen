export default {
  bunsen: {
    array: {
      sort: {
        handle: '.handle'
      }
    },
    errorMessage: {
      boolean: '.frost-bunsen-input-boolean > .error',
      multiSelect: '.frost-bunsen-input-multi-select > .error',
      number: '.frost-bunsen-input-number > .error',
      password: '.frost-bunsen-input-password > .error',
      select: '.frost-bunsen-input-select > .error',
      text: '.frost-bunsen-input-text > .error',
      textarea: '.frost-bunsen-input-textarea > .error'
    },
    label: '.left-label',
    renderer: {
      boolean: '.frost-bunsen-input-boolean',
      buttonGroup: '.frost-bunsen-input-button-group',
      multiSelect: '.frost-bunsen-input-multi-select',
      number: '.frost-bunsen-input-number',
      password: '.frost-bunsen-input-password',
      propertyChooser: '.frost-bunsen-property-chooser',
      select: '.frost-bunsen-input-select',
      text: '.frost-bunsen-input-text',
      textarea: '.frost-bunsen-input-textarea'
    },
    validationErrors: {
      error: '.frost-bunsen-error',
      heading: '.frost-bunsen-validation-result h4'
    }
  },
  error: '.error',
  frost: {
    button: {
      input: {
        disabled: '.frost-button:disabled',
        enabled: '.frost-button:not(:disabled)'
      },
      size: {
        medium: 'medium',
        small: 'small'
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
      error: '.frost-select.multi.error',
      input: {
        disabled: '.frost-select.multi input.trigger:disabled',
        enabled: '.frost-select.multi input.trigger:not(:disabled)'
      }
    },
    number: {
      error: '.frost-text.error',
      input: {
        disabled: '.frost-text input[type="number"]:disabled',
        enabled: '.frost-text input[type="number"]:not(:disabled)'
      }
    },
    password: {
      error: '.frost-password.error',
      input: {
        disabled: '.frost-password input:disabled',
        enabled: '.frost-password input:not(:disabled)'
      }
    },
    select: {
      error: '.frost-select.error',
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
      },
      type: {
        date: {
          input: {
            enabled: '.frost-text input[type="date"]:not(:disabled)'
          }
        }
      }
    },
    textarea: {
      error: '.frost-textarea.error',
      input: {
        disabled: '.frost-textarea textarea:disabled',
        enabled: '.frost-textarea textarea:not(:disabled)'
      }
    }
  }
}
