import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useGetCallerUserProfile';
import { useGetUserRequests } from '../hooks/useGetUserRequests';
import { useUpdateAvailability } from '../hooks/useUpdateAvailability';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import ProfileForm from '../components/ProfileForm';
import BloodRequestCard from '../components/BloodRequestCard';
import { formatBloodGroup } from '../utils/bloodGroupUtils';
import { Edit, User, Droplet } from 'lucide-react';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const { data: requests = [], isLoading: requestsLoading } = useGetUserRequests();
  const { mutate: updateAvailability, isPending: updatingAvailability } = useUpdateAvailability();
  const [isEditingProfile, setIsEditingProfile] = useState(false);

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
        <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Manage your profile and blood requests</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <User className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Your personal details</CardDescription>
                </div>
              </div>
              {!isEditingProfile && (
                <Button onClick={() => setIsEditingProfile(true)} variant="outline" size="sm" className="gap-2">
                  <Edit className="w-4 h-4" />
                  Edit
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isEditingProfile ? (
              <ProfileForm
                profile={userProfile}
                onSuccess={() => setIsEditingProfile(false)}
                onCancel={() => setIsEditingProfile(false)}
              />
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="text-lg font-medium">{userProfile.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Blood Group</p>
                  <p className="text-lg font-medium">{formatBloodGroup(userProfile.bloodGroup)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="text-lg font-medium">
                    {userProfile.location.address || userProfile.location.city}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Contact Preference</p>
                  <p className="text-lg font-medium">{userProfile.contactPref}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplet className="h-5 w-5 text-primary" />
              Donation Status
            </CardTitle>
            <CardDescription>Your availability settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="availability" className="text-sm font-medium">
                  Available for Donation
                </Label>
                <Switch
                  id="availability"
                  checked={userProfile.available}
                  onCheckedChange={handleAvailabilityToggle}
                  disabled={updatingAvailability}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                {userProfile.available
                  ? 'You are currently available to donate blood'
                  : 'You are currently not available to donate blood'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Your Blood Requests</h2>
          <Button onClick={() => navigate({ to: '/blood-request' })} variant="outline">
            Create New Request
          </Button>
        </div>
        {requestsLoading ? (
          <p className="text-muted-foreground">Loading your requests...</p>
        ) : requests.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground mb-4">You haven't created any blood requests yet.</p>
              <Button onClick={() => navigate({ to: '/blood-request' })}>Create Your First Request</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.map((request) => (
              <BloodRequestCard key={request.id} request={request} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
