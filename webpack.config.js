const DtsBundleWebpack = require('dts-bundle-webpack')

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
	},
	optimization: {
		minimize: true
	},
	plugins: [
		new DtsBundleWebpack({
			name: 'physics-common',
			main: 'dist/**/*.d.ts',
			out: 'index.d.ts',
			removeSource: true,
			outputAsModuleFolder: true
		})
	]
}