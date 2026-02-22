import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ActiveLocation } from '../backend';

export function useGetActiveLocations() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<ActiveLocation[]>({
    queryKey: ['activeLocations'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getActiveLocations();
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
    retry: 2,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
  };
}
