import { useAuth } from '@/contexts/AuthContext';
import { User, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title?: string;
  showGreeting?: boolean;
}

export function Header({ title, showGreeting = false }: HeaderProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="gradient-header text-primary-foreground px-4 py-6 pb-10 rounded-b-[2rem] shadow-lg relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/20" />
        <div className="absolute -left-5 bottom-5 w-24 h-24 rounded-full bg-white/10" />
      </div>
      
      <div className="max-w-lg mx-auto relative">
        {showGreeting && user ? (
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-primary-foreground/80 text-sm font-medium">Welcome back,</p>
              <h1 className="text-2xl font-bold mt-1 tracking-tight">{user.name}</h1>
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium">
                  📍 Ward {user.wardNumber}
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium">
                  🏛️ Halisahar
                </span>
              </div>
            </div>
            <button 
              onClick={() => navigate('/citizen/profile')}
              className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/40 flex items-center justify-center overflow-hidden hover:scale-105 transition-transform"
            >
              {user.photo ? (
                <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-6 h-6 text-white" />
              )}
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold tracking-tight">{title}</h1>
          </div>
        )}
      </div>
    </header>
  );
}
