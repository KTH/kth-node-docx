/* globals describe, it */
'use strict'

var assert = require('chai').assert
var factory = require('../element')

describe('element', function () {
  const template = factory({
    tagName: 'x',
    validAttributes: ['foo'],
    validChildren: ['x'],
  })

  const otherTemplate = factory({
    tagName: 'y',
  })

  describe('#create', function () {
    it('should throw an error when invalid attribute', function () {
      assert.throws(() => template(null, { baz: 123 }), 'One or more invalid attributes.')
    })

    it('should throw an error when invalid child', function () {
      var children = [otherTemplate()]
      assert.throws(() => template(null, null, children), 'One or more invalid children.')
    })
  })

  describe('#render', function () {
    it('should return a proper xml string', function () {
      var element = template()
      assert.equal(element.render(), '<x/>')
    })

    it('should render attributes', function () {
      var element = template()
      element.attr('foo', 'bar')
      assert.equal(element.render(), '<x foo="bar"/>')
    })

    it('should render children', function () {
      var element = template()
      element.append(template())
      assert.equal(element.render(), '<x><x/></x>')
    })

    it('should render text', function () {
      var element = template()
      element.text('hello')
      assert.equal(element.render(), '<x>hello</x>')
    })
  })

  describe('#append', function () {
    it('should append child', function () {
      var element = template()
      element.append(template())
      assert.equal(element.getChild(0).getTagName(), 'x')
    })

    it('should only allow valid children', function () {
      var element = template()
      assert.throws(() => element.append(otherTemplate()), 'Invalid child: "y".')
    })
  })

  describe('#attr', function () {
    it('should set attribute value', function () {
      var element = template()
      element.attr('foo', 'bar')
      assert.equal(element.attr('foo'), 'bar')
    })

    it('should only allow valid attributes', function () {
      var element = template()

      assert.throws(() => element.attr('baz', 123), 'Invalid attribute: "baz".')
    })
  })
})
