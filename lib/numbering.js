'use strict';

import { findUnescapedTokens, replaceRanges } from './utils';

const numberingToken = '$';
const defaultRepeater = {
    count: 1,
    value: 1
};

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
    const value = repeater.value != null ? repeater.value : defaultRepeater.value;

    node.name = replaceNumbering(node.name, value);
    node.value = replaceNumbering(node.value, value);
    node.attributes.forEach(attr => {
        node.replaceAttribute(attr.name,
                replaceNumbering(attr.name, value),
                replaceNumbering(attr.value, value));
    });

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

    return defaultRepeater;
}

/**
 * Replaces numbering in given string
 * @param  {String} str
 * @param  {Number} value
 * @return {String}
 */
function replaceNumbering(str, value) {
    // replace numbering in strings only: skip explicit wrappers that could
    // contain unesacped numbering tokens
    if (typeof str === 'string') {
        const ranges = getNumberingRanges(str);
        if (ranges.length) {
            str = replaceNumberingRanges(str, ranges, value);
        }
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
function replaceNumberingRanges(str, ranges, value) {
    return replaceRanges(str, ranges, token => {
        let _value = String(value);
        // pad values for multiple numbering tokens, e.g. 3 for $$$ becomes 003
        while (_value.length < token.length) {
            _value = '0' + _value;
        }
        return _value;
    });
}
