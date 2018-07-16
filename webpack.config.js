var webpack = require('webpack');

module.exports = {
    entry: './src/index.ts',
	mode: 'development',
    output: {
        path: __dirname,
		filename: 'dist/index.js',		
		library: 'common',
		libraryTarget: 'umd',
		umdNamedDefine: true
    },
    resolve: {
        extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js', '.jsx']
    },
    module: {
		rules: [{
			exclude: /node_modules/,
			test: /\.tsx?$/,
			use: { loader: 'ts-loader' }
		}]
    },
	externals: {
		fs: {},
		tls: {},
		net: {},
		console: {}
	}
}
