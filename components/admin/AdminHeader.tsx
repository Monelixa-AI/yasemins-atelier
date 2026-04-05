import { ReactNode } from "react"

interface AdminHeaderProps {
  title: string
  breadcrumb?: string[]
  actions?: ReactNode
}

export function AdminHeader({ title, breadcrumb, actions }: AdminHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E8D5A3]/30">
      <div>
        {breadcrumb && breadcrumb.length > 0 && (
          <p className="text-xs text-[#B8975C] mb-1">
            {breadcrumb.join(" / ")}
          </p>
        )}
        <h1 className="text-2xl font-medium text-[#3D1A0A]">{title}</h1>
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  )
}
