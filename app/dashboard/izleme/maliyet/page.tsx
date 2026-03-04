"use client";

import { CreditCard, TrendingDown, TrendingUp, DollarSign, RefreshCw, AlertTriangle } from "lucide-react";
import { PageShell, StatsCard } from "@/components/dashboard/page-shell";
import { Button } from "@/components/ui/button";

const services = [
    { service: "Sanal Makineler (EC2)", thisMonth: 4820, lastMonth: 4210, change: +14.5, unit: "₺" },
    { service: "Depolama (S3)", thisMonth: 1240, lastMonth: 1180, change: +5.1, unit: "₺" },
    { service: "Veritabanı (RDS)", thisMonth: 3650, lastMonth: 3650, change: 0, unit: "₺" },
    { service: "Konteyner (ECS/EKS)", thisMonth: 2890, lastMonth: 2340, change: +23.5, unit: "₺" },
    { service: "Sunucusuz (Lambda)", thisMonth: 340, lastMonth: 380, change: -10.5, unit: "₺" },
    { service: "CDN (CloudFront)", thisMonth: 890, lastMonth: 920, change: -3.3, unit: "₺" },
    { service: "Ağ & VPC", thisMonth: 560, lastMonth: 540, change: +3.7, unit: "₺" },
    { service: "Diğer", thisMonth: 410, lastMonth: 390, change: +5.1, unit: "₺" },
];

const budgets = [
    { name: "Toplam Aylık Bütçe", limit: 16000, used: 14800, currency: "₺" },
    { name: "Geliştirme Ortamı", limit: 3000, used: 1240, currency: "₺" },
    { name: "Makine Öğrenmesi", limit: 5000, used: 4720, currency: "₺" },
];

export default function MaliyetYonetimiPage() {
    const totalThisMonth = services.reduce((s, r) => s + r.thisMonth, 0);
    const totalLastMonth = services.reduce((s, r) => s + r.lastMonth, 0);
    const changeRate = (((totalThisMonth - totalLastMonth) / totalLastMonth) * 100).toFixed(1);

    return (
        <PageShell
            title="Maliyet Yönetimi"
            description="Bulut harcamalarınızı izleyin, bütçe uyarıları alın ve maliyetleri optimize edin"
            icon={<CreditCard className="w-6 h-6" />}
            iconColor="#10B981"
            breadcrumbs={[{ label: "Yönetim" }, { label: "Maliyet Yönetimi" }]}
            actions={<Button variant="outline" size="sm" className="gap-1.5 text-xs"><RefreshCw className="w-3.5 h-3.5" />Yenile</Button>}
        >
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <StatsCard label="Bu Ay" value={`₺${totalThisMonth.toLocaleString("tr-TR")}`} sub={`Geçen ay: ₺${totalLastMonth.toLocaleString("tr-TR")}`} color="#10B981" icon={<DollarSign className="w-5 h-5" />} />
                <StatsCard label="Değişim" value={`%${changeRate}`} sub="Geçen aya göre" color={Number(changeRate) > 0 ? "#EF4444" : "#10B981"} icon={Number(changeRate) > 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />} />
                <StatsCard label="Aylık Bütçe" value="₺16.000" sub="Bütçe limiti" color="#3B82F6" icon={<CreditCard className="w-5 h-5" />} />
                <StatsCard label="Bütçe Kullanımı" value="%92.5" sub="₺1.200 kaldı" color="#F59E0B" icon={<AlertTriangle className="w-5 h-5" />} />
            </div>

            {/* Bütçe göstergesi */}
            <div className="space-y-3">
                {budgets.map(b => {
                    const pct = Math.round((b.used / b.limit) * 100);
                    const color = pct >= 90 ? "#EF4444" : pct >= 75 ? "#F59E0B" : "#10B981";
                    return (
                        <div key={b.name} className="rounded-xl border bg-card p-4 card-hover">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold">{b.name}</span>
                                <span className="text-sm font-bold" style={{ color }}>{b.currency}{b.used.toLocaleString("tr-TR")} / {b.currency}{b.limit.toLocaleString("tr-TR")}</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-3">
                                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: color }} />
                            </div>
                            <div className="flex justify-between mt-1">
                                <span className="text-xs text-muted-foreground">%{pct} kullanıldı</span>
                                <span className="text-xs text-muted-foreground">{b.currency}{(b.limit - b.used).toLocaleString("tr-TR")} kaldı</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Hizmet dökümü */}
            <div className="rounded-xl border bg-card overflow-hidden">
                <div className="px-5 py-4 border-b"><h2 className="font-semibold text-sm">Hizmet Bazlı Maliyet</h2></div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/30">
                                {["Hizmet", "Bu Ay", "Geçen Ay", "Değişim", "Pay"].map(c => (
                                    <th key={c} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{c}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {services.map(s => (
                                <tr key={s.service} className="hover:bg-muted/20 transition-colors">
                                    <td className="px-5 py-3 text-sm font-medium">{s.service}</td>
                                    <td className="px-5 py-3 text-sm font-bold">₺{s.thisMonth.toLocaleString("tr-TR")}</td>
                                    <td className="px-5 py-3 text-sm text-muted-foreground">₺{s.lastMonth.toLocaleString("tr-TR")}</td>
                                    <td className="px-5 py-3">
                                        <span className={`text-xs font-bold ${s.change > 0 ? "text-red-500" : s.change < 0 ? "text-green-500" : "text-muted-foreground"}`}>
                                            {s.change > 0 ? "+" : ""}{s.change.toFixed(1)}%
                                        </span>
                                    </td>
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 bg-muted rounded-full h-1.5 min-w-[60px]">
                                                <div className="h-full rounded-full bg-green-500/70" style={{ width: `${(s.thisMonth / totalThisMonth * 100)}%` }} />
                                            </div>
                                            <span className="text-xs text-muted-foreground w-8 text-right">{(s.thisMonth / totalThisMonth * 100).toFixed(0)}%</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </PageShell>
    );
}
