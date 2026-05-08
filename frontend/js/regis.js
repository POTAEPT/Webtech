// 1. เชื่อมต่อกับ Element ใน HTML ผ่าน ID
const registerForm = document.getElementById('registerForm');
const passwordError = document.getElementById('passwordError');

// 2. ดักฟัง Event 'submit' เมื่อมีการกดปุ่มสมัครสมาชิก
// สังเกตว่าฟังก์ชันมีคำว่า async นำหน้า เพื่อให้เราใช้คำสั่ง await ข้างในได้
registerForm.addEventListener('submit', async function(event) {
    
    // สำคัญมาก: หยุดการ Refresh หน้าเว็บ ซึ่งเป็นพฤติกรรม Default ของฟอร์ม HTML
    event.preventDefault();

    // ซ่อนข้อความ Error ไว้ก่อนเสมอเมื่อมีการกด Submit ใหม่
    passwordError.style.display = 'none';

    // 3. ดึงค่า (Value) ที่ผู้ใช้กรอกเข้ามา
const firstNameValue = document.getElementById('first_name').value;
const usernameValue = document.getElementById('username').value;
const passwordValue = document.getElementById('password').value;

    // 4. กำหนด Regex Pattern ตรวจสอบความปลอดภัยของรหัสผ่าน
    // ^ เริ่มต้น | (?=.*[A-Z]) มีพิมพ์ใหญ่ซ่อนอยู่ | (?=.*[!@#$%^&*]) มีอักขระพิเศษซ่อนอยู่ | .{8,} ยาว 8 ตัวขึ้นไป | $ สิ้นสุด
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;

    // 5. ตรวจสอบรหัสผ่านด้วยเมธอด .test()
    if (!passwordRegex.test(passwordValue)) {
        // หากได้ค่า false แปลว่าไม่ผ่านเงื่อนไข ให้แสดงข้อความ Error
        passwordError.style.display = 'block';
        // return เป็นการเบรกการทำงานของฟังก์ชันนี้ทันที โค้ดด้านล่างจะไม่ถูกทำงานต่อ
        return; 
    }

    // 6. เมื่อข้อมูลผ่าน Validation จัดเตรียมข้อมูลให้อยู่ในรูป Object
const payload = {
    username: usernameValue,  // ตรงกับ JSON
    password: passwordValue,
    first_name: firstNameValue // ตรงกับ JSON
};

    // 7. กระบวนการส่งข้อมูลไปยัง Backend
    // 7. กระบวนการส่งข้อมูลไปยัง Backend
    try {
        // ❌ ของเดิม: const response = await fetch('/api/register', {
        
        // ✅ เปลี่ยนเป็นบรรทัดนี้ครับ:
        const response = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(payload) 
        });

        if (response.ok) {
            const responseData = await response.json(); 
            alert('สมัครสมาชิกสำเร็จ!');
            registerForm.reset(); 
            // แนะนำเพิ่มเติม: สมัครเสร็จแล้วให้เด้งไปหน้าล็อกอินเลย
            window.location.href = 'login.html';
        } else {
            alert('ไม่สามารถสมัครสมาชิกได้ อาจจะมี Username นี้ในระบบแล้ว');
        }
    } catch (error) {
        console.error('Network Error:', error);
        alert('ระบบมีปัญหาขัดข้อง ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
    }
});