'use strict'

var R = require('ramda')

/**
 * @typedef {Object} ElementInstance
 * @property getTagName
 * @property getChild
 * @property append
 * @property appendAll
 * @property text
 * @property attr
 * @property render
 */

/**
 * Creates an element instance.
 * @typedef {Function} ElementFactory
 * @param {String} [text] - text content of the element
 * @param {Object} [attributes] - key/value pairs of attributes
 * @param {Array} [children] - array of child elements
 * @returns {ElementInstance} an element instance
 */

/**
 * Creates an element factory.
 * @param {Object} config - element configuration
 * @param {String} config.tagName - element tag name
 * @param {String[]} [config.validAttributes] - list of valid attribute names
 * @param {String[]} [config.validChildren] - list of valid child tag names
 * @returns {ElementFactory} function which creates instances of an element
 */
module.exports = function (config) {
  const defaults = {
    tagName: '',
    validAttributes: [],
    validChildren: [],
  }

  let _config = R.merge(defaults, config || {})
  let _isValidChildTagName = R.contains(R.__, _config.validChildren)
  let _isValidAttributeName = R.contains(R.__, _config.validAttributes)

  /**
   * Creates an element instance.
   * @param {String} [text] - text content of the element
   * @param {Object} [attributes] - key/value pairs of attributes
   * @param {Array} [children] - array of child elements
   * @returns {ElementInstance} an element instance
   */
  return function (text, attributes, children) {
    let _text = text || null
    let _attributes = attributes || {}
    let _children = children || []

    if (!R.all(_isValidAttributeName, R.keys(_attributes))) {
      throw new Error('One or more invalid attributes.')
    }

    let tagNames = R.map(child => child.getTagName(), _children)

    if (!R.all(_isValidChildTagName, tagNames)) {
      throw new Error('One or more invalid children.')
    }

    /**
     * An element instance.
     * @type {ElementInstance}
     */
    const element = {
      /**
       * Gets the current element's tag name
       * @returns {String} element tag name
       */
      getTagName: publicGetTagName,

      /**
       * Gets the child element at the specified index.
       * @param {Number} index - the child index
       * @returns {ElementInstance} element or undefined if no such child exist
       */
      getChild: publicGetChild,

      /**
       * Appends a child element.
       * @param {ElementInstance} child - the child element
       * @returns {ElementInstance} the element
       */
      append: publicAppend,

      /**
       * Appends an array of child elements.
       * @param {ElementInstance[]} children - array of child elements
       * @returns {ElementInstance} the element
       */
      appendAll: publicAppendAll,

      /**
       * Gets or sets the text content. Set to an empty string or null to
       * remove the text.
       * @param {String} [text] - the new text to set
       * @returns {String|ElementInstance} current text or element
       */
      text: publicText,

      /**
       * Gets or sets and attribute.
       * @param {String} name - the attribute name
       * @param {*} [value] - the attribute value
       * @returns {*|ElementInstance} attribute value or element
       */
      attr: publicAttr,

      /**
       * Renders the element to an XML string.
       * @returns {String} an XML string
       */
      render: publicRender,
    }

    function publicGetTagName() {
      return _config.tagName
    }

    function publicGetChild(index) {
      return _children[index]
    }

    function publicAppend(child) {
      if (!_isValidChildTagName(child.getTagName())) {
        throw new Error(`Invalid child: "${child.getTagName()}".`)
      }

      _children.push(child)
      return element
    }

    function publicAppendAll(children) {
      R.forEach(publicAppend, children)
      return element
    }

    function publicText(text) {
      if (text !== undefined) {
        _text = text
        return element
      }

      return _text
    }

    function publicAttr(name, value) {
      if (!_isValidAttributeName(name)) {
        throw new Error(`Invalid attribute: "${name}".`)
      }

      if (value === undefined) {
        return _attributes[name]
      }

      _attributes[name] = value
      return element
    }

    function publicRender() {
      var output = `<${_config.tagName}`

      output += R.reduce(
        (acc, name) => {
          return acc + ` ${name}="${_attributes[name]}"`
        },
        '',
        R.keys(_attributes)
      )

      if (_children.length || _text) {
        output += '>'

        output += R.reduce(
          (acc, child) => {
            return acc + child.render()
          },
          '',
          _children
        )

        if (_text) {
          output += _text
        }

        output += `</${_config.tagName}>`
      } else {
        output += '/>'
      }

      return output
    }

    return element
  }
}
