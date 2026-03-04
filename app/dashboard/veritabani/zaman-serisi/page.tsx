"use client";

import { Activity, Plus, RefreshCw, TrendingUp, Clock, Database, Zap } from "lucide-react";
import { PageShell, StatsCard, StatusBadge } from "@/components/dashboard/page-shell";
import { Button } from "@/components/ui/button";

const metrics = [
    { name: "cpu_kullanim", source: "sunucular", retention: "90 gün", points: "8.2M", interval: "10 sn", status: "active" as const },
    { name: "bellek_kullanim", source: "sunucular", retention: "90 gün", points: "8.1M", interval: "10 sn", status: "active" as const },
    { name: "ag_bant_genisligi", source: "ağ_cihazları", retention: "30 gün", points: "3.4M", interval: "30 sn", status: "active" as const },
    { name: "veritabani_sorgu_sre", source: "db_cluster", retention: "60 gün", points: "12M", interval: "1 sn", status: "active" as const },
    { name: "istek_gecikme", source: "api_gateway", retention: "14 gün", points: "45M", interval: "100 ms", status: "active" as const },
    { name: "hata_oranlari", source: "uygulamalar", retention: "365 gün", points: "890K", interval: "1 dk", status: "maintenance" as const },
];

// Mini sparkline simülasyonu
function Sparkline({ color }: { color: string }) {
    const points = Array.from({ length: 12 }, () => Math.random() * 60 + 20);
    const max = Math.max(...points);
    const h = 32;
    const w = 80;
    const path = points.map((p, i) => {
        const x = (i / (points.length - 1)) * w;
        const y = h - (p / max) * h;
        return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    }).join(" ");

    return (
        <svg width={w} height={h} className="overflow-visible">
            <path d={path} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export default function ZamanSerisiPage() {
    return (
        <PageShell
            title="Zaman Serisi Veritabanı"
            description="Yüksek frekanslı zaman damgalı veri noktalarını depolayan ve sorgulayan özel veritabanı"
            icon={<Activity className="w-6 h-6" />}
            iconColor="#06B6D4"
            breadcrumbs={[{ label: "Veritabanı" }, { label: "Zaman Serisi" }]}
            actions={
                <Button size="sm" className="text-xs gap-1.5 text-white" style={{ background: "linear-gradient(135deg,#FF9900,#FF6B00)", border: "none" }}>
                    <Plus className="w-3.5 h-3.5" />Metrik Ekle
                </Button>
            }
        >
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <StatsCard label="Veri Noktası/sn" value="1.2M" sub="Anlık yazma hızı" color="#06B6D4" icon={<Zap className="w-5 h-5" />} />
                <StatsCard label="Toplam Metrik" value={String(metrics.length)} sub="Kayıt altında" color="#10B981" icon={<TrendingUp className="w-5 h-5" />} />
                <StatsCard label="Toplam Veri" value="78 GB" sub="Sıkıştırılmış" color="#8B5CF6" icon={<Database className="w-5 h-5" />} />
                <StatsCard label="Sorgu Gecikme" value="2.1 ms" sub="p95 ortalaması" color="#F59E0B" icon={<Clock className="w-5 h-5" />} />
            </div>

            {/* Metrikler */}
            <div className="rounded-xl border bg-card overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b">
                    <h2 className="font-semibold text-sm">Aktif Metrikler</h2>
                    <Button variant="outline" size="sm" className="text-xs gap-1.5 h-8">
                        <RefreshCw className="w-3 h-3" />Yenile
                    </Button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/30">
                                {["Metrik Adı", "Kaynak", "Saklama", "Veri Noktaları", "Aralık", "Durum", "Son 12 ölçüm"].map(col => (
                                    <th key={col} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{col}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {metrics.map(m => (
                                <tr key={m.name} className="hover:bg-muted/20 transition-colors">
                                    <td className="px-5 py-3 font-mono text-xs font-semibold text-cyan-500">{m.name}</td>
                                    <td className="px-5 py-3"><span className="font-mono text-xs bg-muted px-2 py-0.5 rounded">{m.source}</span></td>
                                    <td className="px-5 py-3 text-xs text-muted-foreground">{m.retention}</td>
                                    <td className="px-5 py-3 text-sm font-medium">{m.points}</td>
                                    <td className="px-5 py-3 text-xs text-cyan-500 font-mono font-medium">{m.interval}</td>
                                    <td className="px-5 py-3"><StatusBadge status={m.status} /></td>
                                    <td className="px-5 py-3">
                                        <Sparkline color={m.status === "active" ? "#06B6D4" : "#6B7280"} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Özet Panel */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { label: "Yazma Hızı", value: "47M/dk", trend: "+12%", color: "#06B6D4" },
                    { label: "Sıkıştırma Oranı", value: "14:1", trend: "Optimal", color: "#10B981" },
                    { label: "Sorgu/Saniye", value: "8.4K", trend: "+5%", color: "#8B5CF6" },
                ].map(stat => (
                    <div key={stat.label} className="rounded-xl border bg-card p-5 card-hover">
                        <p className="text-xs text-muted-foreground">{stat.label}</p>
                        <p className="text-2xl font-bold mt-1" style={{ color: stat.color }}>{stat.value}</p>
                        <p className="text-xs mt-2 text-muted-foreground">{stat.trend} son 24 saate göre</p>
                    </div>
                ))}
            </div>
        </PageShell>
    );
}
