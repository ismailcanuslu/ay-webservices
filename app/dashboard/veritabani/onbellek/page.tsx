"use client";

import { Zap, Plus, RefreshCw, Activity, TrendingUp, Clock, Server } from "lucide-react";
import { PageShell, StatsCard, StatusBadge } from "@/components/dashboard/page-shell";
import { Button } from "@/components/ui/button";

const clusters = [
    { name: "cache-prod-main", type: "Redis 7.2", nodes: 3, memory: "16 GB", hitRate: 94.2, ops: "45K/s", status: "active" as const, uptime: "127 gün" },
    { name: "cache-session-01", type: "Redis 7.2", nodes: 2, memory: "8 GB", hitRate: 88.7, ops: "12K/s", status: "active" as const, uptime: "43 gün" },
    { name: "cache-staging", type: "Memcached 1.6", nodes: 1, memory: "4 GB", hitRate: 72.1, ops: "3.2K/s", status: "active" as const, uptime: "15 gün" },
    { name: "cache-analytics-q", type: "Redis 7.0", nodes: 6, memory: "64 GB", hitRate: 91.4, ops: "120K/s", status: "maintenance" as const, uptime: "89 gün" },
];

function HitRateBar({ rate }: { rate: number }) {
    const color = rate >= 90 ? "#10B981" : rate >= 75 ? "#F59E0B" : "#EF4444";
    return (
        <div className="flex items-center gap-2">
            <div className="flex-1 bg-muted rounded-full h-2 min-w-[80px]">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${rate}%`, backgroundColor: color }} />
            </div>
            <span className="text-xs font-semibold w-12 text-right" style={{ color }}>{rate}%</span>
        </div>
    );
}

export default function OnbellekPage() {
    const totalMemory = clusters.reduce((sum, c) => {
        const gb = parseInt(c.memory);
        return sum + gb * c.nodes;
    }, 0);

    return (
        <PageShell
            title="Önbellek"
            description="Yönetilen Redis ve Memcached bellek içi önbellek kümesi servisi"
            icon={<Zap className="w-6 h-6" />}
            iconColor="#F59E0B"
            breadcrumbs={[{ label: "Veritabanı" }, { label: "Önbellek" }]}
            actions={
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="text-xs gap-1.5">
                        <RefreshCw className="w-3.5 h-3.5" />Yenile
                    </Button>
                    <Button size="sm" className="text-xs gap-1.5 text-white" style={{ background: "linear-gradient(135deg,#FF9900,#FF6B00)", border: "none" }}>
                        <Plus className="w-3.5 h-3.5" />Küme Oluştur
                    </Button>
                </div>
            }
        >
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <StatsCard label="Toplam Küme" value={String(clusters.length)} sub={`${clusters.filter(c => c.status === "active").length} aktif`} color="#F59E0B" icon={<Server className="w-5 h-5" />} />
                <StatsCard label="Toplam Bellek" value={`${totalMemory} GB`} sub="Tüm düğümler" color="#3B82F6" icon={<Activity className="w-5 h-5" />} />
                <StatsCard label="İsabet Oranı" value="91.6%" sub="Genel ortalama" color="#10B981" icon={<TrendingUp className="w-5 h-5" />} />
                <StatsCard label="Toplam İşlem" value="180K/s" sub="Anlık OPS" color="#8B5CF6" icon={<Zap className="w-5 h-5" />} />
            </div>

            {/* Kümeler */}
            <div className="space-y-3">
                {clusters.map((cluster) => (
                    <div key={cluster.name} className="rounded-xl border bg-card p-5 card-hover">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#F59E0B18" }}>
                                    <Zap className="w-4.5 h-4.5" style={{ color: "#F59E0B" }} />
                                </div>
                                <div>
                                    <div className="font-semibold text-sm font-mono text-amber-500">{cluster.name}</div>
                                    <div className="text-xs text-muted-foreground">{cluster.type} · {cluster.nodes} düğüm · {cluster.memory}/düğüm</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <StatusBadge status={cluster.status} />
                                <button className="text-xs text-blue-500 hover:text-blue-600 font-medium transition-colors">Yönet →</button>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <p className="text-xs text-muted-foreground mb-1.5">İsabet Oranı</p>
                                <HitRateBar rate={cluster.hitRate} />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground mb-1.5">İşlem/Saniye</p>
                                <p className="text-sm font-semibold text-purple-500">{cluster.ops}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground mb-1.5">Çalışma Süresi</p>
                                <div className="flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                                    <p className="text-sm font-medium">{cluster.uptime}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </PageShell>
    );
}
