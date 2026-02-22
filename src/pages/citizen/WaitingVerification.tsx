import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle2, Phone, LogOut, RefreshCw, Shield, FileCheck } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function WaitingVerification() {
  const { user, logout, checkAuth } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [checking, setChecking] = useState(false);

  // Check if user got verified
  useEffect(() => {
    if (user?.isVerified) {
      navigate('/citizen');
    }
  }, [user?.isVerified, navigate]);

  const handleCheckStatus = async () => {
    setChecking(true);
    try {
      await checkAuth();
    } catch (error) {
      console.error('Failed to check auth:', error);
    } finally {
      setChecking(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Show loading if user not loaded yet
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 flex items-center justify-center p-4">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="mt-2 text-muted-foreground">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6 animate-fade-in">
        {/* Main Card */}
        <div className="bg-card rounded-2xl p-8 shadow-xl border border-border text-center">
          {/* Animated Icon */}
          <div className="relative mx-auto w-24 h-24 mb-6">
            <div className="absolute inset-0 bg-amber-100 rounded-full animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Clock className="w-12 h-12 text-amber-600" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {t('verificationPending')}
          </h1>
          <p className="text-muted-foreground mb-6">
            {t('verificationPendingDesc')}
          </p>

          {/* Status Steps */}
          <div className="bg-secondary/50 rounded-xl p-4 mb-6 text-left space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">{t('profileSubmitted')}</p>
                <p className="text-xs text-muted-foreground">{t('profileSubmittedDesc')}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 animate-pulse">
                <FileCheck className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">{t('adminReview')}</p>
                <p className="text-xs text-muted-foreground">{t('adminReviewDesc')}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                <Shield className="w-4 h-4 text-gray-400" />
              </div>
              <div>
                <p className="font-medium text-muted-foreground text-sm">{t('accountActivation')}</p>
                <p className="text-xs text-muted-foreground">{t('accountActivationDesc')}</p>
              </div>
            </div>
          </div>

          {/* User Info */}
          {user && (
            <div className="bg-primary/5 rounded-xl p-4 mb-6 text-left">
              <p className="text-xs text-muted-foreground mb-1">{t('registeredAs')}</p>
              <p className="font-semibold text-foreground">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          )}

          {/* Check Status Button */}
          <Button
            onClick={handleCheckStatus}
            disabled={checking}
            className="w-full h-12 rounded-xl font-semibold mb-3"
          >
            {checking ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                {t('checkingStatus')}
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                {t('checkStatus')}
              </>
            )}
          </Button>

          {/* Logout */}
          <Button
            variant="outline"
            onClick={handleLogout}
            className="w-full h-12 rounded-xl font-semibold"
          >
            <LogOut className="w-4 h-4 mr-2" />
            {t('logout')}
          </Button>
        </div>

        {/* Contact Card */}
        <div className="bg-card rounded-2xl p-6 shadow-lg border border-border text-center">
          <h3 className="font-bold text-lg mb-2">{t('needHelp')}</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {t('contactForHelp')}
          </p>
          <a href="tel:+919876543210">
            <Button variant="outline" className="gap-2 h-12 rounded-xl font-semibold">
              <Phone className="w-5 h-5" />
              +91 98765 43210
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
