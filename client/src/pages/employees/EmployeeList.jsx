import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { fetchEmployees } from '../../services/api';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [positionDropdownOpen, setPositionDropdownOpen] = useState(false);
  const [positionFilter, setPositionFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const data = await fetchEmployees();
        setEmployees(data.employees); // Assuming the API returns { employees: [...] }
      } catch (error) {
        console.error('Failed to fetch employees:', error.message);
      }
    };

    loadEmployees();
  }, []);

  // Sorting function
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    const sortedEmployees = [...employees].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setEmployees(sortedEmployees);
    setSortConfig({ key, direction });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="overflow-x-auto p-2">
      {/* Filters and Search */}
      <div className="flex items-center justify-between mb-6">
        {/* Position Filter */}
        <div className="relative w-40">
          <button
            className="w-full flex items-center justify-between px-4 py-2 border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#6A0DAD] text-left bg-white shadow-sm hover:bg-gray-50 transition-all"
            onClick={() => setPositionDropdownOpen(!positionDropdownOpen)}
          >
            {positionFilter === 'All' ? 'Position' : positionFilter}
            <ChevronDown className="h-4 w-4 ml-2 text-gray-500" />
          </button>
          {positionDropdownOpen && (
            <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1">
              <li
                onClick={() => {
                  setPositionFilter('All');
                  setPositionDropdownOpen(false);
                }}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
              >
                All
              </li>
              <li
                onClick={() => {
                  setPositionFilter('Designer Intern');
                  setPositionDropdownOpen(false);
                }}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
              >
                Designer Intern
              </li>
              <li
                onClick={() => {
                  setPositionFilter('Senior UI/UX');
                  setPositionDropdownOpen(false);
                }}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
              >
                Senior UI/UX
              </li>
              <li
                onClick={() => {
                  setPositionFilter('Human Resource Lead');
                  setPositionDropdownOpen(false);
                }}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
              >
                Human Resource Lead
              </li>
              <li
                onClick={() => {
                  setPositionFilter('Full Time Developer');
                  setPositionDropdownOpen(false);
                }}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
              >
                Full Time Developer
              </li>
            </ul>
          )}
        </div>

        {/* Search and Add Candidate Button */}
        <input
          type="text"
          placeholder="Search candidates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-64 px-4 py-2 border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#6A0DAD] bg-white shadow-sm transition-all"
        />
      </div>
      <table className="min-w-full  bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-[#4B0082] text-white">
            <th className="py-3 px-6 text-left text-sm font-semibold rounded-tl-lg">
              Profile
            </th>
            <th
              className="py-3 px-6 text-left text-sm font-semibold cursor-pointer"
              onClick={() => handleSort('name')}
            >
              Employee Name{' '}
              {sortConfig.key === 'name' &&
                (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th
              className="py-3 px-6 text-left text-sm font-semibold cursor-pointer"
              onClick={() => handleSort('email')}
            >
              Email Address{' '}
              {sortConfig.key === 'email' &&
                (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th
              className="py-3 px-6 text-left text-sm font-semibold cursor-pointer"
              onClick={() => handleSort('phone')}
            >
              Phone{' '}
              {sortConfig.key === 'phone' &&
                (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th
              className="py-3 px-6 text-left text-sm font-semibold cursor-pointer"
              onClick={() => handleSort('position')}
            >
              Position{' '}
              {sortConfig.key === 'position' &&
                (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th
              className="py-3 px-6 text-left text-sm font-semibold cursor-pointer"
              onClick={() => handleSort('department')}
            >
              Department{' '}
              {sortConfig.key === 'department' &&
                (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th
              className="py-3 px-6 text-left text-sm font-semibold cursor-pointer"
              onClick={() => handleSort('dateOfJoining')}
            >
              Date of Joining{' '}
              {sortConfig.key === 'dateOfJoining' &&
                (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th className="py-3 px-6 text-left text-sm font-semibold rounded-tr-lg">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee, index) => (
            <tr
              key={index}
              className={`border-b border-gray-200 hover:bg-gray-50 ${
                index === employees.length - 1
                  ? 'rounded-bl-lg rounded-br-lg'
                  : ''
              }`}
            >
              <td className="py-3 px-6">
                <img
                  src={employee.profile}
                  alt={employee.name}
                  className="w-10 h-10 rounded-full"
                />
              </td>
              <td className="py-3 px-6 text-sm text-gray-700">
                {employee.name}
              </td>
              <td className="py-3 px-6 text-sm text-gray-700">
                {employee.email}
              </td>
              <td className="py-3 px-6 text-sm text-gray-700">
                {employee.phone}
              </td>
              <td className="py-3 px-6 text-sm text-gray-700">
                {employee.position}
              </td>
              <td className="py-3 px-6 text-sm text-gray-700">
                {employee.department}
              </td>
              <td className="py-3 px-6 text-sm text-gray-700">
                {formatDate(employee.createdAt)}
              </td>
              <td className="py-3 px-6 text-sm text-gray-700">
                <button className="text-gray-500 hover:text-gray-700">
                  ⋮
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList;