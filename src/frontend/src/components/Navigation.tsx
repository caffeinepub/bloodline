import { Link, useLocation } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Heart } from 'lucide-react';
import { useState } from 'react';
import LoginButton from './LoginButton';

export default function Navigation() {
  const { identity } = useInternetIdentity();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isAuthenticated = !!identity;

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const NavLinks = () => (
    <>
      <Link
        to="/"
        className={`transition-colors ${
          isActive('/') ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'
        }`}
        onClick={() => setIsOpen(false)}
      >
        Home
      </Link>
      {isAuthenticated && (
        <>
          <Link
            to="/blood-request"
            className={`transition-colors ${
              isActive('/blood-request') ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'
            }`}
            onClick={() => setIsOpen(false)}
          >
            Blood Request
          </Link>
          <Link
            to="/blood-donation"
            className={`transition-colors ${
              isActive('/blood-donation') ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'
            }`}
            onClick={() => setIsOpen(false)}
          >
            Blood Donation
          </Link>
          <Link
            to="/dashboard"
            className={`transition-colors ${
              isActive('/dashboard') ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'
            }`}
            onClick={() => setIsOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            to="/location-tracking"
            className={`transition-colors ${
              isActive('/location-tracking') ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'
            }`}
            onClick={() => setIsOpen(false)}
          >
            Location Tracking
          </Link>
        </>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <img src="/assets/generated/logo.dim_256x256.png" alt="BloodLine" className="h-8 w-8" />
            <span className="text-xl font-bold text-primary">BloodLine</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <NavLinks />
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <LoginButton />
          </div>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <div className="flex flex-col gap-4 mt-8">
                <NavLinks />
                <div className="pt-4 border-t border-border">
                  <LoginButton />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
