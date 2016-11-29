var webpack = require('webpack'),
	path = require('path'),
	ExtractTextPlugin = require('extract-text-webpack-plugin'),
	CleanWebpackPlugin = require('clean-webpack-plugin'),
	HtmlWebpackPlugin = require('html-webpack-plugin'),
	extractCSS = new ExtractTextPlugin('./[name].[contenthash:8].css'),
	isBuild = ( process.env.BUILD === 'yes' );

var rules = [
	{
		test: /\.less$/,
		loader: extractCSS.extract({
			fallbackLoader: 'style-loader',
			loader: 'css-loader!postcss-loader!less-loader'
		})
	},
	{
		test: /\.(jpe?g|png|gif|webp)$/,
		loader: 'file-loader?name=./img/[name].[hash:8].[ext]'
	},
	{
		test: /\.html$/,
		loader: 'html-loader'
	},
	{
		test: /\.hbs$/,
		loader: 'handlebars-loader!html-minify-loader'
	},
	{
		test: /\.(mp3|ogg)$/,
		loader: 'file-loader?name=./audio/[name].[ext]'
	},
	{
		test: /\.(woff2|woff|ttf|svg)$/,
		include: path.resolve(__dirname, 'src', 'font'),
		loader: 'file-loader?name=./font/[hash:8].[ext]'
	}
]

var plugins = [
	extractCSS,
	new HtmlWebpackPlugin({
		template: path.resolve(__dirname, 'src', './view/index'),
	})
]

var buildPlugins = [
	new CleanWebpackPlugin(['build']),
	new webpack.optimize.UglifyJsPlugin({
		compress: {
			drop_console: true
		}
	})
]

if(isBuild) {
	plugins = plugins.concat(buildPlugins);
}

module.exports = {
	devtool: isBuild?'':'eval',
	entry: {
		build: path.resolve(__dirname, 'src', 'js', 'animation-bootstrap.js')
	},
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: '[name].[chunkhash:8].js',
		chunkFilename: '[name].[chunkhash:8].[id].js'
	},
	devServer: {
		contentBase: path.resolve(__dirname, 'build'),
		host: '0.0.0.0',
		inline: true,
		compress: true
	},
	resolve: {
		extensions: [ '.js', '.less', '.hbs', '.html' ]
	},
	module: {
		rules: rules
	},
	plugins: plugins
}
