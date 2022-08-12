const {createProxyMiddleware} = require('http-proxy-middleware')


module.exports = function (app) {
    app.use(createProxyMiddleware('/api', {
        target: 'http://172.25.118.70:8000', changeOrigin: true, pathRewrite: {'^/api': '/api'}
    }))
    // app.use(createProxyMiddleware('/api', {
    //     target: 'http://172.25.118.70:8000', changeOrigin: true, pathRewrite: {'^/media': '/media'}
    // }))

}


