import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useGetCallerUserProfile } from './useGetCallerUserProfile';
import { useGetUserRequests } from './useGetUserRequests';
import { BloodRequest } from '../backend';
import { canDonateToReceiver } from '../utils/bloodGroupUtils';

export function useGetMatchingRequests() {
  const { actor, isFetching: actorFetching } = useActor();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: allRequests = [] } = useGetUserRequests();

  return useQuery<BloodRequest[]>({
    queryKey: ['matchingRequests', userProfile?.bloodGroup],
    queryFn: async () => {
      if (!actor || !userProfile) return [];
      
      // Filter requests that match the donor's blood group compatibility
      const matchingRequests = allRequests.filter((request) => {
        // Don't show own requests
        if (request.requester.toString() === userProfile.name) return false;
        
        // Only show pending requests
        if (request.status !== 'pending') return false;
        
        // Check blood group compatibility
        return canDonateToReceiver(userProfile.bloodGroup, request.bloodGroup);
      });
      
      return matchingRequests;
    },
    enabled: !!actor && !actorFetching && !!userProfile,
  });
}
