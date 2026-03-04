"use client";

import { FileText, Plus, RefreshCw, Search, Database, Activity, HardDrive, Layers } from "lucide-react";
import { PageShell, StatsCard, StatusBadge } from "@/components/dashboard/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const collections = [
    { name: "kullanicilar", db: "app_db", documents: "2.4M", size: "3.2 GB", indexes: 5, status: "active" as const },
    { name: "urunler", db: "app_db", documents: "142K", size: "890 MB", indexes: 8, status: "active" as const },
    { name: "yorumlar", db: "app_db", documents: "8.7M", size: "15 GB", indexes: 4, status: "active" as const },
    { name: "medya_meta", db: "media_db", documents: "34M", size: "42 GB", indexes: 6, status: "active" as const },
    { name: "audit_log", db: "ops_db", documents: "120M", size: "230 GB", indexes: 3, status: "maintenance" as const },
    { name: "geolocation_cache", db: "geo_db", documents: "890K", size: "2.1 GB", indexes: 7, status: "active" as const },
];

const databases = [...new Set(collections.map(c => c.db))];

export default function BelgeVtPage() {
    const [search, setSearch] = useState("");
    const [activeDb, setActiveDb] = useState<string>("all");

    const filtered = collections.filter(c =>
        (activeDb === "all" || c.db === activeDb) &&
        c.name.includes(search.toLowerCase())
    );

    return (
        <PageShell
            title="Belge Veritabanı"
            description="JSON belgelerini yüksek ölçekte depolayan yönetilen MongoDB uyumlu veritabanı"
            icon={<FileText className="w-6 h-6" />}
            iconColor="#8B5CF6"
            breadcrumbs={[{ label: "Veritabanı" }, { label: "Belge Veritabanı" }]}
            actions={
                <Button size="sm" className="text-xs gap-1.5 text-white" style={{ background: "linear-gradient(135deg,#FF9900,#FF6B00)", border: "none" }}>
                    <Plus className="w-3.5 h-3.5" />Koleksiyon Oluştur
                </Button>
            }
        >
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <StatsCard label="Veritabanı" value={String(databases.length)} color="#8B5CF6" icon={<Database className="w-5 h-5" />} />
                <StatsCard label="Koleksiyonlar" value={String(collections.length)} sub="Toplam" color="#10B981" icon={<Layers className="w-5 h-5" />} />
                <StatsCard label="Toplam Belge" value="166M+" sub="Tüm koleksiyonlar" color="#3B82F6" icon={<FileText className="w-5 h-5" />} />
                <StatsCard label="Toplam Boyut" value="293 GB" sub="Depolama kullanımı" color="#F59E0B" icon={<HardDrive className="w-5 h-5" />} />
            </div>

            <div className="rounded-xl border bg-card overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-4 border-b flex-wrap">
                    <h2 className="font-semibold text-sm shrink-0">Koleksiyonlar</h2>
                    {/* DB filtre */}
                    <div className="flex gap-1.5">
                        <button
                            onClick={() => setActiveDb("all")}
                            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${activeDb === "all" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"}`}
                        >
                            Tümü
                        </button>
                        {databases.map(db => (
                            <button
                                key={db}
                                onClick={() => setActiveDb(db)}
                                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors font-mono ${activeDb === db ? "bg-purple-500 text-white" : "bg-muted text-muted-foreground hover:bg-accent"}`}
                            >
                                {db}
                            </button>
                        ))}
                    </div>
                    <div className="relative ml-auto max-w-xs w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                        <Input placeholder="Koleksiyon ara..." value={search} onChange={e => setSearch(e.target.value)} className="h-8 pl-8 text-xs" />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/30">
                                {["Koleksiyon", "Veritabanı", "Belge Sayısı", "Boyut", "İndex", "Durum", "İşlem"].map(col => (
                                    <th key={col} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{col}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filtered.map(col => (
                                <tr key={col.name + col.db} className="hover:bg-muted/20 transition-colors">
                                    <td className="px-5 py-3 font-mono text-xs font-semibold text-purple-500">{col.name}</td>
                                    <td className="px-5 py-3"><span className="font-mono text-xs bg-muted px-2 py-0.5 rounded">{col.db}</span></td>
                                    <td className="px-5 py-3 font-medium text-sm">{col.documents}</td>
                                    <td className="px-5 py-3 text-xs text-muted-foreground">{col.size}</td>
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-1">
                                            {[...Array(Math.min(col.indexes, 5))].map((_, i) => (
                                                <div key={i} className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                                            ))}
                                            {col.indexes > 5 && <span className="text-xs text-muted-foreground">+{col.indexes - 5}</span>}
                                        </div>
                                    </td>
                                    <td className="px-5 py-3"><StatusBadge status={col.status} /></td>
                                    <td className="px-5 py-3">
                                        <button className="text-xs text-blue-500 hover:text-blue-600 font-medium transition-colors">Sorgula →</button>
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
