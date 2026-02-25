import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { User, Phone, MapPin, LogOut, Mail, IdCard, Globe, ChevronDown, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function CitizenProfile() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  
  const [selectedLanguage, setSelectedLanguage] = useState(
    localStorage.getItem('appLanguage') || 'en'
  );

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const handleLanguageChange = (newLanguage: string) => {
    setSelectedLanguage(newLanguage);
    localStorage.setItem('appLanguage', newLanguage);
    i18n.changeLanguage(newLanguage);
    updateUser({ language: newLanguage });
    toast.success(t('languageUpdated'));
  };

  const languages = [
    { code: 'en', label: 'English', nativeLabel: 'English' },
    { code: 'hi', label: 'Hindi', nativeLabel: 'हिंदी' },
    { code: 'bn', label: 'Bengali', nativeLabel: 'বাংলা' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      {/* Page Title */}
      <div className="bg-white border-b border-gray-100 px-4 py-4">
        <h1 className="text-xl font-bold text-gray-900 max-w-lg mx-auto">{t('profile')}</h1>
      </div>

      <main className="px-4 py-6 space-y-6 max-w-lg mx-auto pb-8">
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
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-teal-600 flex items-center justify-center shadow-lg">
                  <User className="w-12 h-12 text-white" />
                </div>
              )}
            </div>
            <h2 className="text-2xl font-bold mt-4">{user?.name}</h2>
          </div>

          {/* Info Cards */}
          <div className="space-y-3">
            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-secondary to-secondary/50 rounded-xl hover:shadow-sm transition-shadow">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{t('email')}</p>
                <p className="font-semibold text-foreground">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-secondary to-secondary/50 rounded-xl hover:shadow-sm transition-shadow">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{t('mobile')}</p>
                <p className="font-semibold text-foreground">{user?.mobile || t('notSet')}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-secondary to-secondary/50 rounded-xl hover:shadow-sm transition-shadow">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <IdCard className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{t('wardNumber')}</p>
                <p className="font-semibold text-foreground">{user?.wardNumber ? `${t('ward')} ${user.wardNumber}` : t('notSet')}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-secondary to-secondary/50 rounded-xl hover:shadow-sm transition-shadow">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{t('address')}</p>
                <p className="font-semibold text-foreground text-sm">{user?.address || t('notSet')}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-xs text-amber-700 text-center font-medium">
              ⚠️ {t('profileWarning')}
            </p>
          </div>
        </div>

        {/* Contact Card */}
        <div className="bg-card rounded-2xl p-6 shadow-lg border border-border animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h3 className="font-bold text-lg mb-3">{t('contactMLAOffice')}</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {t('urgentMatters')}
          </p>
          <a href="tel:+919876543210">
            <Button variant="outline" className="w-full gap-2 h-12 rounded-xl font-semibold">
              <Phone className="w-5 h-5" />
              +91 98765 43210
            </Button>
          </a>
        </div>

        {/* Language Settings Card */}
        <div className="bg-card rounded-2xl p-6 shadow-lg border border-border animate-slide-up" style={{ animationDelay: '0.15s' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Globe className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-lg">{t('languageSettings')}</h3>
              <p className="text-sm text-muted-foreground">{t('changeLanguage')}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                  selectedLanguage === lang.code
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border hover:border-primary/50 hover:bg-secondary'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-medium">{lang.nativeLabel}</span>
                  <span className="text-sm text-muted-foreground">({lang.label})</span>
                </div>
                {selectedLanguage === lang.code && (
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Logout Button */}
        <Button
          variant="destructive"
          onClick={handleLogout}
          className="w-full h-14 gap-2 rounded-2xl font-semibold shadow-lg animate-slide-up"
          style={{ animationDelay: '0.2s' }}
        >
          <LogOut className="w-5 h-5" />
          {t('logout')}
        </Button>
      </main>
    </div>
  );
}
