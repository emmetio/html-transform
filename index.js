'use strict';

import implicitTags from './lib/implicit-tags';
import applyNumbering from './lib/numbering';
import { prepare, insert } from './lib/repeater-content';
import addons from './lib/addons/index';

/**
 * Applies basic HTML-specific transformations for given parsed abbreviation:
 * – resolve implied tag names
 * – insert repeated content
 * – resolve node numbering
 */
export default function(tree, content, appliedAddons) {
    if (typeof content === 'string') {
        content = [content];
    } else if (content && typeof content === 'object' && !Array.isArray(content)) {
        appliedAddons = content;
        content = null;
    }

    return tree
    .use(implicitTags)
    .use(prepare, Array.isArray(content) ? content.length : null)
    .use(applyNumbering)
    .use(insert, content)
    .use(addons, appliedAddons);
}
