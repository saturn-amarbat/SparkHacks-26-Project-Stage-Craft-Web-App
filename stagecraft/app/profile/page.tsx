import { getUserProfile, getUserRentals } from '@/app/actions/profile';
import { ProfileHeader } from '@/components/profile/profile-header';
import { RentalHistory } from '@/components/profile/rental-history';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
  const { data: profile, error: profileError } = await getUserProfile();
  
  if (profileError || !profile) {
    redirect('/login?redirectTo=/profile');
  }

  const { data: rentals } = await getUserRentals();

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <ProfileHeader profile={profile} />

      <Tabs defaultValue="rentals" className="space-y-6">
        <TabsList>
          <TabsTrigger value="rentals">My Rentals</TabsTrigger>
          <TabsTrigger value="listings">My Listings</TabsTrigger>
          <TabsTrigger value="gigs">Saved Gigs</TabsTrigger>
        </TabsList>

        <TabsContent value="rentals" className="space-y-4">
          <h2 className="text-2xl font-bold">Rental History</h2>
          <p className="text-muted-foreground">
            Track your current and past equipment rentals.
          </p>
          <RentalHistory rentals={rentals || []} />
        </TabsContent>

        <TabsContent value="listings">
          <div className="text-center py-12 border rounded-lg bg-muted/20">
            <h3 className="text-lg font-medium mb-2">No active listings</h3>
            <p className="text-muted-foreground">
              You haven&apos;t listed any items for rent yet.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="gigs">
          <div className="text-center py-12 border rounded-lg bg-muted/20">
            <h3 className="text-lg font-medium mb-2">No saved gigs</h3>
            <p className="text-muted-foreground">
              Bookmarked casting calls will appear here.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
