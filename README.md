# webpack Smaple

## Setup

```sh
$ mkdir ~/develop/webpack/sample && cd ~/develop/webpack/sample # フォルダ作成
$ npm init -y # 初期化
$ npm install -D webpack webpack-cli # devDependenciesにWebpackのインストール
$ code . # VSCodeで開く
```

## Build

index.js内で必要なsub.jsが統合、distフォルダーのなかにmain.jsとして出力

```sh
$ npx webpack
```

## npm scripts

package.jsonのscriptsに

（内部的に`npx webpack`が呼び出されるスクリプト）

```json
"scripts": {
  "build": "webpack"
},
```

build実行

```sh
$ npm run build
```

## webpack.config.jsファイル

webpackの挙動を調整

* エントリーポイントを指定(entry)
* 出力フォルダーをカスタマイズ(output)
* モード値に「production」「development」を指定(mode)

## webpack-dev-server

ローカルサーバーを起動し、変更時にブラウザをリロード

webpack-dev-serverをdevDependenciesにインストール

```sh
$ npm install -D webpack-dev-server
```

package.jsonにローカルサーバーを起動するスクリプトを追記

（内部的に`npx webpack-dev-server`が呼び出されるコマンド）

```json
"scripts": {
  "start": "webpack-dev-server"
},
```

webpack.config.jsにdevServerの設定を追記

```js
  // ローカル開発用環境を立ち上げる
  // 実行時にブラウザが自動的に localhost を開く
  devServer: {
    contentBase: 'dist',
    open: true
  }
```

devServerの実行

```sh
$ npm run start
```

後継の`webpack-serve`がある、後で調べたい。

## 差分ビルド（watch）

package.jsonに差分ビルドを実行するスクリプトを追記

（内部的に`npx webpack --watch`が呼び出されるコマンド）

```json
"scripts": {
  "watch": "webpack --watch"
},
```

差分ビルドの実行

```sh
$ npm run watch
```

## CSSファイルの読み込み

各loaderをdevDependenciesにインストール

```sh
$ npm i -D style-loader css-loader
```

webpack.config.jsにmodule.rulesの設定を追記

```js
  module: {
    rules: [
      {
        test: /\.css/,
        use: [
          'style-loader', {loader: 'css-loader', options: {url: false}},
        ],
      },
    ]
  }
```

## SCSSファイルの読み込み

各loaderをdevDependenciesにインストール

```sh
$ npm i -D sass-loader node-sass style-loader css-loader
```

webpack.config.jsにmodule.rulesの設定を追記

```js
  module: {
    rules: [
      // Sassファイルの読み込みとコンパイル
      {
        test: /\.scss/, // 対象となるファイルの拡張子
        use: [
          // linkタグに出力する機能
          'style-loader',
          // CSSをバンドルするための機能
          {
            loader: 'css-loader',
            options: {
              // オプションでCSS内のurl()メソッドの取り込みを禁止する
              url: false,
              // ソースマップの利用有無
              sourceMap: enabledSourceMap,
 
              // 0 => no loaders (default);
              // 1 => postcss-loader;
              // 2 => postcss-loader, sass-loader
              importLoaders: 2
            },
          },
          {
            loader: 'sass-loader',
            options: {
              // ソースマップの利用有無
              sourceMap: enabledSourceMap,
            }
          }
        ],
      },
    ]
  }
```

## 画像をバンドル

画像はBase64文字列として変換され、コンパイル後のJSファイルに含まれる

各loaderをdevDependenciesにインストール

```sh
$ npm i -D url-loader
```

webpack.config.jsにmodule.rulesの設定を追記

```js
  module: {
    rules: [
      {
        // 対象となるファイルの拡張子
        test: /\.(gif|png|jpg|eot|wof|woff|woff2|ttf|svg)$/,
        // 画像をBase64として取り込む
        loader: 'url-loader'
      }
    ]
  }
```

## 大きい画像はバンドルしない

画像はBase64文字列として変換され、コンパイル後のJSファイルに含まれるが、
Base64に変換するとファイルサイズが大きくなり、jsが肥大化する。

各loaderをdevDependenciesにインストール

```sh
$ npm i -D file-loader
```

webpack.config.jsにmodule.rulesの設定を追記

```js
  module: {
    rules: [
      {
        // 対象となるファイルの拡張子
        test: /\.(gif|png|jpg|eot|wof|woff|woff2|ttf|svg)$/,
        // 画像をBase64として取り込む
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 100 * 1024, // 100KB以上だったら埋め込まず、dist/imgにファイルを配置
              name: './img/[name].[ext]'
            }
          }
        ]
      }
    ]
  }
```

## ベンダープレフィックスを自動化

各loaderをdevDependenciesにインストール

```sh
$ npm i -D postcss-loader autoprefixer
```

webpack.config.jsのcss-loaderとsass-loaderの間に設定を追記

```js
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
```

## Bootstrapをバンドル

bootstrapをインストール

```sh
$ npm install --save bootstrap jquery popper.js
```

index.jsでjpgを読み込み、JQueryでimg.srcに設定

webpack.config.jsのpluginにJQueryの設定を追加

```js
const webpack = require('webpack');

module.exports = {
	plugins: [
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery'
		})
	]
};
```

http://localhost:8080/album.html
