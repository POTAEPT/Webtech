// backend/server.js
const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 3000;

// นำเข้า Routes
const productRoutes = require('./routes/products');

app.use(cors());

// Middleware ตัวพื้นฐานสำหรับการ Parse JSON
app.use(express.json());

// ประกาศใช้งาน Routing
// หมายความว่า URL อะไรก็ตามที่ขึ้นต้นด้วย '/api/products' จะถูกส่งไปให้ productRoutes จัดการ
app.use('/api/products', productRoutes);

// ทดสอบยิงหน้า Root ของเซิร์ฟเวอร์
app.get('/', (req, res) => {
    res.send('Amado Backend is running! Access /api/products to see the data.');
});

app.listen(PORT, () => {
    console.log(`Server is listening securely on http://localhost:${PORT}`);
});