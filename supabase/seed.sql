-- =============================================
-- Script de inserción de datos de ejemplo
-- Base de datos: Supabase (PostgreSQL)
-- =============================================

-- Limpiar datos existentes (opcional, descomentar si es necesario)
-- TRUNCATE TABLE public.vegetables RESTART IDENTITY;

-- Insertar datos de ejemplo
INSERT INTO public.vegetables (name, quantity, unit, min_stock, category, price) VALUES
    ('Lechuga', 25, 'unidad', 10, 'hoja', 150),
    ('Tomate', 45, 'kg', 20, 'fruto', 280),
    ('Zanahoria', 8, 'kg', 15, 'raiz', 120),
    ('Cebolla', 30, 'kg', 25, 'bulbo', 90),
    ('Espinaca', 12, 'manojo', 8, 'hoja', 180),
    ('Papa', 50, 'kg', 30, 'raiz', 85),
    ('Pimiento Rojo', 5, 'kg', 10, 'fruto', 450),
    ('Ajo', 3, 'kg', 5, 'bulbo', 350),
    ('Pepino', 20, 'unidad', 15, 'fruto', 80),
    ('Acelga', 6, 'manojo', 5, 'hoja', 160);

-- Verificar inserción
SELECT 
    name AS "Nombre",
    quantity AS "Cantidad",
    unit AS "Unidad",
    min_stock AS "Stock Mínimo",
    category AS "Categoría",
    price AS "Precio"
FROM public.vegetables
ORDER BY name;
