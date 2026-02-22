import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useGetCallerUserProfile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LoginButton from '../components/LoginButton';

export default function AuthPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading } = useGetCallerUserProfile();

  useEffect(() => {
    if (identity && userProfile && !isLoading) {
      navigate({ to: '/dashboard' });
    }
  }, [identity, userProfile, isLoading, navigate]);

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img src="/assets/generated/logo.dim_256x256.png" alt="BloodLine" className="h-20 w-20" />
          </div>
          <CardTitle className="text-2xl">Welcome to BloodLine</CardTitle>
          <CardDescription>Sign in to access your dashboard and start saving lives</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <LoginButton />
          <p className="text-sm text-muted-foreground text-center">
            By signing in, you agree to our terms of service and privacy policy
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
