import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { products } from "@/lib/data/products";
import ProductBreadcrumb from "@/components/site/product/ProductBreadcrumb";
import ProductGallery from "@/components/site/product/ProductGallery";
import ProductInfo from "@/components/site/product/ProductInfo";
import ProductDescription from "@/components/site/product/ProductDescription";
import ProductReviews from "@/components/site/product/ProductReviews";
import CrossSellProducts from "@/components/site/product/CrossSellProducts";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const product = products.find((p) => p.slug === params.slug);
  if (!product) return {};
  return {
    title: `${product.name} | Yasemin's Atelier`,
    description: product.shortDesc,
  };
}

export default function ProductDetailPage({ params }: Props) {
  const product = products.find((p) => p.slug === params.slug);
  if (!product) notFound();

  return (
    <>
      <ProductBreadcrumb
        categoryName={product.categoryId}
        categorySlug={product.categoryId}
        productName={product.name}
      />

      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <ProductGallery images={product.images} productName={product.name} />
          <ProductInfo product={product} />
        </div>

        <ProductDescription product={product} />
        <ProductReviews avgRating={product.avgRating} reviewCount={product.reviewCount} />
      </section>

      <CrossSellProducts productId={product.id} categoryId={product.categoryId} />
    </>
  );
}
