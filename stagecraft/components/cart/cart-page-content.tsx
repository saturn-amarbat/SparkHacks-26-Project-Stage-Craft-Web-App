'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { removeFromCart, updateCartItemQuantity } from '@/app/actions/cart';
import { useRouter } from 'next/navigation';

interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  rental_start_date?: string;
  rental_end_date?: string;
  products?: {
    id: string;
    name: string;
    description: string;
    category: string;
    rental_price_per_day: number;
    purchase_price?: number;
    image_url: string;
    available: boolean;
  };
}

interface CartPageContentProps {
  items: CartItem[];
}

export function CartPageContent({ items: initialItems }: CartPageContentProps) {
  const [items, setItems] = useState(initialItems);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const handleRemove = async (cartItemId: string) => {
    setIsUpdating(true);
    const result = await removeFromCart(cartItemId);
    if (result.success) {
      setItems(items.filter((item) => item.id !== cartItemId));
    }
    setIsUpdating(false);
  };

  const handleQuantityChange = async (cartItemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setIsUpdating(true);
    const result = await updateCartItemQuantity(cartItemId, newQuantity);
    if (result.success) {
      setItems(
        items.map((item) =>
          item.id === cartItemId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
    setIsUpdating(false);
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      if (!item.products) return total;

      const itemPrice = item.products.rental_price_per_day;
      let days = 1;

      if (item.rental_start_date && item.rental_end_date) {
        const start = new Date(item.rental_start_date);
        const end = new Date(item.rental_end_date);
        days = Math.max(
          1,
          Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
        );
      }

      return total + itemPrice * days * item.quantity;
    }, 0);
  };

  const handleCheckout = () => {
    router.push('/checkout/success');
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg mb-4">Your cart is empty</p>
        <Link href="/marketplace">
          <Button>Browse Marketplace</Button>
        </Link>
      </div>
    );
  }

  const total = calculateTotal();

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {/* Cart Items */}
      <div className="md:col-span-2 space-y-4">
        {items.map((item) => {
          if (!item.products) return null;

          const days =
            item.rental_start_date && item.rental_end_date
              ? Math.max(
                  1,
                  Math.ceil(
                    (new Date(item.rental_end_date).getTime() -
                      new Date(item.rental_start_date).getTime()) /
                      (1000 * 60 * 60 * 24)
                  )
                )
              : 1;

          const itemTotal =
            item.products.rental_price_per_day * days * item.quantity;

          return (
            <div
              key={item.id}
              className="flex gap-4 border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="relative w-32 h-32 rounded overflow-hidden flex-shrink-0">
                <Image
                  src={item.products.image_url}
                  alt={item.products.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1">
                    <Link href={`/marketplace/${item.products.id}`}>
                      <h3 className="font-semibold text-lg hover:underline">
                        {item.products.name}
                      </h3>
                    </Link>
                    <Badge variant="outline" className="mt-1">
                      {item.products.category}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemove(item.id)}
                    disabled={isUpdating}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>

                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">Quantity:</span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity - 1)
                        }
                        disabled={isUpdating || item.quantity <= 1}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity + 1)
                        }
                        disabled={isUpdating}
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  {item.rental_start_date && item.rental_end_date && (
                    <p className="text-sm text-muted-foreground">
                      Rental: {new Date(item.rental_start_date).toLocaleDateString()} -{' '}
                      {new Date(item.rental_end_date).toLocaleDateString()} ({days}{' '}
                      {days === 1 ? 'day' : 'days'})
                    </p>
                  )}

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-sm text-muted-foreground">
                      ${item.products.rental_price_per_day}/day × {days} × {item.quantity}
                    </span>
                    <span className="font-semibold text-lg">${itemTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Order Summary */}
      <div className="md:col-span-1">
        <div className="border rounded-lg p-6 sticky top-4">
          <h2 className="text-2xl font-bold mb-4">Order Summary</h2>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Items ({items.length})</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax</span>
              <span>${(total * 0.08).toFixed(2)}</span>
            </div>
            <div className="border-t pt-3 flex justify-between text-xl font-bold">
              <span>Total</span>
              <span>${(total * 1.08).toFixed(2)}</span>
            </div>
          </div>

          <Button
            onClick={handleCheckout}
            className="w-full"
            size="lg"
            disabled={isUpdating}
          >
            Proceed to Checkout
          </Button>

          <Link href="/marketplace">
            <Button variant="outline" className="w-full mt-3">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
