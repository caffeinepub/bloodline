import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Heart, MapPin, Zap, Shield } from 'lucide-react';
import FeatureCard from '../components/FeatureCard';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useEffect } from 'react';
import { useGetCallerUserProfile } from '../hooks/useGetCallerUserProfile';

export default function LandingPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();

  useEffect(() => {
    if (identity && userProfile) {
      navigate({ to: '/dashboard' });
    }
  }, [identity, userProfile, navigate]);

  return (
    <div className="min-h-screen">
      <section
        className="relative py-20 px-4 bg-cover bg-center"
        style={{ backgroundImage: 'url(/assets/generated/hero-bg.dim_1920x1080.png)' }}
      >
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground">
              Save Lives with <span className="text-primary">BloodLine</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              A real-time blood donation platform connecting donors and recipients during emergencies. Fast donor
              discovery, secure communication, and location-based matching to help save lives.
            </p>
            <div className="flex gap-4 justify-center pt-4">
              <Button size="lg" onClick={() => navigate({ to: '/auth' })} className="gap-2">
                <Heart className="w-5 h-5" />
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-card">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={MapPin}
              title="Location-Based Matching"
              description="Find nearby donors instantly based on blood type and location proximity"
            />
            <FeatureCard
              icon={Zap}
              title="Fast Response"
              description="Connect with donors in real-time during critical emergencies"
            />
            <FeatureCard
              icon={Heart}
              title="Easy Donation"
              description="Toggle your availability and respond to requests when you can help"
            />
            <FeatureCard
              icon={Shield}
              title="Secure Platform"
              description="Protected by Internet Identity with role-based access control"
            />
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center space-y-6">
          <h2 className="text-3xl font-bold">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 pt-8">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto">
                1
              </div>
              <h3 className="text-xl font-semibold">Sign Up</h3>
              <p className="text-muted-foreground">Register as a donor or receiver with your blood type and location</p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto">
                2
              </div>
              <h3 className="text-xl font-semibold">Get Matched</h3>
              <p className="text-muted-foreground">
                Our system matches donors with recipients based on compatibility and proximity
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto">
                3
              </div>
              <h3 className="text-xl font-semibold">Save Lives</h3>
              <p className="text-muted-foreground">Connect directly and coordinate donation to help those in need</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
