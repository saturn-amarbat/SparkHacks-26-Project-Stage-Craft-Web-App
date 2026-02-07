'use server';

import { createClient } from '@/lib/supabase/server';

export async function getUserProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { data: null, error: 'Not authenticated' };

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return { data, error: error?.message };
}

export async function getUserRentals() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { data: null, error: 'Not authenticated' };

  const { data, error } = await supabase
    .from('rentals')
    .select(`
      *,
      products (
        name,
        image_url,
        category
      )
    `)
    .or(`renter_id.eq.${user.id},owner_id.eq.${user.id}`)
    .order('created_at', { ascending: false });

  return { data, error: error?.message };
}
