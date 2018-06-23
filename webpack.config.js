// [定数] webpack の出力オプションを指定します
// 'production' か 'development' を指定
const MODE = 'development';

// ソースマップの利用有無(productionのときはソースマップを利用しない)
const enabledSourceMap = (MODE === 'development');

const webpack = require('webpack');

module.exports = {
	// モード値を production に設定すると最適化された状態で、
	// development に設定するとソースマップ有効でJSファイルが出力される
	mode: MODE,
	// メインとなるJavaScriptファイル（エントリーポイント）
	entry: `./src/index.js`,
	// ファイルの出力設定
	output: {
		//  出力ファイルのディレクトリ名
		path: `${__dirname}/dist`,
		// 出力ファイル名
		filename: 'main.js'
	},
	// ローカル開発用環境を立ち上げる
	// 実行時にブラウザが自動的に localhost を開く
	devServer: {
		contentBase: 'dist',
		open: true
	},
	module: {
		rules: [
			{
				// 拡張子が.cssのファイルに対して
				test: /\.css/,
				// 配列で指定したLoaderが後ろから順番に適用
				use: [
					// <link>にCSSを展開、動的にstyleタグ作成
					'style-loader', {
						// cssをjsにバンドル、cssのurl()や@import文を、jsのrequire()に変換
						loader: 'css-loader',
						options: {
							// CSS内のurl()メソッドの取り込みを禁止
							url: false,
							// CSSの空白文字を削除
							minimize: true,
							// ソースマップを有効に
							sourceMap: enabledSourceMap,
						}
					},
				],
			},
			{
				test: /\.scss/,
				use: [
					// linkタグに出力する機能
					'style-loader',
					// CSSをバンドルするための機能
					{
						loader: 'css-loader',
						options: {
							// オプションでCSS内のurl()メソッドの取り込みを禁止する
							url: true,
							// ソースマップの利用有無
							sourceMap: enabledSourceMap,
							// 0 => no loaders (default);
							// 1 => postcss-loader;
							// 2 => postcss-loader, sass-loader
							importLoaders: 2
						},
					},
					// PostCSSのための設定
					{
						loader: 'postcss-loader',
						options: {
							// PostCSS側でもソースマップを有効にする
							sourceMap: enabledSourceMap,
							plugins: [
								// Autoprefixerを有効化
								// ベンダープレフィックスを自動付与する
								require('autoprefixer')({grid: true})
							]
						},
					},
					// Sassをバンドルするための機能
					{
						loader: 'sass-loader',
						options: {
							// ソースマップの利用有無
							sourceMap: enabledSourceMap,
						}
					}
				],
			},
			{
				// 対象となるファイルの拡張子
				test: /\.(gif|png|jpg|eot|wof|woff|woff2|ttf|svg)$/,
				// 画像をBase64として取り込む
				use: [{
					loader: 'url-loader',
					options: {
						limit: 100 * 1024, // 100KB以上だったら埋め込まずファイルとして分離する
						name: './img/[name].[ext]'
					}
				}]
			},
		]
	},
	plugins: [
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery'
		})
	]
};