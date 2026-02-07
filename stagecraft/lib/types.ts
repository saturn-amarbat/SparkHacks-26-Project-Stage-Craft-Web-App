import { z } from 'zod';

// Product Category Enum
export const ProductCategory = z.enum(['Costume', 'Prop', 'Equipment']);
export type ProductCategory = z.infer<typeof ProductCategory>;

// Product Schema
export const ProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  category: ProductCategory,
  tags: z.array(z.string()),
  rental_price_per_day: z.number().positive(),
  purchase_price: z.number().positive().optional(),
  image_url: z.string().url(),
  owner_id: z.string().uuid(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  available: z.boolean().default(true),
});

export type Product = z.infer<typeof ProductSchema>;

// User Profile Schema
export const UserProfileSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  full_name: z.string().optional(),
  avatar_url: z.string().url().optional(),
  bio: z.string().optional(),
  role: z.enum(['buyer', 'seller', 'both']),
  created_at: z.string().datetime(),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;

// Cart Item Schema
export const CartItemSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  product_id: z.string().uuid(),
  quantity: z.number().int().positive(),
  rental_start_date: z.string().date().optional(),
  rental_end_date: z.string().date().optional(),
});

export type CartItem = z.infer<typeof CartItemSchema>;

// Rental Schema
export const RentalSchema = z.object({
  id: z.string().uuid(),
  product_id: z.string().uuid(),
  renter_id: z.string().uuid(),
  owner_id: z.string().uuid(),
  start_date: z.string().date(),
  end_date: z.string().date(),
  total_price: z.number().positive(),
  status: z.enum(['pending', 'confirmed', 'active', 'completed', 'cancelled']),
  created_at: z.string().datetime(),
});

export type Rental = z.infer<typeof RentalSchema>;

// Gig Listing Schema (for social networking feature)
export const GigListingSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  production_type: z.string(),
  role_name: z.string().optional(),
  location: z.string(),
  audition_date: z.string().date().optional(),
  performance_dates: z.string().optional(),
  posted_by: z.string().uuid(),
  created_at: z.string().datetime(),
});

export type GigListing = z.infer<typeof GigListingSchema>;

// AI Tool Schemas
export const SearchInventoryInput = z.object({
  query: z.string(),
  category: ProductCategory.optional(),
  match_threshold: z.number().min(0).max(1).default(0.7),
  limit: z.number().int().positive().default(5),
});

export type SearchInventoryInput = z.infer<typeof SearchInventoryInput>;

export const CheckAvailabilityInput = z.object({
  product_id: z.string().uuid(),
  start_date: z.string().date(),
  end_date: z.string().date(),
});

export type CheckAvailabilityInput = z.infer<typeof CheckAvailabilityInput>;

export const CreateCartBundleInput = z.object({
  product_ids: z.array(z.string().uuid()),
  rental_start_date: z.string().date().optional(),
  rental_end_date: z.string().date().optional(),
});

export type CreateCartBundleInput = z.infer<typeof CreateCartBundleInput>;
