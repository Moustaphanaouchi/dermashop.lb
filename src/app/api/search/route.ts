import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { query, products } = await req.json();

    if (!query || !products?.length) {
      return NextResponse.json({ matchedIds: [] });
    }

    // Prepare catalog context for the AI
    const catalogSummary = products.map((p: any) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      category: p.category,
    }));

    // If an OpenAI or Gemini API key is configured
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      // Smart Fallback (No API key needed): Token matching across name, description, category
      const words = query.toLowerCase().split(/\s+/).filter(Boolean);
      const matched = products
        .filter((p: any) => {
          const text = `${p.name} ${p.description} ${p.category}`.toLowerCase();
          return words.some((w: string) => text.includes(w));
        })
        .map((p: any) => p.id);

      return NextResponse.json({ matchedIds: matched });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        temperature: 0.1,
        messages: [
          {
            role: 'system',
            content:
              'You are a dermatologist store assistant. Given a customer query and a product list, return a JSON array containing ONLY the matching product IDs that best address their skin/hair concern. Format: ["id1", "id2"]',
          },
          {
            role: 'user',
            content: `Catalog: ${JSON.stringify(catalogSummary)}\nCustomer Query: "${query}"`,
          },
        ],
      }),
    });

    const aiData = await response.json();
    const content = aiData.choices?.[0]?.message?.content || '[]';
    const parsedIds = JSON.parse(content.replace(/```json|```/g, '').trim());

    return NextResponse.json({ matchedIds: parsedIds });
  } catch (err: any) {
    console.error('Search error:', err);
    return NextResponse.json({ matchedIds: [] });
  }
}