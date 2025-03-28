import { Bell, Moon, Sun } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useState } from 'react';

const Navbar = ({ title }) => {
  const { user } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // In a real implementation, this would toggle dark mode
  };

  return (
    <div className="fixed top-0 flex w-[82vw]  overflow-auto z-50 items-center justify-between bg-white shadow px-6 py-4"> {/* Adjusted padding */}
      {/* Left side - Title */}
      <div className="flex items-center">
        <div className="relative">
          <div className="text-black text-2xl font-medium font-['Poppins']">
            <h1>{title}</h1>
          </div>
        </div>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-6"> {/* Increased gap for better spacing */}
        <button 
          onClick={toggleDarkMode}
          className="grid place-items-center w-8 h-8 text-muted-foreground rounded-full hover:bg-muted transition-colors"
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        
        <div className="relative">
          <button className="grid place-items-center w-8 h-8 text-muted-foreground rounded-full hover:bg-muted transition-colors">
            <Bell size={18} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-accent rounded-full"></span>
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
            {user?.name.charAt(0) || 'U'}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium">{user?.name || 'User'}</p>
            <p className="text-xs text-muted-foreground">{user?.role || 'Role'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;