"use client";

import { Layers, Plus, Activity, Globe, Zap, RefreshCw, TrendingUp } from "lucide-react";
import { PageShell, StatsCard, StatusBadge } from "@/components/dashboard/page-shell";
import { Button } from "@/components/ui/button";

const distributions = [
    { id: "E1ABCDEF123456", domain: "d1abcdefg.cloudfront.net", alias: "cdn.ayws.com", origins: 2, behaviors: 4, status: "active" as const, requests: "45M/gün", bandwidth: "890 GB/gün", cacheHit: 94.2 },
    { id: "E2BCDEF7890123", domain: "d2bcdefgh.cloudfront.net", alias: "static.ayws.com", origins: 1, behaviors: 2, status: "active" as const, requests: "12M/gün", bandwidth: "240 GB/gün", cacheHit: 97.8 },
    { id: "E3CDEF01234567", domain: "d3cdefghi.cloudfront.net", alias: "media.ayws.com", origins: 1, behaviors: 3, status: "active" as const, requests: "8M/gün", bandwidth: "4.2 TB/gün", cacheHit: 88.4 },
    { id: "E4DEF012345678", domain: "d4defghij.cloudfront.net", alias: "—", origins: 1, behaviors: 1, status: "creating" as const, requests: "—", bandwidth: "—", cacheHit: 0 },
];

function CacheBar({ rate }: { rate: number }) {
    const color = rate >= 90 ? "#10B981" : rate >= 80 ? "#F59E0B" : "#EF4444";
    return (
        <div className="flex items-center gap-2">
            <div className="flex-1 bg-muted rounded-full h-2 min-w-[60px]">
                <div className="h-full rounded-full" style={{ width: `${rate}%`, backgroundColor: color }} />
            </div>
            <span className="text-xs font-bold w-10 text-right" style={{ color }}>{rate > 0 ? `${rate}%` : "—"}</span>
        </div>
    );
}

export default function IcerikDagitimPage() {
    return (
        <PageShell
            title="İçerik Dağıtım Ağı"
            description="Küresel edge konumlarından içerik sunarak gecikmeyi azaltın (CloudFront eşdeğeri)"
            icon={<Layers className="w-6 h-6" />}
            iconColor="#06B6D4"
            breadcrumbs={[{ label: "Ağ & İçerik Dağıtımı" }, { label: "İçerik Dağıtım Ağı" }]}
            actions={
                <Button size="sm" className="gap-1.5 text-xs text-white" style={{ background: "linear-gradient(135deg,#FF9900,#FF6B00)", border: "none" }}>
                    <Plus className="w-3.5 h-3.5" />Dağıtım Oluştur
                </Button>
            }
        >
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <StatsCard label="Dağıtım" value={String(distributions.length)} sub={`${distributions.filter(d => d.status === "active").length} aktif`} color="#06B6D4" icon={<Globe className="w-5 h-5" />} />
                <StatsCard label="İstek/Gün" value="65M+" sub="Toplam CDN isteği" color="#10B981" icon={<Activity className="w-5 h-5" />} />
                <StatsCard label="Bant Genişliği" value="5.3 TB/gün" sub="Toplam dağıtım" color="#F59E0B" icon={<TrendingUp className="w-5 h-5" />} />
                <StatsCard label="Önbellek İsabeti" value="93.5%" sub="Genel ortalama" color="#8B5CF6" icon={<Zap className="w-5 h-5" />} />
            </div>

            <div className="rounded-xl border bg-card overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b">
                    <h2 className="font-semibold text-sm">CDN Dağıtımları</h2>
                    <Button variant="outline" size="sm" className="text-xs h-8 gap-1"><RefreshCw className="w-3 h-3" />Yenile</Button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/30">
                                {["Dağıtım ID", "Domain", "Alias", "Origin", "Davranış", "Durum", "İstek/Gün", "Bant", "Önbellek İsabeti"].map(c => (
                                    <th key={c} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{c}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {distributions.map(d => (
                                <tr key={d.id} className="hover:bg-muted/20 transition-colors">
                                    <td className="px-5 py-3 font-mono text-xs font-bold text-cyan-500">{d.id}</td>
                                    <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{d.domain}</td>
                                    <td className="px-5 py-3 font-mono text-xs font-medium">{d.alias}</td>
                                    <td className="px-5 py-3 text-xs text-center">{d.origins}</td>
                                    <td className="px-5 py-3 text-xs text-center">{d.behaviors}</td>
                                    <td className="px-5 py-3"><StatusBadge status={d.status} /></td>
                                    <td className="px-5 py-3 text-xs font-medium">{d.requests}</td>
                                    <td className="px-5 py-3 text-xs font-medium">{d.bandwidth}</td>
                                    <td className="px-5 py-3 min-w-[140px]"><CacheBar rate={d.cacheHit} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edge konumları harita yerine liste */}
            <div className="rounded-xl border bg-card p-5">
                <h3 className="font-semibold text-sm mb-4">Küresel Edge Konumları</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                        { region: "Avrupa", locs: 12, color: "#10B981" }, { region: "Kuzey Amerika", locs: 18, color: "#3B82F6" },
                        { region: "Asya Pasifik", locs: 14, color: "#F59E0B" }, { region: "Güney Amerika", locs: 4, color: "#8B5CF6" },
                        { region: "Orta Doğu", locs: 3, color: "#EF4444" }, { region: "Afrika", locs: 2, color: "#EC4899" },
                    ].map(({ region, locs, color }) => (
                        <div key={region} className="rounded-lg bg-muted/40 p-3 flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                            <div>
                                <div className="text-xs font-medium">{region}</div>
                                <div className="text-xs text-muted-foreground">{locs} konum</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </PageShell>
    );
}
