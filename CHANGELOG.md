# 14.32.14 (2017-07-04)

* **Fixes** a regression in labeling that would always display labels if the model was an array. It's been modified to not display the label if the cell has a renderer for the it.


# 14.32.13 (2017-07-03)

* **Fixes** the behavior when the query dependencies for the select renderer changes


# 14.32.12 (2017-06-27)
**Fixed** issue where inputs are unfocused when items are added to an array. This was causing inputs to lose focus when `autoAdd` feature for arrays is enabled and a user started to type into an empty input.

# 14.32.11 (2017-06-23)
 * **Updated** version of `ember-frost-date-picker`


# 14.32.10 (2017-06-22)
**Fixed** removal of `_internal` properties for `onChange` handler.
**Updated** bunsen-core to fix validation for deep internal properties


# 14.32.9 (2017-06-21)

* **Fixed** an issue where view schema would have validation errors if it referenced a field that did not have its condition met.


# 14.32.8 (2017-06-21)

* **Fixes** a bug in the select renderer not displaying a label when the model enum has 0


# 14.32.7 (2017-06-21)

* **Updated** to use [bunsen-core@0.30.13](https://github.com/ciena-blueplanet/bunsen-core/pull/112)
* **Fixed** the evc example


# 14.32.6 (2017-06-20)
**Fixed** issue where tabs would jump to back to the first tab when an array is added to.


# 14.32.5 (2017-06-19)

* **Fixed** a bug with the queryForCurrentValue select option which assumed the id was at the top level of the form's value.
* **Fixed** `components/form.js` to allow extension of `classNames` rather than hard-setting it to only one class name.


# 14.32.4 (2017-06-19)
**Fixed** custom renderers in arrays as part of the `itemCell` configuration. 


# 14.32.3 (2017-06-17)
**Fixed** how BunsenModelPath handles appending string paths using dot notation. This was causing internal models to be added to the wrong spot in the bunsen model if the cell defining the internal model used dot notation.


# 14.32.2 (2017-06-14)
**Changed** model expansions and internal models to take effect in nested objects.
**Added** support for internal models within arrays.



# 14.32.1 (2017-06-09)
- added a fix to arrays per @agonza40 and updated tests to ensure the values are actually shown


# 14.32.0 (2017-06-06)
* **Added** validateOnVisibilityChange property to allow disabling of form validation after losing/regaining focus of the page
* **Fixed** select documentation formatting


# 14.31.5 (2017-06-06)

* **Fixed** support for list data overrides in the select renderer


# 14.31.4 (2017-06-04)
**Fixed** relative path resolution

# 14.31.3 (2017-06-03)
- **Fixed** issue where when you select an item in the `multi-select` dropdown then filter it only filters locally.


# 14.31.2 (2017-06-02)

* **Fixes** issue with `select-input` failing validation when spread options are provided.


# 14.31.1 (2017-05-31)
**Fixed** references to internal models in deeply nested cells.

# 14.31.0 (2017-05-31)
**Added** support for relative paths for the recordsPath select renderer option
**Fixed** bunsenId, bunsenModel, and config assignment to cells from the inline array item component. 


# 14.30.5 (2017-05-25)
* **Fixed** specifying `options` in the bunsen view for a `multi-select` renderer. The `options` were not making it all the way to the `frost-multi-select` component. 
* **Fixed** API filtering for multi-select. Previously, it was only using local filtering.


# 14.30.4 (2017-05-24)
**Fixed** how view cells are merged.

# 14.30.3 (2017-05-23)
* **Stop** importing `getOwner` from `ember-getowner-polyfill`, since it's a proper polyfill now. (Fixes [#415](https://github.com/ciena-frost/ember-frost-bunsen/issues/415))


# 14.30.2 (2017-05-23)
**Fixed** cell definition re-use. In certain situations cell definitions were being used directly instead of being copied which caused issues when trying to assign an ID to the result cell. Now cell definitions are copied instead of being used directly.


# 14.30.1 (2017-05-16)
**Update** core version to revert view generation.


# 14.30.0 (2017-05-12)

* **Added** support for array conditions in both models and views.

* **Added** view model extension support. This means you can do something like the following:

  *Model*

  ```json
  {
    "properties": {
      "lang": {
        "type": "string"
      }
    },
    "type": "object"
  }
  ```

  *View*
  ```json
  {
    "cells": [
      {
        "children": [
          {
            "id": "langGroup",
            "model": {
              "enum": [
                "Server",
                "Web"
              ],
              "type": "string"
            },
            "internal": true
          },
          {
            "conditions": [
              {
                "if": [
                  {
                    "_internal.langGroup": {"equals": "Web"}
                  }
                ]
              }
            ],
            "model": "lang",
            "renderer": {
              "data": [
                {"label": "CSS", "value": "css"},
                {"label": "HTML", "value": "html"},
                {"label": "JavaScript", "value": "js"}
              ],
              "name": "select"
            }
          },
          {
            "conditions": [
              {
                "if": [
                  {
                    "_internal.langGroup": {"equals": "Server"}
                  }
                ]
              }
            ],
            "model": "lang",
            "renderer": {
              "data": [
                {"label": "Express", "value": "express"},
                {"label": "Python", "value": "py"},
                {"label": "Ruby", "value": "rb"}
              ],
              "name": "select"
            }
          }
        ]
      }
    ],
    "type": "form",
    "version": "2.0"
  }
  ```


# 14.29.2 (2017-05-11)

* **Added** some very basic introduction and model documentation.
* **Fixed** a bug when working with a view in v1 schema.

# 14.29.1 (2017-05-10)

* **Cleaned** up code to run validation in same run loop as setting properties for optimize components a bit more.
* **Fixed** section component to properly apply class for expand/collapse icon.
* **Fixed** tests to clear out variables defined in `describe` blocks to prevent memory leaks.


# 14.29.0 (2017-05-10)

* **Added** support for new `_internal` model property which can contain any properties you don't want to propagate back to the consumer via the `onChange` callback. These can be used to drive conditional views without polluting the form value with state.
* **Fixed** `geolocation` renderer to make less set calls to tighten the Ember run loop around changes.
* **Replaced** some `didReceiveAttrs()` hooks with computed properties since Ember has deprecated the use of the `attrs` argument in the `didReceiveAttrs()` life cycle hook.


# 14.28.3 (2017-05-05)

* **Cleaned** up code by breaking into smaller functions and adding some comments/JSDoc.


# 14.28.2 (2017-05-04)

* **Updated** ember-bunsen-core dependency to fix an issue with Files being stripped from values


# 14.28.1 (2017-05-04)

* **Updated** ember-bunsen-core dependency to 0.24.3, which fixes a bug that would strip Files from values.


# 14.28.0 (2017-05-04)

* **Added** missing `return wait()` call to more tests to make sure they are async safe.
* **Replaced** some deep cloning with shallow cloning to reduce new object creation.


# 14.27.2 (2017-05-03)

* **Added** a missing destroyed checked.
* **Fixed** tests to use the `wait` helper to help prevent tests failures due to timing issues.


# 14.27.1 (2017-05-01)
* **Fixed** a bug where generateFacetView was creating facets where each group had two labels.


# 14.27.0 (2017-04-28)

* **Changed** a bunch of internal code so the `frost-bunsen-cell` component gets the `bunsenModel` for it's `bunsenId` not the parent model. This is preliminary work work a future PR to support conditionals in arrays.

# 14.26.1 (2017-04-27)

* **Fixed** styling regression.

# 14.26.0 (2017-04-24)
* **Added** check in the blueprint to avoid installing packages already installed


# 14.25.1 (2017-04-21)

* **Fixed** bug where array label wasn't showing up when `arrayOptions` is not defined.


# 14.25.0 (2017-04-20)

* **Added** support for select renderer to be driven by an array of integers/numbers/strings when using `endpoint` or simply `recordsPath` to mine the form value.


# 14.24.0 (2017-04-20)

* **Added** support for mining select lists from the form value instead of an API endpoint.


# 14.23.2 (2017-04-07)

* **Fixed** boolean renderer to put label to right of checkbox.


# 14.23.1 (2017-04-03)
**Fixed** issue where hidden renderer was unintentionally unsetting values.


# 14.23.0 (2017-03-31)
* Now supports 'width' option for select renderer


# 14.22.1 (2017-03-29)
* **Updated** travis build and gh pages publish scripts

# 14.22.0 (2017-03-29)
* **Updated** date-time renderer test helpers to be more flexible so they can be used in other tests where date-time-picker is employed
* **Updated** date-time renderer tests to use the more flexible test helpers
* **Added** New `when` renderer that allows the selection of a date based on a keyword or a date time string.
* **Updated** demo app to showcase the new `when` renderer
* **Added** documentation for the new `when` renderer
* **Added** tests for the new `when` render

# 14.21.1 (2017-03-23)

* **Fixed** addon to include `ember-symbol-observable` as a dependency instead of a devDependency.

# 14.21.0 (2017-03-22)

* **Changed** where we run gh-pages publish in hopes of fixing it.
* **Replaced** blueprints with npm dependencies.
* **Upgraded** `ember-bunsen-core` to version `0.23.1`.


# 14.20.1 (2017-03-22)

* **Fixed** build to publish dummy app to `gh-pages` branch.

# 14.20.0 (2017-03-16)

Please add a description of your change here, it will be automatically prepended to the `CHANGELOG.md` file.


# 14.19.1 (2017-03-14)
**Added** a CONTRIBUTING.md file
**Updated** ember version to 2.11.2 to address failing tests from [BUGFIX](https://github.com/emberjs/ember-mocha/issues/141)

# 14.19.0

* **Fixed** size of icon in geolocation renderer.
* **Replaced** some bower dependencies with node dependencies.
* **Updated** `ember-lodash-shim` to version `2.0.0` which shaves over 150 KB off of the production build.

# 14.18.0

* **Added** support for passthrough options (spread options). This allows new properties of downstream to be leveraged as soon as they are available, with the downside of them not being validated at the bunsen level.


# 14.17.0

* **Improved** visual styling of array items.

  *Compact Form*
  <img width="1224" alt="screen shot 2017-02-23 at 2 41 35 pm" src="https://cloud.githubusercontent.com/assets/422902/23285250/d5c93e42-f9e4-11e6-8c32-62bcbeb0141d.png">

  *Compact Form with Labels Hidden*
  <img width="1202" alt="screen shot 2017-02-23 at 1 54 01 pm" src="https://cloud.githubusercontent.com/assets/422902/23285292/173f3fb6-f9e5-11e6-8d4b-3b609435d46d.png">


  *Compact Detail*
  <img width="1078" alt="screen shot 2017-02-23 at 2 29 19 pm" src="https://cloud.githubusercontent.com/assets/422902/23285251/d7deba0e-f9e4-11e6-8312-3baacdbb61c6.png">


# 14.16.3

Modifying queryForCurrentValue to work with string IDs.

# 14.16.1

* **Fixed** bug where changing value to variable referenced in select `endpoint` wasn't causing a new API fetch to be made, to update the list.


# 14.16.0
**Added** support for view conditionals.

# 14.15.1

* **Fixed** a bug that occurred when async select filtering was updated rapidly


# 14.15.0

* **Fixed** CI configuration to *hopefully* bump version at the right time now
* **Added** support for template strings in `endpoint` version of `select` renderer. You can now specify something like this in your bunsen view:  
  ```js 
  {
    endpoint: '/api/v1/heroes',
    recordsPath: 'data',
    labelAttribute: '${name} (${secret})'
    valueAttribute: 'id'
  }
  ```

* **Fixed** a bug where `record.get('title')` was being used instead of `get(record, 'title')` which broke in the ajax use case where the `record` was a POJO and did not have `.get()` defined. 

* **Added** and **Updated** integration tests to date time renderer. 
* **Removed** some of the old tests that were not needed that were copied over from date renderer. 
* **Fixed** a bug that prevented the renderer from properly holding data.

# 14.14.2

* **Fixed** a bug causing the `onValidate()` action to fire twice in certain situations. It will now fire once for each time Bunsen calls `validate()`, regardless of whether the value is updated or there are errors.


# 14.14.1

* **Fixed** issue where remove button wasn't clickable for an array item due to other DOM sitting on top of the button.


# 14.14.0

* **Added** `ember-lodash-shim` configuration to optimize build to only include necessary `lodash` methods.
* **Updated** CI to test in Chrome as well as Firefox.


# 14.13.0

* **Replaced** a bunch of lodash calls with equivalent calls using ES6 and Ember methods.


# 14.12.0

**Added** a new feature for the renderers called DateTime. Allows a user to input a date and time input. Also created tests and added ability to view sample on the dummy server.


# 14.11.0

**Added** queryForCurrentValue option to select renderer


# 14.10.0

* **Fixed** issues with alignment of description icon in consuming apps by changing where it appears in the DOM.


# 14.9.0

* **Added** support for template strings in `select` renderers `endpoint` property.


# 14.8.3

**Fixed** a checkbox-array bug where keeping the value upon refresh was not kept in the selected property, causing the checkboxes to all be cleared upon checking any of the checkboxes after a refresh.


# 14.8.2

* Fixes an issue where `isRequired` called on a cell that referenced a conditioned model threw an exception.


# 14.8.1

**Fixed** `ember-frost-date-picker` version in blueprint.


# 14.8.0

**Added**  new `date` renderer for handling date input.


# 14.7.1

* **Fixed** bug in select when references are present.


# 14.7.0

* **Added** ability to drive select inputs via an API without using Ember Data. Instead you can do something like the following (this example lets you search a city and get a list of matching states from MapQuest's geolocation API):

  **Model**
  ```json
  {
    "properties": {
      "location": {
        "type": "string"
      },
      "results": {
        "type": "string"
      }
    },
    "type": "object"
  }
  ```

  *View*
  ```json
  {
    "properties": {
      "location": {
        "type": "string"
      },
      "results": {
        "endpoint": "http://www.mapquestapi.com/geocoding/v1/address",
        "labelAttribute": "adminArea3",
        "recordsPath": "results.0.locations",
        "query": {
          "key": "<mapquest-api-goes-here>",
          "location": "${./location}"
        },
        "type": "string",
        "valueAttribute": "linkId"
      }
    },
    "type": "object"
  }
  ```

# 14.6.0

* Refactored select renderer code to be a little easier to comprehend.


# 14.5.1

* **Fixed** arrays to stop showing add button when `maxItems` is reached.
* **Upgraded** build to use Ember 2.11.


# 14.5.0

* **Fixed** issues in codebase that were preventing it from being used with Ember 2.10. One known issue currently is that when using with Ember 2.10 the `autofocus` property for forms won't function. If using an older version of Ember the `autofocus` property will continue to work as it always has.


# 14.4.1

* **Added** more tests for the following renderers to ensure we don't have any regressions in the future around their functionality:

  * `button-group`
  * `multi-select`
  * `select`


# 14.4.0

* Cleaned up some code in preparation to get this addon working with Ember 2.10.
* **Updated** dependencies to latest versions (shims were renamed which is why is a minor and not a major). If a consumer uses the old shims instead it'll still function the same.


# 14.3.4

* **Fixed** issues with CSS for object browser filter facets.

# 14.3.3

**Changed** default checkbox size in checkbox-array renderer to small to default to UX standard
**Added** integration tests for checkbox-array renderer size


# 14.3.2

* **Removed** spacing to left of facet labels when expand/collapse handle is not present.


# 14.3.1

* **Fixed** styling of links from`link` renderer when using `url` option.


# 14.3.0

* **Added** new `image` renderer for rendering images in views.


# 14.2.2

* **Fixed** `generateFacetCell()` utility method to only include the collapsible handle for inputs that consume a lot of horizontal space. Currently the collapsible handle will be present for the following renderers:

  * `checkbox-array`
  * `geolocation`
  * `json`
  * `textarea`


# 14.2.1

* **Fixed** all `ember-prop-type` warnings to ensure API's are all being used properly.
* **Fixed** code to comply with latest ESLint rules from `eslint-config-frost-standard`.


# 14.2.0

* **Fixed** an issue where checkbox selection was carrying across checkbox-array groups
* **Fixed** checkbox-array styling, checkboxes are now in a column
* **Added** spacing between checkboxes for object-browser facets styles
* **Added** renderer.labels for overriding labels
* **Added** Style for frost-object-browser-facets for checkbox array spacing
* **Updated** `bunsen-core` to latest version.
* **Updated** `ember-bunsen-core` to latest version.

# 14.1.3

* **Added** new `onTabChange` property so consumers can be notified of changing tabs.
* **Fixed** build to work with bug fix in `ember-prop-types`.


# 14.1.2

* **Fixed** blueprints to not install `ember-browserify` and use the latest/correct versions of other dependencies.


# 14.1.1

* **Fixed** list item CSS.



# 14.1.0

BPSO-33985 be able to see the provisioning log when the Error Log link is clicked in the list view
open a specific tab in tab-nav


# 14.0.1
**Removed** problematic form element from detail view.



# 14.0.0

* **Cleaned** up a bunch of tests by replacing boilerplate with test helpers.

  > Note: These test helpers will get wired into a consumers test suite but are still considered private API. If you choose to start using them know they may change in breaking ways before the next major on this project happens.

* **Removed** `hide` and `show` icons which are no longer used. If you were using these icons in your app via something like below you'll no longer have access to them:

  ```handlebars
  {{frost-icon icon='show' pack='frost-bunsen'}}
  ```

* **Replaced** `ember-redux` with `ember-redux-shim` and `ember-redux-thunk`.

  > NOTE: When upgrading you can remove `ember-browserify` and `ember-redux` from your `package.json` if you are not using them in your app and no other addons you consume require them.


# 13.4.6

* **Fixed** `frost-bunsen-detail` and `frost-bunsen-form` components to work when passed in `validators` and `renderers` properties are `undefined`.
* **Refactored** tests to use common utility methods for setting up tests to reduce boilerplate.



# 13.4.5

* **Updated** `password` renderer to use button instead of icon for reveal action in detail views.


# 13.4.4

* **Fixed** detail views to stop applying `autoAdd` and `sortable` array options.


# 13.4.3

* **Updated** components to explicitly include `HookMixin` from `ember-hook` so integration tests no longer need to initialize `ember-hook`.


# 13.4.2

* **Updated** dependencies.
* **Updated** tests to use latest test helpers and remove deprecation warnings.



# 13.4.1

* **Fixed** bug where `geolocation` renderer wasn't working with consumer properties that didn't match internal properties.
* **Fixed** bug where `geolocation` renderer wasn't checking if it was destroyed or being destroyed before setting properties.


# 13.4.0

* **Added** new component `frost-bunsen` which is designed to be a single entry point for rendering both forms and detail views, as well as any future view types.
* **Added** [spread](https://github.com/ciena-blueplanet/ember-spread) operator to existing `frost-bunsen-detail` and `frost-bunsen-form` components.
* **Fixed** `geolocation` renderer to work when consumer latitude and/or longitude properties expect the format to be a number instead of a string.
* **Fixed** description bubble property validations to not require `description` property as it was causing undesired `ember-prop-type` warnings in the console.
* **Fixed** issue where enter key would sometimes submit form by setting `onsubmit='return false'` on the form element itself.
* **Fixed** issue where `frost-bunsen-form` and `frost-bunsen-detail` would try to update state after the component had been destroyed when getting an update from the redux store.


# 13.3.1
Fixed a bug introduced by a recursive check for required object and array properties.


# 13.3.0

* **Added** new `geolocation` renderer for improved UX around address fields.


# 13.2.3

**Updated** bunsen-core to allow for empty required objects and arrays.


# 13.2.2

* **Fixes** ugly table formatting of the `abstract-input` api docs.


# 13.2.1

* **Updates** the demo to include documentation on `abstract-input` and simple example for creating a custom renderer with validation.

# 13.2.0

* **Added** support for descriptions on input cells via `description` property.


# 13.1.0

* Bringing in input validator support from 12.x


# 13.0.0

* **Upgraded** all dependencies to the latest.



# 12.4.0

* **Added** new `json` renderer.
* **Upgraded** dependencies which includes a fix for the `ipv6-interface` format.



# 12.3.0

* **Added** new model formats: `ipv6-interface`, `ipv6-multicast`, and `ipv6-prefix`.



# 12.2.8

* **Added** missing tests for password renderer to reach full coverage of renderer.
* **Fixed** bug where sections were sometimes showing required label when they shouldn't.


# 12.2.7

* Updates `bunsen-core`


# 12.2.6

* **Updated** bunsen-core



# 12.2.5

* **Fixed** a bug in multi-select renderer that occurred when the value was set to an array the same length as the existing value

# 12.2.4

* **Fixed** link to handle incoming changes and rerender properly.



# 12.2.3

* **Fixed** a bug where conditions evaluated on the default value don't trigger the `renderModel` CP. The CP was unnecessary and removing it fixed the issue.



# 12.2.2

* **Fixed** typo that broke select filtering via API.



# 12.2.1

* **Fixed** array option `compact` to function again.


# 12.2.0

* **Added** a new feature where when a user leaves the browser window/tab with a form on it then comes back later, validation will re-fire. This will be useful for cases where validation involves API checks such as validating an email or username doesn't already exist in the backend's database.

# 12.1.1

* **Fixed** enum driven select to show selected value when filter typed into dropdown.


# 12.1.0

* **Upgraded** `ember-frost-core` to the latest version to get the redesigned `frost-select` which is much more keyboard friendly and now includes the filter text input inside the dropdown.


# 12.0.2

- Re-added class names to tab content element.



# 12.0.1

* **Fixed** bug where tabs would all become unselected when entire bunsen state changed.


# 12.0.0

## Breaking

* **Upgraded** to version `3.x` of [ember-frost-tabs](https://github.com/ciena-frost/ember-frost-tabs) which has a new API.

# 11.6.0

* **Added** `hideLabel` option to cell for hiding the auto-generated label when `model` is present.



# 11.5.4

* **Fixed** password renderer to render as readonly on a detail view.


# 11.5.3

* **Fixed** issue where duplicate headers render for array cells when they set the label or collapsible property.


# 11.5.2

* **Fixed** `link` renderer to better handle empty labels.


# 11.5.1

* **Fixed** bug with array referencing.



# 11.5.0

* **Changed** input renderers to only show required label when inputs are empty.
* **Changed** sections to only show required label when any required child inputs is empty.
* **Fixed** link input renderer to only re-render when DOM will change.
* **Fixed** link input renderer to have correct UX by having it use `frost-link` under the hood.
* **Fixed** link input renderer to prevent bubbling of click event which keeps link from functioning when used within certain components such as a `frost-list`.


# 11.4.0
* **Added**`route` and `url` options to `link` renderer.


# 11.3.5

* **Fixed** issue with duplicate section headings rendering under certain scenarios.
* **Fixed** validation bug where cell's `model` wasn't being applied to it's `children`.
* **Fixed** small visual regression with positioning of collapsible toggle handle.


# 11.3.4

* **Added** tests for static input renderer in a form.
* **Fixed** `button-group` renderer to support being unset by clicking on the selected button to deselect it.


# 11.3.3

* **Fixed** issues with collapsible toggle button swallowing enter keypresses on the form.



# 11.3.2

* Let more stuff pass through Mirage in hopes of fixing dummy app for IE.


# 11.3.1

* **Added** `includePolyfill` flag for babel in order to make demo more browser friendly.



# 11.3.0

* Improved validation errors to indicate whether errors are for model schema or view schema.



# 11.2.0

* Improved validation messages to distinguish warnings from errors.



# 11.1.3

* **Added** more tests around enum driven select to make sure it plays nice with initial values and default values.


# 11.1.2

Partially fixed problem for array of array field case.


# 11.1.1

* Automatically unregsiterForFormValueChanges when renderer is being destroyed.

# 11.1.0

* **Added** readonly version of `select` renderer which is used by `frost-bunsen-detail`.


# 11.0.3

* **Fixed** `list-utils` module to no longer assume that all query params are string values. We were blindly calling `.replace()` to swap out `$filter` if present. Now, we make sure it's actually a string before trying to replace something in it. 

# 11.0.2

* **Fixed** bug where view generator would overwrite `cellDefinitions` by not first checking if a name was already taken.
* **Fixed** validation bug where cell wasn't being validated against proper model.


# 11.0.1

* **Fixed** minor CSS issues with inputs.


# 11.0.0

* **Changed** hooks to include full bunsen ID instead of just last segment. For example given the following bunsen mode:

   ```json
    {
      "properties": {
        "foo": {
          "properties": {
            "bar": {
              "type": "string"
            }
          },
          "type": "object"
        }
      },
      "type": "object"
    }
   ```

  Previously you would target the input for `bar` via `$hook('bunsenForm-bar-input')` whereas now you'd target it with `$hook('bunsenForm-foo.bar-input')`.

* **Cleaned** up some tests by using new test helpers in `ember-frost-core`.

# 10.1.9

* Updated bunsen-core



# 10.1.8

* **Fixed** input position shifting down 3 pixels when field goes into error state.



# 10.1.7

* **Fixed** width of password and text inputs in facets.



# 10.1.6

* **Fixed** styling of empty array message.



# 10.1.5

* **Fixed** width of various input types so that they align.



# 10.1.4

* **Fixed** issue with `hasQueryChanged` returning false when form values actually differed when the old value had missing dependencies.


# 10.1.3

* **Fixed** issue where the `select` input's `query` isn't specified and we should have been looking at `modelType` to fetch from the store.


# 10.1.2

* **Fixed** `populateQuery()` to not throw error.



# 10.1.1

* **Fixed** list utility methods not to be less brittle and not throw an error when query isn't present.


# 10.1.0

* **Added** the option to specify static options for the `select` input
* **Added** the option to enable local filtering for the `select` input


# 10.0.3

* **Fixed** `isRegisteredEmberDataModel` method to work in a consuming apps tests.


# 10.0.2

* **Added** empty message to detail view array with no items.
* **Removed** add/remove buttons from detail view arrays.



# 10.0.1

* **Fixed** select inputs in dummy/demo app.



# 10.0.0

## Breaking

* **Removed** deprecated methods and properties.
* **Removed** support for `Ember` version `2.2` as [ember-frost-core](https://github.com/ciena-frost/ember-frost-core) no longer works with that version due to the introduction of [ember-elsewhere](https://github.com/ef4/ember-elsewhere).
* **Upgraded** dependencies to latest versions. Now you must add `{{frost-select-outlet}}` in your application template where you want the select drop-down to render. This is because now the dropdown renders elsewhere in the DOM using to mitigate issues with selects rendered within confined containers. For more information on this read the [documentation](http://ciena-frost.github.io/ember-frost-core/#/select).

## Non-Breaking

* **Fixed** false positive required prop-type warning regarding a property named `value` on cells which shouldn't actually be required.

# 9.6.0

* **Added** an enum driven checkbox-array renderer to provide a flat checkbox facet selection group with the ability to select multiple options.

# 9.5.3

* **Fixed** issues with required label showing up on cells under scenarios where it shouldn't.


# 9.5.2

* **Added** support for array index references in bunsen views for model property.
* **Removed** clear button from multi-select facets.



# 9.5.1

* Fixes the blueprints so it installs v0.9.1 of ember-bunsen-core



# 9.5.0

* Added change-set processing to the view cells so they only propagate the form value when it has child cells that need updating.


# 9.4.0

* **Added** clear button to facets.


# 9.3.2

* **Fixed** bug introduced by latest `bunsen-core` update.



# 9.3.1

* **Fixed** bug where array items wouldn't render if they had the `compact` array option enabled.
* **Upgraded** dependencies to latest versions.

# 9.3.0

## Additional Features
* **Added** a new *optional* `onError` property to `frost-bunsen-form` and `frost-bunsen-detail` The `onError` callback will be called whenever an API error occurs in the select renderer, or whenever a custom renderer invokes their own `onError` callback. 
This passes out errors that might occur when the select renderer queries for options

## Deprecations
 * **Deprecated** the `onChange` action in `AbstractInput` in favor of one named `handleChange`
 * **Deprecated** the `onFocusIn` action in `AbstractInput` in favor of one named `hideErrorMessage`
 * **Deprecated** the `onFocusOut` action in `AbstractInput` in favor of one named `showErrorMessage`

# 9.2.4

* **Fixed** issue where first item added to an object array wasn't getting defaults applied.


# 9.2.3

* **Fixed** bug where `bunsenView` was being mutated by the codebase and causing labels to disappear from tabs when used in an [ember-frost-modal](https://github.com/ciena-frost/ember-frost-modal) that was closed and re-opened.



# 9.2.2

* **Fixed** bug to allow more than one bunsen instance with tabs on the page.



# 9.2.1

* **Fixed** serialization of Ember Data objects to keep `id` in object so it can be referenced in a bunsen model.



# 9.2.0

* **Added** new test helpers: `expectBunsenInputNotToHaveError()`, `expectBunsenInputToHaveError()`, and `fillInBunsenInput()`.


# 9.1.0
* Detail and form tab content areas will now have css classes based on their button label.



# 9.0.0

## Breaking changes
 * **Stopped** automatically creating `p=label:foo` query param in select-renderer when user types `foo` This was useful for a particular API we were interfacing with early on, but never should have been in the open-source version of this component.

## Non-breaking changes
 * **Added** support for defining `$filter` in your definition of `query` within the bunsen model for a `select` input, which lets you specify what the query looks like to do text matching in query-driven select renderers. 
 * **Added** a new `eslint` rule in `tests/.eslintrc` to stop us using `expect(foo).to.be.true` or other dangling property matchers from `chai` b/c they are dangerous. For more information about why that is, ask @job13er. 


# 8.0.0

## Breaking changes
 * **Removed** - `bunsenStore` from properties passed to a custom renderer. Some of the properties that used to be provided in `bunsenStore` are not provided individually (see below)
 * **Added** - `bunsenView` to properties passed to a custom renderer
 * **Added** - `formDisabled` to properties passed to a custom renderer
 * **Added** - `showAllErrors` to properties passed to a custom renderer
 * **Added** - `registerForFormValueChanges` to properties passed to a custom renderer, if a custom renderer wants to know about changes to `formValue` it must now call the passed in `registerForFormValueChanges` inside `init()` and pass itself into said function `this.registerForFormValueChanges(this)`, the custom renderer must also provide a `formValueChanged` function on the component which will be called by the parent `frost-bunsen-form` or `frost-bunsen-detail` component whenever the `formValue` changes. The only parameter to the `formValueChanged` function is the new `formValue`. 

## Non-breaking changes
 * **Added** ability for the demo app to store currently selected view/model/value in the URL
 * **Added** the `hidden` renderer which allows setting a value in the form without displaying anything to the user. The value can come from the `default` in the bunsen model, or be copied from the value of some other portion of the `formValue` via the `valueRef` property. For instance ,if I want the `label` attribute to be set to what the user entered in `name`, I could specify a `valueRef` of `name`. The `valueRef` is the dotted path from the root of `formValue` to where the value should come from (not relative to the value being set). 

# 7.3.1

 * **Replaced** `ember-cli-blanket` with `ember-cli-code-coverage` (the `addon-spike` branch since it hasn't been merged yet). 


# 7.3.0

* **Added** ability to specific select options in view instead of model.


# 7.2.5

* Fixing CSS class `one-third`.


# 7.2.4

* Consuming latest `ember-frost-fields` because the previous version was overriding the default application template in consuming apps.



# 7.2.3

* Consuming latest `ember-frost-fields` because the previous version was overriding the default application template in consuming apps.



# 7.2.2

* **Fixed** bug where under certain scenarios parent view cells were showing as required when they shouldn't have been.


# 7.2.1

* Cleaned up dependencies and almost got functioning with Ember version `2.1`. There are still two failing tests when run against Ember `2.1`.


# 7.2.0

* **Fixed** addon so it works with older versions of Ember all the way back to Ember `2.2`. Note: this means consumers now need `ember-getowner-polyfill` which they will get if they rerun the blueprints upon updating.


# 7.1.1

* **Fixed** bug where certain view schemas would render with a duplicate section heading. See issue #165 for more.


# 7.1.0

* **Added** the following utility methods for easily generating bunsen views for [ember-frost-object-browser](https://github.com/ciena-frost/ember-frost-object-browser) facets: `generateFacetCell`, `generateFacetView`, and `generateLabelFromModel`.

# 7.0.0

## Breaking

* **Moved** non-Ember specific code to [bunsen-core](https://github.com/ciena-blueplanet/bunsen-core) and started consuming via [ember-bunsen-core](https://github.com/ciena-blueplanet/ember-bunsen-core).
* **Removed** following properties from `frost-bunsen-form` component: `cancelLabel`, `inline`, `onCancel`, `onSubmit`, and `submitLabel`.
* **Removed** `z-schema` bower dependency in favor of using [ember-z-schema](https://github.com/ciena-blueplanet/ember-z-schema).
* **Removed** `frost-bunsen-container`, `frost-bunsen-model-container`, and `frost-bunsen-row` components as they are no longer necessary to support schema.
* **Updated** CSS to no longer provide `.inline` and `.not-inline` classes for forms and just made previous `.inline` styles the default without the extra `.inline` class name.
* **Updated** dependencies to latest versions.
* **Updated** internal components to work with view schema version 2.
* **Updated** internal store to use immutable for the forms value. See [seamless-immutable](https://github.com/rtfeldman/seamless-immutable) for more.
* Simplified the DOM being rendered by the components to reduce the DOM footprint and make the styles less complex.

## Non-Breaking

* **Added** a new `url` renderer.
* **Added** a ton of integration tests to help prevent any future regressions.
* **Fixed** `button-group` renderer to support disabled state.
* **Fixed** CI build for `EMBER_TRY_SCENARIO=ember-beta`.
* **Fixed** false positive `ember-prop-type` warnings by using [hasRegistration()](http://emberjs.com/api/classes/RegistryProxyMixin.html#method_hasRegistration) instead of [lookup()](https://guides.emberjs.com/v2.6.0/applications/dependency-injection/#toc_factory-instance-lookups).
* **Fixed** `multi-select` renderer documentation to provide working example.
* **Fixed** array add and remove buttons to become disabled when appropriate.
* **Fixed** issue with changing model not revalidating.
* **Fixed** array `autoAdd` feature to work with non-object arrays.
* **Fixed** `property-chooser` and `multi-select` renderers to implement `placeholder` view property.
* **Fixed** `property-chooser` to properly implement `label` property.
* Drastically improved demo.

# 6.6.13
 * **Fixed** issue where `onValidation` was only called if validation result changed. It is now called whenever the value of the form changes. This fix requires a bit of explanation. If consumers want to use a `frost-bunsen-form` to update a remote resource whenever something changes (i.e. no `Submit` button), due to the async aspect of validation, one is forced to use `onValidation` to trigger a save of the last observed value from an `onChange` call. However, if the previous value was  valid, no subsequent `onValidation` was previously made when a new value was delivered with `onChange`. This effectively meant that the only way a user could actually update the remote resource would be to first enter an invalid value, then a valid one. Not exactly the best user experience, especially in the case of free text fields where no validation exists ;)

# 6.6.12
No CHANGELOG section found in Pull Request description.
Use a `# CHANGELOG` section in your Pull Request description to auto-populate the `CHANGELOG.md`

# 6.6.11

* **Fixed** bugs coming from select input.

# 6.6.10
No CHANGELOG section found in Pull Request description.
Use a `# CHANGELOG` section in your Pull Request description to auto-populate the `CHANGELOG.md`

# 6.6.9

* **Upgraded** from `lodash` 3.x to 4.x while maintaining functionality against 3.x so consumers aren't forced to upgrade.

# 6.6.8

* Addressed more things blocking the upgrade to lodash 4.

# 6.6.7

* **Replace** more `_.pluck()` with `_.map()`.

# 6.6.6

* **Replaced** `_.pluck()` with `_.map()` in preparation for lodash 4.

# 6.6.5

* I did performance enhancement for select-input component
* I have modified 'didrecieveAttrs' & 'hasQueryChanged' method for select-input component 
* I improved performance by 50% depending on length of bunsen form

# 6.6.4

**fixes** Fixes false validation warnings on the model due to dirty `value`

# 6.6.3

* **Fixed** Ensures an initial value is set in `reduxStore` and resolves an issue where conditions weren't being properly evaluated in the `INIT` state.

# 6.6.2

* **Updated** countries select input in wedding application demo to be filterable.

# 6.6.1 (July 11, 2016)

* **Fixed** code to use `Ember.RSVP` instead of native `Promise`'s to make the Ember run loop aware. This fixes failing acceptance tests in a consuming application.

# 6.6.0 (July 7, 2016)

* Made it so the `select` renderer is automatically used when you specify the `enum` or `modelType` property for a model attribute.

# 6.5.0 (July 7, 2016)

* **Added** new `textarea` renderer than wraps the `frost-textarea` component from `ember-frost-core`.

# 6.4.1 (July 1, 2016)

* **Added** `ember-disable-prototype-extensions` to ensure code works with prototype extensions disabled.
* **Fixed** some of the annoying propType warnings.

# 6.4.0 (June 28, 2016)

* **Added** support for `integer` JSON Schema type.

* **Added** the following custom formats:

  * `bgp-as` - Border gateway protocol (BGP) autonomous system (AS)
  * `date` - date
  * `hex-string` - hexadecimal strings (ie. *2a:3b*)
  * `int8` - signed 8-bit integers
  * `int16` - signed 16-bit integers
  * `int32` - signed 32-bit integers
  * `int64` - signed 64-bit integers
  * `ipv4-address` - IPv4 address (ie. *127.0.0.1*)
  * `ipv4-interface` - IPv4 interface
  * `ipv4-prefix` - IPv4 Prefix (ie. *192.168.0.0/16*)
  * `netmask` - netmask
  * `port-number` - port
  * `time` - time
  * `uint8` - unsigned 8-bit integers
  * `uint16` - unsigned 16-bit integers
  * `uint32` - unsigned 32-bit integers
  * `url` - Uniform resource locator (URL)
  * `vlan-id` - VLAN identification number

# 6.3.2 (June 28, 2016)

* **Fixed** `evaluate()` to no longer choke when called with `undefined` or `null`, it just returns them as-is now.

# 6.3.1 (June 27, 2016)

No CHANGELOG section found in Pull Request description.
Use a `# CHANGELOG` section in your Pull Request description to auto-populate the `CHANGELOG.md`

# 6.3.0 (June 22, 2016)

* **Added** ability to define `conditions` within a `definitions` block of a bunsen model
* **Fixed** integration tests for `addon/components/select-input.js`

# 6.2.0 (June 14, 2016)

* **Added** new `password` renderer and deprecated using the `string` renderer for passwords.

# 6.1.1 (June 10, 2016)

* Downgraded `ember-cli` version back to `2.5.1` as `2.6.0` appears to be breaking the build.

# 6.1.0 (June 7, 2016)

* **Added** `autofocus` property to `frost-bunsen-form` to give consumer ability to determine whether or not first input should get focus on form load.
* **Fixed** `frost-bunsen-form` documentation to include `disabled` property.
* **Updated** wedding application example in demo to make countries select searchable/filterable.

# 6.0.3 (May 26, 2016)

* **Fixed** issue where `onChange()` was being called even when the form value wasn't changing.
* **Fixed** issue where `onValidation()` was being called when the form error state wasn't changing.
* **Fixed** issue where form was getting in a never ending update loop causing UI to come to a crawl.

# 6.0.2 (May 26, 2016)

* **Added** support for nested arrays.
* **Fixed** issue with cells not always getting sub model correctly, causing nested content to not render as expected.

# 6.0.1 (May 25, 2016)

* **Fixed** API reference in `README`.

* **Fixed** bug when trying to create view cells for properties off of array items such as:

   ```json
  {
    "model": "foo.bar.0.baz"
  }
   ```

# 6.0.0 (May 24, 2016)

## Breaking

* **Renamed** `model` property to `bunsenModel`.

* **Renamed** `store` property to `bunsenStore`.

* **Renamed** `view` property to `bunsenView`.

* **Upgraded** `ember-prop-types` to version `2.0.0`.

  > `oneOf` changed to `oneOfType` to better align with the React `propTypes` API.

## Non-Breaking

* **Added** `unit: true` to all unit tests to remove warnings from the test console.
* **Fixed** bug with `subModel` in cell component and uncommented four previously failing tests related to this bug.
* **Removed** all uses of `setTimeout` and `Ember.run` in the tests to make them run more efficiently.
* **Removed** old `TODO` comments that were no longer relevant.

# 5.14.1 (May 24, 2016)

* **Added** a bunch of unit tests around the cell container component.
* **Added** linting of Markdown and SASS to improve quality of styles and documentation.
* **Added** missing `@readOnly` decorators to properties with `TODO` comments.
* **Fixed** a bug when referencing an array item in a view from a container that is relative to a parent containers model.
* **Fixed** a bug when with regex pattern treating model properties with numbers in them as array items.

# 5.14.0 (May 24, 2016)

* **Added** ability to have view containers for specific items in an array. Below is an example:

  *Model*

  ```json
  {
    "properties": {
      "people": {
        "items": {
          "properties": {
            "age": {"type": "number"},
            "name": {
              "properties": {
                "first": {"type": "string"},
                "last": {"type": "string"}
              },
              "type": "object"
            }
          },
          "type": "object"
        },
        "type": "array"
      }
    },
    "type": "object"
  }
  ```

  *View*

  ```json
  {
    "version": "1.0",
    "type": "form",
    "rootContainers": [
      {
        "label": "Main",
        "container": "main"
      }
    ],
    "containers": [
      {
        "id": "main",
        "rows": [
          [
            {
              "item": {
                "label": "Plaintiff",
                "container": "person"
              },
              "model": "people.0"
            },
            {
              "item": {
                "label": "Defendant",
                "container": "person"
              },
              "model": "people.1"
            }
          ]
        ]
      },
      {
        "id": "person",
        "rows": [
          [{"model": "name.first"}],
          [{"model": "name.last"}],
          [{"model": "age"}]
        ]
      }
    ]
  }
   ```

# 5.13.2 (May 22, 2016)

* **Fixed** select inputs from fetching when query hasn't changed.

# 5.13.1 (May 21, 2016)

* **Fixed** issue where detail view was causing errors by attempting to render invalid schemas.

# 5.13.0 (May 20, 2016)

* **Added** new property `disabled` for disabling entire form when set to `true`.

# 5.12.3 (May 17, 2016)

* **Fixed** formatting of *CHANGELOG*
* **Added** `showAllErrors` to *README* documentation of `frost-bunsen-form` component API.

# 5.12.2 (May 17, 2016)

* **Fixed** `disabled` computed property for select input so that it recomputes whenever any dependent properties change.

# 5.12.1 (May 17, 2016)

* **Fixed** issue with error state of select inputs as `error` class wasn't being passed to the underlying select component.

# 5.12.0 (May 16, 2016)

* **Fixed** select inputs to be disabled when their query depends on values of other form fields that have yet to be filled out.

# 5.11 (May 13, 2016)

* **Added** support for object transforms in view JSON. This is to be used by the select component which allows the following variables in it's template string:

  * `id` – the ID of the form field
  * `index` – the index of the selected item
  * `label` – the label for the selected item
  * `value` – the value of the selected item

  Below is an example:

  ```json
  {
    "model": "languages",
    "renderer": "select",
    "writeTransforms": [
      {
        "object": {
          "bar": "this is a string literal",
          "foo": "this includes template variables: ${id} ${value}"
        }
      }
    ]
  }
  ```

# 5.10 (May 13, 2016)

* **Added** support for string transforms in view JSON (both literal and regular expression based). You can add `readTransforms` to mutate the value before it reaches the UI as well as `writeTransforms` to mutate the value going back up to the forms `onChange` event. Below is an example that keeps wordy programming languages in the store while presenting abbreviations in the UI:

  ```json
  {
    "model": "language",
    "readTransforms": [
      {
        "from": "javascript",
        "to": "js"
      },
      {
        "from": "syntactically awesome style sheets",
        "to": "sass"
      }
    ],
    "writeTransforms": [
      {
        "from": "js",
        "to": "javascript"
      },
      {
        "from": "s(a|c)ss",
        "regex": true,
        "to": "syntactically awesome style sheets"
      }
    ]
  }
  ```

# 5.9 (May 09, 2016)

* **Added** support for multiple `rootContainer`'s in views. If you specify more than one `rootContainer` then the UI will render tabs for the root containers and show the first tab on load.

# 5.8 (May 06, 2016)

* **Added** new property `showAllErrors` to `frost-bunsen-form` component that when true informs bunsen to show all error messages even before there is user interaction. This property defaults to `false` making it backwards compatible.
* **Added** new property `isRequiredError` to required errors returned by the `onValidation` action/property with the value `true` to distinguish which error messages are for missing required fields and which ones are for other errors (i.e. does not meet a length requirement).

# 5.7 (May 03, 2016)

# 5.6 (May 02, 2016)

* **Added** ability to hide labels for individual array items. You can hide these labels via the `showLabel` property in your view for the array container.

  ```json
  …
  {
    "model": "addresses",
    "item": {
      "container": "address",
      "showLabel": false
    }
  }
  …
  ```

* **Added** ability to render array items in a compact mode where input(s) are rendered on same line as remove button (as well as sort icon when `sortable` is enabled). To enable the compact mode simply use the `compact` property in your view for the array container.

  ```json
  …
  {
    "model": "addresses",
    "item": {
      "compact": true,
      "container": "address"
    }
  }
  …
  ```

# 5.5 (May 02, 2016)

* **Added** new `button-group` renderer. To learn more about it go to the [demo](http://ciena-frost.github.io/ember-frost-bunsen/#/renderers) and select `button-group` from the select.

# 5.4 (April 28, 2016)

* **Added** ability to override built-in renderers by overriding the following renderer keys in the `renderers` property/mapping: `boolean`, `number`, `string`.
* **Added** ability to specify the name of an Ember component as the value of the `renderer` property in your view without having to add it to the `renderers` property/mapping.
* **Fixed** select inputs to only show error messages after blur.

# 5.3 (April 27, 2016)

* **Fixed** Clean out null values from initial values when getting set for the first time.

# 5.2 (April 26, 2016)

* **Added** support for sortable arrays. You can use this feature by adding `sortable` in your view for the array item container.

  ```json
  …
  {
    "model": "addresses",
    "item": {
      "container": "address",
      "sortable": true
    }
  }
  …
  ```

# 5.1 (April 25, 2016)

* **Added** support for arrays that automatically add an empty item to the end of the list instead of using the `Add Item` button. You can use this feature by adding `autoAdd` in your view for the array item container.

  ```json
  …
  {
    "model": "addresses",
    "item": {
      "autoAdd": true,
      "container": "address"
    }
  }
  …
  ```

# 5.0 (April 18, 2016)

## Breaking

* **Removed** support for `PascalCaseCustomRenderers` in view schema definitions

* **Added** support for `kebab-case-custom-renderers` in view schema definitions
  This was done mainly to accommodate a terser DSL in view schemas for built-in
  renderers such as `select` which was added in this version. The goal is to have
  simple built-in renderers be targeted with easy names like `select`, etc. True custom renderers
  (created in consuming code) can still be addressed either way (based on how the
  consuming code constructs the custom renderers hash), but the kebab-case is encouraged.

## Non-Breaking

* **Added** support for built-in select drop-downs, using `frost-select` from `ember-frost-core`.
  Where options are a fixed list (enum), then the options are pulled from the enum definition
  in the Bunsen model JSON Schema for the rendered attribute, like so:

  ***Model Schema***

  ```json
  ...
  "someProperty": {
    "type": "string",
    "enum": [
      "foo",
      "bar",
      "fizz",
      "buzz"
    ]
  }
  ...
  ```

  ***View Schema***

  ```json
  ...
  {
    "model": "someProperty",
    "renderer": "select"
  }
  ...
  ```

  Where options are based on an API call, arguments to an `Ember.store.query` call
  (the ember-data model type and queryParam definition) can be specified like so:

  ***Model Schema***

  ```json
  ...
  "someProperty": {
    "modelType": "resources",
    "labelAttribute": "label",
    "valueAttribute": "value",
    "query": {
      "resourceTypeId": "someResourceTypeId",
      "q": "domainId:someDomainId"
    }
  }
  ...
  ```

  ***View Schema***

  ```json
  ...
  {
    "model": "someProperty",
    "renderer": "select"
  }
  ...
  ```

  In this example, to populate this dropdown, the schema instructs ember-data to query the store for
  "resources", and to use the "query" object to generate it's query string for the call,
  i.e., `?resourceTypeId=someResourceTypeId&q=domainId:someDomainId`

  As well, where the value to populate a query should come from the in-flight form value itself, variables can
  be inserted into the query specification, using either absolute or relative-style JSON paths:

  ***Model Schema***

  ```json
  ...
  "resourceTypeId": {
    "type": "string"
  }
  "parentProperty": {
    "type": "object",
    "properties": {
      "childProperty": {
        "type": "string",
        "modelType": "resources",
        "query": {
          "resourceTypeId": "${resourceTypeId}",
          "q": "domainId:${../someSiblingPropertyOfParent}"
        }
      }
    }
  },
  "someSiblingPropertyOfParent": {
    "type": "string"
  }
  ...
  ```

  The above example would get the value for ``${resourceTypeId}`` from the current form's `formValue.resourceTypeId`.
  The value for `${../someDomainId}` would come from `formValue.someSiblingPropertyOfParent`.  This is useful when you need
  the asynchronous query for one value to be informed by another chosen value.

# 4.1 (April 11, 2016)

* **Added** default `onChange` action to `AbstractInput` to reduce code required by consumers.
  Instead of a custom renderer having to define its own `onChange` action it can now just implement
  a function named `parseValue` that takes in the argument `value` as a `string` and returns this
  value parsed in whatever format is desired by the custom component. For example the `NumberInput`
  implements this function like so:

  ```javascript
  parseValue (value) {
    return parseFloat(value)
  }
  ```

# 4.0 (April 11, 2016)

## Breaking

* **Removed** `initialValue` from `ember-frost-form` component.

* **Added** `value` to `ember-frost-form` component. Now you can provide an initial value to the form
  by setting `value` instead of `initialValue`. This property is different in the fact that it aims
  to allow the consumer to maintain the value state instead of `ember-frost-bunsen` maintaining it
  for you. If this property is omitted `ember-frost-bunsen` will continue to manage the state as it
  had done previously.

* **Changed** input mixin into a component which changes custom renderers from:

  ```javascript
  import {InputMixin} from 'ember-frost-bunsen'

  export default Ember.Component.extend(InputMixin, {
    // Custom renderer logic goes here…
  })
  ```

  to

  ```javascript
  import {AbstractInput} from 'ember-frost-bunsen'

  export default AbstractInput.extend({
    // Custom renderer logic goes here…
  })
  ```

* **Changed** `onChange({id, value})` is now `onChange(id, value)` in custom renderers.

* **Removed** `valid` from validation results object so it now contains just `errors` and `warnings`.
  In order to check if it is valid you can simply check `errors.length`.

* **Removed** `state` from input component. Previously custom renderers would often maintain
  the value on `state.value` but in order to continue doing so they must initialize `state` in their
  `init` function like so:

  ```javascript
  init () {
    this._super(...arguments)
    this.set('state', Ember.Object.create({
      value: this.get('value')
    }))
  }
  ```

## Non-Breaking

* Convert internal state management to a Redux store for better maintainability.
* Reorganized code base to be leaner and allow consumers to override the templates.
* Added a few more tests.

# 3.0 (March 30, 2016)

## Breaking

* Start consuming [ember-frost-core](https://github.com/ciena-frost/ember-frost-core) instead of:

  * [ember-frost-button](https://github.com/ciena-frost/ember-frost-button)
  * [ember-frost-checkbox](https://github.com/ciena-frost/ember-frost-checkbox)
  * [ember-frost-css-core](https://github.com/ciena-frost/ember-frost-css-core)
  * [ember-frost-icons](https://github.com/ciena-frost/ember-frost-icons)
  * [ember-frost-select](https://github.com/ciena-frost/ember-frost-select)
  * [ember-frost-text](https://github.com/ciena-frost/ember-frost-text)
  * [ember-frost-theme](https://github.com/ciena-frost/ember-frost-theme)

* **Changed** action properties from kebab-case (`on-change`) to camelCase (`onChange`)

# 2.0 (March 09, 2016)

## Breaking

* **Changed** action properties from camelCase (`onChange`) to kebab-case (`on-change`)

## Non-Breaking

* Consume [ember-prop-types](https://github.com/ciena-blueplanet/ember-prop-types) for property validation instead of having own implementation.
