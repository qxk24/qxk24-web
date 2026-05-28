'use client';

interface StarRatingProps {
  value: number;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

const sizeMap = { sm: 'text-sm', md: 'text-base', lg: 'text-xl' };

export function StarRating({ value, size = 'md', label }: StarRatingProps) {
  const rounded = Math.round(value * 2) / 2;

  return (
    <span className="inline-flex items-center gap-1">
      {label && <span className={`text-gray-500 ${sizeMap[size]}`}>{label}</span>}
      <span className={`font-semibold text-amber-500 ${sizeMap[size]}`}>
        {[1, 2, 3, 4, 5].map((i) => {
          const full = rounded >= i;
          const half = !full && rounded >= i - 0.5;
          return <span key={i}>{full ? '★' : half ? '½' : '☆'}</span>;
        })}
      </span>
      <span className={`text-gray-600 ${sizeMap[size]}`}>{value.toFixed(1)}</span>
    </span>
  );
}
