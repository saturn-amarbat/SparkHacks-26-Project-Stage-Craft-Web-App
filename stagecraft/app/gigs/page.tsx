import { getGigs } from '@/app/actions/gigs';
import { GigCard } from '@/components/gig/gig-card';
import { PostGigForm } from '@/components/gig/post-gig-form';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default async function GigsPage() {
  const { data: gigs, error } = await getGigs();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary via-amber-600 to-amber-500 mb-3">
            Gigs
          </h1>
          <p className="text-foreground/80 mt-2 text-lg font-medium">
            Casting calls and crew opportunities.
          </p>
        </div>

        <PostGigForm />
      </div>

      {error ? (
        <div className="text-center py-12 bg-destructive/10 rounded-xl border-2 border-destructive/50">
          <p className="text-destructive text-lg font-semibold">Error loading gigs.</p>
        </div>
      ) : !gigs || gigs.length === 0 ? (
        <div className="text-center py-24 bg-muted/40 rounded-xl border-2 border-dashed border-primary/30">
          <h3 className="text-2xl font-bold mb-3 text-foreground">No gigs yet</h3>
          <p className="text-foreground/70 mb-6 text-base font-medium">Post the first one.</p>
          <PostGigForm />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gigs.map((gig) => (
            <GigCard key={gig.id} gig={gig} />
          ))}
        </div>
      )}
    </div>
  );
}
