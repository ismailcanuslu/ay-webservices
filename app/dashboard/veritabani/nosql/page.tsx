"use client";

import { Layers, Plus, RefreshCw, Search, Activity, HardDrive, Clock, Zap } from "lucide-react";
import { PageShell, StatsCard, StatusBadge } from "@/components/dashboard/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const tables = [
    { name: "kullanicilar", items: "2.4M", size: "4.8 GB", reads: "12.4K/s", writes: "320/s", status: "active" as const },
    { name: "siparisler", items: "8.1M", size: "12.3 GB", reads: "8.2K/s", writes: "1.1K/s", status: "active" as const },
    { name: "urunler", items: "142K", size: "890 MB", reads: "5.6K/s", writes: "45/s", status: "active" as const },
    { name: "log_olaylar", items: "54M", size: "78 GB", reads: "890/s", writes: "22K/s", status: "active" as const },
    { name: "analitik_ham", items: "120M", size: "234 GB", reads: "450/s", writes: "8.5K/s", status: "maintenance" as const },
    { name: "oturumlar", items: "890K", size: "1.2 GB", reads: "34K/s", writes: "12K/s", status: "active" as const },
];

export default function NoSQLPage() {
    const [search, setSearch] = useState("");
    const filtered = tables.filter(t => t.name.includes(search.toLowerCase()));

    return (
        <PageShell
            title="NoSQL Veritabanı"
            description="Çok bölgeli, yüksek performanslı anahtar-değer ve belge veritabanı"
            icon={<Layers className="w-6 h-6" />}
            iconColor="#6366F1"
            breadcrumbs={[{ label: "Veritabanı" }, { label: "NoSQL Veritabanı" }]}
            actions={
                <Button size="sm" className="gap-1.5 text-xs text-white" style={{ background: "linear-gradient(135deg,#FF9900,#FF6B00)", border: "none" }}>
                    <Plus className="w-3.5 h-3.5" />Tablo Oluştur
                </Button>
            }
        >
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <StatsCard label="Toplam Tablo" value="6" sub="Tüm bölgeler" color="#6366F1" icon={<Layers className="w-5 h-5" />} />
                <StatsCard label="Toplam Öğe" value="185M+" sub="Kayıt sayısı" color="#10B981" icon={<HardDrive className="w-5 h-5" />} />
                <StatsCard label="Okuma/Yazma" value="62K/s" sub="Anlık throughput" color="#F59E0B" icon={<Activity className="w-5 h-5" />} />
                <StatsCard label="Gecikme" value="1.2 ms" sub="p99 okuma" color="#3B82F6" icon={<Zap className="w-5 h-5" />} />
            </div>

            {/* Tablolar */}
            <div className="rounded-xl border bg-card overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b gap-3">
                    <h2 className="font-semibold text-sm shrink-0">Tablolar</h2>
                    <div className="relative max-w-xs w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                        <Input
                            placeholder="Tablo ara..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="h-8 pl-8 text-xs"
                        />
                    </div>
                    <Button variant="outline" size="sm" className="text-xs h-8 gap-1.5 shrink-0">
                        <RefreshCw className="w-3 h-3" />Yenile
                    </Button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/30">
                                {["Tablo Adı", "Öğe Sayısı", "Boyut", "Okuma", "Yazma", "Durum", "İşlemler"].map(col => (
                                    <th key={col} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{col}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filtered.map((t) => (
                                <tr key={t.name} className="hover:bg-muted/20 transition-colors">
                                    <td className="px-5 py-3 font-mono text-xs font-semibold text-indigo-500">{t.name}</td>
                                    <td className="px-5 py-3 text-sm font-medium">{t.items}</td>
                                    <td className="px-5 py-3 text-xs text-muted-foreground">{t.size}</td>
                                    <td className="px-5 py-3">
                                        <span className="text-xs text-green-600 dark:text-green-400 font-medium">{t.reads}</span>
                                    </td>
                                    <td className="px-5 py-3">
                                        <span className="text-xs text-orange-500 font-medium">{t.writes}</span>
                                    </td>
                                    <td className="px-5 py-3"><StatusBadge status={t.status} /></td>
                                    <td className="px-5 py-3">
                                        <div className="flex gap-2">
                                            <button className="text-xs text-blue-500 hover:text-blue-600 font-medium transition-colors">Görüntüle</button>
                                            <button className="text-xs text-orange-500 hover:text-orange-600 font-medium transition-colors">Yönet</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Throughput kartları */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl border bg-card p-5">
                    <h3 className="font-semibold text-sm mb-4">Okuma Hacmi (Son 1 saat)</h3>
                    <div className="space-y-2">
                        {tables.slice(0, 4).map(t => (
                            <div key={t.name} className="flex items-center gap-3">
                                <span className="text-xs font-mono text-muted-foreground w-32 truncate">{t.name}</span>
                                <div className="flex-1 bg-muted rounded-full h-2">
                                    <div className="h-full rounded-full bg-blue-500/70" style={{ width: `${Math.random() * 70 + 20}%`, transition: "width 0.5s ease" }} />
                                </div>
                                <span className="text-xs text-muted-foreground w-16 text-right">{t.reads}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="rounded-xl border bg-card p-5">
                    <h3 className="font-semibold text-sm mb-4">Yazma Hacmi (Son 1 saat)</h3>
                    <div className="space-y-2">
                        {tables.slice(0, 4).map(t => (
                            <div key={t.name} className="flex items-center gap-3">
                                <span className="text-xs font-mono text-muted-foreground w-32 truncate">{t.name}</span>
                                <div className="flex-1 bg-muted rounded-full h-2">
                                    <div className="h-full rounded-full bg-orange-400/70" style={{ width: `${Math.random() * 70 + 10}%`, transition: "width 0.5s ease" }} />
                                </div>
                                <span className="text-xs text-muted-foreground w-16 text-right">{t.writes}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </PageShell>
    );
}
