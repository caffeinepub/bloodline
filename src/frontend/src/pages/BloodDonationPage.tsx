import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useGetCallerUserProfile';
import { useGetMatchingRequests } from '../hooks/useGetMatchingRequests';
import { useUpdateAvailability } from '../hooks/useUpdateAvailability';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import BloodRequestCard from '../components/BloodRequestCard';
import { Heart, Droplet } from 'lucide-react';

export default function BloodDonationPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const { data: matchingRequests = [], isLoading: requestsLoading } = useGetMatchingRequests();
  const { mutate: updateAvailability, isPending: updatingAvailability } = useUpdateAvailability();

  useEffect(() => {
    if (!identity) {
      navigate({ to: '/auth' });
    }
  }, [identity, navigate]);

  if (!identity || profileLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Loading...</p>
      </div>
    );
  }

  if (!userProfile) {
    return null;
  }

  const handleAvailabilityToggle = (checked: boolean) => {
    updateAvailability(checked);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <Heart className="h-10 w-10 text-primary" />
          Blood Donation
        </h1>
        <p className="text-muted-foreground">Help save lives by donating blood</p>
      </div>

      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Your Donation Status</CardTitle>
            <CardDescription>Manage your availability for blood donation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="availability" className="text-base font-medium">
                  Available for Donation
                </Label>
                <p className="text-sm text-muted-foreground">
                  Toggle this to let others know you're available to donate blood
                </p>
              </div>
              <Switch
                id="availability"
                checked={userProfile.available}
                onCheckedChange={handleAvailabilityToggle}
                disabled={updatingAvailability}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Droplet className="h-6 w-6 text-primary" />
          Matching Blood Requests
        </h2>
        {requestsLoading ? (
          <p className="text-muted-foreground">Loading matching requests...</p>
        ) : matchingRequests.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <Droplet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">No matching blood requests at the moment.</p>
              <p className="text-sm text-muted-foreground">
                We'll notify you when someone needs your blood type.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matchingRequests.map((request) => (
              <BloodRequestCard key={request.id} request={request} />
            ))}
          </div>
        )}
      </div>

      <div className="mt-12">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              Why Donate Blood?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm">
              <strong>Save Lives:</strong> One donation can save up to three lives.
            </p>
            <p className="text-sm">
              <strong>Health Benefits:</strong> Regular donation can reduce the risk of heart disease and cancer.
            </p>
            <p className="text-sm">
              <strong>Free Health Check:</strong> Get a mini health screening with every donation.
            </p>
            <p className="text-sm">
              <strong>Community Impact:</strong> Help your local community in times of need.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
