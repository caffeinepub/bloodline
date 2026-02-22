import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export default function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <Card className="border-2 hover:border-primary transition-colors">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="p-3 rounded-full bg-primary/10">
            <Icon className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
