import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { inventoryData } = await req.json();
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    const systemPrompt = `Eres un asistente experto en gestión de inventarios de vegetales y análisis de negocios. 
Tu trabajo es analizar los datos del inventario y proporcionar insights útiles sobre:
- Estado general del inventario
- Productos con stock bajo o agotados que necesitan reposición urgente
- Valor total del inventario y oportunidades de optimización
- Recomendaciones para mejorar la gestión del negocio
- Tendencias y patrones que observas

Responde en español de manera clara, concisa y profesional. Usa emojis moderadamente para hacer la respuesta más visual.
Estructura tu respuesta con secciones claras.`;

    const userPrompt = `Analiza el siguiente inventario de vegetales y dame un resumen del estado del negocio con recomendaciones:

${JSON.stringify(inventoryData, null, 2)}

Proporciona:
1. 📊 Resumen ejecutivo del estado del inventario
2. ⚠️ Alertas importantes (stock bajo, agotados)
3. 💰 Análisis del valor del inventario
4. 💡 Recomendaciones de acción inmediata
5. 📈 Sugerencias para optimizar el negocio`;

    console.log("Calling Google Gemini API...");

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: systemPrompt + "\n\n" + userPrompt }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Límite de solicitudes excedido. Intenta de nuevo en unos minutos." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("Gemini response:", JSON.stringify(data, null, 2));
    
    const insight = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!insight) {
      throw new Error("No se recibió respuesta del modelo");
    }

    console.log("AI response received successfully");

    return new Response(
      JSON.stringify({ insight }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in business-insights function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Error desconocido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
