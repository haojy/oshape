import {createElement} from 'react'
import hyperscript from './hyperscript'

const reactReg = /react/
export default function o(...args) {
  if (Array.isArray(args[0].raw) && args.length === 1) {
    return (...x) => {
      const y = hyperscript(...x)
      const taggedElement = hyperscript(args[0].raw[0])
      if (typeof y[1] === 'undefined') y[1] = {className: taggedElement[1].className}
      else y[1].className = `${taggedElement[1].className} ${y[1].className || ''}`
      return createElement(...y)
    }
  } 
  if (Array.isArray(args[0])) return args[0]
  if (typeof args[0] === 'object' && args[0].$$typeof ||
    typeof(args[0]) === 'symbol' && reactReg.test(args[0].toString()))
    return createElement(...args)

  return createElement(...hyperscript(...args))
}

export {default as useObject} from './useObject'
export * from 'react'
