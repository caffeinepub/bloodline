import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { BloodRequest } from '../backend';

export function useGetAllBloodRequests() {
  const { actor, isFetching } = useActor();

  return useQuery<BloodRequest[]>({
    queryKey: ['allBloodRequests'],
    queryFn: async () => {
      if (!actor) return [];
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}
