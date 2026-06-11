import { Link, useLocation } from 'react-router-dom';
import { CalendarDays, Menu, PlusCircle, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/Button';

export default function Navbar() {
  const location = useLocation();
  const { user, signInWithGoogle, logout } = useAuth();

  const navLinks = [
    { name: 'Events', path: '/events' },
    { name: 'Dashboard', path: '/dashboard' },
  ];

  return (
    <nav className="border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-[72px]">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-50 dark:bg-indigo-900/30 p-2 rounded-xl">
              <CalendarDays className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <Link to="/" className="text-xl font-bold tracking-tight text-[var(--foreground)]">
              Kiyo<span className="text-[var(--muted-foreground)] font-medium">Hub</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-1">
              {navLinks.map((link) => (
                <Link 
                  key={link.path}
                  to={link.path} 
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    location.pathname === link.path 
                      ? 'bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white' 
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            
            <div className="flex items-center space-x-4 border-l border-gray-200 dark:border-slate-800 pl-8">
              <Link to="/create" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-1.5 text-sm font-medium px-2 py-2">
                <PlusCircle className="w-4 h-4" />
                <span>Create</span>
              </Link>
              
              {user ? (
                <div className="flex items-center gap-3">
                  <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.email}`} alt="avatar" className="w-8 h-8 rounded-full ring-2 ring-gray-100 dark:ring-slate-800" />
                  <button onClick={logout} className="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Log out">
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Button size="sm" onClick={signInWithGoogle} className="font-semibold shadow-sm">
                  Sign In
                </Button>
              )}
            </div>
          </div>
          
          <div className="md:hidden flex items-center">
            <button className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
