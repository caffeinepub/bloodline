import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useSaveCallerUserProfile } from '../hooks/useSaveCallerUserProfile';
import { BloodGroup, UserProfile } from '../backend';
import { toast } from 'sonner';
import GoogleMapsPlacePicker from './GoogleMapsPlacePicker';

interface ProfileFormProps {
  profile: UserProfile;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ProfileForm({ profile, onSuccess, onCancel }: ProfileFormProps) {
  const [name, setName] = useState(profile.name);
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>(profile.bloodGroup);
  const [location, setLocation] = useState<{ address: string; city: string; latitude: number; longitude: number }>({
    address: profile.location.address || '',
    city: profile.location.city,
    latitude: profile.location.latitude,
    longitude: profile.location.longitude,
  });
  const [contactPref, setContactPref] = useState(profile.contactPref);
  const [available, setAvailable] = useState(profile.available);

  const { mutate: saveProfile, isPending } = useSaveCallerUserProfile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !location) {
      toast.error('Please fill in all required fields');
      return;
    }

    saveProfile(
      {
        name,
        bloodGroup,
        role: profile.role,
        location: {
          city: location.city,
          latitude: location.latitude,
          longitude: location.longitude,
          address: location.address,
        },
        available,
        contactPref,
      },
      {
        onSuccess: () => {
          onSuccess?.();
        },
      }
    );
  };

  return (
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

      <GoogleMapsPlacePicker
        value={location.address}
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

      <div className="flex items-center justify-between">
        <Label htmlFor="available">Available for Donation</Label>
        <Switch id="available" checked={available} onCheckedChange={setAvailable} />
      </div>

      <div className="flex gap-3">
        <Button type="submit" className="flex-1" disabled={isPending}>
          {isPending ? 'Saving...' : 'Save Changes'}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
