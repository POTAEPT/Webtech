// backend/gateway.js
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 5000;

app.use(cors());

app.use(
    '/api/products',
    createProxyMiddleware({
        target: 'http://127.0.0.1:3000',
        changeOrigin: true
    })
);

app.use(
    '/api/orders',
    createProxyMiddleware({
        target: 'http://127.0.0.1:4000',
        changeOrigin: true
    })
);

app.listen(PORT, () => {
    console.log('🚪 API Gateway is running on http://localhost:5000');
});
