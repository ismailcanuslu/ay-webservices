"use client";

import { HardDrive, Plus, Activity, Server, RefreshCw, Lock } from "lucide-react";
import { PageShell, StatsCard, StatusBadge } from "@/components/dashboard/page-shell";
import { Button } from "@/components/ui/button";

const volumes = [
    { id: "vol-01fa2b3c4d5e6f7a", name: "prod-db-data", type: "gp3", size: "500 GB", iops: "16000", throughput: "1000 MB/s", az: "eu-west-1a", attached: "i-08fa3c1a2b3d4e5f6 (web-server-prod-01)", encrypted: true, status: "active" as const },
    { id: "vol-02bc3d4e5f607182", name: "prod-db-logs", type: "gp3", size: "100 GB", iops: "3000", throughput: "125 MB/s", az: "eu-west-1a", attached: "i-08fa3c1a2b3d4e5f6 (web-server-prod-01)", encrypted: true, status: "active" as const },
    { id: "vol-03cd4e5f60718293", name: "app-storage", type: "gp2", size: "200 GB", iops: "600", throughput: "—", az: "eu-west-1b", attached: "i-09ab2c3d4e5f60718 (web-server-prod-02)", encrypted: true, status: "active" as const },
    { id: "vol-04de5f6071829304", name: "analytics-scratch", type: "io2", size: "1 TB", iops: "32000", throughput: "1000 MB/s", az: "eu-west-1c", attached: "—", encrypted: false, status: "stopped" as const },
    { id: "vol-05ef60718293041a", name: "backup-temp", type: "sc1", size: "4 TB", iops: "250", throughput: "250 MB/s", az: "eu-west-1a", attached: "—", encrypted: true, status: "stopped" as const },
];

const volumeTypeColors: Record<string, string> = { gp3: "#10B981", gp2: "#3B82F6", io2: "#8B5CF6", sc1: "#6B7280" };

export default function BlokDepolamaPage() {
    const totalSize = volumes.reduce((s, v) => s + parseInt(v.size), 0);

    return (
        <PageShell
            title="Blok Depolama"
            description="Sanal makineleriniz için yüksek performanslı SSD blok depolama (EBS eşdeğeri)"
            icon={<HardDrive className="w-6 h-6" />}
            iconColor="#10B981"
            breadcrumbs={[{ label: "Depolama" }, { label: "Blok Depolama" }]}
            actions={
                <Button size="sm" className="gap-1.5 text-xs text-white" style={{ background: "linear-gradient(135deg,#FF9900,#FF6B00)", border: "none" }}>
                    <Plus className="w-3.5 h-3.5" />Birim Oluştur
                </Button>
            }
        >
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <StatsCard label="Toplam Birim" value={String(volumes.length)} sub={`${volumes.filter(v => v.attached !== "—").length} bağlı`} color="#10B981" icon={<HardDrive className="w-5 h-5" />} />
                <StatsCard label="Toplam Kapasite" value={`${(totalSize / 1024).toFixed(1)} TB`} sub="Toplam ayrılan" color="#3B82F6" icon={<Activity className="w-5 h-5" />} />
                <StatsCard label="Bağlı Birim" value={String(volumes.filter(v => v.attached !== "—").length)} sub="Aktif monte" color="#F59E0B" icon={<Server className="w-5 h-5" />} />
                <StatsCard label="Şifreli" value={`${volumes.filter(v => v.encrypted).length}/${volumes.length}`} color="#8B5CF6" icon={<Lock className="w-5 h-5" />} />
            </div>

            <div className="rounded-xl border bg-card overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b">
                    <h2 className="font-semibold text-sm">Birimler</h2>
                    <Button variant="outline" size="sm" className="text-xs h-8 gap-1"><RefreshCw className="w-3 h-3" />Yenile</Button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/30">
                                {["Ad / ID", "Tür", "Boyut", "IOPS", "Throughput", "AZ", "Bağlı Örnek", "Şifre", "Durum"].map(c => (
                                    <th key={c} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{c}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {volumes.map(v => {
                                const tc = volumeTypeColors[v.type] || "#6B7280";
                                return (
                                    <tr key={v.id} className="hover:bg-muted/20 transition-colors">
                                        <td className="px-5 py-3">
                                            <div className="font-medium text-xs text-green-500">{v.name}</div>
                                            <div className="text-[10px] font-mono text-muted-foreground">{v.id}</div>
                                        </td>
                                        <td className="px-5 py-3">
                                            <span className="text-xs px-2 py-0.5 rounded font-mono font-semibold" style={{ backgroundColor: `${tc}18`, color: tc }}>{v.type}</span>
                                        </td>
                                        <td className="px-5 py-3 text-sm font-semibold">{v.size}</td>
                                        <td className="px-5 py-3 text-xs text-orange-500 font-mono">{v.iops}</td>
                                        <td className="px-5 py-3 text-xs text-muted-foreground">{v.throughput}</td>
                                        <td className="px-5 py-3 text-xs text-muted-foreground">{v.az}</td>
                                        <td className="px-5 py-3 text-xs text-blue-500 max-w-[160px] truncate">{v.attached}</td>
                                        <td className="px-5 py-3">{v.encrypted ? <Lock className="w-3.5 h-3.5 text-green-500" /> : <span className="text-muted-foreground text-xs">—</span>}</td>
                                        <td className="px-5 py-3"><StatusBadge status={v.status} /></td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </PageShell>
    );
}
