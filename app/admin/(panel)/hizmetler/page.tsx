"use client"

import { useState, useEffect, useCallback } from "react"
import { AdminHeader } from "@/components/admin/AdminHeader"
import {
  ChefHat, Loader2, ChevronDown, ChevronUp, Info,
} from "lucide-react"

interface ServicePackage {
  name: string
  price: string
  features: string[]
  popular?: boolean
}

interface Service {
  slug: string
  name: string
  tagline: string
  description: string
  icon: string
  colorBg: string
  packages: ServicePackage[]
}

export default function HizmetlerPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null)

  const fetchServices = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/services")
      if (!res.ok) throw new Error()
      const data = await res.json()
      setServices(Array.isArray(data) ? data : [])
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchServices()
  }, [fetchServices])

  function toggleExpand(slug: string) {
    setExpandedSlug((prev) => (prev === slug ? null : slug))
  }

  if (loading) {
    return (
      <div>
        <AdminHeader title="Hizmetler" breadcrumb={["Icerik", "Hizmetler"]} />
        <div className="flex justify-center py-16">
          <Loader2 className="animate-spin text-gray-400" size={32} />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <AdminHeader title="Hizmetler" breadcrumb={["Icerik", "Hizmetler"]} />

      {/* Info Note */}
      <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
        <Info size={16} className="text-blue-500 shrink-0" />
        <p className="text-sm text-blue-700">
          Hizmetler su an statik veri ile calismaktadir.
        </p>
      </div>

      {services.length === 0 ? (
        <div className="bg-white border rounded-xl p-12 text-center">
          <ChefHat size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-sm text-gray-400">Henuz hizmet bulunamadi</p>
        </div>
      ) : (
        <div className="space-y-3">
          {services.map((svc) => {
            const isExpanded = expandedSlug === svc.slug
            return (
              <div
                key={svc.slug}
                className="bg-white border rounded-xl overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-5">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                      style={{ backgroundColor: svc.colorBg + "20" }}
                    >
                      {svc.icon}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{svc.name}</h3>
                      <p className="text-xs text-gray-500">{svc.tagline}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                      Aktif
                    </span>
                    <button
                      onClick={() => toggleExpand(svc.slug)}
                      className="flex items-center gap-1 text-sm text-[#C4622D] hover:text-[#A34E1F] font-medium"
                    >
                      Detay
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="border-t px-5 pb-5 pt-4">
                    <p className="text-sm text-gray-600 mb-4">{svc.description}</p>

                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                      Paketler
                    </h4>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {svc.packages.map((pkg) => (
                        <div
                          key={pkg.name}
                          className={`border rounded-lg p-4 ${
                            pkg.popular
                              ? "border-[#C4622D] bg-[#C4622D]/5"
                              : "border-gray-200"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium text-gray-900 text-sm">
                              {pkg.name}
                            </h5>
                            {pkg.popular && (
                              <span className="text-[10px] bg-[#C4622D] text-white px-1.5 py-0.5 rounded">
                                Populer
                              </span>
                            )}
                          </div>
                          <p className="text-lg font-bold text-[#C4622D] mb-3">
                            {pkg.price}
                          </p>
                          <ul className="space-y-1">
                            {pkg.features.map((f, i) => (
                              <li
                                key={i}
                                className="text-xs text-gray-600 flex items-start gap-1.5"
                              >
                                <span className="text-[#C4622D] mt-0.5">&#8226;</span>
                                {f}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
