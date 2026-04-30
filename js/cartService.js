
/**
 * 1. โหลดข้อมูลตะกร้าเริ่มต้น
 * LocalStorage เก็บข้อมูลเป็น String เสมอ ดังนั้นเวลาดึงออกมาใช้ 
 * ต้องแปลงกลับเป็น Object ด้วย JSON.parse()
 * ถ้าเพิ่งเปิดเว็บครั้งแรก (ไม่มีข้อมูล) ให้คืนค่าเป็น Object เปล่า {}
 */
let cart = JSON.parse(localStorage.getItem('amadoCart')) || {};

/**
 * 2. ฟังก์ชันอัปเดต UI (จำนวนสินค้าในตะกร้ามุมขวาบน)
 */
function updateCartUI() {
    // หา Element <span> ที่อยู่ในเมนู Cart ของเทมเพลต Amado
    const cartCountSpan = document.querySelector('.cart-nav span');
    
    if (cartCountSpan) {
        let totalItems = 0;
        
        // วนลูปตามจำนวน Key (Product ID) ในตะกร้า เพื่อหาผลรวมจำนวนชิ้น
        for (let productId in cart) {
            totalItems += cart[productId];
        }
        
        // อัปเดตตัวเลขกลับเข้าไปใน DOM
        cartCountSpan.textContent = `(${totalItems})`;
    }
}

/**
 * 3. ฟังก์ชันบันทึกข้อมูลลง LocalStorage
 */
function saveCart() {
    // ก่อนเซฟ ต้องแปลง Object ให้เป็น String ด้วย JSON.stringify()
    localStorage.setItem('amadoCart', JSON.stringify(cart));
    
    // บันทึกเสร็จแล้ว สั่งอัปเดต UI ทันที
    updateCartUI();
}

/**
 * 4. ฟังก์ชันหลักสำหรับเพิ่มสินค้าลงตะกร้า
 * (ย้ายมาจากที่เราเขียนไว้ใน shop.html)
 */
function handleAddToCart(id) {
    if (cart[id]) {
        cart[id] += 1;
    } else {
        cart[id] = 1;
    }
    
    console.log("Cart Status:", cart);
    
    // เรียกใช้ฟังก์ชันเซฟ (ซึ่งจะไปเรียก Update UI ต่อให้อัตโนมัติ)
    saveCart();
}

// 5. เมื่อโหลดหน้าเว็บเสร็จ ให้อัปเดต UI ทันที 1 ครั้ง 
// เผื่อว่ามีของในตะกร้าอยู่แล้วตั้งแต่ตอนเปิดเว็บมา
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
});