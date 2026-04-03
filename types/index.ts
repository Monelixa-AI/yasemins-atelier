import type {
  User,
  AdminUser,
  Order,
  Product,
  Category,
  Occasion,
  Review,
  BlogPost,
  Role,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  ProductStatus,
  BlogStatus,
  ReviewStatus,
  LoyaltyTier,
  CampaignStatus,
  DiscountType,
  OccasionSlug,
} from "@prisma/client";

export type {
  User,
  AdminUser,
  Order,
  Product,
  Category,
  Occasion,
  Review,
  BlogPost,
  Role,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  ProductStatus,
  BlogStatus,
  ReviewStatus,
  LoyaltyTier,
  CampaignStatus,
  DiscountType,
  OccasionSlug,
};

// Session extensions
export interface SessionUser {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
}

export interface AdminSessionUser {
  id: string;
  email: string;
  name: string;
  role: Role;
}
