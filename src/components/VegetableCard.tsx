import { Vegetable, categoryEmojis, unitLabels } from '@/types/vegetable';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Minus, Plus, Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VegetableCardProps {
  vegetable: Vegetable;
  onAdjustStock: (id: string, amount: number) => void;
  onEdit: (vegetable: Vegetable) => void;
  onDelete: (id: string) => void;
}

export function VegetableCard({ vegetable, onAdjustStock, onEdit, onDelete }: VegetableCardProps) {
  const isLowStock = vegetable.quantity <= vegetable.minStock && vegetable.quantity > 0;
  const isOutOfStock = vegetable.quantity === 0;

  return (
    <Card
      className={cn(
        'group overflow-hidden transition-all duration-300 hover:shadow-lg animate-scale-in',
        isOutOfStock && 'border-destructive/50 bg-destructive/5',
        isLowStock && !isOutOfStock && 'border-warning/50 bg-warning/5'
      )}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl" role="img" aria-label={vegetable.category}>
              {categoryEmojis[vegetable.category]}
            </span>
            <div>
              <h3 className="font-semibold text-foreground">{vegetable.name}</h3>
              <p className="text-sm text-muted-foreground">
                ${vegetable.price.toLocaleString()} / {vegetable.unit}
              </p>
            </div>
          </div>
          <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <Button variant="ghost" size="icon" onClick={() => onEdit(vegetable)} className="h-8 w-8">
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(vegetable.id)}
              className="h-8 w-8 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'text-2xl font-bold',
                isOutOfStock && 'text-destructive',
                isLowStock && !isOutOfStock && 'text-warning',
                !isLowStock && !isOutOfStock && 'text-foreground'
              )}
            >
              {vegetable.quantity}
            </span>
            <span className="text-sm text-muted-foreground">{unitLabels[vegetable.unit]}</span>
          </div>

          {isOutOfStock && (
            <Badge variant="destructive" className="animate-pulse-soft">
              Sin Stock
            </Badge>
          )}
          {isLowStock && !isOutOfStock && (
            <Badge className="bg-warning text-warning-foreground">Stock Bajo</Badge>
          )}
        </div>

        <div className="mt-4 flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onAdjustStock(vegetable.id, -1)}
            disabled={vegetable.quantity === 0}
            className="h-9 w-9"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-500',
                  isOutOfStock && 'bg-destructive',
                  isLowStock && !isOutOfStock && 'bg-warning',
                  !isLowStock && !isOutOfStock && 'bg-primary'
                )}
                style={{
                  width: `${Math.min(100, (vegetable.quantity / (vegetable.minStock * 2)) * 100)}%`,
                }}
              />
            </div>
            <p className="mt-1 text-center text-xs text-muted-foreground">
              Mín: {vegetable.minStock} {vegetable.unit}
            </p>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onAdjustStock(vegetable.id, 1)}
            className="h-9 w-9"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
