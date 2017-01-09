'use strict';

const reSupporterNames = /^xsl:(variable|with\-param)$/i;

/**
 * XSL transformer: removes `select` attributes from certain nodes that contain
 * children
 */
export default function(tree) {
	tree.walk(node => {
		if (reSupporterNames.test(node.name || '') && (node.children.length || node.value)) {
			node.removeAttribute('select');
		}
	});
	return tree;
}
