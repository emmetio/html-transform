export default {
	entry: './index.js',
	targets: [
		{format: 'cjs', dest: 'dist/html-transform.cjs.js'},
		{format: 'es',  dest: 'dist/html-transform.es.js'}
	]
};
