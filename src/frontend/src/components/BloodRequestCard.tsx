import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock } from 'lucide-react';
import { BloodRequest } from '../backend';
import { formatBloodGroup } from '../utils/bloodGroupUtils';
import { useNavigate } from '@tanstack/react-router';

interface BloodRequestCardProps {
  request: BloodRequest;
  showActions?: boolean;
}

export default function BloodRequestCard({ request, showActions = true }: BloodRequestCardProps) {
  const navigate = useNavigate();

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

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const displayLocation = request.location.address || request.location.city;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-2xl font-bold text-primary">
            {formatBloodGroup(request.bloodGroup)}
          </CardTitle>
          <div className="flex gap-2">
            <Badge variant={getUrgencyColor()}>{request.urgency}</Badge>
            <Badge className={getStatusColor()}>{request.status}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span className="line-clamp-1">{displayLocation}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>{formatDate(request.createdAt)}</span>
        </div>
        {showActions && (
          <Button
            onClick={() => navigate({ to: '/request/$requestId', params: { requestId: request.id } })}
            className="w-full mt-4"
          >
            View Details
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
