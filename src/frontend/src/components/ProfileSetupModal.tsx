import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSaveCallerUserProfile } from '../hooks/useSaveCallerUserProfile';
import { BloodGroup, UserRole } from '../backend';
import { toast } from 'sonner';
import GoogleMapsPlacePicker from './GoogleMapsPlacePicker';

export default function ProfileSetupModal() {
  const [name, setName] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup | ''>('');
  const [role, setRole] = useState<UserRole | ''>('');
  const [location, setLocation] = useState<{ address: string; city: string; latitude: number; longitude: number } | null>(null);
  const [contactPref, setContactPref] = useState('');

  const { mutate: saveProfile, isPending } = useSaveCallerUserProfile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !bloodGroup || !role || !location) {
      toast.error('Please fill in all required fields');
      return;
    }

    saveProfile({
      name,
      bloodGroup,
      role,
      location: {
        city: location.city,
        latitude: location.latitude,
        longitude: location.longitude,
        address: location.address,
      },
      available: true,
      contactPref: contactPref || 'In-app messaging',
    });
  };

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-[500px]" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Complete Your Profile</DialogTitle>
          <DialogDescription>
            Please provide your information to get started with BloodLine.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <Label htmlFor="bloodGroup">Blood Group *</Label>
            <Select value={bloodGroup} onValueChange={(value) => setBloodGroup(value as BloodGroup)}>
              <SelectTrigger>
                <SelectValue placeholder="Select blood group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={BloodGroup.aPositive}>A+</SelectItem>
                <SelectItem value={BloodGroup.aNegative}>A-</SelectItem>
                <SelectItem value={BloodGroup.bPositive}>B+</SelectItem>
                <SelectItem value={BloodGroup.bNegative}>B-</SelectItem>
                <SelectItem value={BloodGroup.abPositive}>AB+</SelectItem>
                <SelectItem value={BloodGroup.abNegative}>AB-</SelectItem>
                <SelectItem value={BloodGroup.oPositive}>O+</SelectItem>
                <SelectItem value={BloodGroup.oNegative}>O-</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="role">Role *</Label>
            <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
              <SelectTrigger>
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={UserRole.user}>User</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <GoogleMapsPlacePicker
            onChange={setLocation}
            label="Location"
            placeholder="Search for your location"
            required
          />

          <div>
            <Label htmlFor="contactPref">Contact Preference</Label>
            <Input
              id="contactPref"
              value={contactPref}
              onChange={(e) => setContactPref(e.target.value)}
              placeholder="e.g., In-app messaging"
            />
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? 'Saving...' : 'Complete Profile'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
