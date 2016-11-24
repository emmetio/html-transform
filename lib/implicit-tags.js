'use strict';

const inlineElements = new Set('a,abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,code,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,select,small,span,strike,strong,sub,sup,textarea,tt,u,var'.split(','));
const elementMap = {
    p: 'span',
    ul: 'li',
    ol: 'li',
    table: 'tr',
    tr: 'td',
    tbody: 'tr',
    thead: 'tr',
    tfoot: 'tr',
    colgroup: 'col',
    select: 'option',
    optgroup: 'option',
    audio: 'source',
    video: 'source',
    object: 'param',
    map: 'area'
};

/**
 * Adds missing tag names for given tree depending on node’s parent name
 */
export default function(tree) {
    tree.walk(node => {
        // resolve only nameless nodes without content
        if (node.name == null && node.attributes.length) {
            node.name = resolveName(node.parent.name);
        }
    });
    return tree;
}

/**
 * Returns best node name for given parent node name
 * @param  {String} parentName Name of parent node
 * @return {String}
 */
export function resolveName(parentName) {
    parentName = (parentName || '').toLowerCase();
    return elementMap[parentName]
        || (inlineElements.has(parentName) ? 'span' : 'div');
}
