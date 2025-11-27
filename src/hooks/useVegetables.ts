import { useState, useCallback, useMemo } from 'react';
import { Vegetable, VegetableCategory } from '@/types/vegetable';
import { initialVegetables } from '@/data/initialVegetables';

export function useVegetables() {
  const [vegetables, setVegetables] = useState<Vegetable[]>(initialVegetables);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<VegetableCategory | 'all'>('all');

  const filteredVegetables = useMemo(() => {
    return vegetables.filter((veg) => {
      const matchesSearch = veg.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || veg.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [vegetables, searchTerm, categoryFilter]);

  const addVegetable = useCallback((vegetable: Omit<Vegetable, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newVegetable: Vegetable = {
      ...vegetable,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setVegetables((prev) => [...prev, newVegetable]);
  }, []);

  const updateVegetable = useCallback((id: string, updates: Partial<Vegetable>) => {
    setVegetables((prev) =>
      prev.map((veg) =>
        veg.id === id ? { ...veg, ...updates, updatedAt: new Date() } : veg
      )
    );
  }, []);

  const deleteVegetable = useCallback((id: string) => {
    setVegetables((prev) => prev.filter((veg) => veg.id !== id));
  }, []);

  const adjustStock = useCallback((id: string, amount: number) => {
    setVegetables((prev) =>
      prev.map((veg) =>
        veg.id === id
          ? { ...veg, quantity: Math.max(0, veg.quantity + amount), updatedAt: new Date() }
          : veg
      )
    );
  }, []);

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
  };
}
