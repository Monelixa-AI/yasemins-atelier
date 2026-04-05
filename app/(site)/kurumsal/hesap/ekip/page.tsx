"use client";

import { useState, useEffect } from "react";
import {
  Users,
  UserPlus,
  Shield,
  Eye,
  ShoppingBag,
  CheckCircle,
  Send,
} from "lucide-react";

interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  maxOrderAmount: number | null;
  active: boolean;
}

const roleLabels: Record<string, string> = {
  ADMIN: "Yönetici",
  APPROVER: "Onaylayıcı",
  MEMBER: "Üye",
  VIEWER: "İzleyici",
};

const roleColors: Record<string, string> = {
  ADMIN: "bg-[#C4622D]/10 text-[#C4622D]",
  APPROVER: "bg-[#B8975C]/10 text-[#B8975C]",
  MEMBER: "bg-blue-50 text-blue-600",
  VIEWER: "bg-gray-100 text-gray-600",
};

const roleIcons: Record<string, typeof Shield> = {
  ADMIN: Shield,
  APPROVER: CheckCircle,
  MEMBER: ShoppingBag,
  VIEWER: Eye,
};

export default function EkipPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("MEMBER");
  const [inviteLimit, setInviteLimit] = useState("");
  const [inviting, setInviting] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/corporate/members")
      .then((r) => r.json())
      .then((data) => setMembers(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleToggle(id: string, active: boolean) {
    try {
      await fetch(`/api/corporate/members/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !active }),
      });
      setMembers((prev) =>
        prev.map((m) => (m.id === id ? { ...m, active: !m.active } : m))
      );
    } catch {}
  }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setInviting(true);
    setError("");
    setInviteSuccess(false);
    try {
      const res = await fetch("/api/corporate/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: inviteEmail,
          role: inviteRole,
          maxOrderAmount: inviteLimit ? Number(inviteLimit) : null,
        }),
      });
      if (!res.ok) throw new Error();
      const newMember = await res.json();
      setMembers((prev) => [...prev, newMember]);
      setInviteEmail("");
      setInviteLimit("");
      setInviteSuccess(true);
      setTimeout(() => setInviteSuccess(false), 3000);
    } catch {
      setError("Davet gönderilemedi.");
    } finally {
      setInviting(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-12">
      <div className="flex items-center gap-3 mb-8">
        <Users size={28} className="text-[#C4622D]" />
        <h1 className="font-heading text-3xl text-[#3D1A0A]">Ekip Yönetimi</h1>
      </div>

      {/* Members table */}
      <div className="bg-white rounded-xl border border-[#B8975C]/10 overflow-hidden mb-10">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-7 h-7 border-2 border-[#C4622D] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : members.length === 0 ? (
          <div className="text-center py-16">
            <Users size={40} className="text-[#B8975C]/30 mx-auto mb-3" />
            <p className="font-body text-sm text-[#3D1A0A]/50">Henüz ekip üyesi yok</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#B8975C]/10 bg-[#FDF6EE]/50">
                <th className="px-4 py-3 font-body text-xs text-[#3D1A0A]/50 uppercase tracking-wider">Ad</th>
                <th className="px-4 py-3 font-body text-xs text-[#3D1A0A]/50 uppercase tracking-wider">E-posta</th>
                <th className="px-4 py-3 font-body text-xs text-[#3D1A0A]/50 uppercase tracking-wider">Rol</th>
                <th className="px-4 py-3 font-body text-xs text-[#3D1A0A]/50 uppercase tracking-wider">Sipariş Limiti</th>
                <th className="px-4 py-3 font-body text-xs text-[#3D1A0A]/50 uppercase tracking-wider">Durum</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => {
                const RoleIcon = roleIcons[m.role] || Eye;
                return (
                  <tr key={m.id} className="border-b border-[#B8975C]/5 last:border-0">
                    <td className="px-4 py-3 font-body text-sm text-[#3D1A0A]">{m.name}</td>
                    <td className="px-4 py-3 font-body text-sm text-[#3D1A0A]/60">{m.email}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${roleColors[m.role] || "bg-gray-100 text-gray-600"}`}>
                        <RoleIcon size={12} />
                        {roleLabels[m.role] || m.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-body text-sm text-[#3D1A0A]/60">
                      {m.maxOrderAmount ? `${m.maxOrderAmount.toLocaleString("tr-TR")} TL` : "Sınırsız"}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggle(m.id, m.active)}
                        className={`relative w-10 h-5 rounded-full transition-colors ${
                          m.active ? "bg-[#C4622D]" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                            m.active ? "translate-x-5" : ""
                          }`}
                        />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Invite form */}
      <div className="bg-[#FDF6EE] rounded-xl p-6 border border-[#B8975C]/10">
        <div className="flex items-center gap-2 mb-4">
          <UserPlus size={20} className="text-[#C4622D]" />
          <h2 className="font-heading text-xl text-[#3D1A0A]">Yeni Üye Davet Et</h2>
        </div>

        <form onSubmit={handleInvite} className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block font-body text-xs text-[#3D1A0A]/60 mb-1">E-posta *</label>
            <input
              type="email" required value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="w-full rounded-lg border border-[#B8975C]/20 px-3 py-2 font-body text-sm focus:outline-none focus:border-[#C4622D] bg-white"
              placeholder="ornek@sirket.com"
            />
          </div>

          <div className="w-40">
            <label className="block font-body text-xs text-[#3D1A0A]/60 mb-1">Rol</label>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="w-full rounded-lg border border-[#B8975C]/20 px-3 py-2 font-body text-sm focus:outline-none focus:border-[#C4622D] bg-white"
            >
              <option value="ADMIN">Yönetici</option>
              <option value="APPROVER">Onaylayıcı</option>
              <option value="MEMBER">Üye</option>
              <option value="VIEWER">İzleyici</option>
            </select>
          </div>

          <div className="w-36">
            <label className="block font-body text-xs text-[#3D1A0A]/60 mb-1">Sipariş Limiti</label>
            <input
              type="number" value={inviteLimit}
              onChange={(e) => setInviteLimit(e.target.value)}
              className="w-full rounded-lg border border-[#B8975C]/20 px-3 py-2 font-body text-sm focus:outline-none focus:border-[#C4622D] bg-white"
              placeholder="Opsiyonel"
            />
          </div>

          <button
            type="submit" disabled={inviting}
            className="flex items-center gap-2 px-5 py-2 bg-[#C4622D] hover:bg-[#C4622D]/90 disabled:opacity-50 text-white font-body text-sm font-medium rounded-lg transition-colors"
          >
            <Send size={14} />
            {inviting ? "Gönderiliyor..." : "Davet Gönder"}
          </button>
        </form>

        {inviteSuccess && (
          <p className="mt-3 font-body text-sm text-green-600">Davet başarıyla gönderildi!</p>
        )}
        {error && (
          <p className="mt-3 font-body text-sm text-red-500">{error}</p>
        )}
      </div>
    </div>
  );
}
