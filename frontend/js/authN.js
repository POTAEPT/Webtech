document.addEventListener("DOMContentLoaded", () => {
    // อ้างอิงถึง Element ต่างๆ บนหน้าเว็บ
    const loginBtn = document.getElementById('loginBtn');
    const welcomeArea = document.getElementById('welcomeArea');
    const displayUsername = document.getElementById('displayUsername');
    const logoutBtn = document.getElementById('logoutBtn');

    // 🛡️ Logic ใหม่: ตรวจสอบหา JWT Token จาก LocalStorage
    const token = localStorage.getItem('amado_token');
    const displayName = localStorage.getItem('displayName');

    if (token) {
        // หากมี Token ถือว่าล็อกอินแล้ว: ซ่อนปุ่ม Login โชว์ข้อความทักทาย
        if (loginBtn) loginBtn.style.display = 'none';
        if (welcomeArea) {
            welcomeArea.style.display = 'inline-block';
            displayUsername.innerText = displayName;
        }
    } 

    // ดักจับการกดปุ่ม Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            // ทำลายบัตรผ่าน (Token) และข้อมูลทิ้ง
            localStorage.removeItem('amado_token');
            localStorage.removeItem('displayName');
            
            // รีเฟรชหน้าต่างปัจจุบัน เพื่อเคลียร์หน้าจอและกลับสู่สถานะยังไม่ล็อกอิน
            window.location.reload();
        });
    }
});