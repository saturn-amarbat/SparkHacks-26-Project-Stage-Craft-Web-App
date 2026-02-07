'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Settings, LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface ProfileHeaderProps {
  profile: {
    full_name: string | null;
    email: string;
    avatar_url: string | null;
    role: string | null;
  };
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const router = useRouter();
  
  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <Card className="mb-8 border-none bg-gradient-to-r from-muted/50 to-background">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
            <AvatarImage src={profile.avatar_url || ''} />
            <AvatarFallback className="bg-primary/20 text-2xl">
              {profile.full_name?.[0] || <User />}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 text-center md:text-left space-y-2">
            <h1 className="text-3xl font-bold">{profile.full_name || 'Theater Professional'}</h1>
            <p className="text-muted-foreground">{profile.email}</p>
            <div className="flex gap-2 justify-center md:justify-start">
              <Badge variant="secondary" className="capitalize">
                {profile.role || 'Member'}
              </Badge>
              <Badge variant="outline" className="border-primary/50 text-primary">
                verified
              </Badge>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" size="sm" className="gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              className="gap-2"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
