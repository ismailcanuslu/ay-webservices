"use client";

import { Zap, Plus, Star, Activity, RefreshCw, CheckCircle } from "lucide-react";
import { PageShell, StatsCard, StatusBadge } from "@/components/dashboard/page-shell";
import { Button } from "@/components/ui/button";

const engines = [
    { name: "Ürün Önerileri", algorithm: "İşbirlikçi Filtreleme", training: "Çevrimiçi", coverage: "%94.2", ctr: "+18.4%", status: "active" as const },
    { name: "İçerik Sıralaması", algorithm: "Derin Öğrenme", training: "Günlük", coverage: "%89.1", ctr: "+12.7%", status: "active" as const },
    { name: "Kullanıcı Segmentasyonu", algorithm: "K-means Kümeleme", training: "Haftalık", coverage: "%100", ctr: "—", status: "active" as const },
    { name: "Çapraz Satış", algorithm: "Pazar Sepeti Analizi", training: "Günlük", coverage: "%76.4", ctr: "+9.2%", status: "maintenance" as const },
];

const recentRecs = [
    { user: "usr-0001", recs: ["Ürün A", "Ürün B", "Ürün C"], score: 0.94 },
    { user: "usr-0002", recs: ["Ürün D", "Ürün A", "Ürün E"], score: 0.88 },
    { user: "usr-0003", recs: ["Ürün B", "Ürün F", "Ürün G"], score: 0.91 },
    { user: "usr-0004", recs: ["Ürün H", "Ürün C", "Ürün I"], score: 0.85 },
];

export default function OneriMotoruPage() {
    return (
        <PageShell
            title="Öneri Motoru"
            description="Kullanıcı davranışına dayalı kişiselleştirilmiş içerik ve ürün önerileri üretin"
            icon={<Zap className="w-6 h-6" />}
            iconColor="#6366F1"
            breadcrumbs={[{ label: "Yapay Zeka" }, { label: "Öneri Motoru" }]}
            actions={
                <Button size="sm" className="gap-1.5 text-xs text-white" style={{ background: "linear-gradient(135deg,#FF9900,#FF6B00)", border: "none" }}>
                    <Plus className="w-3.5 h-3.5" />Kampanya Oluştur
                </Button>
            }
        >
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <StatsCard label="Motor Sayısı" value={String(engines.length)} color="#6366F1" icon={<Zap className="w-5 h-5" />} />
                <StatsCard label="Günlük Öneri" value="4.2M" sub="Üretilen öneri" color="#10B981" icon={<Activity className="w-5 h-5" />} />
                <StatsCard label="Ort. CTR" value="+13.4%" sub="Tıklanma artışı" color="#F59E0B" icon={<Star className="w-5 h-5" />} />
                <StatsCard label="Kapsama" value="%89.9" sub="Kullanıcı kapsama" color="#3B82F6" icon={<CheckCircle className="w-5 h-5" />} />
            </div>

            <div className="space-y-3">
                {engines.map(e => (
                    <div key={e.name} className="rounded-xl border bg-card p-5 card-hover">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <div className="font-semibold text-sm" style={{ color: "#6366F1" }}>{e.name}</div>
                                <div className="text-xs text-muted-foreground mt-0.5">Algoritma: {e.algorithm} · Eğitim: {e.training}</div>
                            </div>
                            <StatusBadge status={e.status} />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-muted/40 rounded-lg p-3">
                                <p className="text-xs text-muted-foreground">Kapsama</p>
                                <p className="text-xl font-bold text-indigo-500">{e.coverage}</p>
                            </div>
                            <div className="bg-muted/40 rounded-lg p-3">
                                <p className="text-xs text-muted-foreground">CTR Artışı</p>
                                <p className="text-xl font-bold text-green-500">{e.ctr}</p>
                            </div>
                            <div className="flex items-center justify-end">
                                <button className="text-xs text-orange-500 hover:text-orange-600 font-medium transition-colors">Detay →</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="rounded-xl border bg-card overflow-hidden">
                <div className="px-5 py-4 border-b"><h2 className="font-semibold text-sm">Örnek Öneriler</h2></div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/30">
                                {["Kullanıcı", "Önerilen Ürünler", "Güven Skoru"].map(c =>
                                    <th key={c} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{c}</th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {recentRecs.map(r => (
                                <tr key={r.user} className="hover:bg-muted/20 transition-colors">
                                    <td className="px-5 py-3 font-mono text-xs text-indigo-500">{r.user}</td>
                                    <td className="px-5 py-3">
                                        <div className="flex gap-2 flex-wrap">
                                            {r.recs.map(p => <span key={p} className="text-xs bg-indigo-100 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 px-2 py-0.5 rounded">{p}</span>)}
                                        </div>
                                    </td>
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 bg-muted rounded-full h-1.5 max-w-[80px]">
                                                <div className="h-full rounded-full bg-indigo-500" style={{ width: `${r.score * 100}%` }} />
                                            </div>
                                            <span className="text-xs font-bold text-indigo-500">%{Math.round(r.score * 100)}</span>
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
