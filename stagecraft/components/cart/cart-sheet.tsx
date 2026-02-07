'use client';

import { useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/lib/store/cart-store';
import { getCartItems, removeFromCart } from '@/app/actions/cart';

export function CartSheet() {
  const {
    items,
    isOpen,
    closeCart,
    setItems,
    getTotalPrice,
  } = useCartStore();

  const loadCartItems = useCallback(async () => {
    const { data } = await getCartItems();
    if (data) {
      setItems(data);
    }
  }, [setItems]);

  useEffect(() => {
    if (isOpen) {
      loadCartItems();
    }
  }, [isOpen, loadCartItems]);

  const handleRemove = async (cartItemId: string) => {
    await removeFromCart(cartItemId);
    await loadCartItems();
  };

  const totalPrice = getTotalPrice();

  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground text-lg">Your cart is empty</p>
              <p className="text-sm text-muted-foreground mt-2">
                Add items from the marketplace or chat with our AI assistant
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4">
              <div className="space-y-4">
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
                      className="flex gap-4 border rounded-lg p-3"
                    >
                      <div className="relative w-20 h-20 rounded overflow-hidden flex-shrink-0">
                        <Image
                          src={item.products.image_url}
                          alt={item.products.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm truncate">
                              {item.products.name}
                            </h4>
                            <Badge variant="outline" className="mt-1">
                              {item.products.category}
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 flex-shrink-0"
                            onClick={() => handleRemove(item.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="mt-2 text-sm space-y-1">
                          <p className="text-muted-foreground">
                            ${item.products.rental_price_per_day}/day × {days}{' '}
                            {days === 1 ? 'day' : 'days'} × {item.quantity}
                          </p>
                          {item.rental_start_date && item.rental_end_date && (
                            <p className="text-xs text-muted-foreground">
                              {new Date(item.rental_start_date).toLocaleDateString()}{' '}
                              - {new Date(item.rental_end_date).toLocaleDateString()}
                            </p>
                          )}
                          <p className="font-semibold">${itemTotal}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="border-t pt-4 space-y-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>

              <Link href="/cart" onClick={closeCart}>
                <Button className="w-full" size="lg">
                  View Cart & Checkout
                </Button>
              </Link>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
