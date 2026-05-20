import Booking from '../models/Booking.js';
import User from '../models/User.js';
import Report from '../models/Report.js';

export const getDashboardAnalytics = async (req, res) => {
  try {
    //ดึงการจองทั้งหมดในระบบ ยกเว้นอันที่กดยกเลิกทิ้ง
    const totalBookings = await Booking.countDocuments({ status: { $ne: 'ยกเลิกแล้ว' } }); 
    
    // นับเฉพาะการจองที่ "อนุมัติ / เช็คอินเรียบร้อย"
    const approvedBookings = await Booking.countDocuments({ status: 'เช็คอินเรียบร้อย' });

    // สถิติตัวนับอื่นๆ ในระบบ
    const activeUsers = await User.countDocuments({ role: 'student' });
    const pendingApprovals = await Booking.countDocuments({ status: 'รอการเช็คอิน' }); 
    const pendingReports = await Report.countDocuments({ status: 'pending' });


    const facilityAnalytics = await Booking.aggregate([
      { 
        $match: { status: { $ne: 'ยกเลิกแล้ว' } } 
      },
      { $group: { _id: '$facilityName', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    const maxFacilityCount = facilityAnalytics.length > 0 ? facilityAnalytics[0].count : 1;
    const popularFacilities = facilityAnalytics.map(item => ({
      name: item._id || 'ไม่ระบุสถานที่',
      bookings: item.count,
      percentage: Math.round((item.count / maxFacilityCount) * 100)
    }));


    // กราฟช่วงเวลายอดฮิต
    const timeAnalytics = await Booking.aggregate([
      { 
        $match: { status: { $ne: 'ยกเลิกแล้ว' } } 
      },
      { $group: { _id: '$timeSlot', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 4 }
    ]);

    const maxTimeCount = timeAnalytics.length > 0 ? timeAnalytics[0].count : 1;
    const peakHours = timeAnalytics.map(item => ({
      time: item._id || 'ไม่ระบุเวลา',
      count: item.count,
      percentage: Math.round((item.count / maxTimeCount) * 100)
    }));

    res.status(200).json({
      overview: {
        totalBookings,
        approvedBookings,
        activeUsers,
        pendingApprovals,
        pendingReports
      },
      popularFacilities,
      peakHours
    });

  } catch (error) {
    console.error('❌ แดชบอร์ดคำนวณสถิติขัดข้อง:', error);
    res.status(500).json({ message: 'ไม่สามารถประมวลผลข้อมูล Data Analytics ได้' });
  }
};