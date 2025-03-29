import { useState } from "react"
import { Search, MoreVertical, ChevronDown, ChevronUp } from "lucide-react"

const EmployeeStatusTable = () => {
  const [statusFilter, setStatusFilter] = useState("Status")
  const [isStatusOpen, setIsStatusOpen] = useState(false)
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: "Jane Cooper",
      position: "Full Time",
      department: "Designer",
      task: "Dashboard Home page Alignment",
      status: "Present",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    },
    {
      id: 2,
      name: "Arlene McCoy",
      position: "Full Time",
      department: "Designer",
      task: "Dashboard Login page design, Dashboard Home page design",
      status: "Absent",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    },
    {
      id: 3,
      name: "Cody Fisher",
      position: "Senior",
      department: "Backend Development",
      task: "--",
      status: "Absent",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    {
      id: 4,
      name: "Jarvey Wilson",
      position: "Junior",
      department: "Backend Development",
      task: "Dashboard login page integration",
      status: "Present",
      avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    },
    {
      id: 5,
      name: "Leslie Alexander",
      position: "Team Lead",
      department: "Human Resource",
      task: "4 scheduled interview, Setting of resumes",
      status: "Present",
      avatar: "https://randomuser.me/api/portraits/women/3.jpg",
    },
  ])

  const toggleStatus = (id) => {
    setEmployees(
      employees.map((emp) => {
        if (emp.id === id) {
          return {
            ...emp,
            status: emp.status === "Present" ? "Absent" : "Present",
          }
        }
        return emp
      }),
    )
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Present":
        return "bg-green-100 text-green-600 border-green-200"
      case "Absent":
        return "bg-red-100 text-red-600 border-red-200"
      case "Medical Leave":
        return "bg-orange-100 text-orange-600 border-orange-200"
      case "Work from Home":
        return "bg-blue-100 text-blue-600 border-blue-200"
      default:
        return "bg-gray-100 text-gray-600 border-gray-200"
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-40">
          <button
            onClick={() => setIsStatusOpen(!isStatusOpen)}
            className="w-full flex items-center justify-between px-4 py-2 border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#6A0DAD] text-left bg-white shadow-sm hover:bg-gray-50 transition-all"
          >
            <span>{statusFilter}</span>
            {isStatusOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {isStatusOpen && (
            <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1">
              <ul className="py-1">
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                  onClick={() => {
                    setStatusFilter("Status")
                    setIsStatusOpen(false)
                  }}
                >
                  Status
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                  onClick={() => {
                    setStatusFilter("Present")
                    setIsStatusOpen(false)
                  }}
                >
                  Present
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                  onClick={() => {
                    setStatusFilter("Absent")
                    setIsStatusOpen(false)
                  }}
                >
                  Absent
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                  onClick={() => {
                    setStatusFilter("Medical Leave")
                    setIsStatusOpen(false)
                  }}
                >
                  Medical Leave
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                  onClick={() => {
                    setStatusFilter("Work from Home")
                    setIsStatusOpen(false)
                  }}
                >
                  Work from Home
                </li>
              </ul>
            </div>
          )}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search employees..."
            className="w-64 px-4 py-2 border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#6A0DAD] bg-white shadow-sm transition-all"
          />
        </div>
      </div>
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full text-gray-700">
          <thead className="bg-[#6A0DAD]">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                Profile
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                Employee Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                Position
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                Task
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {employees
              .filter((emp) => statusFilter === "Status" || emp.status === statusFilter)
              .map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50 transition-all">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={employee.avatar || "/placeholder.svg"}
                      alt={employee.name}
                      className="w-8 h-8 rounded-full"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {employee.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {employee.position}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {employee.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {employee.task}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleStatus(employee.id)}
                      className={`px-3 py-1 text-xs rounded-full border ${getStatusColor(employee.status)}`}
                    >
                      {employee.status}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <button className="text-gray-500 hover:text-gray-700">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default EmployeeStatusTable

