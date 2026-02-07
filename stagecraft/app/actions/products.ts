'use server';

import { createClient } from '@/lib/supabase/server';

export async function getProducts(filters?: {
  category?: 'Costume' | 'Prop' | 'Equipment';
  limit?: number;
  searchQuery?: string;
}) {
  try {
    const supabase = await createClient();

    let query = supabase
      .from('products')
      .select('*, profiles(full_name, avatar_url)')
      .eq('available', true);

    if (filters?.category) {
      query = query.eq('category', filters.category);
    }

    if (filters?.searchQuery) {
      query = query.ilike('name', `%${filters.searchQuery}%`);
    }

    query = query
      .order('created_at', { ascending: false })
      .limit(filters?.limit || 50);

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching products:', error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error fetching products:', error);
    return { data: null, error: 'Failed to fetch products' };
  }
}

export async function getProductById(id: string) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('products')
      .select('*, profiles(full_name, avatar_url)')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching product:', error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error fetching product:', error);
    return { data: null, error: 'Failed to fetch product' };
  }
}

export async function getFeaturedProducts(limit: number = 6) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('products')
      .select('*, profiles(full_name, avatar_url)')
      .eq('available', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching featured products:', error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error fetching featured products:', error);
    return { data: null, error: 'Failed to fetch featured products' };
  }
}

export async function getProductsByCategory(
  category: 'Costume' | 'Prop' | 'Equipment',
  limit: number = 12
) {
  return getProducts({ category, limit });
}
