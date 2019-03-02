const selectorParser = /(?:(^|#|\.)([^#\.\[\]]+))|(\[(.+?)(?:\s*=\s*("|'|)((?:\\["'\]]|.)*?)\5)?\])/g
const selectorCache = {}

function compileSelector(selector) {
  let match
  let tag = 'div'
  const classes = []
  const attrs = {}
	
  while (match = selectorParser.exec(selector)) {
    const type = match[1]
    const value = match[2]
    if (type === '' && value !== '') tag = value
    else if (type === '#') attrs.id = value
    else if (type === '.') classes.push(value)
    else if (match[3][0] === '[') {
      let attrValue = match[6]
      if (attrValue) attrValue = attrValue.replace(/\\(["'])/g, '$1').replace(/\\\\/g, '\\')
      if (match[4] === 'class') classes.push(attrValue)
      else attrs[match[4]] = attrValue === '' ? attrValue : attrValue || true
    }
  }
  if (classes.length > 0) attrs.className = classes.join(' ')
  return selectorCache[selector] = {tag, attrs}
}

function mergeElement({tag, attrs}, ...args) {
  let config = arguments[1]
  let children
  let childrenIndex = 2

  if (args[0] == null) {
    config = {}
  } else if (typeof args[0] !== 'object'
    || Array.isArray(args[0]) 
    || typeof args[0]['$$typeof'] === 'symbol'
  ) { 
    config = {}
    childrenIndex = 1
  }

  if (arguments.length === childrenIndex + 1) {
    children = arguments[childrenIndex]
    // if (!Array.isArray(children)) children = [children]
  } else {
    children = []
    while (childrenIndex < arguments.length) children.push(arguments[childrenIndex++])
  }

  const props = {...attrs, ...config}
  const configClassName = config.className && config.className !== true ? config.className : ''
  const className = [attrs.className, configClassName || ''].join(configClassName && attrs.className ? ' ' : '')
  if (className) props.className = className
  else delete props.className
  if (typeof attrs.id !== 'undefined' && typeof config.key === 'undefined') props.key = attrs.id

  return [tag, Reflect.ownKeys(props).length ? props : null, Array.isArray(children) && !children.length ? null : children]
}

function hyperscript(selector, ...args) {
  if (selector == null || typeof selector !== 'string' && typeof selector !== 'function') {
    throw new Error('The selector must be either a string or a component.')
  }

  return typeof selector === 'string' ? mergeElement(selectorCache[selector] || compileSelector(selector), ...args) : [selector, ...args]
}

module.exports = hyperscript
