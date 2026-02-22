import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { BloodGroup, Location, Variant_normal_high_critical } from '../backend';
import { toast } from 'sonner';

interface CreateBloodRequestParams {
  bloodGroup: BloodGroup;
  location: Location;
  urgency: Variant_normal_high_critical;
}

export function useCreateBloodRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bloodGroup, location, urgency }: CreateBloodRequestParams) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createBloodRequest(bloodGroup, location, urgency);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userRequests'] });
      queryClient.invalidateQueries({ queryKey: ['matchingRequests'] });
      toast.success('Blood request created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create blood request');
    },
  });
}
