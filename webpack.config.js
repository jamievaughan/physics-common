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
		minimize: false
	},
	plugins: [
		new DtsBundleWebpack({
			name: 'twodee',
			main: 'dist/**/*.d.ts',
			out: 'index.d.ts',
			removeSource: false,
			outputAsModuleFolder: true
		})
	]
}