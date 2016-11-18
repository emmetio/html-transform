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
