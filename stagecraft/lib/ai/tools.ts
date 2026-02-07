import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy-key-for-build",
});

// Service role key is required to bypass RLS for administrative tool functions
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key",
);

/**
 * Semantic search for products using vector similarity
 */
export async function inventorySemanticSearch(
  query: string,
  category?: "Costume" | "Prop" | "Equipment",
  matchThreshold: number = 0.7,
  limit: number = 5,
) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return {
        success: false,
        products: [],
        count: 0,
        error: "Missing OPENAI_API_KEY in environment",
      };
    }

    // Convert search query to vector embedding
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: query,
    });
    const queryEmbedding = embeddingResponse.data[0].embedding;

    // Execute similarity search via RPC
    const { data, error } = await supabase.rpc("match_products", {
      query_embedding: queryEmbedding,
      match_threshold: matchThreshold,
      match_count: category ? limit * 3 : limit, // Get more if filtering by category
    });

    if (error) {
      console.error("Error in semantic search:", error);
      return {
        success: false,
        products: [],
        count: 0,
        error: error.message,
      };
    }

    // Apply client-side category filtering
    const filtered = category
      ? data?.filter((p: { category: string }) => p.category === category)
      : data;

    // Limit results after filtering
    const results = filtered?.slice(0, limit) || [];

    return {
      success: true,
      products: results,
      count: results.length,
      query,
      category,
    };
  } catch (error) {
    console.error("Error in inventorySemanticSearch:", error);
    return {
      success: false,
      products: [],
      count: 0,
      error: "Failed to search inventory",
    };
  }
}

/**
 * Check if a product is available for rental during specific dates
 */
export async function checkProductAvailability(
  productId: string,
  startDate: string,
  endDate: string,
) {
  try {
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
        success: false,
        available: false,
        error: error.message,
      };
    }

    const available = !conflicts || conflicts.length === 0;

    return {
      success: true,
      available,
      conflicts: conflicts || [],
      message: available
        ? "Item is available for your dates"
        : `Item unavailable ${startDate} to ${endDate}. Next available: ${conflicts && conflicts[0] ? conflicts[0].end_date : "unknown"}`,
    };
  } catch (error) {
    console.error("Error in checkProductAvailability:", error);
    return {
      success: false,
      available: false,
      error: "Failed to check availability",
    };
  }
}

/**
 * Add multiple items to user's cart at once
 */
export async function createCartBundle(
  user: {
    id: string;
    email?: string | null;
    full_name?: string | null;
    avatar_url?: string | null;
  },
  productIds: string[],
  rentalDates?: { start: string; end: string },
) {
  try {
    if (!user?.id) {
      return {
        success: false,
        error: "User not authenticated",
        itemsAdded: 0,
      };
    }

    if (!user.email) {
      return {
        success: false,
        error: "User profile is missing an email address",
        itemsAdded: 0,
      };
    }

    const { data: existingProfile, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .single();

    if (profileError && profileError.code !== "PGRST116") {
      console.error("Error checking profile:", profileError);
      return {
        success: false,
        error: profileError.message,
        itemsAdded: 0,
      };
    }

    if (!existingProfile) {
      const { error: insertProfileError } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          email: user.email,
          full_name: user.full_name || null,
          avatar_url: user.avatar_url || null,
        });

      if (insertProfileError) {
        console.error("Error creating profile:", insertProfileError);
        return {
          success: false,
          error: insertProfileError.message,
          itemsAdded: 0,
        };
      }
    }

    if (!productIds || productIds.length === 0) {
      return {
        success: false,
        error: "No products specified",
        itemsAdded: 0,
      };
    }

    // Get existing cart items for this user
    const { data: existingItems } = await supabase
      .from("cart_items")
      .select("product_id, id, quantity")
      .eq("user_id", user.id);

    const existingProductIds = new Set(
      existingItems?.map((item) => item.product_id) || [],
    );

    const itemsToInsert = [];
    const itemsToUpdate = [];

    for (const productId of productIds) {
      if (existingProductIds.has(productId)) {
        // Find existing item and prepare update
        const existingItem = existingItems?.find(
          (item) => item.product_id === productId,
        );
        if (existingItem) {
          itemsToUpdate.push({
            id: existingItem.id,
            quantity: existingItem.quantity + 1,
          });
        }
      } else {
        // Prepare new item
        itemsToInsert.push({
          user_id: user.id,
          product_id: productId,
          quantity: 1,
          ...(rentalDates && {
            rental_start_date: rentalDates.start,
            rental_end_date: rentalDates.end,
          }),
        });
      }
    }

    // Batch insert new items
    if (itemsToInsert.length > 0) {
      const { error: insertError } = await supabase
        .from("cart_items")
        .insert(itemsToInsert);

      if (insertError) {
        console.error("Error inserting cart items:", insertError);
        return {
          success: false,
          error: insertError.message,
          itemsAdded: 0,
        };
      }
    }

    // Update existing items
    for (const item of itemsToUpdate) {
      await supabase
        .from("cart_items")
        .update({ quantity: item.quantity })
        .eq("id", item.id);
    }

    const totalItemsAffected = itemsToInsert.length + itemsToUpdate.length;

    return {
      success: true,
      itemsAdded: totalItemsAffected,
      message: `Added ${totalItemsAffected} item(s) to your cart`,
      newItems: itemsToInsert.length,
      updatedItems: itemsToUpdate.length,
    };
  } catch (error) {
    console.error("Error in createCartBundle:", error);
    return {
      success: false,
      error: "Failed to add items to cart",
      itemsAdded: 0,
    };
  }
}
