"use client";

import { FileText, Plus, Shield, Clock, CheckCircle, AlertTriangle, RefreshCw } from "lucide-react";
import { PageShell, StatsCard, StatusBadge } from "@/components/dashboard/page-shell";
import { Button } from "@/components/ui/button";

const certs = [
    { domain: "*.ayws.com", issuer: "Let's Encrypt", type: "Wildcard", expires: "15.06.2024", daysLeft: 103, status: "active" as const, autoRenew: true },
    { domain: "ayws.com", issuer: "Amazon CA", type: "DV", expires: "12.09.2024", daysLeft: 192, status: "active" as const, autoRenew: true },
    { domain: "api.ayws.com", issuer: "Amazon CA", type: "DV", expires: "22.08.2024", daysLeft: 171, status: "active" as const, autoRenew: true },
    { domain: "internal.ayws.local", issuer: "Özel CA", type: "Özel", expires: "01.01.2025", daysLeft: 303, status: "active" as const, autoRenew: false },
    { domain: "legacy.ayws.com", issuer: "DigiCert", type: "OV", expires: "08.03.2024", daysLeft: 4, status: "maintenance" as const, autoRenew: false },
];

function ExpiryBadge({ days }: { days: number }) {
    const color = days <= 14 ? "#EF4444" : days <= 30 ? "#F59E0B" : "#10B981";
    const label = days <= 14 ? "Kritik" : days <= 30 ? "Yakında" : `${days} gün`;
    return (
        <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ backgroundColor: `${color}18`, color }}>{label}</span>
    );
}

export default function SertifikaPage() {
    return (
        <PageShell
            title="Sertifika Yöneticisi"
            description="SSL/TLS sertifikalarını merkezi olarak yönetin ve otomatik yenileme ayarlayın"
            icon={<FileText className="w-6 h-6" />}
            iconColor="#10B981"
            breadcrumbs={[{ label: "Güvenlik" }, { label: "Sertifika Yöneticisi" }]}
            actions={
                <Button size="sm" className="gap-1.5 text-xs text-white" style={{ background: "linear-gradient(135deg,#FF9900,#FF6B00)", border: "none" }}>
                    <Plus className="w-3.5 h-3.5" />Sertifika Talep Et
                </Button>
            }
        >
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <StatsCard label="Toplam Sertifika" value={String(certs.length)} sub={`${certs.filter(c => c.status === "active").length} aktif`} color="#10B981" icon={<Shield className="w-5 h-5" />} />
                <StatsCard label="Otomatik Yenileme" value={String(certs.filter(c => c.autoRenew).length)} sub="Sertifika" color="#3B82F6" icon={<RefreshCw className="w-5 h-5" />} />
                <StatsCard label="Kritik Son Tarih" value="1" sub="4 gün içinde dolacak" color="#EF4444" icon={<AlertTriangle className="w-5 h-5" />} />
                <StatsCard label="Geçerli" value="4" sub="Uzun süre geçerli" color="#8B5CF6" icon={<CheckCircle className="w-5 h-5" />} />
            </div>

            {/* Acil uyarı */}
            <div className="rounded-xl border border-red-500/30 bg-red-50 dark:bg-red-950/20 p-4 flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                <div>
                    <div className="text-sm font-semibold text-red-700 dark:text-red-400">Sertifika Son Tarihi Yaklaşıyor!</div>
                    <div className="text-xs text-red-600 dark:text-red-500 mt-0.5"><span className="font-mono">legacy.ayws.com</span> sertifikası 4 gün içinde dolacak. Otomatik yenileme kapalı — manuel işlem gerekiyor.</div>
                </div>
                <Button size="sm" className="ml-auto text-xs shrink-0 bg-red-500 hover:bg-red-600 text-white border-none">Hemen Yenile</Button>
            </div>

            <div className="rounded-xl border bg-card overflow-hidden">
                <div className="px-5 py-4 border-b"><h2 className="font-semibold text-sm">Sertifikalar</h2></div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/30">
                                {["Domain", "Sağlayıcı", "Tür", "Son Tarih", "Kalan", "Oto. Yenileme", "Durum"].map(c => (
                                    <th key={c} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{c}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {certs.map(c => (
                                <tr key={c.domain} className="hover:bg-muted/20 transition-colors">
                                    <td className="px-5 py-3 font-mono text-xs font-semibold text-green-500">{c.domain}</td>
                                    <td className="px-5 py-3 text-xs text-muted-foreground">{c.issuer}</td>
                                    <td className="px-5 py-3"><span className="text-xs bg-muted px-2 py-0.5 rounded">{c.type}</span></td>
                                    <td className="px-5 py-3 text-xs font-mono">{c.expires}</td>
                                    <td className="px-5 py-3"><ExpiryBadge days={c.daysLeft} /></td>
                                    <td className="px-5 py-3">
                                        <span className={`text-xs font-medium ${c.autoRenew ? "text-green-500" : "text-muted-foreground"}`}>{c.autoRenew ? "✓ Aktif" : "✗ Kapalı"}</span>
                                    </td>
                                    <td className="px-5 py-3"><StatusBadge status={c.status} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </PageShell>
    );
}
