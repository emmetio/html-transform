'use strict';

import bem from './bem';
import jsx from './jsx';
import xsl from './xsl';

const supportedAddons = { bem, jsx, xsl };

/**
 * Runs additional transforms on given tree.
 * These transforms may introduce side-effects and unexpected result
 * so they are not applied by default, authors must specify which addons
 * in `addons` argument as `{addonName: addonOptions}`
 * @param {Node} tree Parsed Emmet abbreviation
 * @param {Object} addons Add-ons to apply and their options
 */
export default function(tree, addons) {
    Object.keys(addons || {}).forEach(key => {
        if (key in supportedAddons) {
            const addonOpt = typeof addons[key] === 'object' ? addons[key] : null;
            tree = tree.use(supportedAddons[key], addonOpt);
        }
    });

    return tree;
}
