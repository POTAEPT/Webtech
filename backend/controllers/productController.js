// backend/controllers/productController.js
const productService = require('../services/productService');

/**
 * 1. ฟังก์ชันดั้งเดิม: ดึงข้อมูลสินค้า "ทั้งหมด"
 */
async function getProducts(req, res) {
    try {
        const products = await productService.getAllProducts();
        res.status(200).json(products);
    } catch (error) {
        console.error("Error in getProducts controller:", error.message);
        res.status(500).json({ 
            success: false, 
            message: 'Server Error: Unable to retrieve products.' 
        });
    }
}

/**
 * 2. ฟังก์ชันใหม่ (Weekend Work): ดึงข้อมูลแบบมี Gatekeeper คัดกรอง Category
 */
async function getProductsByCategory(req, res) {
    try {
        // แกะซองจดหมายเพื่อดึงค่า Query Parameter
        const requestedCategory = req.query.category;

        // Gatekeeper: ตรวจสอบความถูกต้องของข้อมูล
        if (!requestedCategory || requestedCategory.trim() === '') {
            return res.status(400).json({
                status: "fail",
                message: "Gatekeeper alert: Missing or invalid category parameter."
            });
        }

        // Processing: ดึงข้อมูลและคัดกรอง
        const allProducts = await productService.getAllProducts();
        const filteredProducts = allProducts.filter(
            product => product.category.toLowerCase() === requestedCategory.toLowerCase()
        );

        // Response: ส่งข้อมูลกลับ
        res.status(200).json({
            status: "success",
            results: filteredProducts.length,
            data: filteredProducts
        });

    } catch (error) {
        console.error("Error Processing Request:", error);
        res.status(500).json({
            status: "fail",
            message: "Internal Server Error during processing."
        });
    }
}

module.exports = {
    getProducts,
    getProductsByCategory
};