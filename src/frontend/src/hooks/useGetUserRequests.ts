import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import { BloodRequest } from '../backend';

export function useGetUserRequests() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<BloodRequest[]>({
    queryKey: ['userRequests', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return [];
      return actor.getRequestsForUser(identity.getPrincipal());
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}
