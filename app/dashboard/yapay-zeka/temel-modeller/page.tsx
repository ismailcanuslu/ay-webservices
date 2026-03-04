"use client";

import { Bot, Plus, Zap, RefreshCw, Activity, Layers, Star } from "lucide-react";
import { PageShell, StatsCard, StatusBadge } from "@/components/dashboard/page-shell";
import { Button } from "@/components/ui/button";

const models = [
    { name: "AY-Chat-Pro", provider: "AY Modeller", type: "Sohbet", context: "128K token", params: "70B", latency: "1.2 sn", cost: "₺0.08/1K", status: "active" as const, rating: 4.8 },
    { name: "Claude-3.5 Sonnet", provider: "Anthropic", type: "Sohbet", context: "200K token", params: "—", latency: "0.9 sn", cost: "₺0.12/1K", status: "active" as const, rating: 4.9 },
    { name: "Llama-3.1-70B", provider: "Meta (OSS)", type: "Sohbet", context: "128K token", params: "70B", latency: "0.7 sn", cost: "₺0.04/1K", status: "active" as const, rating: 4.6 },
    { name: "AY-Embed-V2", provider: "AY Modeller", type: "Gömme", context: "8K token", params: "1.5B", latency: "0.1 sn", cost: "₺0.001/1K", status: "active" as const, rating: 4.7 },
    { name: "Stable-Diffusion-XL", provider: "StabilityAI", type: "Görüntü", context: "—", params: "3.5B", latency: "3.2 sn", cost: "₺0.04/görsel", status: "maintenance" as const, rating: 4.5 },
];

const typeColors: Record<string, string> = { "Sohbet": "#6366F1", "Gömme": "#10B981", "Görüntü": "#EC4899", "Tamamlama": "#F59E0B" };

export default function TemelModellerPage() {
    return (
        <PageShell
            title="Temel Modeller"
            description="Büyük dil ve temel yapay zeka modellerine API ile erişin (Bedrock eşdeğeri)"
            icon={<Layers className="w-6 h-6" />}
            iconColor="#6366F1"
            breadcrumbs={[{ label: "Yapay Zeka" }, { label: "Temel Modeller" }]}
            actions={
                <Button size="sm" className="gap-1.5 text-xs text-white" style={{ background: "linear-gradient(135deg,#FF9900,#FF6B00)", border: "none" }}>
                    <Plus className="w-3.5 h-3.5" />Model Ekle
                </Button>
            }
        >
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <StatsCard label="Model Sayısı" value={String(models.length)} sub={`${models.filter(m => m.status === "active").length} erişilebilir`} color="#6366F1" icon={<Layers className="w-5 h-5" />} />
                <StatsCard label="Bugün İstek" value="245K" sub="Token tüketimi" color="#10B981" icon={<Activity className="w-5 h-5" />} />
                <StatsCard label="Ort. Gecikme" value="0.94 sn" color="#3B82F6" icon={<Zap className="w-5 h-5" />} />
                <StatsCard label="Aylık Maliyet" value="₺8.420" color="#F59E0B" icon={<RefreshCw className="w-5 h-5" />} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {models.map(m => {
                    const tc = typeColors[m.type] || "#6B7280";
                    return (
                        <div key={m.name} className="rounded-xl border bg-card p-5 card-hover">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <div className="font-semibold text-sm" style={{ color: "#6366F1" }}>{m.name}</div>
                                    <div className="text-xs text-muted-foreground mt-0.5">{m.provider}</div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: `${tc}18`, color: tc }}>{m.type}</span>
                                    <StatusBadge status={m.status} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                                <div className="text-muted-foreground">Bağlam: <span className="font-medium">{m.context}</span></div>
                                <div className="text-muted-foreground">Param: <span className="font-medium">{m.params}</span></div>
                                <div className="text-muted-foreground">Gecikme: <span className="font-medium text-indigo-400">{m.latency}</span></div>
                                <div className="text-muted-foreground">Maliyet: <span className="font-medium text-green-500">{m.cost}</span></div>
                            </div>
                            <div className="flex items-center justify-between pt-3 border-t">
                                <div className="flex items-center gap-1 text-yellow-500">
                                    <Star className="w-3 h-3 fill-current" />
                                    <span className="text-xs font-bold">{m.rating}</span>
                                </div>
                                <Button variant="outline" size="sm" className="text-xs h-7">Kullan →</Button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </PageShell>
    );
}
