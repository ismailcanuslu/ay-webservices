"use client";

import { Shield, Plus, Activity, AlertTriangle, CheckCircle, RefreshCw, XCircle, Filter } from "lucide-react";
import { PageShell, StatsCard, StatusBadge } from "@/components/dashboard/page-shell";
import { Button } from "@/components/ui/button";

const rules = [
    { id: "WAF-001", name: "SQL Enjeksiyon Engeli", type: "Yönetilen", priority: 1, action: "Engelle", requests: "12.4K", blocked: "234", status: "active" as const },
    { id: "WAF-002", name: "XSS Koruması", type: "Yönetilen", priority: 2, action: "Engelle", requests: "8.9K", blocked: "89", status: "active" as const },
    { id: "WAF-003", name: "Kötü Botlar", type: "Yönetilen", priority: 3, action: "Engelle", requests: "45K", blocked: "12.3K", status: "active" as const },
    { id: "WAF-004", name: "Hız Sınırlama (IP)", type: "Özel", priority: 10, action: "Engelle", requests: "230K", blocked: "1.2K", status: "active" as const },
    { id: "WAF-005", name: "Coğrafi Engelleme", type: "Özel", priority: 20, action: "Engelle", requests: "18K", blocked: "18K", status: "active" as const },
    { id: "WAF-006", name: "Yönetim Paneli Kısıtı", type: "Özel", priority: 30, action: "Say", requests: "4.2K", blocked: "0", status: "maintenance" as const },
];

const recentBlocks = [
    { time: "19:14:32", ip: "185.23.45.67", country: "🇷🇺 RU", rule: "SQL Enjeksiyon", uri: "/api/users?id=1 OR 1=1", action: "Engellendi" },
    { time: "19:12:11", ip: "103.45.67.89", country: "🇨🇳 CN", rule: "Kötü Botlar", uri: "/wp-admin/login.php", action: "Engellendi" },
    { time: "19:09:44", ip: "45.89.123.45", country: "🇮🇷 IR", rule: "Coğrafi Engelleme", uri: "/dashboard/api", action: "Engellendi" },
    { time: "19:07:23", ip: "192.168.45.12", country: "🇩🇪 DE", rule: "Hız Sınırlama", uri: "/api/products", action: "Engellendi" },
];

export default function WafPage() {
    return (
        <PageShell
            title="Web Uygulama Güvenlik Duvarı"
            description="Kötü niyetli web trafiğini gerçek zamanlı filtreleyerek uygulamalarınızı koruyun"
            icon={<Shield className="w-6 h-6" />}
            iconColor="#EF4444"
            breadcrumbs={[{ label: "Güvenlik" }, { label: "Web Uygulama Güvenlik Duvarı" }]}
            actions={
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs"><RefreshCw className="w-3.5 h-3.5" />Yenile</Button>
                    <Button size="sm" className="gap-1.5 text-xs text-white" style={{ background: "linear-gradient(135deg,#FF9900,#FF6B00)", border: "none" }}>
                        <Plus className="w-3.5 h-3.5" />Kural Ekle
                    </Button>
                </div>
            }
        >
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <StatsCard label="Toplam Kural" value={String(rules.length)} sub={`${rules.filter(r => r.status === "active").length} aktif`} color="#EF4444" icon={<Shield className="w-5 h-5" />} />
                <StatsCard label="Engellenen (Bugün)" value="31.8K" sub="İstek reddedildi" color="#F59E0B" icon={<XCircle className="w-5 h-5" />} />
                <StatsCard label="Toplam İncelenen" value="308K" sub="Tüm trafik" color="#3B82F6" icon={<Activity className="w-5 h-5" />} />
                <StatsCard label="Engelleme Oranı" value="10.3%" sub="Tespit hassasiyeti" color="#10B981" icon={<CheckCircle className="w-5 h-5" />} />
            </div>

            {/* Kurallar */}
            <div className="rounded-xl border bg-card overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b">
                    <h2 className="font-semibold text-sm">WAF Kuralları</h2>
                    <Button variant="outline" size="sm" className="text-xs h-8 gap-1"><Filter className="w-3 h-3" />Filtrele</Button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/30">
                                {["ID", "Kural Adı", "Tür", "Öncelik", "Aksiyon", "İncelenen", "Engellenen", "Durum"].map(c => (
                                    <th key={c} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{c}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {rules.map(r => (
                                <tr key={r.id} className="hover:bg-muted/20 transition-colors">
                                    <td className="px-5 py-3 font-mono text-xs text-red-500 font-bold">{r.id}</td>
                                    <td className="px-5 py-3 text-sm font-medium">{r.name}</td>
                                    <td className="px-5 py-3">
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.type === "Yönetilen" ? "bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400" : "bg-orange-100 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400"}`}>{r.type}</span>
                                    </td>
                                    <td className="px-5 py-3 font-mono text-xs">{r.priority}</td>
                                    <td className="px-5 py-3"><span className="text-xs font-medium text-red-500 bg-red-100 dark:bg-red-950/30 px-2 py-0.5 rounded">{r.action}</span></td>
                                    <td className="px-5 py-3 text-sm">{r.requests}</td>
                                    <td className="px-5 py-3 text-sm font-semibold text-red-500">{r.blocked}</td>
                                    <td className="px-5 py-3"><StatusBadge status={r.status} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Son engellemeler */}
            <div className="rounded-xl border bg-card overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-4 border-b">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <h2 className="font-semibold text-sm">Son Engellenen İstekler</h2>
                </div>
                <div className="divide-y divide-border">
                    {recentBlocks.map((b, i) => (
                        <div key={i} className="flex items-center gap-4 px-5 py-3 hover:bg-muted/20 transition-colors">
                            <span className="font-mono text-xs text-muted-foreground w-16 shrink-0">{b.time}</span>
                            <span className="font-mono text-xs text-red-400 w-32 shrink-0">{b.ip}</span>
                            <span className="text-xs w-8 shrink-0">{b.country}</span>
                            <span className="text-xs bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded font-medium shrink-0">{b.rule}</span>
                            <span className="font-mono text-xs text-muted-foreground truncate flex-1">{b.uri}</span>
                            <span className="text-xs font-medium text-red-500 shrink-0">{b.action}</span>
                        </div>
                    ))}
                </div>
            </div>
        </PageShell>
    );
}
