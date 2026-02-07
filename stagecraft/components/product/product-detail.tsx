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
import { ShoppingCart, Sparkles, Calendar, Tag } from 'lucide-react';
import { FadeIn } from '@/components/ui/motion';

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
        toast.success('Added to cart!', {
          description: `${product.name} is ready for checkout`,
          icon: <Sparkles className="h-4 w-4" />,
          duration: 3000,
        });

        setTimeout(() => {
          openCart();
        }, 500);

        router.refresh();
      } else {
        if ((result as { needsAuth?: boolean }).needsAuth) {
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
    <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-start">
      {/* Image Section */}
      <FadeIn className="relative aspect-[4/3] md:aspect-square rounded-3xl overflow-hidden shadow-2xl bg-muted border border-border/50">
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 hover:scale-105"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
      </FadeIn>

      {/* Details Section */}
      <FadeIn delay={0.2} className="space-y-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="outline" className="px-3 py-1 text-sm bg-background/50 backdrop-blur border-primary/20">
              {product.category}
            </Badge>
            <Badge 
              variant={product.available ? 'default' : 'secondary'}
              className="px-3 py-1 text-sm"
            >
              {product.available ? 'Available' : 'Unavailable'}
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 font-heading text-foreground">
            {product.name}
          </h1>
          
          <p className="text-xl text-muted-foreground leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="px-3 py-1 gap-1 text-muted-foreground bg-secondary/50">
                <Tag className="w-3 h-3" />
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Pricing Card */}
        <div className="glass-card rounded-2xl p-6 space-y-6">
          <div className="flex justify-between items-baseline pb-4 border-b border-white/10">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight">${product.rental_price_per_day}</span>
                <span className="text-muted-foreground">/ day</span>
              </div>
            </div>
            {product.purchase_price && (
              <div className="text-right">
                <span className="text-lg font-semibold block">${product.purchase_price}</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Buy Price</span>
              </div>
            )}
          </div>

          {/* Rental Dates */}
          {product.available && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-date" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-2">
                    <Calendar className="w-3 h-3" /> Start Date
                  </Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="bg-background/50 border-white/10 h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-2">
                    <Calendar className="w-3 h-3" /> End Date
                  </Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate || new Date().toISOString().split('T')[0]}
                    className="bg-background/50 border-white/10 h-10"
                  />
                </div>
              </div>

              {startDate && endDate && (
                <div className="flex justify-between items-center p-4 bg-primary/10 rounded-xl border border-primary/20">
                  <span className="font-medium">Total Cost</span>
                  <span className="text-2xl font-bold text-primary">${calculateTotal()}</span>
                </div>
              )}

              <Button
                onClick={handleAddToCart}
                disabled={isLoading || !product.available}
                className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                size="lg"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {isLoading ? 'Adding to Cart...' : 'Add to Cart'}
              </Button>
            </div>
          )}
        </div>

        {/* Owner Info */}
        {product.profiles?.full_name && (
          <div className="flex items-center gap-3 pt-4 opacity-70">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-400" />
            <div className="text-sm">
              <span className="text-muted-foreground">Listed by </span>
              <span className="font-medium text-foreground">{product.profiles.full_name}</span>
            </div>
          </div>
        )}
      </FadeIn>
    </div>
  );
}