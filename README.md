# Oshape &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/haojy/oshape/blob/master/LICENSE)  [![CircleCI Status](https://circleci.com/gh/haojy/oshape.svg?style=shield&circle-token=:circle-token)](https://circleci.com/gh/haojy/oshape)

**Oshape** affords some helpful APIs and opinionated way to structure components with [React Hook](https://reactjs.org/docs/hooks-intro.html). *Hook* gives the ability to decouple the state management as a function from a component structure, then a pure function component not only plays view presentation but also equips with React lifecycle functions without HOC or props render. So a component can be considered as a function which
- has *props* as outside input
- keeps component logic by hooks, includes 
  * observed variable for the state, 
  * side effect functions for event handlers, HTTP request and response, and etc.
  * element reference
- returns virtual nodes by `createElement`

**Oshape** names the abstract logic after **shape** which consists of 
- a *state* object, includes observe states
- a *handle* object, includes kinds of side effect functions and useful functions in the component scope
- a *ref* object, keeps element references

Actually, **shape** is a custom hook to define state and behaviors for an abstract component, which can be reused by other function component. Besides `useState` and `useReducer`, oshape provides a hook `useObject` 
- avoid more renderings when to define multiple states by `usState`
- sets state of a object, more like `this.setState()` in component class; but be more simple than `useReducer`

When function component is becoming first class component, `React.createElement` is a good option to create element tree. Oshape provides a more useful hyperscript function `o()` to build component,
- accepts `selector` string to use CSS library conveniently, like
`o('span.spinner-border', o('span.sr-only', 'Loading...'))`
- also apply `selector` for a component, like
```o`.mx-auto.mt-5`(Login)```


## Installation

```bash
npm install oshape
# Or by yarn
yarn add oshape
```

| peer-dependent on React v16.8


## Example to shape component

```javascript
// Component
export default function Login(props) {
  const [state, handle, ref] = shapeLogin(props)

  return o('.text-center', state.authenticated ? 'login successfully' :
    o('form', [
      o('label#label-username.sr-only[htmlFor=username]', 'User name'),
      o('input#username.form-control[type=email][placeholder="User name"][required][autoFocus]', {ref: ref.username}),
      o('label#label-password.sr-only[htmlFor=password]', 'Password'),
      o('input#password.form-control[type=password][placeholder="Password"][required]', {ref: ref.password}),
      o('button#login-submit.btn.btn-lg.btn-primary.btn-block[type=submit]', {onClick: handle.submit},'Login in'),
    ])
  )
}

// shape
export default function shapeLogin(props, context) {
  const [state, setState] = useObject({
    authenticated: false
  })
  const ref = {
    username: useRef(null),
    password: useRef(null),
  }

  const handle = useMemo(() => {
    return {
      login(username, password) {
        return service.authenticate({username, password, csrfProtection: true}) // to mock `service.authenticate` 
          .then(rs => setState({authenticated: true}))
      },
      submit(e) {
        e.preventDefault()
        if (!ref.username.current.value || !ref.password.current.value) return // fail to validate 
        handle.login(ref.username.current.value, ref.password.current.value)
      }
    }
  }, [store])

  return [state, handle, ref]
}
```
