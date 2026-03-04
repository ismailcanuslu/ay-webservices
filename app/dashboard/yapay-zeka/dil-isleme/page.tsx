"use client";

import { Languages, Plus, Activity, Zap, RefreshCw, Check } from "lucide-react";
import { PageShell, StatsCard } from "@/components/dashboard/page-shell";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const models = [
    { name: "Duygu Analizi", desc: "Metin içindeki duygu ve tonu tespit edin", requests: "45K/gün", lang: "30+ dil" },
    { name: "Varlık Tanıma (NER)", desc: "İsim, yer, kuruluş varlıklarını çıkarın", requests: "28K/gün", lang: "15+ dil" },
    { name: "Otomatik Çeviri", desc: "100+ dil arasında yüksek kaliteli çeviri", requests: "12K/gün", lang: "100+ dil" },
    { name: "Metin Özetleme", desc: "Uzun metinlerden otomatik özet üretin", requests: "8.9K/gün", lang: "10+ dil" },
    { name: "Soru Cevaplama", desc: "Metin bağlamına dayalı soruları yanıtlayın", requests: "5.4K/gün", lang: "12+ dil" },
    { name: "Niyet Tespiti", desc: "Kullanıcı niyetini ve slotu çıkarın", requests: "34K/gün", lang: "8+ dil" },
];

export default function DilIsleme() {
    const [text, setText] = useState("AY Web Services bulut altyapısı mükemmel çalışıyor! Müşteri hizmetleri ekibi gerçekten yardımsever. Fiyatlandırma biraz yüksek ama kaliteli bir servis.");
    const sentiment = { label: "Olumlu", score: 0.82, color: "#10B981" };

    return (
        <PageShell
            title="Dil İşleme"
            description="Doğal dil işleme ile metin analizini uygulamalarınıza entegre edin (Comprehend eşdeğeri)"
            icon={<Languages className="w-6 h-6" />}
            iconColor="#6366F1"
            breadcrumbs={[{ label: "Yapay Zeka" }, { label: "Dil İşleme" }]}
            actions={
                <Button size="sm" className="gap-1.5 text-xs text-white" style={{ background: "linear-gradient(135deg,#FF9900,#FF6B00)", border: "none" }}>
                    <Plus className="w-3.5 h-3.5" />Analiz Başlat
                </Button>
            }
        >
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <StatsCard label="NLP Yeteneği" value={String(models.length)} color="#6366F1" icon={<Languages className="w-5 h-5" />} />
                <StatsCard label="İstek/Gün" value="133K" sub="Toplam analiz" color="#10B981" icon={<Activity className="w-5 h-5" />} />
                <StatsCard label="Desteklenen Dil" value="100+" color="#3B82F6" icon={<Zap className="w-5 h-5" />} />
                <StatsCard label="Model Doğruluğu" value="%94.2" sub="Ortalama F1" color="#F59E0B" icon={<Check className="w-5 h-5" />} />
            </div>

            {/* Canlı demo */}
            <div className="rounded-xl border bg-card p-5">
                <h3 className="font-semibold text-sm mb-4">Canlı Demo — Duygu Analizi</h3>
                <textarea
                    className="w-full bg-muted/40 rounded-lg px-4 py-3 text-sm text-foreground border border-border focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none font-mono"
                    rows={3}
                    value={text}
                    onChange={e => setText(e.target.value)}
                />
                <div className="mt-4 flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2 bg-muted/40 rounded-lg px-4 py-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: sentiment.color }} />
                        <span className="text-sm font-semibold" style={{ color: sentiment.color }}>{sentiment.label}</span>
                        <span className="text-xs text-muted-foreground ml-2">Güven: <span className="font-bold">%{Math.round(sentiment.score * 100)}</span></span>
                    </div>
                    <div className="flex-1 bg-muted rounded-full h-3 max-w-xs">
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${sentiment.score * 100}%`, backgroundColor: sentiment.color }} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {models.map(m => (
                    <div key={m.name} className="rounded-xl border bg-card p-4 card-hover">
                        <div className="font-semibold text-sm" style={{ color: "#6366F1" }}>{m.name}</div>
                        <div className="text-xs text-muted-foreground mt-1 mb-3">{m.desc}</div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">{m.lang}</span>
                            <span className="text-xs font-medium text-indigo-400">{m.requests}</span>
                        </div>
                    </div>
                ))}
            </div>
        </PageShell>
    );
}
