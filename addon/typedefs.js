/**
 * @typedef {Object} BunsenCell
 *
 * NOTE: One of container or model is required
 *
 * @property {String} [className] - a CSS class (or space-separated classes) to apply to the cell
 * @property {String} [container] - reference to the ID of a container defined in the containers array
 * @property {String} [model] - reference to the ID of a model defined in the ModelSet (use dot notation for children)
 */

/**
 * @typedef {Object} BunsenChangeEvent
 * @property {String} id - the ID for the element that changed
 * @property {*} value - the value that changed
 */

/**
 * @typedef {Object} BunsenContainer
 * @property {String} [className] - a CSS class (or space-separated classes) to apply to the container
 * @property {Boolean} [collapsible=false] - whether or not container should be collapsible
 * @property {String} [defaultClassName] - a CSS class (or space-separated classes) to apply to all cells
 * @property {String} id - the unique ID for the container, used to generate a BunsenContainerSet
 * @property {String} [instructions] - instructions for container
 * @property {BunsenRow[]} rows - the rows in the container
 */

/**
 * @typedef BunsenContainerSet
 * A key-value pair of ID => BunsenContainer
 */

/**
 * @typedef {Object} BunsenDereferenceResult
 * The result of dereferencing a schema
 * @property {BunsenValidationError[]} errors - the list of errors encountered during dereferencing
 * @property {String[]} refs - the list of references which were encountered/processed
 * @property {Object} schema - the dereferenced schema
 */

/**
 * @typedef {Object} BunsenModel
 * JSON Schema defining the model (JSON schema)
 *
 * http://spacetelescope.github.io/understanding-json-schema/reference/generic.html
 * http://spacetelescope.github.io/understanding-json-schema/reference/type.html
 *
 * @property {*} [default] - the default value for this field
 * @property {String} [description] - kinda like a comment, meant for the human reader of the schema/model
 * @property {*[]} [enum] - array of possible values that are valid
 * @property {BunsenModelSet} [properties] - sub-model info for 'object' type models
 * @property {String} title - user-presented label for the model
 * @property {String} type - the type of model ['string', 'object', 'array']
 *
 * The following properties are only supported when the type is 'string'
 * @property {Number} [minLength] - the minimum length of the string
 * @property {Number} [maxLength] - the maximum length of the string
 * @property {String} [pattern] - a regular expression that the string value must match
 */

/**
 * @typedef BunsenModelSet
 * A key-value pair of ID => BunsenModel
 */

/**
 * @typedef {Object} BunsenRootContainer
 * @property {String} container - reference to the ID of a container defined in the containers array
 * @property {String} label - the user visible label for this root view (displayed as tab name if more than one)
 */

/**
 * @typedef {BunsenCell[]} BunsenRow
 * An array of cells makes up a row
 */

/**
 * @typedef {Object} BunsenValidationError
 * @property {String} path - the dotted path to the attribute where the error occurred
 * @property {String} message - the error message
 */

/**
 * @typedef BunsenValidationResult
 * @property {BunsenValidationError[]} errors - the errors (if any)
 * @property {BunsenValidationWarning[]} warnings - the warnings (if any)
 */

/**
 * @typedef BunsenValidationWarning
 * @property {String} path - the dotted path to the attribute where the error occurred
 * @property {String} message - the warning message
 */

/**
 * @typedef BunsenView
 * @property {BunsenContainer[]} containers - the containers for the config (layout)
 * @property {BunsenRootContainer[]} rootContainers - the top-level views (create tabs if more than one, not yet supported)
 * @property {String} type - the type of this schema (currently only "form" is supported)
 * @property {String} version - the version of this schema
 */

/**
 * @typedef {Object} CheckboxChangeEvent
 * @property {String} id - id of field
 * @property {Boolean} value - checked state
 */
