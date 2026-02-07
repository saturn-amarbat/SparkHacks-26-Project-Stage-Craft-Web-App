'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { addToCart } from '@/app/actions/cart';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/store/cart-store';
import { toast } from 'sonner';
import { ShoppingCart, Sparkles } from 'lucide-react';

interface ProductDetailProps {
  product: {
    id: string;
    name: string;
    description: string;
    category: string;
    tags: string[];
    rental_price_per_day: number;
    purchase_price?: number;
    image_url: string;
    available: boolean;
    profiles?: {
      full_name?: string;
      avatar_url?: string;
    };
  };
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { openCart } = useCartStore();

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      const dates =
        startDate && endDate
          ? { start: startDate, end: endDate }
          : undefined;

      const result = await addToCart(product.id, dates);

      if (result.success) {
        // Show success toast with cute animation
        toast.success('Added to cart!', {
          description: `${product.name} is ready for checkout`,
          icon: <Sparkles className="h-4 w-4" />,
          duration: 3000,
        });

        // Open cart after a short delay
        setTimeout(() => {
          openCart();
        }, 500);

        router.refresh();
      } else {
        // Check if user needs to sign in
        if ((result as any).needsAuth) {
          toast.error('Sign in required', {
            description: result.error,
            action: {
              label: 'Sign In',
              onClick: () => router.push(`/login?redirectTo=/marketplace/${product.id}`),
            },
          });
        } else {
          toast.error('Oops!', {
            description: result.error || 'Failed to add to cart',
          });
        }
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Oops!', {
        description: 'Failed to add to cart',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!startDate || !endDate) return product.rental_price_per_day;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.max(
      1,
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    );

    return product.rental_price_per_day * days;
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Image Section */}
      <div className="relative aspect-square rounded-lg overflow-hidden">
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Details Section */}
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge>{product.category}</Badge>
            <Badge variant={product.available ? 'default' : 'secondary'}>
              {product.available ? 'Available' : 'Unavailable'}
            </Badge>
          </div>
          <h1 className="text-4xl font-bold">{product.name}</h1>
        </div>

        <div>
          <p className="text-lg text-muted-foreground">{product.description}</p>
        </div>

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Pricing */}
        <div className="border-y py-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-3xl font-bold">
                ${product.rental_price_per_day}
              </p>
              <p className="text-sm text-muted-foreground">per day</p>
            </div>
            {product.purchase_price && (
              <div className="text-right">
                <p className="text-xl font-semibold">
                  ${product.purchase_price}
                </p>
                <p className="text-sm text-muted-foreground">to purchase</p>
              </div>
            )}
          </div>
        </div>

        {/* Rental Dates */}
        {product.available && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate || new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            {startDate && endDate && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Total Cost</p>
                <p className="text-2xl font-bold">${calculateTotal()}</p>
              </div>
            )}

            <Button
              onClick={handleAddToCart}
              disabled={isLoading || !product.available}
              className="w-full transition-all hover:scale-105 active:scale-95"
              size="lg"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {isLoading ? 'Adding...' : 'Add to Cart'}
            </Button>
          </div>
        )}

        {/* Owner Info */}
        {product.profiles?.full_name && (
          <div className="border-t pt-4">
            <p className="text-sm text-muted-foreground">Listed by</p>
            <p className="font-medium">{product.profiles.full_name}</p>
          </div>
        )}
      </div>
    </div>
  );
}
