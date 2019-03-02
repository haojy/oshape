const o = require('../hyperscript')

describe('hyperscript', () => {
  describe('selector', () => {
    it('throws on null selector', () => {
      expect(() => o(null)).toThrow()
    })
    it('throws on non-string selector w/o a view property', () => {
      expect(() => o({})).toThrow()
    })
    it('handles tag in selector', () => {
      const [tag, props, children] = o('a')

      expect(tag).toEqual('a')
    })
    it('className normalization', () =>{
      expect(o('a.x', { className: null })[1]).toEqual({ className: 'x' })
      expect(o('a.x', { className: undefined })[1]).toEqual({ className: 'x' })
      expect(o('a.x', { className: false })[1]).toEqual({ className: 'x' })
      expect(o('a.x', { className: true })[1]).toEqual({ className: 'x' })
      expect(o('a', { className: null })[1]).toBeNull()
      expect(o('a', { className: undefined })[1]).toBeNull()
      expect(o('a', { className: false })[1]).toBeNull()
      expect(o('a', { className: true })[1]).toBeNull()
    })
    it('handles class in selector', () => {
      const [tag, props, children] = o('.a')

      expect(tag).toEqual('div')
      expect(props.className).toEqual('a')
    })
    it('handles many classes in selector', () => {
      const [tag, props, children] = o('.a.b.c')

      expect(tag).toEqual('div')
      expect(props.className).toEqual('a b c')
    })
    it('handles id in selector', () => {
      const [tag, props, children] = o('#a')

      expect(tag).toEqual('div')
      expect(props.id).toEqual('a')
    })
    it('handles attr in selector', () => {
      const [tag, props, children] = o('[a=b]')

      expect(tag).toEqual('div')
      expect(props.a).toEqual('b')
    })
    it('handles many attrs in selector', () => {
      const [tag, props, children] = o('[a=b][c=d]')

      expect(tag).toEqual('div')
      expect(props.a).toEqual('b')
      expect(props.c).toEqual('d')
    })
    it('handles attr w/ spaces in selector', () => {
      const [tag, props, children] = o('[a = b]')

      expect(tag).toEqual('div')
      expect(props.a).toEqual('b')
    })
    it('handles attr w/ quotes in selector', () => {
      const [tag, props, children] = o('[a=\'b\']')

      expect(tag).toEqual('div')
      expect(props.a).toEqual('b')
    })
    it('handles attr w/ quoted square bracket', () => {
      const [tag, props, children] = o('[x][a=\'[b]\'].c')

      expect(tag).toEqual('div')
      expect(props.x).toEqual(true)
      expect(props.a).toEqual('[b]')
      expect(props.className).toEqual('c')
    })
    it('handles attr w/ unmatched square bracket', () => {
      const [tag, props, children] = o('[a=\']\'].c')

      expect(tag).toEqual('div')
      expect(props.a).toEqual(']')
      expect(props.className).toEqual('c')
    })
    it('handles attr w/ quoted square bracket and quote', () => {
      const [tag, props, children] = o('[a=\'[b"\\\']\'].c') // `[a='[b"\']']`

      expect(tag).toEqual('div')
      expect(props.a).toEqual('[b"\']') // `[b"']`
      expect(props.className).toEqual('c')
    })
    it('handles attr w/ quoted square containing escaped square bracket', () => {
      const [tag, props, children] = o('[a=\'[\\]]\'].c') // `[a='[\]]']`

      expect(tag).toEqual('div')
      expect(props.a).toEqual('[\\]]') // `[\]]`
      expect(props.className).toEqual('c')
    })
    it('handles attr w/ backslashes', () => {
      const [tag, props, children] = o('[a=\'\\\\\'].c') // `[a='\\']`

      expect(tag).toEqual('div')
      expect(props.a).toEqual('\\')
      expect(props.className).toEqual('c')
    })
    it('handles attr w/ quotes and spaces in selector', () => {
      const [tag, props, children] = o('[a = \'b\']')

      expect(tag).toEqual('div')
      expect(props.a).toEqual('b')
    })
    it('handles many attr w/ quotes and spaces in selector', () => {
      const [tag, props, children] = o('[a = \'b\'][c = \'d\']')

      expect(tag).toEqual('div')
      expect(props.a).toEqual('b')
      expect(props.c).toEqual('d')
    })
    it('handles tag, class, attrs in selector', () => {
      const [tag, props, children] = o('a.b[c = \'d\']')

      expect(tag).toEqual('a')
      expect(props.className).toEqual('b')
      expect(props.c).toEqual('d')
    })
    it('handles tag, mixed classes, attrs in selector', () => {
      const [tag, props, children] = o('a.b[c = \'d\'].e[f = \'g\']')

      expect(tag).toEqual('a')
      expect(props.className).toEqual('b e')
      expect(props.c).toEqual('d')
      expect(props.f).toEqual('g')
    })
    it('handles attr without value', () => {
      const [tag, props, children] = o('[a]')

      expect(tag).toEqual('div')
      expect(props.a).toEqual(true)
    })
    it('handles explicit empty string value for input', () => {
      const [tag, props, children] = o('input[value=""]')

      expect(tag).toEqual('input')
      expect(props.value).toEqual('')
    })
    it('handles explicit empty string value for option', () => {
      const [tag, props, children] = o('option[value=""]')

      expect(tag).toEqual('option')
      expect(props.value).toEqual('')
    })
  })

  describe('attrs', () => {
    it('handles string attr', () => {
      const [tag, props, children] = o('div', {a: 'b'})

      expect(tag).toEqual('div')
      expect(props.a).toEqual('b')
    })
    it('handles falsy string attr', () => {
      const [tag, props, children] = o('div', {a: ''})

      expect(tag).toEqual('div')
      expect(props.a).toEqual('')
    })
    it('handles number attr', () => {
      const [tag, props, children] = o('div', {a: 1})

      expect(tag).toEqual('div')
      expect(props.a).toEqual(1)
    })
    it('handles falsy number attr', () => {
      const [tag, props, children] = o('div', {a: 0})

      expect(tag).toEqual('div')
      expect(props.a).toEqual(0)
    })
    it('handles boolean attr', () => {
      const [tag, props, children] = o('div', {a: true})

      expect(tag).toEqual('div')
      expect(props.a).toEqual(true)
    })
    it('handles falsy boolean attr', () => {
      const [tag, props, children] = o('div', {a: false})

      expect(tag).toEqual('div')
      expect(props.a).toEqual(false)
    })
    it('handles only key in attrs', () => {
      const [tag, props, children] = o('div', {key:'a'})

      expect(tag).toEqual('div')
      expect(props.key).toEqual('a')
    })
    it('handles many attrs', () => {
      const [tag, props, children] = o('div', {a: 'b', c: 'd'})

      expect(tag).toEqual('div')
      expect(props.a).toEqual('b')
      expect(props.c).toEqual('d')
    })
    it('handles className attrs property', () => {
      const [tag, props, children] = o('div', {className: 'a'})

      expect(props.className).toEqual('a')
    })
    it('handles \'class\' as a verbose attribute declaration', () => {
      const [tag, props, children] = o('[class=a]')

      expect(props.className).toEqual('a')
    })
    it('handles merging classes w/ class property', () => {
      const [tag, props, children] = o('.a', {class: 'b'})

      expect(props.className).toEqual('a')
      expect(props.class).toEqual('b')
    })
    it('handles merging classes w/ className property', () => {
      const [tag, props, children] = o('.a', {className: 'b'})

      expect(props.className).toEqual('a b')
    })
  })

  describe('custom element attrs', function() {
    it('handles string attr', function() {
      const [tag, props, children] = o('custom-element', {a: 'b'})

      expect(tag).toEqual('custom-element')
      expect(props.a).toEqual('b')
    })
    it('handles falsy string attr', function() {
      const [tag, props, children] = o('custom-element', {a: ''})

      expect(tag).toEqual('custom-element')
      expect(props.a).toEqual('')
    })
    it('handles number attr', function() {
      const [tag, props, children] = o('custom-element', {a: 1})

      expect(tag).toEqual('custom-element')
      expect(props.a).toEqual(1)
    })
    it('handles falsy number attr', function() {
      const [tag, props, children] = o('custom-element', {a: 0})

      expect(tag).toEqual('custom-element')
      expect(props.a).toEqual(0)
    })
    it('handles boolean attr', function() {
      const [tag, props, children] = o('custom-element', {a: true})

      expect(tag).toEqual('custom-element')
      expect(props.a).toEqual(true)
    })
    it('handles falsy boolean attr', function() {
      const [tag, props, children] = o('custom-element', {a: false})

      expect(tag).toEqual('custom-element')
      expect(props.a).toEqual(false)
    })
    it('handles only key in attrs', function() {
      const [tag, props, children] = o('custom-element', {key:'a'})

      expect(tag).toEqual('custom-element')
      expect(props.key).toEqual('a')
    })
    it('handles many attrs', function() {
      const [tag, props, children] = o('custom-element', {a: 'b', c: 'd'})

      expect(tag).toEqual('custom-element')
      expect(props.a).toEqual('b')
      expect(props.c).toEqual('d')
    })
    it('handles className attrs property', function() {
      const [tag, props, children] = o('custom-element', {className: 'a'})

      expect(props.className).toEqual('a')
    })
    it('casts className using toString like browsers', function() {
      const className = {
        valueOf: () => '.valueOf',
        toString: () => 'toString'
      }
      const [tag, props, children] = o('custom-element' + className, {className: className})

      expect(props.className).toEqual('valueOf toString')
    })
  })
  describe('children', function() {
    it('handles string single child', function() {
      const [tag, props, children] = o('div', {}, ['a'])

      expect(children[0]).toEqual('a')
    })
    it('handles falsy string single child', function() {
      const [tag, props, children] = o('div', {}, [''])

      expect(children[0]).toEqual('')
    })
    it('handles number single child', function() {
      const [tag, props, children] = o('div', {}, [1])

      expect(children[0]).toEqual(1)
    })
    it('handles falsy number single child', function() {
      const [tag, props, children] = o('div', {}, [0])

      expect(children[0]).toEqual(0)
    })
    it('handles boolean single child', function() {
      const [tag, props, children] = o('div', {}, [true])

      expect(children[0]).toEqual(true)
    })
    it('handles falsy boolean single child', function() {
      const [tag, props, children] = o('div', {}, [false])

      expect(children[0]).toEqual(false)
    })
    it('handles null single child', function() {
      const [tag, props, children] = o('div', {}, [null])

      expect(children[0]).toEqual(null)
    })
    it('handles undefined single child', function() {
      const [tag, props, children] = o('div', {}, [undefined])

      expect(children[0]).toEqual(undefined)
    })
    it('handles multiple string children', function() {
      const [tag, props, children] = o('div', {}, ['', 'a'])

      expect(children[0]).toEqual('')
      expect(children[1]).toEqual('a')
    })
    it('handles multiple number children', function() {
      const [tag, props, children] = o('div', {}, [0, 1])

      expect(children[0]).toEqual(0)
      expect(children[1]).toEqual(1)
    })
    it('handles multiple boolean children', function() {
      const [tag, props, children] = o('div', {}, [false, true])

      expect(children[0]).toEqual(false)
      expect(children[1]).toEqual(true)
    })
    it('handles multiple null/undefined child', function() {
      const [tag, props, children] = o('div', {}, [null, undefined])

      expect(children[0]).toEqual(null)
      expect(children[1]).toEqual(undefined)
    })
    it('handles falsy number single child without attrs', function() {
      const [tag, props, children] = o('div', 0)

      expect(children).toEqual(0)
    })
  })
  describe('permutations', function() {
    it('handles null attr and children', function() {
      const [tag, props, children] = o('div', null, [o('a'), o('b')])

      expect(props).toEqual(null)
      expect(children[0][0]).toEqual('a')
      expect(children[1][0]).toEqual('b')
    })
    it('handles null attr and child unwrapped', function() {
      const [tag, props, children] = o('div', null, o('a'))

      expect(props).toEqual(null)
      expect(children[0][0]).toEqual('a')
    })
    it('handles null attr and children unwrapped', function() {
      const [tag, props, children] = o('div', null, o('a'), o('b'))

      expect(props).toEqual(null)
      expect(children[0][0]).toEqual('a')
      expect(children[1][0]).toEqual('b')
    })
    it('handles attr and children', function() {
      const [tag, props, children] = o('div', {a: 'b'}, [o('i'), o('s')])

      expect(props.a).toEqual('b')
      expect(children[0][0]).toEqual('i')
      expect(children[1][0]).toEqual('s')
    })
    it('handles attr and child unwrapped', function() {
      const [tag, props, children] = o('div', {a: 'b'}, o('i'))

      expect(props.a).toEqual('b')
      expect(children[0][0]).toEqual('i')
    })
    it('handles attr and children unwrapped', function() {
      const [tag, props, children] = o('div', {a: 'b'}, o('i'), o('s'))

      expect(props.a).toEqual('b')
      expect(children[0][0]).toEqual('i')
      expect(children[1][0]).toEqual('s')
    })
    it('handles attr and text children', function() {
      const [tag, props, children] = o('div', {a: 'b'}, ['c', 'd'])

      expect(props.a).toEqual('b')
      expect(children[0]).toEqual('c')
      expect(children[1]).toEqual('d')
    })
    it('handles attr and single string text child', function() {
      const [tag, props, children] = o('div', {a: 'b'}, ['c'])

      expect(props.a).toEqual('b')
      expect(children[0]).toEqual('c')
    })
    it('handles attr and single falsy string text child', function() {
      const [tag, props, children] = o('div', {a: 'b'}, [''])

      expect(props.a).toEqual('b')
      expect(children[0]).toEqual('')
    })
    it('handles attr and single number text child', function() {
      const [tag, props, children] = o('div', {a: 'b'}, [1])

      expect(props.a).toEqual('b')
      expect(children[0]).toEqual(1)
    })
    it('handles attr and single falsy number text child', function() {
      const [tag, props, children] = o('div', {a: 'b'}, [0])

      expect(props.a).toEqual('b')
      expect(children[0]).toEqual(0)
    })
    it('handles attr and single boolean text child', function() {
      const [tag, props, children] = o('div', {a: 'b'}, [true])

      expect(props.a).toEqual('b')
      expect(children[0]).toEqual(true)
    })
    it('handles attr and single falsy boolean text child', function() {
      const [tag, props, children] = o('div', {a: 'b'}, [0])

      expect(props.a).toEqual('b')
      expect(children[0]).toEqual(0)
    })
    it('handles attr and single false boolean text child', function() {
      const [tag, props, children] = o('div', {a: 'b'}, [false])

      expect(props.a).toEqual('b')
      expect(children[0]).toEqual(false)
    })
    it('handles attr and single text child unwrapped', function() {
      const [tag, props, children] = o('div', {a: 'b'}, 'c')

      expect(props.a).toEqual('b')
      expect(children[0]).toEqual('c')
    })
    it('handles attr and text children unwrapped', function() {
      const [tag, props, children] = o('div', {a: 'b'}, 'c', 'd')

      expect(props.a).toEqual('b')
      expect(children[0]).toEqual('c')
      expect(children[1]).toEqual('d')
    })
    it('handles children without attr', function() {
      const [tag, props, children] = o('div', [o('i'), o('s')])

      expect(props).toEqual(null)
      expect(children[0][0]).toEqual('i')
      expect(children[1][0]).toEqual('s')
    })
    it('handles child without attr unwrapped', function() {
      const [tag, props, children] = o('div', o('i'))

      expect(props).toEqual(null)
      expect(children[0][0]).toEqual('i')
    })
    it('handles classy child without attr unwrapped', function() {
      const [tag, props, children] = o('div.cls', o('i.cls'))

      expect(props).toEqual({className: 'cls'})
      expect(children[0]).toEqual('i')
      expect(children[1]).toEqual({className: 'cls'})
    })
    it('handles children without attr unwrapped', function() {
      const [tag, props, children] = o('div', o('i'), o('s'))

      expect(props).toEqual(null)
      expect(children[0][0]).toEqual('i')
      expect(children[1][0]).toEqual('s')
    })
    it('handles shared attrs', function() {
      var attrs = {a: 'b'}

      var nodeA = o('.a', attrs)
      var nodeB = o('.b', attrs)

      expect(nodeA[1].className).toEqual('a')
      expect(nodeA[1].a).toEqual('b')

      expect(nodeB[1].className).toEqual('b')
      expect(nodeB[1].a).toEqual('b')
    })
    it('doesnt modify passed attributes object', function() {
      var attrs = {a: 'b'}
      o('.a', attrs)
      expect(attrs).toEqual({a: 'b'})
    })
    it('non-nullish attr takes precedence over selector', function() {
      expect(o('[a=b]', {a: 'c'})[1]).toEqual({a: 'c'})
    })
    it('null attr takes precedence over selector', function() {
      expect(o('[a=b]', {a: null})[1]).toEqual({a: null})
    })
    it('undefined attr takes precedence over selector', function() {
      expect(o('[a=b]', {a: undefined})[1]).toEqual({a: undefined})
    })
    it('handles fragment children without attr unwrapped', function() {
      const [tag, props, children] = o('div', [o('i')], [o('s')])

      expect(children[0][0][0]).toEqual('i')
      expect(children[1][0][0]).toEqual('s')
    })
    it('handles children with nested array', function() {
      const [tag, props, children] = o('div', [[o('i'), o('s')]])

      expect(props).toEqual(null)
      expect(children[0][0][0]).toEqual('i')
      expect(children[0][1][0]).toEqual('s')
    })
    it('handles children with deeply nested array', function() {
      const [tag, props, children] = o('div', [[[o('i'), o('s')]]])

      expect(children[0][0][0][0]).toEqual('i')
      expect(children[0][0][1][0]).toEqual('s')
    })
  })
  describe('components', function() {
    it('works with POJOs', function() {
      const component = function() {}
      const [tag, props, children] = o(component, {id: 'a'}, 'b')

      expect(tag).toEqual(component)
      expect(props.id).toEqual('a')
      expect(children.length).toEqual(1)
      expect(children[0]).toEqual('b')
    })
    it('works with constructibles', function() {
      const component = function() {}
      component.prototype.render = function() {}

      const [tag, props, children] = o(component, {id: 'a'}, 'b')

      expect(tag).toEqual(component)
      expect(props.id).toEqual('a')
      expect(children.length).toEqual(1)
      expect(children[0]).toEqual('b')
    })
  })
  describe('opinioned features', () => {
    it('selecotr id will be also regarded as a `key', () => {
      const [tag, props, children] = o('#key-id')
      expect(props.key).toEqual('key-id')
    })
  })
})
