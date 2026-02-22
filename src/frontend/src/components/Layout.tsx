import { Outlet } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import Navigation from './Navigation';
import ProfileSetupModal from './ProfileSetupModal';
import { useGetCallerUserProfile } from '../hooks/useGetCallerUserProfile';

export default function Layout() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const isAuthenticated = !!identity;

  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-border py-6 px-4 bg-card">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} BloodLine. Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                window.location.hostname
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
      {showProfileSetup && <ProfileSetupModal />}
    </div>
  );
}
