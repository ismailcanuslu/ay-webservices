"use client";

import { Shield, Activity, Zap, Globe, TrendingDown, RefreshCw, AlertTriangle } from "lucide-react";
import { PageShell, StatsCard } from "@/components/dashboard/page-shell";
import { Button } from "@/components/ui/button";

const attacks = [
    { date: "04.03.2024 18:45", type: "UDP Flood", src: "Çoklu kaynak (Botnet)", peak: "48 Gbps", duration: "4 dk 12 sn", mitigated: true },
    { date: "03.03.2024 09:12", type: "SYN Flood", src: "Çin, Rusya, İran", peak: "12 Gbps", duration: "1 dk 45 sn", mitigated: true },
    { date: "02.03.2024 22:30", type: "HTTP Flood", src: "Dağıtık (203 ülke)", peak: "2.4M req/sn", duration: "8 dk 30 sn", mitigated: true },
    { date: "01.03.2024 14:00", type: "DNS Amplifikasyon", src: "Yansıtma saldırısı", peak: "780 Gbps", duration: "12 sn", mitigated: true },
];

const protectedResources = [
    { name: "prod-alb-main", type: "Yük Dengeleyici", plan: "Gelişmiş", status: "✓ Korumalı" },
    { name: "ayws.com", type: "Route53 Bölgesi", plan: "Standart", status: "✓ Korumalı" },
    { name: "cdn.ayws.com", type: "CloudFront", plan: "Gelişmiş", status: "✓ Korumalı" },
    { name: "api.ayws.com", type: "API Gateway", plan: "Gelişmiş", status: "✓ Korumalı" },
];

export default function DdosKorumaPage() {
    return (
        <PageShell
            title="DDoS Koruması"
            description="Dağıtık hizmet reddi saldırılarına karşı altyapınızı otomatik olarak koruyun"
            icon={<Shield className="w-6 h-6" />}
            iconColor="#EF4444"
            breadcrumbs={[{ label: "Güvenlik" }, { label: "DDoS Koruması" }]}
            actions={<Button variant="outline" size="sm" className="gap-1.5 text-xs"><RefreshCw className="w-3.5 h-3.5" />Yenile</Button>}
        >
            {/* Durum bandı */}
            <div className="rounded-xl border border-green-500/30 bg-green-50 dark:bg-green-950/20 p-4 flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                <div>
                    <div className="text-sm font-semibold text-green-700 dark:text-green-400">Sistem Korumalı — Aktif Saldırı Yok</div>
                    <div className="text-xs text-green-600 dark:text-green-500 mt-0.5">Son güncelleme: 04.03.2024 19:26 · Otomatik koruma etkin</div>
                </div>
            </div>

            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <StatsCard label="Bu Ay Engellenen" value="4" sub="DDoS saldırısı" color="#EF4444" icon={<Shield className="w-5 h-5" />} />
                <StatsCard label="Maks. Saldırı" value="780 Gbps" sub="Bu ay en yüksek" color="#F59E0B" icon={<Zap className="w-5 h-5" />} />
                <StatsCard label="Korunan Kaynak" value={String(protectedResources.length)} sub="Aktif koruma" color="#10B981" icon={<Globe className="w-5 h-5" />} />
                <StatsCard label="Azaltma Oranı" value="100%" sub="Tüm saldırılar önlendi" color="#3B82F6" icon={<TrendingDown className="w-5 h-5" />} />
            </div>

            {/* Saldırı geçmişi */}
            <div className="rounded-xl border bg-card overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-4 border-b">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <h2 className="font-semibold text-sm">Saldırı Geçmişi (Son 7 Gün)</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/30">
                                {["Tarih", "Saldırı Türü", "Kaynak", "Zirve Hacim", "Süre", "Durum"].map(c => (
                                    <th key={c} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{c}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {attacks.map((a, i) => (
                                <tr key={i} className="hover:bg-muted/20 transition-colors">
                                    <td className="px-5 py-3 text-xs font-mono text-muted-foreground">{a.date}</td>
                                    <td className="px-5 py-3"><span className="text-xs font-medium text-red-500 bg-red-100 dark:bg-red-950/30 px-2 py-0.5 rounded">{a.type}</span></td>
                                    <td className="px-5 py-3 text-xs text-muted-foreground">{a.src}</td>
                                    <td className="px-5 py-3 text-sm font-bold text-red-500">{a.peak}</td>
                                    <td className="px-5 py-3 text-xs text-muted-foreground">{a.duration}</td>
                                    <td className="px-5 py-3"><span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-950/30 px-2 py-0.5 rounded">✓ Azaltıldı</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Korunan kaynaklar */}
            <div className="rounded-xl border bg-card overflow-hidden">
                <div className="px-5 py-4 border-b"><h2 className="font-semibold text-sm">Korunan Kaynaklar</h2></div>
                <div className="divide-y divide-border">
                    {protectedResources.map(r => (
                        <div key={r.name} className="flex items-center justify-between px-5 py-3 hover:bg-muted/20 transition-colors">
                            <div>
                                <div className="text-sm font-mono font-medium">{r.name}</div>
                                <div className="text-xs text-muted-foreground">{r.type}</div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.plan === "Gelişmiş" ? "bg-purple-100 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400" : "bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400"}`}>{r.plan}</span>
                                <span className="text-xs font-semibold text-green-600 dark:text-green-400">{r.status}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </PageShell>
    );
}
