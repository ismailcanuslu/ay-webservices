"use client";

import { Activity, Plus, Zap, RefreshCw, Clock } from "lucide-react";
import { PageShell, StatsCard, StatusBadge } from "@/components/dashboard/page-shell";
import { Button } from "@/components/ui/button";

const streams = [
    { name: "prod-clickstream", shards: 4, producers: 8, consumers: 3, throughput: "12 MB/sn", retention: "24 sa", lag: "0.2 sn", status: "active" as const },
    { name: "prod-order-events", shards: 2, producers: 3, consumers: 2, throughput: "2.4 MB/sn", retention: "7 gün", lag: "0 sn", status: "active" as const },
    { name: "ml-feature-stream", shards: 8, producers: 2, consumers: 4, throughput: "45 MB/sn", retention: "24 sa", lag: "1.2 sn", status: "active" as const },
    { name: "audit-log-stream", shards: 1, producers: 12, consumers: 1, throughput: "890 KB/sn", retention: "30 gün", lag: "0 sn", status: "maintenance" as const },
];

export default function VeriAkisiPage() {
    return (
        <PageShell
            title="Veri Akışı"
            description="Gerçek zamanlı veri akışlarını yönetin ve işleyin (Kinesis eşdeğeri)"
            icon={<Activity className="w-6 h-6" />}
            iconColor="#A855F7"
            breadcrumbs={[{ label: "Entegrasyon" }, { label: "Veri Akışı" }]}
            actions={
                <Button size="sm" className="gap-1.5 text-xs text-white" style={{ background: "linear-gradient(135deg,#FF9900,#FF6B00)", border: "none" }}>
                    <Plus className="w-3.5 h-3.5" />Akış Oluştur
                </Button>
            }
        >
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <StatsCard label="Akış Sayısı" value={String(streams.length)} sub={`${streams.filter(s => s.status === "active").length} aktif`} color="#A855F7" icon={<Activity className="w-5 h-5" />} />
                <StatsCard label="Toplam Shard" value={String(streams.reduce((s, r) => s + r.shards, 0))} color="#3B82F6" icon={<Zap className="w-5 h-5" />} />
                <StatsCard label="Toplam Throughput" value="60.3 MB/sn" color="#10B981" icon={<RefreshCw className="w-5 h-5" />} />
                <StatsCard label="Maks. Gecikme" value="1.2 sn" sub="ml-feature-stream" color="#F59E0B" icon={<Clock className="w-5 h-5" />} />
            </div>

            <div className="space-y-3">
                {streams.map(s => (
                    <div key={s.name} className="rounded-xl border bg-card p-5 card-hover">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <div className="font-mono text-sm font-semibold text-purple-500">{s.name}</div>
                                <div className="text-xs text-muted-foreground mt-0.5">{s.shards} shard · {s.producers} üretici · {s.consumers} tüketici</div>
                            </div>
                            <StatusBadge status={s.status} />
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div><p className="text-xs text-muted-foreground">Throughput</p><p className="text-sm font-bold text-purple-500">{s.throughput}</p></div>
                            <div><p className="text-xs text-muted-foreground">Saklama</p><p className="text-sm font-semibold">{s.retention}</p></div>
                            <div><p className="text-xs text-muted-foreground">Gecikme</p><p className={`text-sm font-bold ${parseFloat(s.lag) > 1 ? "text-red-500" : "text-green-500"}`}>{s.lag}</p></div>
                            <div className="flex items-center justify-end"><button className="text-xs text-orange-500 hover:text-orange-600 font-medium transition-colors">İzle →</button></div>
                        </div>
                    </div>
                ))}
            </div>
        </PageShell>
    );
}
