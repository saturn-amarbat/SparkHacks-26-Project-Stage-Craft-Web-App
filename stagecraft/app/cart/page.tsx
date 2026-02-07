import { getCartItems } from '@/app/actions/cart';
import { CartPageContent } from '@/components/cart/cart-page-content';

export default async function CartPage() {
  const { data: cartItems, error } = await getCartItems();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

      {error ? (
        <div className="text-center py-12">
          <p className="text-destructive">Error loading cart: {error}</p>
        </div>
      ) : (
        <CartPageContent items={cartItems || []} />
      )}
    </div>
  );
}
