"use client";

import { Network, Plus, HardDrive, Server, Activity, RefreshCw } from "lucide-react";
import { PageShell, StatsCard, StatusBadge } from "@/components/dashboard/page-shell";
import { Button } from "@/components/ui/button";

const fileSystems = [
    { id: "fs-01fa2b3c", name: "prod-shared-storage", size: "2 TB", used: "1.2 TB", useRate: 60, throughput: "250 MiB/s", mounts: 5, protocol: "NFS 4.1", az: "Çok AZ", status: "active" as const },
    { id: "fs-02bc3d4e", name: "app-media-storage", size: "500 GB", used: "180 GB", useRate: 36, throughput: "100 MiB/s", mounts: 3, protocol: "NFS 4.1", az: "eu-west-1a", status: "active" as const },
    { id: "fs-03cd4e5f", name: "dev-workspace", size: "100 GB", used: "45 GB", useRate: 45, throughput: "50 MiB/s", mounts: 8, protocol: "NFS 4.0", az: "eu-west-1b", status: "active" as const },
    { id: "fs-04de5f60", name: "analytics-scratch", size: "5 TB", used: "3.8 TB", useRate: 76, throughput: "500 MiB/s", mounts: 2, protocol: "NFS 4.1", az: "Çok AZ", status: "maintenance" as const },
];

function UsageBar({ rate }: { rate: number }) {
    const color = rate >= 80 ? "#EF4444" : rate >= 60 ? "#F59E0B" : "#10B981";
    return (
        <div className="flex items-center gap-2">
            <div className="flex-1 bg-muted rounded-full h-2 min-w-[80px]">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${rate}%`, backgroundColor: color }} />
            </div>
            <span className="text-xs font-semibold w-8 text-right" style={{ color }}>{rate}%</span>
        </div>
    );
}

export default function AgDosyaSistemiPage() {
    return (
        <PageShell
            title="Ağ Dosya Sistemi"
            description="Birden fazla örnek tarafından paylaşılan tam yönetilen NFS dosya sistemi (EFS eşdeğeri)"
            icon={<Network className="w-6 h-6" />}
            iconColor="#06B6D4"
            breadcrumbs={[{ label: "Depolama" }, { label: "Ağ Dosya Sistemi" }]}
            actions={
                <Button size="sm" className="gap-1.5 text-xs text-white" style={{ background: "linear-gradient(135deg,#FF9900,#FF6B00)", border: "none" }}>
                    <Plus className="w-3.5 h-3.5" />Dosya Sistemi Oluştur
                </Button>
            }
        >
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <StatsCard label="Toplam FS" value={String(fileSystems.length)} sub={`${fileSystems.filter(f => f.status === "active").length} aktif`} color="#06B6D4" icon={<Network className="w-5 h-5" />} />
                <StatsCard label="Toplam Kapasite" value="7.6 TB" sub="Ayrılan alan" color="#3B82F6" icon={<HardDrive className="w-5 h-5" />} />
                <StatsCard label="Kullanılıyor" value="5.2 TB" sub="Ortalama %68" color="#F59E0B" icon={<Activity className="w-5 h-5" />} />
                <StatsCard label="Bağlı Örnek" value="18" sub="Toplam mount noktası" color="#8B5CF6" icon={<Server className="w-5 h-5" />} />
            </div>

            <div className="space-y-3">
                {fileSystems.map(fs => (
                    <div key={fs.id} className="rounded-xl border bg-card p-5 card-hover">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-cyan-100 dark:bg-cyan-950/30 flex items-center justify-center">
                                    <Network className="w-4.5 h-4.5" style={{ color: "#06B6D4" }} />
                                </div>
                                <div>
                                    <div className="font-semibold text-sm font-mono" style={{ color: "#06B6D4" }}>{fs.name}</div>
                                    <div className="text-xs text-muted-foreground">{fs.id} · {fs.protocol} · {fs.az}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <StatusBadge status={fs.status} />
                                <Button variant="outline" size="sm" className="text-xs h-7"><RefreshCw className="w-3 h-3 mr-1" />Yönet</Button>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <p className="text-xs text-muted-foreground mb-1.5">Kullanım</p>
                                <UsageBar rate={fs.useRate} />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Boyut</p>
                                <p className="text-sm font-semibold">{fs.size}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Throughput</p>
                                <p className="text-sm font-semibold text-cyan-500">{fs.throughput}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Mount Noktası</p>
                                <p className="text-sm font-semibold">{fs.mounts} örnek</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </PageShell>
    );
}
