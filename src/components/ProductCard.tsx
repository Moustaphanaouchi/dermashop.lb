'use client';

interface Props {
  product: any;
  onAdd: (id: string) => void;
}

const CATEGORY_ICON: Record<string, string> = {
  serums: '🧴',
  skin: '✨',
  hair: '💆‍♀️',
  tools: '🔄',
};

export default function ProductCard({ product, onAdd }: Props) {
  const media = product.media?.[0];

  return (
    <div className="bg-white rounded-2xl shadow-luxe overflow-hidden border border-pink-100 hover:-translate-y-1 transition-transform">
      <div className="relative bg-blush h-48 flex items-center justify-center overflow-hidden">
        {media ? (
          media.type === 'video' ? (
            <video src={media.url} className="w-full h-full object-cover" muted loop autoPlay playsInline />
          ) : (
            <img src={media.url} alt={product.name} className="w-full h-full object-cover" />
          )
        ) : (
          <span className="text-6xl">{CATEGORY_ICON[product.category] || '💄'}</span>
        )}
        {!product.stock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-bold">Out of Stock</span>
          </div>
        )}
        {product.badge && (
          <span className="absolute top-3 left-3 bg-maroon text-white text-xs px-3 py-1 rounded-full">
            {product.badge}
          </span>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-bold text-lg mb-1">{product.name}</h3>
        <p className="text-sm text-zinc-500 mb-3 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-maroon">${product.price}</span>
            {product.bulkPrice && (
              <p className="text-xs text-zinc-400">{product.bulkQty} for ${product.bulkPrice}</p>
            )}
          </div>
          <button
            onClick={() => onAdd(product.id)}
            disabled={!product.stock}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
              product.stock ? 'bg-maroon text-white hover:opacity-90' : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
            }`}
          >
            + Add
          </button>
        </div>
      </div>
    </div>
  );
}