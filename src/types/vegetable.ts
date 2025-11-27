export interface Vegetable {
  id: string;
  name: string;
  quantity: number;
  unit: 'kg' | 'unidad' | 'manojo' | 'docena';
  minStock: number;
  category: 'hoja' | 'raiz' | 'fruto' | 'bulbo' | 'otro';
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

export type VegetableCategory = Vegetable['category'];
export type VegetableUnit = Vegetable['unit'];

export const categoryLabels: Record<VegetableCategory, string> = {
  hoja: 'Hoja Verde',
  raiz: 'Raíz/Tubérculo',
  fruto: 'Fruto',
  bulbo: 'Bulbo',
  otro: 'Otro',
};

export const unitLabels: Record<VegetableUnit, string> = {
  kg: 'Kilogramos',
  unidad: 'Unidades',
  manojo: 'Manojos',
  docena: 'Docenas',
};

export const categoryEmojis: Record<VegetableCategory, string> = {
  hoja: '🥬',
  raiz: '🥕',
  fruto: '🍅',
  bulbo: '🧅',
  otro: '🥒',
};
