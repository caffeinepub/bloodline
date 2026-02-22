import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Variant_cancelled_pending_completed_matched } from '../backend';
import { toast } from 'sonner';

interface UpdateRequestStatusParams {
  requestId: string;
  status: Variant_cancelled_pending_completed_matched;
}

export function useUpdateRequestStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ requestId, status }: UpdateRequestStatusParams) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateBloodRequestStatus(requestId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userRequests'] });
      queryClient.invalidateQueries({ queryKey: ['requestDetails'] });
      queryClient.invalidateQueries({ queryKey: ['matchingRequests'] });
      toast.success('Request status updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update request status');
    },
  });
}
