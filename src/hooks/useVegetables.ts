import { useState, useCallback, useMemo, useEffect } from 'react';
import { Vegetable, VegetableCategory } from '@/types/vegetable';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useVegetables() {
  const [vegetables, setVegetables] = useState<Vegetable[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<VegetableCategory | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Cargar vegetales desde Supabase
  const fetchVegetables = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('vegetables')
        .select('*')
        .order('name');

      if (error) throw error;

      const mappedData: Vegetable[] = (data || []).map((item) => ({
        id: item.id,
        name: item.name,
        quantity: Number(item.quantity),
        unit: item.unit,
        minStock: Number(item.min_stock),
        category: item.category,
        price: Number(item.price),
        createdAt: new Date(item.created_at),
        updatedAt: new Date(item.updated_at),
      }));

      setVegetables(mappedData);
    } catch (error) {
      console.error('Error fetching vegetables:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los vegetales',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchVegetables();
  }, [fetchVegetables]);

  const filteredVegetables = useMemo(() => {
    return vegetables.filter((veg) => {
      const matchesSearch = veg.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || veg.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [vegetables, searchTerm, categoryFilter]);

  const addVegetable = useCallback(async (vegetable: Omit<Vegetable, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const { error } = await supabase.from('vegetables').insert({
        name: vegetable.name,
        quantity: vegetable.quantity,
        unit: vegetable.unit,
        min_stock: vegetable.minStock,
        category: vegetable.category,
        price: vegetable.price,
      });

      if (error) throw error;

      await fetchVegetables();
      return true;
    } catch (error) {
      console.error('Error adding vegetable:', error);
      toast({
        title: 'Error',
        description: 'No se pudo agregar el vegetal',
        variant: 'destructive',
      });
      return false;
    }
  }, [fetchVegetables, toast]);

  const updateVegetable = useCallback(async (id: string, updates: Partial<Vegetable>) => {
    try {
      const dbUpdates: Record<string, unknown> = {};
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.quantity !== undefined) dbUpdates.quantity = updates.quantity;
      if (updates.unit !== undefined) dbUpdates.unit = updates.unit;
      if (updates.minStock !== undefined) dbUpdates.min_stock = updates.minStock;
      if (updates.category !== undefined) dbUpdates.category = updates.category;
      if (updates.price !== undefined) dbUpdates.price = updates.price;

      const { error } = await supabase
        .from('vegetables')
        .update(dbUpdates)
        .eq('id', id);

      if (error) throw error;

      await fetchVegetables();
      return true;
    } catch (error) {
      console.error('Error updating vegetable:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el vegetal',
        variant: 'destructive',
      });
      return false;
    }
  }, [fetchVegetables, toast]);

  const deleteVegetable = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('vegetables')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchVegetables();
      return true;
    } catch (error) {
      console.error('Error deleting vegetable:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el vegetal',
        variant: 'destructive',
      });
      return false;
    }
  }, [fetchVegetables, toast]);

  const adjustStock = useCallback(async (id: string, amount: number) => {
    const vegetable = vegetables.find((v) => v.id === id);
    if (!vegetable) return false;

    const newQuantity = Math.max(0, vegetable.quantity + amount);
    return updateVegetable(id, { quantity: newQuantity });
  }, [vegetables, updateVegetable]);

  const stats = useMemo(() => {
    const totalItems = vegetables.length;
    const lowStockItems = vegetables.filter((v) => v.quantity <= v.minStock).length;
    const outOfStockItems = vegetables.filter((v) => v.quantity === 0).length;
    const totalValue = vegetables.reduce((sum, v) => sum + v.quantity * v.price, 0);
    return { totalItems, lowStockItems, outOfStockItems, totalValue };
  }, [vegetables]);

  return {
    vegetables: filteredVegetables,
    allVegetables: vegetables,
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
    addVegetable,
    updateVegetable,
    deleteVegetable,
    adjustStock,
    stats,
    loading,
    refetch: fetchVegetables,
  };
}
