const hasOwnProperty = Object.prototype.hasOwnProperty

export default function ({ types: t }) {
  return {
    visitor: {
      MemberExpression(path, state) {
        for (const pattern in state.opts) {
          if (hasOwnProperty.call(state.opts, pattern) && path.matchesPattern(pattern)) {
            path.replaceWith(t.valueToNode(state.opts[pattern]))

            if (path.parentPath.isBinaryExpression()) {
              const result = path.parentPath.evaluate()

              if (result.confident) {
                path.parentPath.replaceWith(t.valueToNode(result.value))
              }
            }

            break
          }
        }
      }
    }
  }
}
