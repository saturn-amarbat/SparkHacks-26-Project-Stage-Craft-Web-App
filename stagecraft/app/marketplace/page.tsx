import { getProducts } from '@/app/actions/products';
import { ProductGrid } from '@/components/product/product-grid';
import { Badge } from '@/components/ui/badge';

export const dynamic = 'force-dynamic';

export default async function MarketplacePage() {
  const { data: products, error } = await getProducts({ limit: 50 });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Marketplace</h1>
        <p className="text-muted-foreground">
          Costumes, props, and equipment.
        </p>
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 mb-6">
        <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
          All
        </Badge>
        <Badge variant="outline" className="cursor-pointer">
          Costumes
        </Badge>
        <Badge variant="outline" className="cursor-pointer">
          Props
        </Badge>
        <Badge variant="outline" className="cursor-pointer">
          Equipment
        </Badge>
      </div>

      {error ? (
        <div className="text-center py-12">
          <p className="text-destructive">Error loading products: {error}</p>
        </div>
      ) : (
        <ProductGrid products={products || []} />
      )}
    </div>
  );
}
