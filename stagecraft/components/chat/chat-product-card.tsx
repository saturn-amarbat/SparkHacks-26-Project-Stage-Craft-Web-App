"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Check } from "lucide-react";
import { useState } from "react";
import { addToCart } from "@/app/actions/cart";
import { toast } from "sonner";

export interface ChatProduct {
  id: string;
  name: string;
  description?: string;
  category?: string;
  rental_price_per_day?: number;
  purchase_price?: number;
  image_url?: string;
  available?: boolean;
  similarity?: number;
}

interface ChatProductCardProps {
  product: ChatProduct;
}

export function ChatProductCard({ product }: ChatProductCardProps) {
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      const result = await addToCart(product.id);
      if (result?.error) {
        toast.error(result.error);
      } else {
        setAdded(true);
        toast.success(`${product.name} added to cart`);
      }
    } catch {
      toast.error("Failed to add to cart");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-3 bg-card border border-border/50 rounded-xl p-3 w-full max-w-sm">
      {product.image_url && (
        <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover"
            sizes="80px"
          />
        </div>
      )}
      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-medium text-sm leading-tight truncate">
            {product.name}
          </h4>
          {product.category && (
            <Badge variant="outline" className="text-[10px] flex-shrink-0">
              {product.category}
            </Badge>
          )}
        </div>
        {product.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
            {product.description}
          </p>
        )}
        <div className="flex items-center justify-between mt-auto pt-2">
          {product.rental_price_per_day != null && (
            <span className="text-sm font-semibold">
              ${product.rental_price_per_day}
              <span className="text-xs font-normal text-muted-foreground">
                /day
              </span>
            </span>
          )}
          <Button
            size="sm"
            variant={added ? "secondary" : "default"}
            className="h-7 text-xs px-2"
            disabled={added || loading}
            onClick={handleAddToCart}
          >
            {added ? (
              <>
                <Check className="h-3 w-3 mr-1" /> Added
              </>
            ) : (
              <>
                <ShoppingCart className="h-3 w-3 mr-1" /> Add
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
