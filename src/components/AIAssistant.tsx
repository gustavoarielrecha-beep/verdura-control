import { useState } from 'react';
import { Bot, Sparkles, RefreshCw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AIAssistantProps {
  inventoryData: {
    vegetables: Array<{
      name: string;
      quantity: number;
      unit: string;
      minStock: number;
      category: string;
      price: number;
    }>;
    stats: {
      totalItems: number;
      lowStockItems: number;
      outOfStockItems: number;
      totalValue: number;
    };
  };
}

export function AIAssistant({ inventoryData }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchInsight = async () => {
    setLoading(true);
    setInsight(null);

    try {
      const response = await supabase.functions.invoke('business-insights', {
        body: { inventoryData },
      });

      if (response.error) {
        throw new Error(response.error.message || 'Error al obtener insights');
      }

      if (response.data?.error) {
        throw new Error(response.data.error);
      }

      setInsight(response.data.insight);
    } catch (error) {
      console.error('Error fetching AI insight:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'No se pudo obtener el análisis',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    if (!insight) {
      fetchInsight();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <Button
        onClick={handleOpen}
        className={cn(
          'fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg',
          'bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70',
          'transition-all duration-300 hover:scale-110'
        )}
        size="icon"
      >
        <Bot className="h-6 w-6" />
      </Button>

      {/* Assistant Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <Card className="relative w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between border-b p-4 bg-gradient-to-r from-primary/10 to-primary/5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">Asistente de Negocio</h2>
                  <p className="text-sm text-muted-foreground">Análisis inteligente de tu inventario</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={fetchInsight}
                  disabled={loading}
                  className="h-8 w-8"
                >
                  <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <div className="relative">
                    <div className="h-12 w-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                  </div>
                  <p className="text-muted-foreground text-sm">Analizando tu inventario...</p>
                </div>
              ) : insight ? (
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                    {insight}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <Bot className="h-12 w-12 text-muted-foreground/50" />
                  <p className="text-muted-foreground text-sm">
                    Haz clic en actualizar para obtener un análisis
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t p-3 bg-muted/30">
              <p className="text-xs text-muted-foreground text-center">
                Powered by Gemini 2.5 Pro • Los análisis son sugerencias basadas en los datos actuales
              </p>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
