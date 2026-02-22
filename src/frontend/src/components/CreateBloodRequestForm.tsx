import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateBloodRequest } from '../hooks/useCreateBloodRequest';
import { BloodGroup, Variant_normal_high_critical } from '../backend';
import { toast } from 'sonner';
import GoogleMapsPlacePicker from './GoogleMapsPlacePicker';

interface CreateBloodRequestFormProps {
  onSuccess?: () => void;
}

export default function CreateBloodRequestForm({ onSuccess }: CreateBloodRequestFormProps) {
  const [bloodGroup, setBloodGroup] = useState<BloodGroup | ''>('');
  const [urgency, setUrgency] = useState<Variant_normal_high_critical | ''>('');
  const [location, setLocation] = useState<{ address: string; city: string; latitude: number; longitude: number } | null>(null);

  const { mutate: createRequest, isPending } = useCreateBloodRequest();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!bloodGroup || !urgency || !location) {
      toast.error('Please fill in all fields');
      return;
    }

    createRequest(
      {
        bloodGroup,
        urgency,
        location: {
          city: location.city,
          latitude: location.latitude,
          longitude: location.longitude,
          address: location.address,
        },
      },
      {
        onSuccess: () => {
          setBloodGroup('');
          setUrgency('');
          setLocation(null);
          onSuccess?.();
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        <Label htmlFor="urgency">Urgency Level *</Label>
        <Select value={urgency} onValueChange={(value) => setUrgency(value as Variant_normal_high_critical)}>
          <SelectTrigger>
            <SelectValue placeholder="Select urgency level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="normal">Normal</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <GoogleMapsPlacePicker
        onChange={setLocation}
        label="Location"
        placeholder="Search for the request location"
        required
      />

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create Request'}
      </Button>
    </form>
  );
}
