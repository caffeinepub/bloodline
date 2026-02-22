import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';

export default function ChatPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();

  useEffect(() => {
    if (!identity) {
      navigate({ to: '/auth' });
    }
  }, [identity, navigate]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <img src="/assets/generated/chat-icon.dim_64x64.png" alt="Chat" className="h-8 w-8" />
            <CardTitle>Chat</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Chat functionality will be available here. Connect with matched donors or receivers to coordinate blood
              donations.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
