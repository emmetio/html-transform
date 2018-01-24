'use strict';

import { findUnescapedTokens, replaceRanges } from './utils';

const numberingToken = '$';

/**
 * Numbering of expanded abbreviation: finds all nodes with `$` in value
 * or attributes and replaces its occurances with repeater value
 */
export default function(tree) {
    tree.walk(applyNumbering);
    return tree;
};

/**
 * Applies numbering for given node: replaces occurances of numbering token
 * in node’s name, content and attributes
 * @param  {Node} node
 * @return {Node}
 */
function applyNumbering(node) {
    const repeater = findRepeater(node);

    if (repeater && repeater.value != null) {
        // NB replace numbering in nodes with explicit repeater only:
        // it solves issues with abbreviations like `xsl:if[test=$foo]` where
        // `$foo` is preferred output
        const value = repeater.value;
        const count = repeater.count;

        node.name = replaceNumbering(node.name, value, count);
        node.value = replaceNumbering(node.value, value, count);
        node.attributes.forEach(attr => {
            const copy = node.getAttribute(attr.name).clone();
            copy.name = replaceNumbering(attr.name, value, count);
            copy.value = replaceNumbering(attr.value, value, count);
            node.replaceAttribute(attr.name, copy);
        });
    }

    return node;
}

/**
 * Returns repeater object for given node
 * @param  {Node} node
 * @return {Object}
 */
function findRepeater(node) {
    while (node) {
        if (node.repeat) {
            return node.repeat;
        }

        node = node.parent;
    }
}

/**
 * Replaces numbering in given string
 * @param  {String} str
 * @param  {Number} value
 * @return {String}
 */
function replaceNumbering(str, value, count) {
    // replace numbering in strings only: skip explicit wrappers that could
    // contain unescaped numbering tokens
    if (typeof str === 'string') {
        const ranges = getNumberingRanges(str);
        return replaceNumberingRanges(str, ranges, value, count);
    }

    return str;
}

/**
 * Returns numbering ranges, e.g. ranges of `$` occurances, in given string.
 * Multiple adjacent ranges are combined
 * @param  {String} str
 * @return {Array}
 */
function getNumberingRanges(str) {
    return findUnescapedTokens(str || '', numberingToken)
    .reduce((out, range) => {
        // skip ranges that actually belongs to output placeholder or tabstops
        if (!/[#{]/.test(str[range[0] + 1] || '')) {
            const lastRange = out[out.length - 1];
            if (lastRange && lastRange[0] + lastRange[1] === range[0]) {
                lastRange[1] += range[1];
            } else {
                out.push(range);
            }
        }

        return out;
    }, []);
}

/**
 * @param  {String} str
 * @param  {Array} ranges
 * @param  {Number} value
 * @return {String}
 */
function replaceNumberingRanges(str, ranges, value, count) {
    const replaced = replaceRanges(str, ranges, (token, offset, descendingOrder) => {
    let _value = descendingOrder ? String(offset + count - value + 1) : String(value + offset);
        // pad values for multiple numbering tokens, e.g. 3 for $$$ becomes 003
        while (_value.length < token.length) {
            _value = '0' + _value;
        }
        return _value;
    });

    // unescape screened numbering tokens
    return unescapeString(replaced);
}

/**
 * Unescapes characters, screened with `\`, in given string
 * @param  {String} str
 * @return {String}
 */
function unescapeString(str) {
    let i = 0, result = '';
    const len = str.length;

    while (i < len) {
        const ch = str[i++];
        result += (ch === '\\') ? (str[i++] || '') : ch;
    }

    return result;
}
