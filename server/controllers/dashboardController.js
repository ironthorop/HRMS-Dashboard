import Employee from '../models/Employee.js';
import Candidate from '../models/Candidate.js';
import Leave from '../models/Leave.js';
import Attendance from '../models/Attendance.js';

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
export const getDashboardStats = async (req, res) => {
  try {
    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get total employees count
    const totalEmployees = await Employee.countDocuments();
    
    // Get active employees count
    const activeEmployees = await Employee.countDocuments({ status: 'active' });
    
    // Get total candidates count
    const totalCandidates = await Candidate.countDocuments();
    
    // Get pending leaves count
    const pendingLeaves = await Leave.countDocuments({ status: 'pending' });
    
    // Get today's attendance
    const todayAttendance = await Attendance.find({
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });
    
    const todayPresent = todayAttendance.filter(a => a.status === 'present').length;
    const todayAbsent = todayAttendance.filter(a => a.status === 'absent').length;
    
    // Get recent leaves
    const recentLeaves = await Leave.find()
      .populate('employee', 'name')
      .sort({ createdAt: -1 })
      .limit(5);
    
    // Get recent candidates
    const recentCandidates = await Candidate.find()
      .sort({ createdAt: -1 })
      .limit(5);
    
    res.json({
      totalEmployees,
      activeEmployees,
      totalCandidates,
      pendingLeaves,
      todayPresent,
      todayAbsent,
      recentLeaves,
      recentCandidates
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get employee status distribution
// @route   GET /api/dashboard/employee-status
// @access  Private
export const getEmployeeStatusDistribution = async (req, res) => {
  try {
    const statusCounts = await Employee.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          status: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);
    
    res.json(statusCounts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get department distribution
// @route   GET /api/dashboard/department-distribution
// @access  Private
export const getDepartmentDistribution = async (req, res) => {
  try {
    const departmentCounts = await Employee.aggregate([
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          department: '$_id',
          count: 1,
          _id: 0
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);
    
    res.json(departmentCounts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get leave status distribution
// @route   GET /api/dashboard/leave-status
// @access  Private
export const getLeaveStatusDistribution = async (req, res) => {
  try {
    const leaveStatusCounts = await Leave.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          status: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);
    
    res.json(leaveStatusCounts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get attendance overview for the last 7 days
// @route   GET /api/dashboard/attendance-overview
// @access  Private
export const getAttendanceOverview = async (req, res) => {
  try {
    // Get dates for the last 7 days
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      dates.push(date);
    }
    
    // Prepare result array
    const result = [];
    
    // For each date, get attendance counts
    for (const date of dates) {
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      
      const dayAttendance = await Attendance.find({
        date: {
          $gte: date,
          $lt: nextDay
        }
      });
      
      const present = dayAttendance.filter(a => a.status === 'present').length;
      const absent = dayAttendance.filter(a => a.status === 'absent').length;
      const leave = dayAttendance.filter(a => a.status === 'on_leave').length;
      
      result.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        present,
        absent,
        leave
      });
    }
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};