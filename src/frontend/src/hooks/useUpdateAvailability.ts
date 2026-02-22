import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useGetCallerUserProfile } from './useGetCallerUserProfile';
import { toast } from 'sonner';

export function useUpdateAvailability() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { data: userProfile } = useGetCallerUserProfile();

  return useMutation({
    mutationFn: async (available: boolean) => {
      if (!actor || !userProfile) throw new Error('Actor or profile not available');
      return actor.saveCallerUserProfile({
        ...userProfile,
        available,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      toast.success('Availability updated');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update availability');
    },
  });
}
