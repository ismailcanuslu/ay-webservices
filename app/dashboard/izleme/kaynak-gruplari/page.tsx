"use client";

import { Layers, Plus, Server, HardDrive, Tag, Search } from "lucide-react";
import { PageShell, StatsCard, StatusBadge } from "@/components/dashboard/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const groups = [
    { name: "production", desc: "Prodüksiyon ortamı kaynakları", resources: 28, cost: "₺12.340/ay", tags: ["env:prod", "team:ops"], status: "active" as const },
    { name: "staging", desc: "Test ve doğrulama ortamı", resources: 14, cost: "₺3.240/ay", tags: ["env:staging", "team:dev"], status: "active" as const },
    { name: "ml-platform", desc: "Makine öğrenmesi altyapısı", resources: 8, cost: "₺6.780/ay", tags: ["team:ml", "env:prod"], status: "active" as const },
    { name: "monitoring", desc: "İzleme ve gözlemlenebilirlik stack'i", resources: 12, cost: "₺1.890/ay", tags: ["team:ops", "purpose:monitoring"], status: "active" as const },
    { name: "dr-failover", desc: "Felaket kurtarma kaynakları", resources: 6, cost: "₺2.100/ay", tags: ["env:dr", "team:ops"], status: "maintenance" as const },
];

const tagStats = [
    { key: "env", values: ["prod (28)", "staging (14)", "dr (6)", "dev (4)"] },
    { key: "team", values: ["ops (40)", "dev (18)", "ml (8)", "finance (3)"] },
    { key: "purpose", values: ["compute (22)", "storage (15)", "monitoring (12)", "ml (8)"] },
];

export default function KaynaklarPage() {
    const [search, setSearch] = useState("");
    const filtered = groups.filter(g => g.name.includes(search) || g.desc.toLowerCase().includes(search));
    return (
        <PageShell
            title="Kaynak Grupları"
            description="Etiketlere göre kaynakları mantıksal gruplar halinde organize edin ve yönetin"
            icon={<Layers className="w-6 h-6" />}
            iconColor="#64748B"
            breadcrumbs={[{ label: "Yönetim" }, { label: "Kaynak Grupları" }]}
            actions={
                <Button size="sm" className="gap-1.5 text-xs text-white" style={{ background: "linear-gradient(135deg,#FF9900,#FF6B00)", border: "none" }}>
                    <Plus className="w-3.5 h-3.5" />Grup Oluştur
                </Button>
            }
        >
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <StatsCard label="Toplam Grup" value={String(groups.length)} color="#64748B" icon={<Layers className="w-5 h-5" />} />
                <StatsCard label="Toplam Kaynak" value={String(groups.reduce((s, g) => s + g.resources, 0))} sub="Etiketlenmiş" color="#10B981" icon={<Server className="w-5 h-5" />} />
                <StatsCard label="Etiket Anahtarı" value="12" color="#3B82F6" icon={<Tag className="w-5 h-5" />} />
                <StatsCard label="Aylık Toplam" value="₺26.350" color="#F59E0B" icon={<HardDrive className="w-5 h-5" />} />
            </div>

            <div className="rounded-xl border bg-card overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-4 border-b flex-wrap">
                    <h2 className="font-semibold text-sm shrink-0">Kaynak Grupları</h2>
                    <div className="relative max-w-xs w-full ml-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                        <Input placeholder="Grup ara..." value={search} onChange={e => setSearch(e.target.value)} className="h-8 pl-8 text-xs" />
                    </div>
                </div>
                <div className="divide-y divide-border">
                    {filtered.map(g => (
                        <div key={g.name} className="flex items-start justify-between gap-4 px-5 py-4 hover:bg-muted/20 transition-colors">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-mono text-sm font-semibold text-slate-500">{g.name}</span>
                                    <StatusBadge status={g.status} />
                                </div>
                                <div className="text-xs text-muted-foreground mb-2">{g.desc}</div>
                                <div className="flex flex-wrap gap-1">
                                    {g.tags.map(t => (
                                        <span key={t} className="text-[10px] font-mono bg-muted px-2 py-0.5 rounded">{t}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="text-right shrink-0">
                                <div className="text-sm font-bold">{g.resources} kaynak</div>
                                <div className="text-xs text-green-500 font-medium mt-0.5">{g.cost}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Etiket analizi */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {tagStats.map(t => (
                    <div key={t.key} className="rounded-xl border bg-card p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <Tag className="w-4 h-4 text-muted-foreground" />
                            <span className="font-mono text-sm font-semibold">tag:{t.key}</span>
                        </div>
                        <div className="space-y-1.5">
                            {t.values.map(v => (
                                <div key={v} className="text-xs bg-muted/40 rounded px-2 py-1 font-mono">{v}</div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </PageShell>
    );
}
