const path = require('path') // 引用path模块
const { DefinePlugin } = require('webpack');

process.env.NODE_ENV = 'production'
module.exports = {
    // 入口文件
    entry: "./src/index.js",
    // 打包后的出口文件
    output: {
        // 输出的路径  是绝对路径(导入path模块) 这里是用node来做的
        path: path.resolve(__dirname, 'build'),
        // 输出的文件名称
        filename: 'js/bundle.js',
    },
    // 使用开发模式打包
    mode: "production",
    devtool: 'inline-source-map',
    plugins: [
        new DefinePlugin({
            baseURL: '/learn-react/',
        }),
    ],
}