import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, Loader2, AlertCircle } from 'lucide-react';
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="gradient-header text-primary-foreground px-4 py-8 text-center">
        <div className="w-16 h-16 mx-auto bg-primary-foreground/20 rounded-2xl flex items-center justify-center mb-4">
          <Shield className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold">Halisahar Civic Portal</h1>
        <p className="text-primary-foreground/80 mt-2">Report and track local problems</p>
      </div>

      {/* Login Section */}
      <div className="flex-1 px-4 py-8 max-w-md mx-auto w-full flex flex-col justify-center">
        <div className="bg-card rounded-2xl p-8 shadow-card border border-border space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold">Welcome Back</h2>
            <p className="text-muted-foreground">
              Please sign in with your Google account to continue
            </p>
          </div>

          {user && !user.isVerified && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Verification Pending</AlertTitle>
              <AlertDescription>
                Your account is currently under review by the administrator. 
                Please wait for verification to log in easily.
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

          <div className="flex justify-center">
            {loading ? (
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            ) : (
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError("Google Login Failed")}
                useOneTap
              />
            )}
          </div>
          
          <p className="text-center text-xs text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>

        {/* Info */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>A initiative by</p>
          <p className="font-semibold text-foreground">MLA Office, Halisahar</p>
        </div>
      </div>
    </div>
  );
}
