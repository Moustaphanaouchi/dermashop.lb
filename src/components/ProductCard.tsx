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
    <div className="group bg-white rounded-3xl p-3 shadow-[0_4px_20px_rgb(0,0,0,0.04)] hover:shadow-[0_10px_30px_rgb(0,0,0,0.08)] border border-rose-100/60 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
      {/* Visual / Image Container */}
      <div className="relative aspect-square w-full rounded-2xl bg-gradient-to-b from-[#fdfbf9] to-[#f7f3ee] flex items-center justify-center overflow-hidden p-6">
        {media ? (
          media.type === 'video' ? (
            <video
              src={media.url}
              className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
              muted
              loop
              autoPlay
              playsInline
            />
          ) : (
            <img
              src={media.url}
              alt={product.name}
              className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105 drop-shadow-sm"
            />
          )
        ) : (
          <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-3xl">
            {CATEGORY_ICON[product.category] || '✨'}
          </div>
        )}

        {/* Out of Stock Overlay */}
        {!product.stock && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex items-center justify-center">
            <span className="text-zinc-700 bg-white px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase shadow-sm border border-zinc-200">
              Sold Out
            </span>
          </div>
        )}

        {/* Promotional / Status Badge */}
        {product.badge && (
          <span className="absolute top-3 left-3 bg-zinc-900 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full tracking-wide shadow-sm">
            {product.badge}
          </span>
        )}
      </div>

      {/* Product Content Details */}
      <div className="px-2 pt-4 pb-2 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-zinc-900 text-base leading-snug line-clamp-1 group-hover:text-rose-900 transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
            {product.description || 'Clinical formula designed for targeted daily results.'}
          </p>
        </div>

        {/* Pricing and Action */}
        <div className="flex items-center justify-between pt-4 mt-2 border-t border-zinc-100/80">
          <div>
            <span className="text-lg font-bold text-zinc-900 tracking-tight">
              ${Number(product.price).toFixed(2)}
            </span>
            {product.bulkPrice && (
              <p className="text-[11px] text-zinc-400 font-medium">
                {product.bulkQty} for ${Number(product.bulkPrice).toFixed(2)}
              </p>
            )}
          </div>

          <button
            onClick={() => onAdd(product.id)}
            disabled={!product.stock}
            className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all shadow-sm ${
              product.stock
                ? 'bg-zinc-900 text-white hover:bg-zinc-800 active:scale-95'
                : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
            }`}
          >
            Add +
          </button>
        </div>
      </div>
    </div>
  );
}