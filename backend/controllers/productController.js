// backend/controllers/productController.js
const productService = require('../services/productService');

/**
 * Handler สำหรับ GET /api/products
 */
async function getProducts(req, res) {
    try {
        // สั่งให้ Service ไปดึงข้อมูลมา
        const products = await productService.getAllProducts();
        
        // ถ้าสำเร็จ ส่ง HTTP Status 200 (OK) พร้อมข้อมูล JSON แบบตรงไปตรงมา
        res.status(200).json(products);
    } catch (error) {
        console.error("Error in getProducts controller:", error.message);
        
        // สไตล์ DevSecOps: ถ้ามี Error ข้างหลังบ้าน เราจะไม่ส่ง Error Stack กลับไปให้ Client เห็น
        // แต่เราจะส่งข้อความแบบกว้างๆ พร้อม Status 500 (Internal Server Error)
        res.status(500).json({ 
            success: false, 
            message: 'Server Error: Unable to retrieve products.' 
        });
    }
}

module.exports = {
    getProducts
};