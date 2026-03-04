"use client";

import { useState } from "react";
import { Cloud, Plus, Search, HardDrive, Activity, Globe, Lock, RefreshCw, Filter } from "lucide-react";
import { PageShell, StatsCard, StatusBadge } from "@/components/dashboard/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const buckets = [
    { name: "ay-prod-assets", region: "eu-west-1", objects: "1.24M", size: "420 GB", access: "Özel", versioning: true, encryption: true, status: "active" as const, created: "12.01.2024" },
    { name: "ay-prod-backups", region: "eu-west-1", objects: "8.9K", size: "2.1 TB", access: "Özel", versioning: true, encryption: true, status: "active" as const, created: "12.01.2024" },
    { name: "ay-static-cdn", region: "eu-west-1", objects: "45.2K", size: "12.3 GB", access: "Genel", versioning: false, encryption: false, status: "active" as const, created: "15.01.2024" },
    { name: "ay-logs-archive", region: "eu-central-1", objects: "2.3M", size: "890 GB", access: "Özel", versioning: false, encryption: true, status: "active" as const, created: "20.01.2024" },
    { name: "ay-ml-datasets", region: "us-east-1", objects: "12.4K", size: "4.7 TB", access: "Özel", versioning: true, encryption: true, status: "active" as const, created: "05.02.2024" },
    { name: "ay-dev-temp", region: "eu-west-1", objects: "890", size: "2.4 GB", access: "Özel", versioning: false, encryption: false, status: "active" as const, created: "28.02.2024" },
];

export default function NesneDepolamaPage() {
    const [search, setSearch] = useState("");
    const filtered = buckets.filter(b => b.name.includes(search));
    const totalSize = "8.1 TB";

    return (
        <PageShell
            title="Nesne Depolama"
            description="Ölçeklenebilir nesne depolama — sınırsız veri, yüksek dayanıklılık (S3 eşdeğeri)"
            icon={<Cloud className="w-6 h-6" />}
            iconColor="#3B82F6"
            breadcrumbs={[{ label: "Depolama" }, { label: "Nesne Depolama" }]}
            actions={
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs"><RefreshCw className="w-3.5 h-3.5" />Yenile</Button>
                    <Button size="sm" className="gap-1.5 text-xs text-white" style={{ background: "linear-gradient(135deg,#FF9900,#FF6B00)", border: "none" }}>
                        <Plus className="w-3.5 h-3.5" />Kova Oluştur
                    </Button>
                </div>
            }
        >
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <StatsCard label="Toplam Kova" value={String(buckets.length)} sub="3 bölgede" color="#3B82F6" icon={<Cloud className="w-5 h-5" />} />
                <StatsCard label="Toplam Boyut" value={totalSize} sub="Depolama kullanımı" color="#10B981" icon={<HardDrive className="w-5 h-5" />} />
                <StatsCard label="Toplam Nesne" value="3.6M+" sub="Dosya ve veri" color="#F59E0B" icon={<Activity className="w-5 h-5" />} />
                <StatsCard label="Bölge" value="3" sub="Aktif bölge" color="#8B5CF6" icon={<Globe className="w-5 h-5" />} />
            </div>

            <div className="rounded-xl border bg-card overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-4 border-b flex-wrap">
                    <h2 className="font-semibold text-sm shrink-0">Kovalar</h2>
                    <div className="relative max-w-xs w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                        <Input placeholder="Kova ara..." value={search} onChange={e => setSearch(e.target.value)} className="h-8 pl-8 text-xs" />
                    </div>
                    <Button variant="outline" size="sm" className="h-8 text-xs gap-1 ml-auto"><Filter className="w-3 h-3" />Filtrele</Button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/30">
                                {["Kova Adı", "Bölge", "Nesne Sayısı", "Boyut", "Erişim", "Sürüm", "Şifreleme", "Durum", "Oluşturma"].map(c => (
                                    <th key={c} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{c}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filtered.map(b => (
                                <tr key={b.name} className="hover:bg-muted/20 transition-colors cursor-pointer">
                                    <td className="px-5 py-3 font-mono text-xs font-semibold text-blue-500">{b.name}</td>
                                    <td className="px-5 py-3 text-xs text-muted-foreground">{b.region}</td>
                                    <td className="px-5 py-3 text-sm font-medium">{b.objects}</td>
                                    <td className="px-5 py-3 text-sm font-medium">{b.size}</td>
                                    <td className="px-5 py-3">
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${b.access === "Genel" ? "bg-green-100 dark:bg-green-950/30 text-green-600 dark:text-green-400" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"}`}>
                                            {b.access}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3">
                                        <span className={`text-xs ${b.versioning ? "text-green-500" : "text-muted-foreground"}`}>{b.versioning ? "✓ Aktif" : "—"}</span>
                                    </td>
                                    <td className="px-5 py-3">
                                        {b.encryption ? <Lock className="w-3.5 h-3.5 text-orange-500" /> : <span className="text-xs text-muted-foreground">—</span>}
                                    </td>
                                    <td className="px-5 py-3"><StatusBadge status={b.status} /></td>
                                    <td className="px-5 py-3 text-xs text-muted-foreground">{b.created}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </PageShell>
    );
}
