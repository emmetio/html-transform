'use strict';

import resolveImplicitTag from '@emmetio/implicit-tag';

/**
 * Adds missing tag names for given tree depending on node’s parent name
 */
export default function(tree) {
    tree.walk(node => {
        // resolve only nameless nodes without content
        if (node.name == null && node.attributes.length) {
            node.name = resolveImplicitTag(node.parent.name);
        }
    });
    return tree;
}
