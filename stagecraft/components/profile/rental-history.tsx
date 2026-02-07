import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

interface Rental {
  id: string;
  start_date: string;
  end_date: string;
  total_price: number;
  status: string;
  products: {
    name: string;
    image_url: string;
    category: string;
  };
}

interface RentalHistoryProps {
  rentals: Rental[];
}

export function RentalHistory({ rentals }: RentalHistoryProps) {
  if (rentals.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg bg-muted/20">
        <p className="text-muted-foreground">No rental history yet.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead>Dates</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rentals.map((rental) => (
            <TableRow key={rental.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded overflow-hidden">
                    <Image
                      src={rental.products?.image_url || '/placeholder.jpg'}
                      alt={rental.products?.name || 'Product'}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{rental.products?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {rental.products?.category}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-sm">
                {new Date(rental.start_date).toLocaleDateString()} -{' '}
                {new Date(rental.end_date).toLocaleDateString()}
              </TableCell>
              <TableCell className="font-medium">
                ${rental.total_price}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    rental.status === 'confirmed'
                      ? 'default'
                      : rental.status === 'pending'
                      ? 'secondary'
                      : 'outline'
                  }
                  className="capitalize"
                >
                  {rental.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
