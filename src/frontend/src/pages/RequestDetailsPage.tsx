import { useEffect } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetRequestDetails } from '../hooks/useGetRequestDetails';
import { useGetCallerUserProfile } from '../hooks/useGetCallerUserProfile';
import { useUpdateRequestStatus } from '../hooks/useUpdateRequestStatus';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Clock, User } from 'lucide-react';
import { formatBloodGroup } from '../utils/bloodGroupUtils';
import { useState } from 'react';
import { Variant_cancelled_pending_completed_matched } from '../backend';

export default function RequestDetailsPage() {
  const navigate = useNavigate();
  const { requestId } = useParams({ from: '/request/$requestId' });
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: request, isLoading } = useGetRequestDetails(requestId);
  const { mutate: updateStatus, isPending: updatingStatus } = useUpdateRequestStatus();
  const [newStatus, setNewStatus] = useState<Variant_cancelled_pending_completed_matched | ''>('');

  useEffect(() => {
    if (!identity) {
      navigate({ to: '/auth' });
    }
  }, [identity, navigate]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Loading...</p>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Request not found</p>
      </div>
    );
  }

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const getUrgencyColor = () => {
    switch (request.urgency) {
      case 'critical':
        return 'destructive';
      case 'high':
        return 'default';
      case 'normal':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getStatusColor = () => {
    switch (request.status) {
      case 'completed':
        return 'bg-green-500/10 text-green-700 dark:text-green-400';
      case 'matched':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-400';
      case 'cancelled':
        return 'bg-gray-500/10 text-gray-700 dark:text-gray-400';
      default:
        return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
    }
  };

  const canUpdateStatus =
    userProfile &&
    (userProfile.role === 'admin' ||
      identity?.getPrincipal().toString() === request.requester.toString() ||
      (request.matchedDonor && identity?.getPrincipal().toString() === request.matchedDonor.toString()));

  const handleStatusUpdate = () => {
    if (newStatus) {
      updateStatus({ requestId: request.id, status: newStatus });
      setNewStatus('');
    }
  };

  const displayLocation = request.location.address || request.location.city;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
      <Button variant="outline" onClick={() => navigate({ to: -1 as any })}>
        ← Back
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="text-3xl font-bold text-primary">
              {formatBloodGroup(request.bloodGroup)} Blood Request
            </CardTitle>
            <div className="flex gap-2">
              <Badge variant={getUrgencyColor()}>{request.urgency}</Badge>
              <Badge className={getStatusColor()}>{request.status}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Request ID</p>
                <p className="font-medium">{request.id}</p>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{displayLocation}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Created At</p>
                  <p className="font-medium">{formatDate(request.createdAt)}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Requester</p>
                  <p className="font-medium text-xs break-all">{request.requester.toString()}</p>
                </div>
              </div>
              {request.matchedDonor && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Matched Donor</p>
                    <p className="font-medium text-xs break-all">{request.matchedDonor.toString()}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {canUpdateStatus && (
            <div className="pt-6 border-t border-border">
              <p className="text-sm font-medium mb-3">Update Status</p>
              <div className="flex gap-3">
                <Select value={newStatus} onValueChange={(value) => setNewStatus(value as Variant_cancelled_pending_completed_matched)}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select new status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="matched">Matched</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleStatusUpdate} disabled={!newStatus || updatingStatus}>
                  {updatingStatus ? 'Updating...' : 'Update'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
