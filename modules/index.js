import { expandReplacements } from './config'

export default function ({ types: t }) {
  return {
    visitor: {

      // process.env.NODE_ENV
      MemberExpression(path, state) {
        const replacements = expandReplacements(state.opts)
        const keys = Object.keys(replacements)

        for (let i = 0, len = keys.length; i < len; ++i) {
          const key = keys[i]

          if (path.matchesPattern(key)) {
            path.replaceWith(t.valueToNode(replacements[key]))

            if (path.parentPath.isBinaryExpression()) {
              const result = path.parentPath.evaluate()

              if (result.confident)
                path.parentPath.replaceWith(t.valueToNode(result.value))
            }

            break
          }
        }
      },

      // typeof window
      UnaryExpression(path, state) {
        if (path.node.operator !== 'typeof')
          return

        const replacements = state.opts
        const keys = Object.keys(replacements)
        const typeofValues = {}

        keys.forEach(function (key) {
          if (key.substring(0, 7) === 'typeof ')
            typeofValues[key.substring(7)] = replacements[key]
        })

        const argumentNames = Object.keys(typeofValues)

        for (let i = 0, len = argumentNames.length; i < len; ++i) {
          const argumentName = argumentNames[i]

          if (path.node.argument.name === argumentName) {
            path.replaceWith(t.valueToNode(typeofValues[argumentName]))

            if (path.parentPath.isBinaryExpression()) {
              const result = path.parentPath.evaluate()

              if (result.confident)
                path.parentPath.replaceWith(t.valueToNode(result.value))
            }

            break
          }
        }
      }

    }
  }
}
