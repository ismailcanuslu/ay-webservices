"use client";

import { Archive, Plus, HardDrive, Clock, Activity, RefreshCw, Shield } from "lucide-react";
import { PageShell, StatsCard, StatusBadge } from "@/components/dashboard/page-shell";
import { Button } from "@/components/ui/button";

const vaults = [
    { name: "prod-db-archive", size: "4.2 TB", objects: 1240, retrieval: "Standart (3-5 saat)", region: "eu-west-1", lastArchive: "Bugün 03:00", status: "active" as const },
    { name: "log-coldarchive", size: "8.9 TB", objects: 45200, retrieval: "Toplu (5-12 saat)", region: "eu-west-1", lastArchive: "Dün 01:00", status: "active" as const },
    { name: "media-glacier", size: "15.3 TB", objects: 9800, retrieval: "Hızlı (1-5 dk)", region: "eu-central-1", lastArchive: "2 gün önce", status: "active" as const },
    { name: "compliance-archive", size: "2.1 TB", objects: 880, retrieval: "Standart (3-5 saat)", region: "us-east-1", lastArchive: "Bir hafta önce", status: "active" as const },
];

const policies = [
    { name: "30 günden eski S3 nesneleri", source: "ay-prod-assets", transition: "Standart-IA → 30 gün", delete: "365 gün" },
    { name: "Log arşivi politikası", source: "ay-logs-archive", transition: "Glacier → 90 gün", delete: "1825 gün (5 yıl)" },
    { name: "Yedek temizleme", source: "ay-prod-backups", transition: "Glacier Deep → 180 gün", delete: "2555 gün (7 yıl)" },
];

export default function ArsivDepolamaPage() {
    const totalSize = "30.5 TB";
    return (
        <PageShell
            title="Arşiv Depolama"
            description="Uzun vadeli, düşük maliyetli arşiv depolama — uyumluluk ve yedekleme için (Glacier eşdeğeri)"
            icon={<Archive className="w-6 h-6" />}
            iconColor="#6B7280"
            breadcrumbs={[{ label: "Depolama" }, { label: "Arşiv Depolama" }]}
            actions={
                <Button size="sm" className="gap-1.5 text-xs text-white" style={{ background: "linear-gradient(135deg,#FF9900,#FF6B00)", border: "none" }}>
                    <Plus className="w-3.5 h-3.5" />Kasa Oluştur
                </Button>
            }
        >
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <StatsCard label="Toplam Kasa" value={String(vaults.length)} sub="2 bölgede" color="#6B7280" icon={<Archive className="w-5 h-5" />} />
                <StatsCard label="Toplam Arşiv" value={totalSize} sub="Sıkıştırılmış" color="#3B82F6" icon={<HardDrive className="w-5 h-5" />} />
                <StatsCard label="Uyumluluk" value="5-7 yıl" sub="Saklama politikası" color="#10B981" icon={<Shield className="w-5 h-5" />} />
                <StatsCard label="Aylık Tasarruf" value="₺4.820" sub="Standart vs Arşiv" color="#F59E0B" icon={<Activity className="w-5 h-5" />} />
            </div>

            {/* Kasalar */}
            <div className="rounded-xl border bg-card overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b">
                    <h2 className="font-semibold text-sm">Arşiv Kasaları</h2>
                    <Button variant="outline" size="sm" className="text-xs h-8 gap-1"><RefreshCw className="w-3 h-3" />Yenile</Button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/30">
                                {["Kasa Adı", "Toplam Boyut", "Nesne Sayısı", "Erişim Hızı", "Bölge", "Son Arşiv", "Durum"].map(c => (
                                    <th key={c} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{c}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {vaults.map(v => (
                                <tr key={v.name} className="hover:bg-muted/20 transition-colors">
                                    <td className="px-5 py-3 font-mono text-xs font-semibold text-gray-500">{v.name}</td>
                                    <td className="px-5 py-3 text-sm font-semibold">{v.size}</td>
                                    <td className="px-5 py-3 text-sm">{v.objects.toLocaleString("tr-TR")}</td>
                                    <td className="px-5 py-3 text-xs text-muted-foreground">{v.retrieval}</td>
                                    <td className="px-5 py-3 text-xs text-muted-foreground">{v.region}</td>
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="w-3 h-3" />{v.lastArchive}</div>
                                    </td>
                                    <td className="px-5 py-3"><StatusBadge status={v.status} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Yaşam döngüsü politikaları */}
            <div className="rounded-xl border bg-card overflow-hidden">
                <div className="px-5 py-4 border-b"><h2 className="font-semibold text-sm">Yaşam Döngüsü Politikaları</h2></div>
                <div className="divide-y divide-border">
                    {policies.map(p => (
                        <div key={p.name} className="flex items-center justify-between px-5 py-4 hover:bg-muted/20 transition-colors">
                            <div>
                                <div className="font-medium text-sm">{p.name}</div>
                                <div className="text-xs text-muted-foreground mt-0.5">Kaynak: <span className="font-mono">{p.source}</span></div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-blue-500 font-medium">{p.transition}</div>
                                <div className="text-xs text-red-500 mt-0.5">Silme: {p.delete}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </PageShell>
    );
}
