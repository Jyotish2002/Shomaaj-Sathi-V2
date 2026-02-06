import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, Loader2, AlertCircle, CheckCircle2, MapPin, FileText, Users } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Login() {
  const navigate = useNavigate();
  const { loginWithGoogle, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      if (!user.isProfileComplete) {
        navigate('/citizen/profile-setup');
      } else if (!user.isVerified && user.role !== 'admin') {
        // User is logged in but not verified, show message
      } else {
        navigate(user.role === 'admin' ? '/admin' : '/citizen');
      }
    }
  }, [user, navigate]);

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setLoading(true);
    setError(null);
    console.log('Google Success Callback Received');
    try {
      if (!credentialResponse.credential) {
        throw new Error("No credential received from Google");
      }
      await loginWithGoogle(credentialResponse.credential);
    } catch (err: any) {
      console.error('Frontend Login Error:', err);
      setError(err.response?.data?.message || err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: MapPin, text: 'Report issues with GPS location' },
    { icon: FileText, text: 'Track complaint status in real-time' },
    { icon: CheckCircle2, text: 'Get notified when solved' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background flex flex-col">
      {/* Header */}
      <div className="gradient-header text-primary-foreground px-4 py-10 text-center rounded-b-[2.5rem] shadow-lg relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/20" />
          <div className="absolute -left-5 bottom-5 w-24 h-24 rounded-full bg-white/10" />
          <div className="absolute right-20 bottom-0 w-16 h-16 rounded-full bg-white/15" />
        </div>
        
        <div className="relative animate-fade-in">
          <div className="w-20 h-20 mx-auto bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 border border-white/30 shadow-lg">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Halisahar Civic Portal</h1>
          <p className="text-primary-foreground/80 mt-2 text-lg">Report and track local problems</p>
        </div>
      </div>

      {/* Login Section */}
      <div className="flex-1 px-4 py-6 max-w-md mx-auto w-full flex flex-col justify-center">
        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          {features.map((feature, index) => (
            <div 
              key={index}
              className="inline-flex items-center gap-2 bg-secondary/80 text-secondary-foreground px-3 py-2 rounded-full text-sm font-medium"
            >
              <feature.icon className="w-4 h-4 text-primary" />
              {feature.text}
            </div>
          ))}
        </div>

        <div className="bg-card rounded-2xl p-8 shadow-xl border border-border space-y-6 animate-slide-up">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">Welcome Back</h2>
            <p className="text-muted-foreground">
              Sign in with Google to continue
            </p>
          </div>

          {user && !user.isVerified && (
            <Alert variant="default" className="bg-amber-50 border-amber-200">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-800">Verification Pending</AlertTitle>
              <AlertDescription className="text-amber-700">
                Your account is under review. You'll be notified once verified.
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col items-center gap-4">
            {loading ? (
              <div className="flex flex-col items-center gap-2 py-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Signing you in...</p>
              </div>
            ) : (
              <div className="w-full flex justify-center py-2">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError("Google Login Failed")}
                  useOneTap
                  shape="pill"
                  size="large"
                  width={280}
                />
              </div>
            )}
          </div>
          
          <p className="text-center text-xs text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>

        {/* Info */}
        <div className="mt-8 text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="inline-flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-full">
            <Users className="w-4 h-4 text-primary" />
            <div className="text-sm">
              <span className="text-muted-foreground">An initiative by </span>
              <span className="font-semibold text-foreground">MLA Office, Halisahar</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
