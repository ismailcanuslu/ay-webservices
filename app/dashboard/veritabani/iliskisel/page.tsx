"use client";

import { useState } from "react";
import { Database, Plus, RefreshCw, Filter, Download, Activity, HardDrive, Cpu, Clock } from "lucide-react";
import { PageShell, StatsCard, StatusBadge, DataTable } from "@/components/dashboard/page-shell";
import { Button } from "@/components/ui/button";

const instances = [
    { id: "db-prod-main-01", engine: "PostgreSQL 16.2", class: "db.r6g.large", storage: "500 GB", status: "active" as const, region: "eu-west-1", az: "eu-west-1a", backup: "Bugün 03:00", connections: 87 },
    { id: "db-prod-replica-01", engine: "PostgreSQL 16.2", class: "db.r6g.medium", storage: "500 GB", status: "active" as const, region: "eu-west-1", az: "eu-west-1b", backup: "Bugün 03:15", connections: 23 },
    { id: "db-staging-01", engine: "MySQL 8.0.35", class: "db.t3.medium", storage: "100 GB", status: "active" as const, region: "eu-central-1", az: "eu-central-1a", backup: "Dün 02:00", connections: 12 },
    { id: "db-analytics-01", engine: "PostgreSQL 15.4", class: "db.r6g.2xlarge", storage: "2 TB", status: "maintenance" as const, region: "us-east-1", az: "us-east-1a", backup: "Bugün 01:00", connections: 0 },
    { id: "db-test-02", engine: "MariaDB 10.11", class: "db.t3.small", storage: "20 GB", status: "stopped" as const, region: "eu-west-1", az: "eu-west-1c", backup: "3 gün önce", connections: 0 },
];

const engineColors: Record<string, string> = {
    PostgreSQL: "#336791",
    MySQL: "#00758F",
    MariaDB: "#C0765A",
};

export default function IliskiselVtPage() {
    const [selected, setSelected] = useState<string[]>([]);

    const toggleSelect = (id: string) => {
        setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    return (
        <PageShell
            title="İlişkisel Veritabanı"
            description="Yönetilen PostgreSQL, MySQL ve MariaDB veritabanı örnekleri"
            icon={<Database className="w-6 h-6" />}
            iconColor="#10B981"
            breadcrumbs={[{ label: "Veritabanı" }, { label: "İlişkisel Veritabanı" }]}
            actions={
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                        <RefreshCw className="w-3.5 h-3.5" />Yenile
                    </Button>
                    <Button size="sm" className="gap-1.5 text-xs text-white" style={{ background: "linear-gradient(135deg,#FF9900,#FF6B00)", border: "none" }}>
                        <Plus className="w-3.5 h-3.5" />Yeni Veritabanı
                    </Button>
                </div>
            }
        >
            {/* İstatistikler */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <StatsCard label="Toplam Örnek" value="5" sub="3 bölgede" color="#10B981" icon={<Database className="w-5 h-5" />} />
                <StatsCard label="Toplam Depolama" value="3.1 TB" sub="Kullanımda" color="#3B82F6" icon={<HardDrive className="w-5 h-5" />} />
                <StatsCard label="Aktif Bağlantı" value="122" sub="Anlık toplam" color="#F59E0B" icon={<Activity className="w-5 h-5" />} />
                <StatsCard label="Son Yedekleme" value="03:00" sub="Bugün, başarılı" color="#8B5CF6" icon={<Clock className="w-5 h-5" />} />
            </div>

            {/* Tablo */}
            <div className="rounded-xl border bg-card overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b">
                    <div className="flex items-center gap-3">
                        <h2 className="font-semibold text-sm">Veritabanı Örnekleri</h2>
                        <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{instances.length}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8">
                            <Filter className="w-3 h-3" />Filtrele
                        </Button>
                        <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8">
                            <Download className="w-3 h-3" />Dışa Aktar
                        </Button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/30">
                                <th className="w-10 px-4 py-3">
                                    <input type="checkbox" className="rounded accent-orange-500" onChange={(e) => setSelected(e.target.checked ? instances.map(i => i.id) : [])} />
                                </th>
                                {["Örnek ID", "Motor", "Sınıf", "Depolama", "Durum", "Bölge", "Aktif Bağlantı", "Son Yedek"].map(col => (
                                    <th key={col} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{col}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {instances.map((inst) => {
                                const engineName = inst.engine.split(" ")[0];
                                const engColor = engineColors[engineName] || "#6B7280";
                                return (
                                    <tr key={inst.id} className="hover:bg-muted/20 transition-colors cursor-pointer" onClick={() => toggleSelect(inst.id)}>
                                        <td className="px-4 py-3">
                                            <input type="checkbox" className="rounded accent-orange-500" checked={selected.includes(inst.id)} onChange={() => toggleSelect(inst.id)} onClick={e => e.stopPropagation()} />
                                        </td>
                                        <td className="px-4 py-3 font-mono text-xs font-medium text-blue-500">{inst.id}</td>
                                        <td className="px-4 py-3">
                                            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium" style={{ backgroundColor: `${engColor}15`, color: engColor }}>
                                                {inst.engine}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground text-xs">{inst.class}</td>
                                        <td className="px-4 py-3 text-muted-foreground text-xs">{inst.storage}</td>
                                        <td className="px-4 py-3"><StatusBadge status={inst.status} /></td>
                                        <td className="px-4 py-3 text-xs text-muted-foreground">{inst.region} / {inst.az}</td>
                                        <td className="px-4 py-3">
                                            {inst.connections > 0 ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 bg-muted rounded-full h-1.5 min-w-[60px]">
                                                        <div className="h-full rounded-full bg-orange-400" style={{ width: `${Math.min(inst.connections, 100)}%` }} />
                                                    </div>
                                                    <span className="text-xs text-muted-foreground">{inst.connections}</span>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-muted-foreground">—</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-xs text-muted-foreground">{inst.backup}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                {selected.length > 0 && (
                    <div className="px-5 py-3 border-t bg-orange-50 dark:bg-orange-950/20 flex items-center justify-between">
                        <span className="text-xs text-orange-700 dark:text-orange-400 font-medium">{selected.length} örnek seçildi</span>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="text-xs h-7">Başlat</Button>
                            <Button variant="outline" size="sm" className="text-xs h-7">Durdur</Button>
                            <Button variant="outline" size="sm" className="text-xs h-7 text-red-600 border-red-200 hover:bg-red-50">Sil</Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Motor Dağılımı */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { engine: "PostgreSQL", count: 3, color: "#336791" },
                    { engine: "MySQL", count: 1, color: "#00758F" },
                    { engine: "MariaDB", count: 1, color: "#C0765A" },
                ].map(({ engine, count, color }) => (
                    <div key={engine} className="rounded-xl border bg-card p-5 card-hover flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}18` }}>
                            <Database className="w-5 h-5" style={{ color }} />
                        </div>
                        <div>
                            <div className="text-sm font-semibold">{engine}</div>
                            <div className="text-xs text-muted-foreground">{count} örnek</div>
                        </div>
                    </div>
                ))}
            </div>
        </PageShell>
    );
}
