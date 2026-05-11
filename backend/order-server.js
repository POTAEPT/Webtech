// backend/order-server.js
const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 4000;

// นำเข้า Routes
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');

app.use(cors());

// Middleware ตัวพื้นฐานสำหรับการ Parse JSON
app.use(express.json());

// ประกาศใช้งาน Routing
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);

// ทดสอบยิงหน้า Root ของเซิร์ฟเวอร์
app.get('/', (req, res) => {
    res.send('Amado Backend is running! Access /api/products to see the data.');
});

app.listen(PORT, () => {
    console.log('🛒 Order Service is running on http://localhost:4000');
});
