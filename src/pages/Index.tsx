import { useState } from 'react';
import { Header } from '@/components/Header';
import { StatsCard } from '@/components/StatsCard';
import { VegetableCard } from '@/components/VegetableCard';
import { AddVegetableDialog } from '@/components/AddVegetableDialog';
import { SearchAndFilter } from '@/components/SearchAndFilter';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';
import { AIAssistant } from '@/components/AIAssistant';
import { useVegetables } from '@/hooks/useVegetables';
import { Vegetable } from '@/types/vegetable';
import { Package, AlertTriangle, XCircle, DollarSign } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const {
    vegetables,
    allVegetables,
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
    addVegetable,
    updateVegetable,
    deleteVegetable,
    adjustStock,
    stats,
  } = useVegetables();

  const [editingVegetable, setEditingVegetable] = useState<Vegetable | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vegetableToDelete, setVegetableToDelete] = useState<Vegetable | null>(null);

  const handleAddVegetable = (vegetable: Omit<Vegetable, 'id' | 'createdAt' | 'updatedAt'>) => {
    addVegetable(vegetable);
    toast({
      title: '¡Verdura agregada!',
      description: `${vegetable.name} ha sido agregada al inventario.`,
    });
  };

  const handleEditVegetable = (vegetable: Vegetable) => {
    setEditingVegetable(vegetable);
    setEditDialogOpen(true);
  };

  const handleUpdateVegetable = (id: string, updates: Partial<Vegetable>) => {
    updateVegetable(id, updates);
    setEditingVegetable(null);
    toast({
      title: '¡Verdura actualizada!',
      description: 'Los cambios han sido guardados.',
    });
  };

  const handleDeleteClick = (id: string) => {
    const vegetable = vegetables.find((v) => v.id === id);
    if (vegetable) {
      setVegetableToDelete(vegetable);
      setDeleteDialogOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    if (vegetableToDelete) {
      deleteVegetable(vegetableToDelete.id);
      toast({
        title: 'Verdura eliminada',
        description: `${vegetableToDelete.name} ha sido eliminada del inventario.`,
        variant: 'destructive',
      });
      setVegetableToDelete(null);
    }
  };

  const handleAdjustStock = (id: string, amount: number) => {
    adjustStock(id, amount);
    const vegetable = vegetables.find((v) => v.id === id);
    if (vegetable) {
      const newQty = Math.max(0, vegetable.quantity + amount);
      if (newQty <= vegetable.minStock && newQty > 0) {
        toast({
          title: '⚠️ Stock bajo',
          description: `${vegetable.name} está por debajo del stock mínimo.`,
        });
      } else if (newQty === 0) {
        toast({
          title: '🚨 Sin stock',
          description: `${vegetable.name} se ha agotado.`,
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Stats Section */}
        <section className="mb-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Total Productos"
              value={stats.totalItems}
              icon={Package}
              variant="default"
            />
            <StatsCard
              title="Stock Bajo"
              value={stats.lowStockItems}
              icon={AlertTriangle}
              variant={stats.lowStockItems > 0 ? 'warning' : 'default'}
            />
            <StatsCard
              title="Sin Stock"
              value={stats.outOfStockItems}
              icon={XCircle}
              variant={stats.outOfStockItems > 0 ? 'danger' : 'default'}
            />
            <StatsCard
              title="Valor Total"
              value={`$${stats.totalValue.toLocaleString()}`}
              icon={DollarSign}
              variant="success"
            />
          </div>
        </section>

        {/* Actions Section */}
        <section className="mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-bold text-foreground">Inventario</h2>
            <AddVegetableDialog onAdd={handleAddVegetable} />
          </div>
        </section>

        {/* Search and Filter */}
        <section className="mb-6">
          <SearchAndFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            categoryFilter={categoryFilter}
            onCategoryChange={setCategoryFilter}
          />
        </section>

        {/* Vegetables Grid */}
        <section>
          {vegetables.length === 0 ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 p-8 text-center">
              <Package className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold text-foreground">No hay verduras</h3>
              <p className="mb-4 text-muted-foreground">
                {searchTerm || categoryFilter !== 'all'
                  ? 'No se encontraron resultados con los filtros aplicados.'
                  : 'Comienza agregando productos a tu inventario.'}
              </p>
              {!searchTerm && categoryFilter === 'all' && (
                <AddVegetableDialog onAdd={handleAddVegetable} />
              )}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {vegetables.map((vegetable) => (
                <VegetableCard
                  key={vegetable.id}
                  vegetable={vegetable}
                  onAdjustStock={handleAdjustStock}
                  onEdit={handleEditVegetable}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Edit Dialog */}
      {editingVegetable && (
        <AddVegetableDialog
          onAdd={handleAddVegetable}
          editingVegetable={editingVegetable}
          onUpdate={handleUpdateVegetable}
          open={editDialogOpen}
          onOpenChange={(open) => {
            setEditDialogOpen(open);
            if (!open) setEditingVegetable(null);
          }}
        />
      )}

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        vegetableName={vegetableToDelete?.name || ''}
      />

      {/* AI Assistant */}
      <AIAssistant
        inventoryData={{
          vegetables: allVegetables.map((v) => ({
            name: v.name,
            quantity: v.quantity,
            unit: v.unit,
            minStock: v.minStock,
            category: v.category,
            price: v.price,
          })),
          stats,
        }}
      />
    </div>
  );
};

export default Index;
