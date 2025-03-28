import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, Users, UserPlus, Calendar, FileText, 
  LogOut, Menu
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useState } from 'react';

const Sidebar = ({ setTitle }) => {
  const location = useLocation();
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(true); // State to toggle sidebar

  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: Home },
    { to: '/candidates', label: 'Candidates', icon: UserPlus },
    { to: '/employees', label: 'Employees', icon: Users },
    { to: '/attendance', label: 'Attendance', icon: Calendar },
    { to: '/leaves', label: 'Leave Management', icon: FileText },
  ];

  return (
    <div>
      {/* Toggle Button for Mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-[#4B0082] text-white p-2 rounded-full"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen  bg-[#fff] flex flex-col overflow-x-hidden transition-transform duration-300 z-40 py-4
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:w-[18vw]`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-end justify-center mb-6">
            <div className="w-8 h-8 border-4 border-[#4B0082] mr-2"></div>
            <span className="text-[#4B0082] text-2xl font-bold">LOGO</span>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 py-6 overflow-y-auto">
          <ul className="space-y-1 px-3">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;

              return (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    onClick={() => {
                      setTitle(link.label);
                      setIsOpen(false); // Close sidebar on link click
                    }}
                    className={({ isActive }) => `
                      flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                      ${isActive ? "bg-[#4B0082] text-white" : "hover:bg-gray-100"}
                    `}
                  >
                    <span className={`grid place-items-center ${isActive ? "text-white" : "text-gray-600"}`}>
                      <Icon className="size-5" />
                    </span>
                    <span className="font-medium">{link.label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-gray-200 mt-auto">
          <button
            onClick={logout}
            className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg
              hover:bg-gray-100 transition-colors`}
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;