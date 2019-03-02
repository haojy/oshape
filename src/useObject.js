import {useState} from 'react'
import setWith from 'lodash/setWith'
import defaultsDeep from 'lodash/defaultsDeep'

const identity = a => a
export default function (initial = {}, pathCreation = undefined) {
  const [object, setState] = useState(initial) 

  const setObject = (...args) => {
    const newObj = args.length === 1 ? args[0] : setWith({}, args[0], args[1], pathCreation)
    setState({...object, ...newObj})
  }
  const setObjectDeep = (...args) => {
    const newObj = args.length === 1 ? args[0] : setWith({}, args[0], args[1], pathCreation)
    setState(defaultsDeep(newObj, object))
  }
  return [object, setObject, setObjectDeep]
}
