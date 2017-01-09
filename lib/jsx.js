'use strict';

/**
 * JSX transformer: replaces `class` and `for` attributes with `className` and
 * `htmlFor` attributes respectively
 */
export default function(tree) {
	tree.walk(node => {
		replace(node, 'class', 'className');
		replace(node, 'for', 'htmlFor');
	});
	return tree;
}

function replace(node, oldName, newName) {
	let attr = node.getAttribute(oldName);
	if (attr) {
		attr.name = newName;
	}
}
