// import 文を使って sub.js ファイルを読み込む。
import {hello} from './sub';

// import 文を使ってstyle.cssファイルを読み込む。
//import './index.css';
// import文を使ってSassファイルを読み込む。
import './index.scss';

// Bootstrapのスタイルシート側の機能を読み込む
//import 'bootstrap/dist/css/bootstrap.min.css';
// BootstrapのJavaScript側の機能を読み込む
import 'bootstrap';

// sub.jsに定義されたJavaScriptを実行する。
hello();

// base64データがビルドされるのでそれをimportする
import jpg from './thumb.jpg';
$("img").attr("src", jpg);
