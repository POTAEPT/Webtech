document.addEventListener("DOMContentLoaded", () => {
    // 1. อ้างอิงถึง Group และ Element ต่างๆ
    const guestGroup = document.getElementById('guestGroup');
    const userGroup = document.getElementById('userGroup');
    const displayUsername = document.getElementById('displayUsername');
    const logoutBtn = document.getElementById('logoutBtn');

    // 2. ตรวจสอบสถานะจาก Token ใน LocalStorage
    const token = localStorage.getItem('amado_token');
    const displayName = localStorage.getItem('displayName');

    // 3. Logic การสลับการแสดงผล (State Management)
    if (token) {
        // กรณี: ล็อคอินแล้ว
        // - ซ่อนปุ่ม Login/Register
        if (guestGroup) guestGroup.style.display = 'none';
        
        // - แสดงข้อความต้อนรับและปุ่ม Logout
        if (userGroup) {
            userGroup.style.display = 'block'; // หรือ 'flex', 'inline-block' ตามโครงสร้าง CSS
            if (displayUsername) {
                // เอาชื่อที่เก็บไว้มาใส่ใน HTML
                displayUsername.innerText = displayName || 'User'; 
            }
        }
    } else {
        // กรณี: ยังไม่ล็อคอิน (หรือไม่มี Token)
        // - แสดงปุ่ม Login/Register ตามปกติ
        if (guestGroup) guestGroup.style.display = 'block';
        
        // - ซ่อนกล่องข้อความต้อนรับและปุ่ม Logout
        if (userGroup) userGroup.style.display = 'none';
    }

    // 4. ผูก Event ให้กับปุ่ม Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            // ทำลาย Token และข้อมูลผู้ใช้ทิ้ง
            localStorage.removeItem('amado_token');
            localStorage.removeItem('displayName');
            
            // นำผู้ใช้กลับไปหน้า Login หรือรีเฟรชหน้าเว็บ
            // ในที่นี้ นัทให้ Redirect ไปหน้า Login เพื่อความชัวร์ว่าออกจากระบบจริง
            window.location.href = 'login.html'; 
        });
    }
});