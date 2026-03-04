"use client";

import { Globe, Plus, Activity, Clock, Shield, RefreshCw, Search } from "lucide-react";
import { PageShell, StatsCard, StatusBadge } from "@/components/dashboard/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const zones = [
    { name: "ayws.com", records: 24, type: "Genel", ttl: 300, health: "Sağlıklı", queries: "1.2M/gün", status: "active" as const },
    { name: "api.ayws.com", records: 8, type: "Genel", ttl: 60, health: "Sağlıklı", queries: "4.5M/gün", status: "active" as const },
    { name: "internal.ayws.local", records: 42, type: "Özel", ttl: 300, health: "Sağlıklı", queries: "890K/gün", status: "active" as const },
    { name: "staging.ayws.com", records: 12, type: "Genel", ttl: 60, health: "Sağlıklı", queries: "45K/gün", status: "active" as const },
    { name: "dr.ayws.com", records: 6, type: "Genel", ttl: 30, health: "İzleniyor", queries: "12K/gün", status: "maintenance" as const },
];

const records = [
    { name: "ayws.com", type: "A", value: "54.123.45.67", ttl: 300, routing: "Basit" },
    { name: "www.ayws.com", type: "CNAME", value: "ayws.com", ttl: 300, routing: "Basit" },
    { name: "api.ayws.com", type: "A", value: "54.123.45.68", ttl: 60, routing: "Ağırlıklı" },
    { name: "mail.ayws.com", type: "MX", value: "10 mail.provider.com", ttl: 3600, routing: "Basit" },
    { name: "ayws.com", type: "TXT", value: "v=spf1 include:... ~all", ttl: 3600, routing: "Basit" },
    { name: "_dmarc.ayws.com", type: "TXT", value: "v=DMARC1; p=quarantine;...", ttl: 3600, routing: "Basit" },
];

const typeColors: Record<string, string> = { A: "#10B981", CNAME: "#3B82F6", MX: "#F59E0B", TXT: "#8B5CF6", AAAA: "#06B6D4" };

export default function DnsHizmetiPage() {
    const [search, setSearch] = useState("");
    const filteredRecords = records.filter(r => r.name.includes(search) || r.type.includes(search.toUpperCase()));

    return (
        <PageShell
            title="DNS Hizmeti"
            description="Global ölçekli yüksek kullanılabilirliğe sahip DNS yönetimi (Route53 eşdeğeri)"
            icon={<Globe className="w-6 h-6" />}
            iconColor="#8B5CF6"
            breadcrumbs={[{ label: "Ağ & İçerik Dağıtımı" }, { label: "DNS Hizmeti" }]}
            actions={
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs"><RefreshCw className="w-3.5 h-3.5" />Yenile</Button>
                    <Button size="sm" className="gap-1.5 text-xs text-white" style={{ background: "linear-gradient(135deg,#FF9900,#FF6B00)", border: "none" }}>
                        <Plus className="w-3.5 h-3.5" />Bölge Oluştur
                    </Button>
                </div>
            }
        >
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <StatsCard label="Barındırılan Bölge" value={String(zones.length)} sub="2 özel, 3 genel" color="#8B5CF6" icon={<Globe className="w-5 h-5" />} />
                <StatsCard label="Toplam Kayıt" value="92" sub="Tüm bölgeler" color="#10B981" icon={<Activity className="w-5 h-5" />} />
                <StatsCard label="Günlük Sorgu" value="6.6M" sub="Toplam" color="#3B82F6" icon={<Clock className="w-5 h-5" />} />
                <StatsCard label="Sağlık Kontrolü" value="5" sub="Aktif kontrol" color="#F59E0B" icon={<Shield className="w-5 h-5" />} />
            </div>

            {/* Bölgeler */}
            <div className="rounded-xl border bg-card overflow-hidden">
                <div className="px-5 py-4 border-b"><h2 className="font-semibold text-sm">Barındırılan Bölgeler</h2></div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/30">
                                {["Bölge Adı", "Kayıt Sayısı", "Tür", "TTL (sn)", "Sağlık", "Günlük Sorgu", "Durum"].map(c => (
                                    <th key={c} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{c}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {zones.map(z => (
                                <tr key={z.name} className="hover:bg-muted/20 transition-colors cursor-pointer">
                                    <td className="px-5 py-3 font-mono text-xs font-semibold text-purple-500">{z.name}</td>
                                    <td className="px-5 py-3 text-sm font-semibold">{z.records}</td>
                                    <td className="px-5 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${z.type === "Genel" ? "bg-green-100 dark:bg-green-950/30 text-green-600 dark:text-green-400" : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"}`}>{z.type}</span></td>
                                    <td className="px-5 py-3 text-xs font-mono text-muted-foreground">{z.ttl}s</td>
                                    <td className="px-5 py-3 text-xs text-green-500 font-medium">{z.health}</td>
                                    <td className="px-5 py-3 text-xs text-purple-400 font-medium">{z.queries}</td>
                                    <td className="px-5 py-3"><StatusBadge status={z.status} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* DNS Kayıtları */}
            <div className="rounded-xl border bg-card overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-4 border-b flex-wrap">
                    <h2 className="font-semibold text-sm shrink-0">DNS Kayıtları (ayws.com)</h2>
                    <div className="relative max-w-xs w-full ml-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                        <Input placeholder="Kayıt ara..." value={search} onChange={e => setSearch(e.target.value)} className="h-8 pl-8 text-xs" />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/30">
                                {["Ad", "Tür", "Değer", "TTL", "Yönlendirme", "İşlem"].map(c => (
                                    <th key={c} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{c}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredRecords.map((r, i) => (
                                <tr key={i} className="hover:bg-muted/20 transition-colors">
                                    <td className="px-5 py-3 font-mono text-xs font-medium">{r.name}</td>
                                    <td className="px-5 py-3">
                                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded" style={{ backgroundColor: `${typeColors[r.type] || "#6B7280"}18`, color: typeColors[r.type] || "#6B7280" }}>{r.type}</span>
                                    </td>
                                    <td className="px-5 py-3 font-mono text-xs text-muted-foreground max-w-[240px] truncate">{r.value}</td>
                                    <td className="px-5 py-3 text-xs font-mono">{r.ttl}s</td>
                                    <td className="px-5 py-3 text-xs text-muted-foreground">{r.routing}</td>
                                    <td className="px-5 py-3">
                                        <div className="flex gap-2">
                                            <button className="text-xs text-blue-500 hover:text-blue-600 font-medium">Düzenle</button>
                                            <button className="text-xs text-red-500 hover:text-red-600 font-medium">Sil</button>
                                        </div>
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
