function deepEqualNodes(a, b) {
  return !Object.keys(a).find(function (key) {
    if (b[key] === undefined || key === 'raw')
      return false

    if (a[key] instanceof Object)
      return deepEqualNodes(a[key], b[key])

    return a[key] !== b[key]
  })
}

export default function ({ types: t, template }) {
  return {
    visitor: {
      Program(path, state) {
        const replacements = state.opts
        const visitor = {}

        Object.keys(replacements).forEach(function (key) {
          const match = template(key)()

          // TODO: template('"object"')() returns undefined so we don't
          // have a good way of specifying strings as substitutes. Not
          // sure if this is a bug in Babel or not.
          const replacement = template(replacements[key])() || t.valueToNode(eval(replacements[key]))

          visitor[match.type] = visitor[match.type] || { enter: [] }

          visitor[match.type].enter.push(function (path) {
            if (deepEqualNodes(path.node, match)) {
              path.replaceWith(replacement)

              if (path.parentPath.isBinaryExpression()) {
                const result = path.parentPath.evaluate()

                if (result.confident)
                  path.parentPath.replaceWith(t.valueToNode(result.value))
              }
            }
          })
        })

        path.traverse(visitor)
      }
    }
  }
}
