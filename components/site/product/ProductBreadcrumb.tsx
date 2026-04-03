import Link from "next/link";

interface ProductBreadcrumbProps {
  categoryName?: string;
  categorySlug?: string;
  productName: string;
}

export default function ProductBreadcrumb({ categoryName, categorySlug, productName }: ProductBreadcrumbProps) {
  return (
    <nav className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
      <ol className="flex items-center gap-2 font-body text-xs text-gold">
        <li><Link href="/" className="hover:text-terracotta transition-colors">Ana Sayfa</Link></li>
        <li>/</li>
        <li><Link href="/menu" className="hover:text-terracotta transition-colors">Menü</Link></li>
        {categoryName && categorySlug && (
          <>
            <li>/</li>
            <li><Link href={`/menu?category=${categorySlug}`} className="hover:text-terracotta transition-colors">{categoryName}</Link></li>
          </>
        )}
        <li>/</li>
        <li className="text-brown-deep">{productName}</li>
      </ol>
    </nav>
  );
}
