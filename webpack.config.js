const environment = process.env.NODE_ENV;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
const srcPath = path.resolve(__dirname, 'src');
const distPath = path.resolve(__dirname, 'dist');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const HtmlWebpackPlugin = require('html-webpack-plugin');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const glob = require('glob');

const tsPages = `${srcPath}/assets/scripts/pages/`;
const pathList = glob
    .sync('**/*.ts', {
        ignore: '**/_*.ts',
        cwd: tsPages,
    })
    .map((key) => {
        // return [path.basename(key, '.ts'), `${tsPages}/${key}`];
        let dir;
        let tsPath;
        if (path.dirname(key) === '.') {
            dir = 'index';
            tsPath = key;
        } else {
            dir = path.dirname(key) + '/' + path.basename(key, '.ts');
            tsPath = path.dirname(key) + '/' + path.basename(key);
        }
        return [dir, tsPages + tsPath];
    });
const entries = Object.fromEntries(pathList);

const htmlList = glob
    .sync('**/*.html', {
        cwd: path.resolve(__dirname, './src/pages/'),
    })
    .map((key) => {
        let dir;
        if (path.dirname(key) === '.') {
            dir = 'index';
        } else {
            dir = path.dirname(key) + '/' + path.basename(key, '.html');
        }
        return [dir, key];
    });

const generateHtml = () =>
    htmlList
        .filter((item) => item.length > 1)
        .map(
            (item) =>
                new HtmlWebpackPlugin({
                    inject: 'head',
                    scriptLoading: 'defer',
                    template: path.resolve(__dirname, `./src/pages/${item[1]}`),
                    filename: item[1],
                    chunks: [item[0]],
                    minify: false,
                })
        );

const config = {
    context: path.resolve(__dirname, 'src/assets'),

    mode: environment,

    entry: entries,
    output: {
        filename: 'assets/scripts/[name].js?[chunkhash]',
        path: distPath,
        assetModuleFilename: 'assets/img/[name][ext]',
    },

    // webpack-dev-serverの設定
    devServer: {
        static: {
            directory: path.join(srcPath),
            staticOptions: {},
            serveIndex: true,
            watch: true,
        },
        hot: 'only',
        port: 3000,
    },

    resolve: {
        // tsモジュールの解決
        extensions: ['.ts', '.js'],
        alias: {
            '@styles': `${srcPath}/assets/styles`,
            '@scripts': `${srcPath}/assets/scripts`,
        },
    },

    module: {
        rules: [
            {
                // 拡張子 .ts の場合
                test: /\.ts$/,
                // TypeScript をコンパイルする
                use: 'ts-loader',
            },
            {
                test: /(\.s[ac]ss)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                    'postcss-loader',
                ],
            },
        ],
    },

    plugins: [
        new CleanWebpackPlugin({
            cleanStaleWebpackAssets: false,
            verbose: false,
        }),
        new MiniCssExtractPlugin({
            filename: 'assets/css/[name].css?[chunkhash]',
        }),
        ...generateHtml(),
    ],
};

module.exports = config;
