const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/community',
        createProxyMiddleware({
            "*": "http:localhost:3000",
            target: 'http://52.79.155.156:3001',
            changeOrigin: true,
        })
    );
};