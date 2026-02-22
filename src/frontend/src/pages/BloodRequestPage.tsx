import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetUserRequests } from '../hooks/useGetUserRequests';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import CreateBloodRequestForm from '../components/CreateBloodRequestForm';
import BloodRequestCard from '../components/BloodRequestCard';
import { ChevronDown, ChevronUp, Plus } from 'lucide-react';

export default function BloodRequestPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: requests = [], isLoading } = useGetUserRequests();
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    if (!identity) {
      navigate({ to: '/auth' });
    }
  }, [identity, navigate]);

  if (!identity) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Blood Requests</h1>
        <p className="text-muted-foreground">Create and manage your blood requests</p>
      </div>

      <div className="mb-8">
        <Collapsible open={isFormOpen} onOpenChange={setIsFormOpen}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Create New Blood Request</CardTitle>
                  <CardDescription>Request blood for yourself or someone in need</CardDescription>
                </div>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="icon">
                    {isFormOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </Button>
                </CollapsibleTrigger>
              </div>
            </CardHeader>
            <CollapsibleContent>
              <CardContent>
                <CreateBloodRequestForm onSuccess={() => setIsFormOpen(false)} />
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
        {!isFormOpen && (
          <Button onClick={() => setIsFormOpen(true)} className="w-full mt-4" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Create New Request
          </Button>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Your Blood Requests</h2>
        {isLoading ? (
          <p className="text-muted-foreground">Loading your requests...</p>
        ) : requests.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">You haven't created any blood requests yet.</p>
              <Button onClick={() => setIsFormOpen(true)} className="mt-4">
                Create Your First Request
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.map((request) => (
              <BloodRequestCard key={request.id} request={request} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
