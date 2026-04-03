import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { services } from "@/lib/data/services";
import { ServiceHero, ServiceSteps, ServicePackages, ServiceFAQ, ServiceCTA } from "@/components/site/services";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const svc = services.find((s) => s.slug === params.slug);
  if (!svc) return {};
  return { title: svc.seoTitle, description: svc.seoDesc };
}

export default function ServiceDetailPage({ params }: Props) {
  const service = services.find((s) => s.slug === params.slug);
  if (!service) notFound();

  return (
    <>
      <ServiceHero service={service} />
      <ServiceSteps steps={service.steps} />
      <ServicePackages packages={service.packages} colorBg={service.colorBg} />
      <ServiceFAQ faqs={service.faqs} />
      <ServiceCTA serviceName={service.name} colorBg={service.colorBg} />
    </>
  );
}
