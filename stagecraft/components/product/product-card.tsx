import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { HoverCard } from '@/components/ui/motion';

interface ProductCardProps {
  product: {
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

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/marketplace/${product.id}`} className="group block h-full">
      <HoverCard className="relative h-full flex flex-col bg-card rounded-3xl overflow-hidden shadow-sm transition-shadow duration-300 hover:shadow-2xl hover:shadow-purple-500/10 border border-border/50 hover:border-border">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="absolute top-3 right-3 z-10">
             {!product.available && (
                <Badge variant="secondary" className="backdrop-blur-md bg-black/50 text-white border-0">
                  Unavailable
                </Badge>
             )}
          </div>
          <div className="absolute top-3 left-3 z-10">
            <Badge variant="outline" className="backdrop-blur-md bg-white/10 text-white border-white/20">
              {product.category}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-grow">
          <div className="mb-4 flex-grow">
            <h3 className="font-semibold text-lg tracking-tight leading-snug mb-2 group-hover:text-purple-400 transition-colors">
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="flex items-end justify-between pt-4 border-t border-border/50">
            <div>
              <p className="text-lg font-bold tracking-tight">
                ${product.rental_price_per_day}
                <span className="text-xs font-normal text-muted-foreground ml-1">/ day</span>
              </p>
            </div>
            {product.purchase_price && (
              <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-1 rounded-md">
                Buy ${product.purchase_price}
              </span>
            )}
          </div>
        </div>
      </HoverCard>
    </Link>
  );
}