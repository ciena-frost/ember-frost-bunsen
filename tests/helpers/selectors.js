export default {
  bunsen: {
    array: {
      emptyMsg: '.frost-bunsen-array-container > .frost-bunsen-empty-msg',
      sort: {
        handle: '.frost-bunsen-handle'
      }
    },
    collapsible: {
      handle: '.frost-icon-frost-expand-collapse'
    },
    label: '.frost-bunsen-left-label',
    renderer: {
      boolean: '.frost-bunsen-input-boolean',
      buttonGroup: '.frost-bunsen-input-button-group',
      checkboxArray: '.frost-bunsen-input-checkbox-array',
      link: '.frost-bunsen-input-link',
      multiSelect: '.frost-bunsen-input-multi-select',
      number: '.frost-bunsen-input-number',
      password: {
        input: '.frost-bunsen-input-password',
        reveal: '.frost-bunsen-input-password-reveal',
        text: '.frost-bunsen-input-password-text'
      },
      propertyChooser: '.frost-bunsen-input-property-chooser',
      select: {
        arrow: '.frost-bunsen-input-select .down-arrow',
        input: '.frost-bunsen-input-select',
        items: '.frost-select-dropdown li'
      },
      static: '.frost-bunsen-input-static',
      text: '.frost-bunsen-input-text',
      textarea: '.frost-bunsen-input-textarea',
      url: '.frost-bunsen-input-url'
    },
    section: {
      clearableButton: '.frost-bunsen-heading h3 + button',
      heading: '.frost-bunsen-heading h3',
      required: '.frost-bunsen-heading .frost-bunsen-required'
    },
    validationErrors: {
      error: '.frost-bunsen-error',
      heading: '.frost-bunsen-validation-result h4'
    },
    value: '.frost-bunsen-left-input'
  },
  error: '.frost-bunsen-error',
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
        checked: '.frost-checkbox input[type="checkbox"]:checked',
        disabled: '.frost-checkbox input[type="checkbox"]:disabled',
        enabled: '.frost-checkbox input[type="checkbox"]:not(:disabled)'
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
      input: {
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
      input: {
        disabled: '.frost-textarea textarea:disabled',
        enabled: '.frost-textarea textarea:not(:disabled)'
      }
    },
    url: {
      input: {
        disabled: '.frost-url-input input:disabled',
        enabled: '.frost-url-input input:not(:disabled)'
      }
    }
  }
}
