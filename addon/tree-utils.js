import _ from 'lodash'

/* eslint-disable complexity */
/**
 * Determines if aId or bId is a common ancestor of each other
 * @param {String} dependencyId - precomputed path id
 * @param {String} bunsenId - bunsen id
 * @returns {Boolean} whether aId or bId is a common ancestor
 */
export function isCommonAncestor (dependencyId, bunsenId) {
  if (dependencyId === undefined || bunsenId === undefined) {
    return false
  }

  // replace array indexes with []
  if (!bunsenId.startsWith('root')) {
    bunsenId = convertBunsenId(bunsenId)
  }

  if (dependencyId === bunsenId) {
    return true
  }

  let aPath = dependencyId.split('.')
  let bPath = bunsenId.split('.')

  // swap paths if aId is longer than bId
  // NOTE: This is vital for verifying if a value change occurred at the ancestry or descendent level.
  // For example, a view cell concerned with all changes for (foo.bar) would be interested to know if (foo) was changed.
  // Also, if (foo.bar.baz) was added, the same view cell would need to be notified.
  if (aPath.length > bPath.length) {
    const tmp = aPath
    aPath = bPath
    bPath = tmp
  }

  // if all of aPath matches bPath, then aPath is the common ancestor
  for (let i = 0; i < aPath.length; ++i) {
    if (aPath[i] !== bPath[i]) {
      return false
    }
  }

  return true
}

/**
 * Determines the common ancestor id for all the ids given
 * @param {String[]} ids - bunsenIds
 * @returns {String} common ancestor for all ids given
 */
export function findCommonAncestor (ids) {
  if (ids.length === 0) {
    return undefined
  }

  let minLength = Infinity
  let paths = []
  for (let i = 0; i < ids.length; ++i) {
    const pathId = ids[i]

    const path = pathId.split('.')
    if (path.length < minLength) {
      minLength = path.length
    }

    paths.push(path)
  }

  let commonAncestorPath = []
  for (let i = 0; i < minLength; ++i) {
    let sample = paths[0][i]

    // keep going if all path segments at i are equal
    if (_.every(paths, (path) => {
      return path[i] === sample
    })) {
      commonAncestorPath.push(sample)
    } else {
      break
    }
  }

  return commonAncestorPath.join('.')
}
/* eslint-enable complexity */

/**
 * Convert bunsenIds to usable ids against the precomputed values.
 * @param {String} bunsenId - bunsenId
 * @returns {String} the converted bunsenId
 */
export function convertBunsenId (bunsenId) {
  return `root.${bunsenId}`.replace(/\.\d+/g, '.[]')
}

/**
 * Used to traverse a cellConfig object depth-first
 * @param {Object} cell - cell config
 * @param {Function} iteratee - callback
 */
export function traverseCell (cell, iteratee) {
  const stack = [cell]

  while (stack.length > 0) {
    const node = stack.pop()

    iteratee(node)

    // descendent object
    if (node.children) {
      node.children.forEach((child) => {
        stack.push(child)
      })
    }

    // descendant array
    if (node.arrayOptions && node.arrayOptions.itemCell) {
      stack.push(node.arrayOptions.itemCell)
    }
  }
}

/**
 * Post-order breadth-first traversal
 * @param {Object} object - cellConfig
 * @param {Function} iteratee - callback
 */
export function traverseCellBreadthFirst (object, iteratee) {
  let queue = [object]
  let stack = []

  // breadth-first traversal
  while (queue.length > 0) {
    let obj = queue.shift()

    // visit the node in reverse order later
    stack.push(obj)

    // descendant object
    if (obj.children && obj.children.length > 0) {
      obj.children.forEach((child) => {
        queue.push(child)
      })
    }

    // descendant array
    if (obj.arrayOptions && obj.arrayOptions.itemCell) {
      queue.push(obj.arrayOptions.itemCell)
    }
  }

  // traverse visited cells in reverse
  while (stack.length > 0) {
    let obj = stack.pop()
    iteratee(obj)
  }
}

/**
 * Traverses an object, ignoring arrays
 * @param {Object} obj - object to traverse
 * @param {Function} iteratee - callback
 */
export function traverseObject (obj, iteratee) {
  const stack = [obj]

  while (stack.length > 0) {
    const next = stack.pop()

    iteratee(next)

    Object.keys(next).forEach((key) => {
      stack.push(next[key])
    })
  }
}
