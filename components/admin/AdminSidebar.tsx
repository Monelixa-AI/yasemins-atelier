"use client";

import Link from "next/link";
import { BRAND } from "@/lib/constants";

export function AdminSidebar() {
  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-brown-deep text-cream">
      <div className="flex h-16 items-center px-6">
        <Link href="/admin/dashboard" className="text-lg font-bold text-gold">
          {BRAND.name}
        </Link>
      </div>
      <nav className="flex-1 px-4 py-4">
        {/* Admin navigation will be added */}
      </nav>
    </aside>
  );
}
