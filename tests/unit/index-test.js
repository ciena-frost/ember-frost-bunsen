import {expect} from 'chai'
import {describe, it} from 'mocha'

import {
  AbstractInput as _AbstractInput,
  ArrayContainer as _ArrayContainer,
  ArrayInlineItem as _ArrayInlineItem,
  ArrayTabContent as _ArrayTabContent,
  ArrayTabNav as _ArrayTabNav,
  BooleanInput as _BooleanInput,
  ButtonGroupInput as _ButtonGroupInput,
  Cell as _Cell,
  Detail as _Detail,
  Error as _Error,
  Form as _Form,
  InputWrapper as _InputWrapper,
  ModelContainer as _ModelContainer,
  MultiSelectInput as _MultiSelectInput,
  NumberInput as _NumberInput,
  PasswordInput as _PasswordInput,
  PropertyChooser as _PropertyChooser,
  Section as _Section,
  SelectInput as _SelectInput,
  StaticInput as _StaticInput,
  TextInput as _TextInput,
  TextareaInput as _TextareaInput,
  ValidationResult as _ValidationResult
} from 'ember-frost-bunsen'

import {default as AbstractInput} from 'ember-frost-bunsen/components/abstract-input'
import {default as ArrayContainer} from 'ember-frost-bunsen/components/array-container'
import {default as ArrayInlineItem} from 'ember-frost-bunsen/components/array-inline-item'
import {default as ArrayTabContent} from 'ember-frost-bunsen/components/array-tab-content'
import {default as ArrayTabNav} from 'ember-frost-bunsen/components/array-tab-nav'
import {default as BooleanInput} from 'ember-frost-bunsen/components/boolean-input'
import {default as ButtonGroupInput} from 'ember-frost-bunsen/components/button-group-input'
import {default as Cell} from 'ember-frost-bunsen/components/cell'
import {default as Detail} from 'ember-frost-bunsen/components/detail'
import {default as Error} from 'ember-frost-bunsen/components/error'
import {default as Form} from 'ember-frost-bunsen/components/form'
import {default as InputWrapper} from 'ember-frost-bunsen/components/input-wrapper'
import {default as ModelContainer} from 'ember-frost-bunsen/components/model-container'
import {default as MultiSelectInput} from 'ember-frost-bunsen/components/multi-select-input'
import {default as NumberInput} from 'ember-frost-bunsen/components/number-input'
import {default as PasswordInput} from 'ember-frost-bunsen/components/password-input'
import {default as PropertyChooser} from 'ember-frost-bunsen/components/property-chooser'
import {default as Section} from 'ember-frost-bunsen/components/section'
import {default as SelectInput} from 'ember-frost-bunsen/components/select-input'
import {default as StaticInput} from 'ember-frost-bunsen/components/static-input'
import {default as TextInput} from 'ember-frost-bunsen/components/text-input'
import {default as TextareaInput} from 'ember-frost-bunsen/components/textarea-input'
import {default as ValidationResult} from 'ember-frost-bunsen/components/validation-result'

describe('Unit: ember-frost-bunsen', function () {
  it('imports AbstractInput', function () {
    expect(AbstractInput).to.equal(_AbstractInput)
  })

  it('imports ArrayContainer', function () {
    expect(ArrayContainer).to.equal(_ArrayContainer)
  })

  it('imports ArrayInlineItem', function () {
    expect(ArrayInlineItem).to.equal(_ArrayInlineItem)
  })

  it('imports ArrayTabContent', function () {
    expect(ArrayTabContent).to.equal(_ArrayTabContent)
  })

  it('imports ArrayTabNav', function () {
    expect(ArrayTabNav).to.equal(_ArrayTabNav)
  })

  it('imports BooleanInput', function () {
    expect(BooleanInput).to.equal(_BooleanInput)
  })

  it('imports ButtonGroupInput', function () {
    expect(ButtonGroupInput).to.equal(_ButtonGroupInput)
  })

  it('imports Cell', function () {
    expect(Cell).to.equal(_Cell)
  })

  it('exports Detail', function () {
    expect(Detail).to.equal(_Detail)
  })

  it('exports Error', function () {
    expect(Error).to.equal(_Error)
  })

  it('exports Form', function () {
    expect(Form).to.equal(_Form)
  })

  it('exports InputWrapper', function () {
    expect(InputWrapper).to.equal(_InputWrapper)
  })

  it('exports ModelContainer', function () {
    expect(ModelContainer).to.equal(_ModelContainer)
  })

  it('exports MultiSelectInput', function () {
    expect(MultiSelectInput).to.equal(_MultiSelectInput)
  })

  it('exports NumberInput', function () {
    expect(NumberInput).to.equal(_NumberInput)
  })

  it('exports PasswordInput', function () {
    expect(PasswordInput).to.equal(_PasswordInput)
  })

  it('exports PropertyChooser', function () {
    expect(PropertyChooser).to.equal(_PropertyChooser)
  })

  it('exports Section', function () {
    expect(Section).to.equal(_Section)
  })

  it('exports SelectInput', function () {
    expect(SelectInput).to.equal(_SelectInput)
  })

  it('exports StaticInput', function () {
    expect(StaticInput).to.equal(_StaticInput)
  })

  it('exports TextInput', function () {
    expect(TextInput).to.equal(_TextInput)
  })

  it('exports TextareaInput', function () {
    expect(TextareaInput).to.equal(_TextareaInput)
  })

  it('exports ValidationResult', function () {
    expect(ValidationResult).to.equal(_ValidationResult)
  })
})
