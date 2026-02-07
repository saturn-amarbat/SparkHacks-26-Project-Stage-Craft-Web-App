import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

export default function CheckoutSuccessPage() {
  return (
    <div className="container mx-auto px-4 pb-16 pt-24">
      <div className="max-w-2xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="h-24 w-24 text-green-500" />
        </div>

        <h1 className="text-4xl font-bold mb-4">Order Confirmed!</h1>

        <p className="text-xl text-muted-foreground mb-8">
          Thank you for your order! Your theatrical items have been reserved.
        </p>

        <div className="bg-muted rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold mb-3">What&apos;s Next?</h2>
          <ul className="text-left space-y-2 text-muted-foreground">
            <li>✓ Order confirmation sent to your email</li>
            <li>✓ Rental items will be prepared for pickup</li>
            <li>✓ You&apos;ll receive a reminder before your rental start date</li>
            <li>✓ Contact the owner for any special arrangements</li>
          </ul>
        </div>

        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/marketplace">
            <Button size="lg">
              Continue Shopping
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" size="lg">
              Back to Home
            </Button>
          </Link>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          Break a leg! 🎭
        </p>
      </div>
    </div>
  );
}
