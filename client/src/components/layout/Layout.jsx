import { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useAuth } from '../../hooks/useAuth';

const Layout = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [title, setTitle] = useState("Dashboard");

  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <div className="space-y-4 text-center">
          <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <Sidebar setTitle={setTitle} />
      <div className="flex-grow flex flex-col "> 
        <Navbar title={title} />
        <div className="flex-grow mt-[70px] overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;