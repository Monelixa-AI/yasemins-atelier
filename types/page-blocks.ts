export type BlockType =
  | "text"
  | "image"
  | "image_text"
  | "video"
  | "cta"
  | "faq"
  | "stats"
  | "testimonial";

export interface TextBlock {
  type: "text";
  content: string;
  alignment?: "left" | "center" | "right";
}

export interface ImageBlock {
  type: "image";
  src: string;
  alt: string;
  caption?: string;
  fullWidth?: boolean;
}

export interface ImageTextBlock {
  type: "image_text";
  imageSrc: string;
  imageAlt?: string;
  imagePosition: "left" | "right";
  title: string;
  content: string;
  ctaText?: string;
  ctaHref?: string;
}

export interface CTABlock {
  type: "cta";
  title: string;
  subtitle?: string;
  buttonText: string;
  buttonHref: string;
  variant: "primary" | "dark";
}

export interface FAQBlock {
  type: "faq";
  title: string;
  items: { question: string; answer: string }[];
}

export interface StatsBlock {
  type: "stats";
  items: { value: string; label: string }[];
}

export type PageBlock =
  | TextBlock
  | ImageBlock
  | ImageTextBlock
  | CTABlock
  | FAQBlock
  | StatsBlock;

export interface StaticPage {
  id: string;
  title: string;
  slug: string;
  blocks: PageBlock[];
  metaTitle?: string;
  metaDesc?: string;
}
