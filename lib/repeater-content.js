'use strict';

/**
 * Placeholder for inserted content
 */
const placeholder = '$#';

/**
 * Inserts content into node with implicit repeat count: this node is then
 * duplicated for each content item and content itself is inserted either into
 * deepest child or instead of a special token
 * @param {Node} tree Parsed abbreviation
 * @param {Array[String]} content Array of content items to insert
 * @return {Node}
 */
export default function(tree, content) {
    if (Array.isArray(content) && content.length) {

    }
    return tree;
}

function hasImplicitRepeat(node) {
    return node.repeat && node.repeat.count === null;
}

/**
 * Locates output placeholders in given string and returns their locations
 * @param  {String} str
 * @return {Array}  Array of placeholder ranges
 */
export function findPlaceholders(str) {
    const result = new Set();
    const plen = placeholder.length;

    // 1. Find all occurances of placeholder
    let pos = 0;
    while ((pos = str.indexOf(placeholder, pos)) !== -1) {
        result.add(pos);
        pos += plen;
    }

    if (result.size) {
        // 2. Remove ones that escaped
        let pos = 0;
        const len = str.length;

        while (pos < len) {
            if (str[pos++] === '\\') {
                result.delete(pos++);
                continue;
            }
        }
    }

    return Array.from(result).map(ix => range(ix, plen));
}

function range(start, length) {
    return [start, length];
}
