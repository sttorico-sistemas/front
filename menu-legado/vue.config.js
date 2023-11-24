const { defineConfig } = require('@vue/cli-service');
const path = require('path');

module.exports = defineConfig({
    transpileDependencies: true,
    publicPath: './',

    configureWebpack: {
        module: {
            rules: [
                {
                    test: /\.pdf$/,
                    loader: 'file-loader',
                    options: {
                        name: 'pdfs/[name].[hash:8].[ext]',
                    },
                },
            ],
        },
    },
});

