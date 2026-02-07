'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CartButton } from '@/components/cart/cart-button';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-6 h-16 flex justify-between items-center">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <h1 className="text-2xl font-bold tracking-tight font-heading">
            StageCraft
          </h1>
        </Link>
        <nav className="flex gap-1 items-center">
          <Link href="/marketplace">
            <Button variant="ghost" className="rounded-full text-sm font-medium hover:bg-white/10">Marketplace</Button>
          </Link>
          <Link href="/gigs">
            <Button variant="ghost" className="rounded-full text-sm font-medium hover:bg-white/10">Gigs</Button>
          </Link>
          <Link href="/chat">
            <Button variant="ghost" className="rounded-full text-sm font-medium hover:bg-white/10">AI Assistant</Button>
          </Link>
          <div className="w-px h-4 bg-border mx-2" />
          <CartButton />
          <Link href="/profile">
            <Button variant="ghost" className="rounded-full w-8 h-8 p-0 ml-1">
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-500 to-rose-500" />
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}