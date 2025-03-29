import { useState, useEffect } from "react";
import { fetchLeaves, createLeave, updateLeave, deleteLeave, fetchEmployees } from "../../services/api";
import { Calendar, Check, ChevronDown, ChevronLeft, ChevronRight, Download, Search, X } from "lucide-react";

const Leaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [employees, setEmployees] = useState([]); // State to store employees from the database
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Fetch leaves and employees from the backend
  useEffect(() => {
    const getLeavesAndEmployees = async () => {
      setLoading(true);
      try {
        const [leavesResponse, employeesResponse] = await Promise.all([
          fetchLeaves(),
          fetchEmployees(),
        ]);
        setLeaves(leavesResponse.leaves);
        setEmployees(employeesResponse.employees);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    getLeavesAndEmployees();
  }, []);

  // Add a new leave
  const handleAddLeave = async (leaveData) => {
    try {
      const response = await createLeave(leaveData);
      setLeaves((prev) => [...prev, response.leave]);
    } catch (err) {
      alert(err.message);
    }
  };

  // Update leave status
  const handleUpdateLeave = async (id, updatedData) => {
    try {
      const response = await updateLeave(id, updatedData);
      setLeaves((prev) =>
        prev.map((leave) => (leave._id === id ? response.leave : leave))
      );
    } catch (err) {
      alert(err.message);
    }
  };

  // Delete a leave
  const handleDeleteLeave = async (id) => {
    try {
      await deleteLeave(id);
      setLeaves((prev) => prev.filter((leave) => leave._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  // Handle document download
  const handleDownloadDoc = async (leaveId, docId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/leaves/${leaveId}/docs/${docId}`);
      if (!response.ok) {
        throw new Error("Failed to download document");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "document.pdf";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(err.message);
    }
  };

  const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const generateCalendarDates = (month, year) => {
    const days = daysInMonth(month, year);
    const firstDay = firstDayOfMonth(month, year);
    const weeks = [];
    let currentDay = 1;

    for (let i = 0; i < 6; i++) {
      const week = [];
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDay) {
          week.push(null);
        } else if (currentDay > days) {
          week.push(null);
        } else {
          week.push(currentDay++);
        }
      }
      weeks.push(week);
    }
    return weeks;
  };

  const calendarDates = generateCalendarDates(currentMonth, currentYear);

  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Filter approved leaves for the calendar
  const approvedLeaves = leaves.filter((leave) => leave.status === "approved");

  // Filter leaves based on status and search query
  const filteredLeaves = leaves.filter((leave) => {
    const matchesStatus = !statusFilter || leave.status === statusFilter;
    const matchesSearch = leave.employee.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-4">
    <div className="flex flex-col md:flex-row gap-4">
      {/* Left Panel - Applied Leaves */}
      <div className="bg-white rounded-lg shadow-md p-4 flex-1">
        <div className="flex justify-between items-center mb-4">
          <div className="relative">
            <button className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-1.5 text-sm">
              Status <ChevronDown size={16} />
            </button>
          </div>
          <div className="relative">
            <Search size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-8 pr-3 py-1.5 border border-gray-300 rounded-md text-sm w-64"
            />
          </div>
        </div>

        <div className="bg-purple-900 text-white rounded-md p-3 mb-4">
          <div className="grid grid-cols-5 gap-2">
            <div className="font-medium">Profile</div>
            <div className="font-medium">Name</div>
            <div className="font-medium">Date</div>
            <div className="font-medium">Reason</div>
            <div className="font-medium">Status</div>
          </div>
        </div>

        {filteredLeaves.map((leave) => (
          <div key={leave._id} className="grid grid-cols-5 gap-2 py-3 border-b border-gray-100">
            <div className="flex items-center">
              <img src={leave.avatar || "/placeholder.svg"} alt={leave.employee.name} className="w-8 h-8 rounded-full mr-2" />
            </div>
            <div>
              <div className="font-medium text-sm">{leave.employee.name}</div>
              <div className="text-xs text-gray-500">{leave.employee.position}</div>
            </div>
            <div className="text-sm self-center">{leave.date}</div>
            <div className="text-sm self-center">{leave.reason}</div>
            <div className="self-center">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                ${leave.status === "approved" ? "bg-green-100 text-green-800 border-green-200" : "bg-red-100 text-red-800 border-red-200"}`}>
                <Check size={12} className="mr-1" />
                {leave.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Right Panel - Leave Calendar */}
      <div className="bg-white rounded-lg shadow-md p-4 w-full md:w-80">
        <button
          onClick={() => setShowModal(true)}
          className="w-full bg-purple-700 text-white rounded-md py-2 mb-4 font-medium"
        >
          Add Leave
        </button>

        <div className="mb-6">
          <h2 className="font-medium mb-4">Leave Calendar</h2>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1">
              <ChevronLeft size={16} className="cursor-pointer" onClick={handlePreviousMonth} />
              <span className="text-sm">{monthNames[currentMonth]}, {currentYear}</span>
              <ChevronRight size={16} className="cursor-pointer" onClick={handleNextMonth} />
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
              <div key={index} className="text-center text-xs font-medium">
                {day}
              </div>
            ))}
          </div>

          {calendarDates.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 gap-1 mb-2">
              {week.map((date, dateIndex) => (
                <div key={dateIndex} className="text-center">
                  {date && (
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs mx-auto
                        ${approvedLeaves.some((leave) => new Date(leave.date).getDate() === date && 
                        new Date(leave.date).getMonth() === currentMonth && 
                        new Date(leave.date).getFullYear() === currentYear) ? "bg-purple-700 text-white" : ""}`}
                    >
                      {date}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div>
          <h2 className="font-medium mb-4">Approved Leaves</h2>
          {approvedLeaves.map((leave) => (
            <div key={leave.id} className="flex items-center gap-2 mb-2">
              <img src={leave.avatar || "/placeholder.svg"} alt={leave.name} className="w-8 h-8 rounded-full" />
              <div>
                <div className="font-medium text-sm">{leave.name}</div>
                <div className="text-xs text-gray-500">{leave.position}</div>
              </div>
              <div className="ml-auto text-sm">{leave.date}</div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Add New Leave Modal */}
    {showModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-full max-w-md overflow-hidden">
          <div className="bg-purple-700 text-white p-4 flex justify-between items-center">
            <h2 className="font-medium">Add New Leave</h2>
            <button onClick={() => setShowModal(false)}>
              <X size={20} />
            </button>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Jane Cooper"
                  className="w-full p-2 border border-gray-300 rounded-md pl-3 pr-8"
                />
                <X size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Full Time Designer"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  disabled
                />
              </div>

              <div className="relative">
                <label className="text-sm text-gray-500">Leave Date*</label>
                <div className="flex mt-1">
                  <input
                    type="text"
                    placeholder="Select date"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Calendar size={16} className="text-gray-400" />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center">
                  <label className="text-sm text-gray-500">Documents</label>
                  <Download size={16} className="text-gray-400" />
                </div>
                <input type="text" className="w-full p-2 border border-gray-300 rounded-md mt-1" />
              </div>

              <div>
                <input type="text" placeholder="Reason*" className="w-full p-2 border border-gray-300 rounded-md" />
              </div>

              <button className="bg-purple-700 text-white rounded-md py-2 font-medium">Submit</button>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
  );
};

export default Leaves;

