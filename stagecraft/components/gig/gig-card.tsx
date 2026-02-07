import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarDays, MapPin, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { HoverCard } from '@/components/ui/motion';

interface GigProps {
  gig: {
    id: string;
    title: string;
    description: string;
    production_type: string;
    location: string;
    role_name?: string;
    audition_date?: string;
    created_at: string;
    profiles?: {
      full_name?: string;
      avatar_url?: string;
    };
  };
}

export function GigCard({ gig }: GigProps) {
  return (
    <HoverCard className="h-full">
      <Card className="flex flex-col h-full hover:shadow-xl transition-colors transition-shadow duration-300 border-2 border-primary/30 hover:border-primary/60 bg-card">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start gap-4">
            <div>
              <Badge variant="default" className="mb-3 font-semibold bg-primary text-primary-foreground border-0">
                {gig.production_type}
              </Badge>
              <h3 className="font-bold text-xl line-clamp-2 text-foreground mb-2">{gig.title}</h3>
              {gig.role_name && (
                <p className="text-sm font-semibold text-amber-600 dark:text-amber-400 mt-1">
                  Seeking: {gig.role_name}
                </p>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 pb-3">
          <p className="text-foreground/80 text-sm line-clamp-3 mb-4 leading-relaxed">
            {gig.description}
          </p>

          <div className="space-y-2.5 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
              <span className="text-foreground/90 font-medium">{gig.location}</span>
            </div>
            {gig.audition_date && (
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                <span className="text-foreground/90 font-medium">Audition: {new Date(gig.audition_date).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="pt-3 border-t-2 border-border bg-muted/50 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Avatar className="h-7 w-7 ring-2 ring-primary/20">
              <AvatarImage src={gig.profiles?.avatar_url} />
              <AvatarFallback className="bg-primary/10">
                <User className="h-3.5 w-3.5 text-primary" />
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-foreground/70 font-medium">
              Posted {formatDistanceToNow(new Date(gig.created_at))} ago
            </span>
          </div>
          <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
            Apply Now
          </Button>
        </CardFooter>
      </Card>
    </HoverCard>
  );
}
