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
  activeCategory,
}: Props) {
  const [query, setQuery] = useState('');
  const [isAiSearching, setIsAiSearching] = useState(false);

  useEffect(() => {
    let result = products;

    if (activeCategory !== 'all') {
      result = result.filter((p) => p.category === activeCategory);
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      );
    }

    onFilter(result);
  }, [query, activeCategory, products]);

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
    <form
      onSubmit={handleAiSearch}
      className="relative flex items-center w-full bg-stone-50 hover:bg-stone-100/80 focus-within:bg-white rounded-full border border-pink-200/60 focus-within:border-rose-300 focus-within:ring-2 focus-within:ring-rose-100 transition-all px-3 py-1.5 shadow-xs"
    >
      <span className="text-zinc-400 mr-2 shrink-0">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </span>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search clinical products, concerns..."
        className="w-full bg-transparent text-xs sm:text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none"
      />

      {query && (
        <button
          type="button"
          onClick={() => setQuery('')}
          className="text-zinc-400 hover:text-zinc-600 px-1.5 text-xs shrink-0"
        >
          ✕
        </button>
      )}

      <button
        type="submit"
        disabled={isAiSearching}
        className="shrink-0 flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full text-[11px] font-semibold hover:opacity-95 active:scale-95 transition-all shadow-xs disabled:opacity-50 ml-1"
      >
        {isAiSearching ? '...' : '✨ AI'}
      </button>
    </form>
  );
}

export default CatalogSearch;