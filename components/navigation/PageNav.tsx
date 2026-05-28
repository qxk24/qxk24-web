import Link from 'next/link';

interface PageNavItem {
  href: string;
  label: string;
  icon: string;
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
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-200 bg-amber-50 text-amber-800 text-sm font-medium hover:bg-amber-100 transition-colors"
        >
          <span aria-hidden="true">{item.icon}</span>
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
