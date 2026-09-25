'use client';

import React, { useState, useEffect } from 'react';

interface Props {
  products: any[];
  onFilter: (filtered: any[]) => void;
  categories: { id: string; label: string }[];
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
}

export function CatalogSearch({
  products,
  onFilter,
  categories,
  activeCategory,
  onSelectCategory,
}: Props) {
  const [query, setQuery] = useState('');
  const [isAiSearching, setIsAiSearching] = useState(false);

  // Fast direct text filter whenever category or normal search text changes
  useEffect(() => {
    let result = products;

    if (activeCategory !== 'all') {
      result = result.filter((p) => p.category === activeCategory);
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      );
    }

    onFilter(result);
  }, [query, activeCategory, products]);

  // AI-Powered semantic search triggered on Enter or "Ask AI" button
  async function handleAiSearch(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setIsAiSearching(true);
    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, products }),
      });
      const data = await res.json();

      if (data.matchedIds && data.matchedIds.length > 0) {
        const matches = products.filter((p) => data.matchedIds.includes(p.id));
        onFilter(matches);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiSearching(false);
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto my-6 px-4">
      {/* Search Input Bar */}
      <form
        onSubmit={handleAiSearch}
        className="relative flex items-center bg-white rounded-full border border-pink-200/80 shadow-sm focus-within:ring-2 focus-within:ring-rose-400 focus-within:border-transparent transition-all p-1.5"
      >
        <span className="pl-3.5 pr-2 text-zinc-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products or describe your skin/hair concern..."
          className="w-full bg-transparent text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none px-2"
        />

        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="text-zinc-400 hover:text-zinc-600 px-2 text-xs"
          >
            ✕
          </button>
        )}

        <button
          type="submit"
          disabled={isAiSearching}
          className="shrink-0 flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full text-xs font-semibold hover:opacity-95 active:scale-95 transition-all shadow-sm disabled:opacity-50"
        >
          {isAiSearching ? (
            <span>Thinking...</span>
          ) : (
            <>
              <span>✨ AI Match</span>
            </>
          )}
        </button>
      </form>

      {/* Suggested Concern Tags */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs text-zinc-500">
        <span className="text-[11px] text-zinc-400">Try asking:</span>
        {[
          'Hair growth',
          'Sun protection',
          'Glow & Brightening',
          'Scalp stimulation',
        ].map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => {
              setQuery(tag);
            }}
            className="px-2.5 py-1 bg-rose-50/70 hover:bg-rose-100 text-rose-800 rounded-full transition-colors"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}