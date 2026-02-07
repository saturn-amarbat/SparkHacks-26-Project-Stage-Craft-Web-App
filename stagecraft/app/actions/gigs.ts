'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getGigs() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('gig_listings')
      .select(`
        *,
        profiles (
          full_name,
          avatar_url
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching gigs:', error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error fetching gigs:', error);
    return { data: null, error: 'Failed to fetch gigs' };
  }
}

export async function createGig(formData: FormData) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Please sign in to post a gig' };
    }

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const production_type = formData.get('production_type') as string;
    const location = formData.get('location') as string;
    const role_name = formData.get('role_name') as string;
    
    // Naive date handling for demo
    const dateStr = formData.get('audition_date') as string;
    const audition_date = dateStr ? new Date(dateStr).toISOString() : null;

    if (!title || !description || !location) {
      return { success: false, error: 'Missing required fields' };
    }

    const { error } = await supabase.from('gig_listings').insert({
      title,
      description,
      production_type,
      location,
      role_name,
      audition_date,
      posted_by: user.id,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/gigs');
    return { success: true };
  } catch (error) {
    console.error('Error creating gig:', error);
    return { success: false, error: 'Failed to create gig' };
  }
}
