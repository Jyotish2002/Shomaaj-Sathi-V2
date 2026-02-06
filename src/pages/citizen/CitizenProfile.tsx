import { Header } from '@/components/citizen/Header';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Phone, MapPin, LogOut, Mail, Shield, IdCard, CheckCircle2 } from 'lucide-react';

export default function CitizenProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <Header title="Profile" />

      <main className="px-4 -mt-6 space-y-6 max-w-lg mx-auto pb-8">
        {/* Profile Header Card */}
        <div className="bg-card rounded-2xl p-6 shadow-lg border border-border animate-fade-in">
          {/* Avatar and Name */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="relative">
              {user?.photo ? (
                <img 
                  src={user.photo} 
                  alt={user.name} 
                  className="w-24 h-24 rounded-full object-cover border-4 border-primary/20 shadow-lg" 
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg">
                  <User className="w-12 h-12 text-white" />
                </div>
              )}
              {user?.isVerified && (
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-4 border-card">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            <h2 className="text-2xl font-bold mt-4">{user?.name}</h2>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                <Shield className="w-3.5 h-3.5" />
                {user?.isVerified ? 'Verified Citizen' : 'Pending Verification'}
              </span>
            </div>
          </div>

          {/* Info Cards */}
          <div className="space-y-3">
            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-secondary to-secondary/50 rounded-xl hover:shadow-sm transition-shadow">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Email</p>
                <p className="font-semibold text-foreground">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-secondary to-secondary/50 rounded-xl hover:shadow-sm transition-shadow">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Mobile</p>
                <p className="font-semibold text-foreground">{user?.mobile || 'Not set'}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-secondary to-secondary/50 rounded-xl hover:shadow-sm transition-shadow">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <IdCard className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Ward Number</p>
                <p className="font-semibold text-foreground">{user?.wardNumber ? `Ward ${user.wardNumber}` : 'Not set'}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-secondary to-secondary/50 rounded-xl hover:shadow-sm transition-shadow">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Address</p>
                <p className="font-semibold text-foreground text-sm">{user?.address || 'Not set'}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-xs text-amber-700 text-center font-medium">
              ⚠️ Profile details cannot be changed after initial setup. Contact admin for corrections.
            </p>
          </div>
        </div>

        {/* Contact Card */}
        <div className="bg-card rounded-2xl p-6 shadow-lg border border-border animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h3 className="font-bold text-lg mb-3">Contact MLA Office</h3>
          <p className="text-sm text-muted-foreground mb-4">
            For urgent matters or profile corrections, contact the MLA office directly.
          </p>
          <a href="tel:+919876543210">
            <Button variant="outline" className="w-full gap-2 h-12 rounded-xl font-semibold">
              <Phone className="w-5 h-5" />
              +91 98765 43210
            </Button>
          </a>
        </div>

        {/* Logout Button */}
        <Button
          variant="destructive"
          onClick={handleLogout}
          className="w-full h-14 gap-2 rounded-2xl font-semibold shadow-lg animate-slide-up"
          style={{ animationDelay: '0.2s' }}
        >
          <LogOut className="w-5 h-5" />
          Logout
        </Button>
      </main>
    </div>
  );
}
