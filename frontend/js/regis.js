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
    try {
        // ใช้ await เพื่อรอให้ fetch ทำงานเสร็จสมบูรณ์
        const response = await fetch('/api/register', {
            method: 'POST', 
            headers: {
                // แจ้ง Backend ว่าข้อมูลที่ส่งไป (Body) เป็นรูปแบบ JSON
                'Content-Type': 'application/json' 
            },
            // ใช้ JSON.stringify() เพื่อแปลง Object ของ JS เป็นสตริง JSON ก่อนส่งข้ามเครือข่าย
            body: JSON.stringify(payload) 
        });

        // 8. ตรวจสอบผลลัพธ์ที่ Backend ตอบกลับมา (HTTP Status Code 200-299 ถือว่า ok)
        if (response.ok) {
            // กรณี Backend ตอบกลับว่าสร้างบัญชีสำเร็จ
            const responseData = await response.json(); // สมมติว่า Backend คืนค่า JSON กลับมาด้วย
            console.log('Success:', responseData);
            alert('สมัครสมาชิกสำเร็จ!');
            registerForm.reset(); // ล้างฟอร์มให้เป็นหน้าว่าง
        } else {
            // กรณี Backend ตอบกลับมาว่ามี Error (เช่น อีเมลซ้ำในระบบ)
            alert('ไม่สามารถสมัครสมาชิกได้ โปรดตรวจสอบข้อมูลอีกครั้ง');
        }
    } catch (error) {
        // 9. ส่วน catch ดักจับ Error กรณีเกิดปัญหากับเครือข่าย เช่น เน็ตหลุด หรือ Backend ล่ม
        console.error('Network Error:', error);
        alert('ระบบมีปัญหาขัดข้อง ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
    }
});