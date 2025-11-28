-- =============================================
-- Script de creación de objetos para VerduraStock
-- Base de datos: Supabase (PostgreSQL)
-- =============================================

-- Crear tipos ENUM para categorías y unidades
CREATE TYPE vegetable_category AS ENUM ('hoja', 'raiz', 'fruto', 'bulbo', 'otro');
CREATE TYPE vegetable_unit AS ENUM ('kg', 'unidad', 'manojo', 'docena');

-- Crear tabla de vegetales
CREATE TABLE IF NOT EXISTS public.vegetables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL DEFAULT 0,
    unit vegetable_unit NOT NULL DEFAULT 'kg',
    min_stock DECIMAL(10, 2) NOT NULL DEFAULT 0,
    category vegetable_category NOT NULL DEFAULT 'otro',
    price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índice para búsquedas por nombre
CREATE INDEX idx_vegetables_name ON public.vegetables(name);

-- Crear índice para filtrado por categoría
CREATE INDEX idx_vegetables_category ON public.vegetables(category);

-- Función para actualizar automáticamente updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at automáticamente
CREATE TRIGGER update_vegetables_updated_at
    BEFORE UPDATE ON public.vegetables
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.vegetables ENABLE ROW LEVEL SECURITY;

-- Política para permitir lectura pública (sin autenticación requerida)
CREATE POLICY "Permitir lectura pública de vegetables"
    ON public.vegetables
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Política para permitir inserción pública
CREATE POLICY "Permitir inserción pública de vegetables"
    ON public.vegetables
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Política para permitir actualización pública
CREATE POLICY "Permitir actualización pública de vegetables"
    ON public.vegetables
    FOR UPDATE
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- Política para permitir eliminación pública
CREATE POLICY "Permitir eliminación pública de vegetables"
    ON public.vegetables
    FOR DELETE
    TO anon, authenticated
    USING (true);

-- Comentarios de documentación
COMMENT ON TABLE public.vegetables IS 'Tabla principal de inventario de verduras';
COMMENT ON COLUMN public.vegetables.id IS 'Identificador único del vegetal';
COMMENT ON COLUMN public.vegetables.name IS 'Nombre del vegetal';
COMMENT ON COLUMN public.vegetables.quantity IS 'Cantidad actual en stock';
COMMENT ON COLUMN public.vegetables.unit IS 'Unidad de medida (kg, unidad, manojo, docena)';
COMMENT ON COLUMN public.vegetables.min_stock IS 'Stock mínimo para alertas';
COMMENT ON COLUMN public.vegetables.category IS 'Categoría del vegetal (hoja, raiz, fruto, bulbo, otro)';
COMMENT ON COLUMN public.vegetables.price IS 'Precio por unidad';
COMMENT ON COLUMN public.vegetables.created_at IS 'Fecha de creación del registro';
COMMENT ON COLUMN public.vegetables.updated_at IS 'Fecha de última actualización';
