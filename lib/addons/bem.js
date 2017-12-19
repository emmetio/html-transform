'use strict';

const defaultOptions = {
	element: '__',
	modifier: '_'
};

const reElement  = /^(-+)([a-z0-9]+[a-z0-9-]*)/i;
const reModifier = /^(_+)([a-z0-9]+[a-z0-9-]*)/i;
const blockCandidates1 = className => /^[a-z]\-/i.test(className);
const blockCandidates2 = className => /^[a-z]/i.test(className);

/**
 * BEM transformer: updates class names written as `-element` and
 * `_modifier` into full class names as described in BEM specs. Also adds missing
 * class names: fir example, if node contains `.block_modifier` class, ensures
 * that element contains `.block` class as well
 */
export default function(tree, options) {
	options = Object.assign({}, defaultOptions, options);

	tree.walk(node => expandClassNames(node, options));

	const lookup = createBlockLookup(tree);
	tree.walk(node => expandShortNotation(node, lookup, options));

	return tree;
}

/**
 * Expands existing class names in BEM notation in given `node`.
 * For example, if node contains `b__el_mod` class name, this method ensures
 * that element contains `b__el` class as well
 * @param  {Node} node
 * @param  {Object} options
 * @return {Set}
 */
function expandClassNames(node, options) {
	const classNames = node.classList.reduce((out, cl) => {
		// remove all modifiers from class name to get a base element name
		const ix = cl.indexOf(options.modifier);
		if (ix !== -1) {
			out.add(cl.slice(0, ix));
		}

		return out.add(cl);
	}, new Set());

	if (classNames.size) {
		node.setAttribute('class', Array.from(classNames).join(' '));
	}
}

/**
 * Expands short BEM notation, e.g. `-element` and `_modifier`
 * @param  {Node} node      Parsed Emmet abbreviation node
 * @param  {Map} lookup     BEM block name lookup
 * @param  {Object} options
 */
function expandShortNotation(node, lookup, options) {
	const classNames = node.classList.reduce((out, cl) => {
		let prefix, m;
		const originalClass = cl;

		// parse element definition (could be only one)
		if (m = cl.match(reElement)) {
			prefix = getBlockName(node, lookup, m[1]) + options.element + m[2];
			out.add(prefix);
			cl = cl.slice(m[0].length);
		}

		// parse modifiers definitions (may contain multiple)
		while (m = cl.match(reModifier)) {
			if (!prefix) {
				prefix = getBlockName(node, lookup, m[1]);
				out.add(prefix);
			}

			out.add(`${prefix}${options.modifier}${m[2]}`);
			cl = cl.slice(m[0].length);
		}

		if (cl === originalClass) {
			// class name wasn’t modified: it’s not a BEM-specific class,
			// add it as-is into output
			out.add(originalClass);
		}

		return out;
	}, new Set());

	const arrClassNames = Array.from(classNames).filter(Boolean);
	if (arrClassNames.length) {
		node.setAttribute('class', arrClassNames.join(' '));
	}
}

/**
 * Creates block name lookup for each node in given tree, e.g. finds block
 * name explicitly for each node
 * @param  {Node} tree
 * @return {Map}
 */
function createBlockLookup(tree) {
	const lookup = new Map();

	tree.walk(node => {
		const classNames = node.classList;
		if (classNames.length) {
			// guess best block name from class or use parent’s block name
			lookup.set(node,
				find(classNames, blockCandidates1)
				|| find(classNames, blockCandidates2)
				|| lookup.get(node.parent)
			);
		}
	});

	return lookup;
}

/**
 * Returns block name for given `node` by `prefix`, which tells the depth of
 * of parent node lookup
 * @param  {Node} node
 * @param  {Map} lookup
 * @param  {String} prefix
 * @return {String}
 */
function getBlockName(node, lookup, prefix) {
	let depth = prefix.length > 1 ? prefix.length : 0;

	// NB don’t walk up to root node, stay at first root child in case of
	// too deep prefix
	while (node.parent && node.parent.parent && depth--) {
		node = node.parent;
	}

	return lookup.get(node) || '';
}

function find(arr, filter) {
	return arr.filter(filter)[0];
}
