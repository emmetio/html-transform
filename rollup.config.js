export default {
	entry: './index.js',
	external: ['@emmetio/implicit-tag'],
	targets: [
		{format: 'cjs', dest: 'dist/html-transform.cjs.js'},
		{format: 'es',  dest: 'dist/html-transform.es.js'}
	]
};
