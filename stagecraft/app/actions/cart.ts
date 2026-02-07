'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function addToCart(
  productId: string,
  dates?: { start: string; end: string }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Please sign in to continue', needsAuth: true };
    }

    // Check if item already in cart
    const { data: existing } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .single();

    if (existing) {
      // Update quantity
      const { error } = await supabase
        .from('cart_items')
        .update({
          quantity: existing.quantity + 1,
          ...(dates && {
            rental_start_date: dates.start,
            rental_end_date: dates.end,
          }),
        })
        .eq('id', existing.id);

      if (error) {
        return { success: false, error: error.message };
      }
    } else {
      // Insert new item
      const { error } = await supabase.from('cart_items').insert({
        user_id: user.id,
        product_id: productId,
        quantity: 1,
        ...(dates && {
          rental_start_date: dates.start,
          rental_end_date: dates.end,
        }),
      });

      if (error) {
        return { success: false, error: error.message };
      }
    }

    revalidatePath('/cart');
    return { success: true };
  } catch (error) {
    console.error('Error adding to cart:', error);
    return { success: false, error: 'Failed to add to cart' };
  }
}

export async function getCartItems() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Use demo user if not authenticated (for hackathon/demo purposes)
    const userId = user?.id || '51bf926f-1055-4019-a2d9-fcee854806f7';

    const { data, error } = await supabase
      .from('cart_items')
      .select(
        `
        *,
        products (
          id,
          name,
          description,
          category,
          rental_price_per_day,
          purchase_price,
          image_url,
          available
        )
      `
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching cart items:', error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error fetching cart items:', error);
    return { data: null, error: 'Failed to fetch cart items' };
  }
}

export async function removeFromCart(cartItemId: string) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Please sign in to continue' };
    }

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', cartItemId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error removing from cart:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/cart');
    return { success: true };
  } catch (error) {
    console.error('Unexpected error removing from cart:', error);
    return { success: false, error: 'Failed to remove from cart' };
  }
}

export async function updateCartItemQuantity(
  cartItemId: string,
  quantity: number
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Please sign in to continue' };
    }

    if (quantity < 1) {
      return removeFromCart(cartItemId);
    }

    const { error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', cartItemId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error updating cart item:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/cart');
    return { success: true };
  } catch (error) {
    console.error('Unexpected error updating cart item:', error);
    return { success: false, error: 'Failed to update cart item' };
  }
}

export async function clearCart() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Please sign in to continue' };
    }

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.id);

    if (error) {
      console.error('Error clearing cart:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/cart');
    return { success: true };
  } catch (error) {
    console.error('Unexpected error clearing cart:', error);
    return { success: false, error: 'Failed to clear cart' };
  }
}
