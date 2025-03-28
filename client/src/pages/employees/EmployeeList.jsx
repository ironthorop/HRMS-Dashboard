import React, { useState } from 'react';

// Sample employee data (you can replace this with your own data or fetch from an API)
const initialEmployees = [
  {
    profile: 'https://via.placeholder.com/40', // Placeholder image
    name: 'Jane Cooper',
    email: 'jane.cooper@example.com',
    phone: '(704) 555-0127',
    position: 'Intern',
    department: 'Designer',
    dateOfJoining: '10/03/16',
  },
  {
    profile: 'https://via.placeholder.com/40',
    name: 'Ariana McCoy',
    email: 'ariana.mccoy@example.com',
    phone: '(202) 555-0107',
    position: 'Full Time',
    department: 'Designer',
    dateOfJoining: '11/07/16',
  },
  {
    profile: 'https://via.placeholder.com/40',
    name: 'Cody Fisher',
    email: 'cody.fisher@example.com',
    phone: '(225) 555-0128',
    position: 'Senior',
    department: 'Backend Development',
    dateOfJoining: '08/31/17',
  },
  {
    profile: 'https://via.placeholder.com/40',
    name: 'Jeremy Wilson',
    email: 'jeremy.wilson@example.com',
    phone: '(225) 555-0128',
    position: 'Junior',
    department: 'Backend Development',
    dateOfJoining: '12/04/17',
  },
  {
    profile: 'https://via.placeholder.com/40',
    name: 'Leslie Alexander',
    email: 'leslie.alexander@example.com',
    phone: '(207) 555-0119',
    position: 'Team Lead',
    department: 'Human Resource',
    dateOfJoining: '05/02/14',
  },
];

const EmployeeList = () => {
  const [employees, setEmployees] = useState(initialEmployees);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });

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

  return (
    <div className="overflow-x-auto p-2">
      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-[#4B0082] text-white">
            <th className="py-3 px-4 text-left text-sm font-semibold rounded-tl-lg">
              Profile
            </th>
            <th
              className="py-3 px-4 text-left text-sm font-semibold cursor-pointer"
              onClick={() => handleSort('name')}
            >
              Employee Name{' '}
              {sortConfig.key === 'name' &&
                (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th
              className="py-3 px-4 text-left text-sm font-semibold cursor-pointer"
              onClick={() => handleSort('email')}
            >
              Email Address{' '}
              {sortConfig.key === 'email' &&
                (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th
              className="py-3 px-4 text-left text-sm font-semibold cursor-pointer"
              onClick={() => handleSort('phone')}
            >
              Phone{' '}
              {sortConfig.key === 'phone' &&
                (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th
              className="py-3 px-4 text-left text-sm font-semibold cursor-pointer"
              onClick={() => handleSort('position')}
            >
              Position{' '}
              {sortConfig.key === 'position' &&
                (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th
              className="py-3 px-4 text-left text-sm font-semibold cursor-pointer"
              onClick={() => handleSort('department')}
            >
              Department{' '}
              {sortConfig.key === 'department' &&
                (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th
              className="py-3 px-4 text-left text-sm font-semibold cursor-pointer"
              onClick={() => handleSort('dateOfJoining')}
            >
              Date of Joining{' '}
              {sortConfig.key === 'dateOfJoining' &&
                (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th className="py-3 px-4 text-left text-sm font-semibold rounded-tr-lg">
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
              <td className="py-3 px-4">
                <img
                  src={employee.profile}
                  alt={employee.name}
                  className="w-10 h-10 rounded-full"
                />
              </td>
              <td className="py-3 px-4 text-sm text-gray-700">
                {employee.name}
              </td>
              <td className="py-3 px-4 text-sm text-gray-700">
                {employee.email}
              </td>
              <td className="py-3 px-4 text-sm text-gray-700">
                {employee.phone}
              </td>
              <td className="py-3 px-4 text-sm text-gray-700">
                {employee.position}
              </td>
              <td className="py-3 px-4 text-sm text-gray-700">
                {employee.department}
              </td>
              <td className="py-3 px-4 text-sm text-gray-700">
                {employee.dateOfJoining}
              </td>
              <td className="py-3 px-4 text-sm text-gray-700">
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