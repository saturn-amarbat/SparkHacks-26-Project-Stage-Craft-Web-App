"use server";

import { createClient } from "@/lib/supabase/server";

export async function checkAvailability(
  productId: string,
  startDate: string,
  endDate: string,
) {
  try {
    const supabase = await createClient();

    // Check for overlapping rentals
    const { data: conflicts, error } = await supabase
      .from("rentals")
      .select("*")
      .eq("product_id", productId)
      .in("status", ["pending", "confirmed", "active"])
      .or(`start_date.lte.${endDate},end_date.gte.${startDate}`);

    if (error) {
      console.error("Error checking availability:", error);
      return {
        available: false,
        conflicts: [],
        error: error.message,
      };
    }

    const available = !conflicts || conflicts.length === 0;

    return {
      available,
      conflicts: conflicts || [],
      message: available
        ? "Item is available for your dates"
        : `Item unavailable ${startDate} to ${endDate}. Conflicts with existing rental(s).`,
    };
  } catch (error) {
    console.error("Unexpected error checking availability:", error);
    return {
      available: false,
      conflicts: [],
      error: "Failed to check availability",
    };
  }
}

export async function getUserRentals() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { data: null, error: "Not authenticated" };
    }

    const { data, error } = await supabase
      .from("rentals")
      .select(
        `
        *,
        products (
          id,
          name,
          image_url,
          category
        )
      `,
      )
      .eq("renter_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching user rentals:", error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    console.error("Unexpected error fetching user rentals:", error);
    return { data: null, error: "Failed to fetch rentals" };
  }
}

export async function createRental(
  productId: string,
  startDate: string,
  endDate: string,
  totalPrice: number,
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    // Get product owner
    const { data: product } = await supabase
      .from("products")
      .select("owner_id")
      .eq("id", productId)
      .single();

    if (!product) {
      return { success: false, error: "Product not found" };
    }

    // Check availability first
    const availability = await checkAvailability(productId, startDate, endDate);
    if (!availability.available) {
      return { success: false, error: "Product not available for these dates" };
    }

    // Create rental
    const { error } = await supabase.from("rentals").insert({
      product_id: productId,
      renter_id: user.id,
      owner_id: product.owner_id,
      start_date: startDate,
      end_date: endDate,
      total_price: totalPrice,
      status: "pending",
    });

    if (error) {
      console.error("Error creating rental:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Unexpected error creating rental:", error);
    return { success: false, error: "Failed to create rental" };
  }
}
