import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useGetCallerUserProfile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ProfileForm from '../components/ProfileForm';
import { formatBloodGroup } from '../utils/bloodGroupUtils';
import { Edit, User } from 'lucide-react';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading } = useGetCallerUserProfile();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!identity) {
      navigate({ to: '/auth' });
    }
  }, [identity, navigate]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Loading...</p>
      </div>
    );
  }

  if (!userProfile) {
    return null;
  }

  const displayLocation = userProfile.location.address || userProfile.location.city;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <User className="h-12 w-12 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Profile</h1>
            <p className="text-muted-foreground">Manage your personal information</p>
          </div>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} variant="outline" className="gap-2">
            <Edit className="w-4 h-4" />
            Edit Profile
          </Button>
        )}
      </div>

      {isEditing ? (
        <Card>
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileForm profile={userProfile} onSuccess={() => setIsEditing(false)} onCancel={() => setIsEditing(false)} />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="text-lg font-medium">{userProfile.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Blood Group</p>
              <p className="text-lg font-medium">{formatBloodGroup(userProfile.bloodGroup)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Role</p>
              <p className="text-lg font-medium capitalize">{userProfile.role}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="text-lg font-medium">{displayLocation}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Contact Preference</p>
              <p className="text-lg font-medium">{userProfile.contactPref}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Availability</p>
              <p className="text-lg font-medium">{userProfile.available ? 'Available' : 'Not Available'}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
