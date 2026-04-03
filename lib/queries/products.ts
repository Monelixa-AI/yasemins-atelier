import { prisma } from "@/lib/db";

export async function getProducts(filters?: {
  category?: string;
  occasion?: string;
  featured?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  sort?: string;
}) {
  try {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 12;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { status: "ACTIVE" };

    if (filters?.category) {
      where.category = { slug: filters.category };
    }
    if (filters?.occasion) {
      where.occasions = { some: { occasion: { slug: filters.occasion } } };
    }
    if (filters?.featured) {
      where.isFeatured = true;
    }
    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { shortDesc: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    const orderBy: Record<string, string> = {};
    switch (filters?.sort) {
      case "price_asc": orderBy.basePrice = "asc"; break;
      case "price_desc": orderBy.basePrice = "desc"; break;
      case "newest": orderBy.createdAt = "desc"; break;
      case "popular": orderBy.reviewCount = "desc"; break;
      default: orderBy.sortOrder = "asc";
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true, images: { orderBy: { sortOrder: "asc" } }, variants: { orderBy: { sortOrder: "asc" } } },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return { products, total, page, totalPages: Math.ceil(total / limit) };
  } catch {
    return { products: [], total: 0, page: 1, totalPages: 0 };
  }
}

export async function getProductBySlug(slug: string) {
  try {
    return await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: { orderBy: { sortOrder: "asc" } },
        variants: { orderBy: { sortOrder: "asc" } },
        reviews: { where: { status: "APPROVED" }, take: 5, orderBy: { createdAt: "desc" } },
        occasions: { include: { occasion: true } },
      },
    });
  } catch {
    return null;
  }
}

export async function getFeaturedProducts() {
  try {
    return await prisma.product.findMany({
      where: { isFeatured: true, status: "ACTIVE" },
      include: { images: true, variants: true },
      take: 8,
    });
  } catch {
    return [];
  }
}
