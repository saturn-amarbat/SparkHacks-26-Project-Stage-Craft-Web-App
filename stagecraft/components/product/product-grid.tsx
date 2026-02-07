import { ProductCard } from './product-card';
import { StaggerContainer, StaggerItem } from '@/components/ui/motion';

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  rental_price_per_day: number;
  purchase_price?: number;
  image_url: string;
  available: boolean;
}

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No products found</p>
        <p className="text-sm text-muted-foreground mt-2">
          Try adjusting your search or browse all categories
        </p>
      </div>
    );
  }

  return (
    <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <StaggerItem key={product.id} className="h-full">
          <ProductCard product={product} />
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}
