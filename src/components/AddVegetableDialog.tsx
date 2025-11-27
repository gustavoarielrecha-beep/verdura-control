import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { Vegetable, VegetableCategory, VegetableUnit, categoryLabels, unitLabels } from '@/types/vegetable';

interface AddVegetableDialogProps {
  onAdd: (vegetable: Omit<Vegetable, 'id' | 'createdAt' | 'updatedAt'>) => void;
  editingVegetable?: Vegetable | null;
  onUpdate?: (id: string, updates: Partial<Vegetable>) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AddVegetableDialog({
  onAdd,
  editingVegetable,
  onUpdate,
  open,
  onOpenChange,
}: AddVegetableDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const setIsOpen = isControlled ? onOpenChange! : setInternalOpen;

  const [name, setName] = useState(editingVegetable?.name || '');
  const [quantity, setQuantity] = useState(editingVegetable?.quantity?.toString() || '');
  const [unit, setUnit] = useState<VegetableUnit>(editingVegetable?.unit || 'kg');
  const [minStock, setMinStock] = useState(editingVegetable?.minStock?.toString() || '');
  const [category, setCategory] = useState<VegetableCategory>(editingVegetable?.category || 'fruto');
  const [price, setPrice] = useState(editingVegetable?.price?.toString() || '');

  const resetForm = () => {
    setName('');
    setQuantity('');
    setUnit('kg');
    setMinStock('');
    setCategory('fruto');
    setPrice('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const vegetableData = {
      name: name.trim(),
      quantity: parseFloat(quantity) || 0,
      unit,
      minStock: parseFloat(minStock) || 0,
      category,
      price: parseFloat(price) || 0,
    };

    if (editingVegetable && onUpdate) {
      onUpdate(editingVegetable.id, vegetableData);
    } else {
      onAdd(vegetableData);
    }

    resetForm();
    setIsOpen(false);
  };

  const isEditing = !!editingVegetable;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {!isEditing && (
        <DialogTrigger asChild>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Agregar Verdura
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Verdura' : 'Agregar Nueva Verdura'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Tomate"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Cantidad</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                step="0.1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="0"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unidad</Label>
              <Select value={unit} onValueChange={(v) => setUnit(v as VegetableUnit)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(unitLabels) as VegetableUnit[]).map((u) => (
                    <SelectItem key={u} value={u}>
                      {unitLabels[u]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minStock">Stock Mínimo</Label>
              <Input
                id="minStock"
                type="number"
                min="0"
                step="0.1"
                value={minStock}
                onChange={(e) => setMinStock(e.target.value)}
                placeholder="0"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Precio ($)</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="1"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoría</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as VegetableCategory)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(categoryLabels) as VegetableCategory[]).map((c) => (
                  <SelectItem key={c} value={c}>
                    {categoryLabels[c]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full">
            {isEditing ? 'Guardar Cambios' : 'Agregar'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
