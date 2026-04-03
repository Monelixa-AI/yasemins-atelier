import { prisma } from "@/lib/db";

export async function getCategories() {
  try {
    return await prisma.category.findMany({
      where: { isActive: true },
      include: { children: { where: { isActive: true }, orderBy: { sortOrder: "asc" } } },
      orderBy: { sortOrder: "asc" },
    });
  } catch {
    return [];
  }
}

export async function getCategoryBySlug(slug: string) {
  try {
    return await prisma.category.findUnique({
      where: { slug },
      include: { children: true, products: { where: { status: "ACTIVE" } } },
    });
  } catch {
    return null;
  }
}
