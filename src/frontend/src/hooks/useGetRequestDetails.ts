import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useGetUserRequests } from './useGetUserRequests';
import { BloodRequest } from '../backend';

export function useGetRequestDetails(requestId: string) {
  const { actor, isFetching } = useActor();
  const { data: userRequests } = useGetUserRequests();

  return useQuery<BloodRequest | null>({
    queryKey: ['requestDetails', requestId],
    queryFn: async () => {
      if (!userRequests) return null;
      return userRequests.find((req) => req.id === requestId) || null;
    },
    enabled: !!actor && !isFetching && !!userRequests,
  });
}
