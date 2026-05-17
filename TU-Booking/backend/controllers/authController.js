import User from '../models/User.js'; // นำเข้า Model ที่เราสร้างไว้

export const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'กรุณากรอก Username และ Password' });
    }

    try {
        // 1. คุยกับ REST API ของมหาลัยตามลอจิกเดิมของคุณ
        const tuApiUrl = `https://restapi.tu.ac.th/api/v2/profile/std/info/?id=${password}`;
        
        const response = await fetch(tuApiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Application-Key': 'TU6c11ad3c3e8a28360b79dc1c27bc6b0621ea2dd3b7410f5c2d76d74c39c1106b0a5f3a176400bd358d81f97bac8eb139' 
            }
        });

        const result = await response.json();

        // 2. ตรวจสอบเงื่อนไขผลลัพธ์จาก TU REST API
        if (response.ok && result.status === true) {
            const apiEmail = result.data.email.toLowerCase();
            const inputUsername = username.toLowerCase();

            if (inputUsername === apiEmail) {
                
                const stdId = result.data.userName; // ดึงรหัสนักศึกษาออกมาจากก้อน API มหาลัย
                
                // ----------------------------------------------------------------
                // 3. เริ่มต้นทำระบบตรวจสอบร่วมกับ MongoDB ข้อมูลส่วนตัวของเรา
                // ----------------------------------------------------------------
                let user = await User.findOne({ studentId: stdId });

                // 👉 ลอจิกสำคัญ: หากเป็นการเข้าสู่ระบบครั้งแรก (ไม่เจอใน DB) ให้บันทึกข้อมูลใหม่ลงไปทันที
                if (!user) {
                    user = await User.create({
                        studentId: stdId,
                        name: result.data.displayname_th,
                        role: 'student', // ทุกคนที่เข้ามาครั้งแรกเป็น Student เสมอตามแผน
                        points: 150      // แต้มสะสมตั้งต้น
                    });
                }

                // 👉 ลอจิกเพิ่มเติม: หากผู้ใช้งานคนนี้ติดสถานะ "ถูกระงับสิทธิ์ (แบน)" อยู่ ไม่ให้ผ่านเข้าระบบจอง
                if (user.banUntil) {
                    const today = new Date();
                    if (today <= user.banUntil) {
                        return res.status(403).json({ 
                            error: `บัญชีนี้ถูกระงับสิทธิ์ชั่วคราวเนื่องจากผิดกฎระบบจอง จนถึงวันที่ ${new Date(user.banUntil).toLocaleDateString('th-TH')}` 
                        });
                    }
                }

                // 4. ข้อมูลถูกต้องและผ่านเงื่อนไขทั้งหมด ส่งข้อมูลผสมกลับไปให้ฝั่ง React หน้าบ้านทำงาน
                return res.status(200).json({
                    message: 'Login สำเร็จ',
                    user: {
                        studentId: user.studentId,
                        name: user.name,
                        role: user.role, // 👉 บรรทัดนี้แหละที่จะส่งค่า 'student' หรือ 'admin' ไปบอก React
                        points: user.points
                    }
                });

            } else {
                return res.status(401).json({ error: 'Username ไม่ถูกต้อง' });
            }
        } else {
            return res.status(401).json({ error: result.message || 'รหัสนักศึกษา หรือ Password ของ TU ไม่ถูกต้อง' });
        }

    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ error: 'เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์มหาลัย' });
    }
};