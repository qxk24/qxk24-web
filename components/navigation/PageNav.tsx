import Link from 'next/link';

interface PageNavItem {
  href: string;
  label: string;
}

interface PageNavProps {
  items: PageNavItem[];
  className?: string;
}

export function PageNav({ items, className = '' }: PageNavProps) {
  return (
    <nav className={`flex flex-wrap items-center gap-3 ${className}`} aria-label="Page navigation">
      {items.map((item) => (
        <Link
          key={`${item.href}-${item.label}`}
          href={item.href}
          className="inline-flex items-center px-4 py-2 rounded-full border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
