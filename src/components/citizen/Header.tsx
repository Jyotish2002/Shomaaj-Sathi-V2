import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { User, LogOut, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-lg mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left Section - Logo and Title */}
        <div className="flex items-center gap-3">
          {/* Municipal Logo */}
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-md overflow-hidden border-2 border-primary/20">
            <img 
              src="/municipal-logo.png" 
              alt="Municipal Logo" 
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to text if image doesn't load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.parentElement!.innerHTML = '<span class="text-white font-bold text-lg">MC</span>';
              }}
            />
          </div>
          {/* Title and Subtitle */}
          <div className="flex flex-col">
            <h1 className="text-base font-bold text-primary leading-tight tracking-tight">
              Municipal Corporation
            </h1>
            <p className="text-xs text-gray-500 leading-tight">
              Building a Better Tomorrow
            </p>
          </div>
        </div>

        {/* Right Section - Profile Icon */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-10 h-10 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center overflow-hidden hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
            aria-label="User menu"
          >
            {user?.photo ? (
              <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <User className="w-5 h-5 text-gray-600" />
            )}
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-fade-in">
              {/* User Info */}
              {user && (
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              )}
              
              {/* Menu Items */}
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  navigate('/citizen/profile');
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <User className="w-4 h-4 text-gray-500" />
                Profile
              </button>
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
