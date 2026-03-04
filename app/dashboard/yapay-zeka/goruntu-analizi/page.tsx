"use client";

import { Image, Plus, Activity, Eye, Zap, RefreshCw, CheckCircle } from "lucide-react";
import { PageShell, StatsCard, StatusBadge } from "@/components/dashboard/page-shell";
import { Button } from "@/components/ui/button";

const jobs = [
    { id: "img-job-001", input: "product-images/batch-20240304.zip", type: "Nesne Tespiti", images: 1240, detected: 4892, confidence: "94.2%", duration: "4 dk 12 sn", status: "active" as const },
    { id: "img-job-002", input: "moderation-queue/2024.zip", type: "İçerik Denetimi", images: 8900, detected: 12, confidence: "99.1%", duration: "12 dk 30 sn", status: "active" as const },
    { id: "img-job-003", input: "face-recognition/employees.zip", type: "Yüz Tanıma", images: 340, detected: 340, confidence: "97.8%", duration: "1 dk 45 sn", status: "active" as const },
    { id: "img-job-004", input: "documents/invoices.zip", type: "Belge Analizi", images: 560, detected: 560, confidence: "96.4%", duration: "3 dk 20 sn", status: "maintenance" as const },
];

const capabilities = [
    { name: "Nesne Tespiti", desc: "Görsellerdeki nesneleri ve konumlarını tespit edin", requests: "45K/gün" },
    { name: "Yüz Analizi", desc: "Duygu, yaş, cinsiyet ve kimlik tespiti", requests: "12K/gün" },
    { name: "İçerik Denetimi", desc: "Uygunsuz içerikleri otomatik filtreleyin", requests: "89K/gün" },
    { name: "Belge OCR", desc: "Belge ve görsellerden metin çıkarın", requests: "28K/gün" },
];

export default function GoruntuAnaliziPage() {
    return (
        <PageShell
            title="Görüntü Analizi"
            description="Derin öğrenme ile görüntü ve video içeriklerini analiz edin (Rekognition eşdeğeri)"
            icon={<Image className="w-6 h-6" />}
            iconColor="#6366F1"
            breadcrumbs={[{ label: "Yapay Zeka" }, { label: "Görüntü Analizi" }]}
            actions={
                <Button size="sm" className="gap-1.5 text-xs text-white" style={{ background: "linear-gradient(135deg,#FF9900,#FF6B00)", border: "none" }}>
                    <Plus className="w-3.5 h-3.5" />Analiz Başlat
                </Button>
            }
        >
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <StatsCard label="Bugün İşlenen" value="11.0K" sub="Görsel/video" color="#6366F1" icon={<Image className="w-5 h-5" />} />
                <StatsCard label="Tespit Edilen" value="5.8K" sub="Nesne ve yüz" color="#10B981" icon={<Eye className="w-5 h-5" />} />
                <StatsCard label="Ort. Güven" value="%96.9" color="#3B82F6" icon={<CheckCircle className="w-5 h-5" />} />
                <StatsCard label="Ort. Yanıt" value="280 ms" color="#F59E0B" icon={<Zap className="w-5 h-5" />} />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {capabilities.map(c => (
                    <div key={c.name} className="rounded-xl border bg-card p-4 card-hover">
                        <div className="text-sm font-semibold" style={{ color: "#6366F1" }}>{c.name}</div>
                        <div className="text-xs text-muted-foreground mt-1 mb-3">{c.desc}</div>
                        <div className="text-xs font-medium text-indigo-400">{c.requests}</div>
                    </div>
                ))}
            </div>

            <div className="rounded-xl border bg-card overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b">
                    <h2 className="font-semibold text-sm">Analiz İşleri</h2>
                    <Button variant="outline" size="sm" className="text-xs h-8 gap-1"><RefreshCw className="w-3 h-3" />Yenile</Button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/30">
                                {["İş ID", "Girdi", "Tür", "Görüntü", "Tespit", "Güven", "Süre", "Durum"].map(c =>
                                    <th key={c} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{c}</th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {jobs.map(j => (
                                <tr key={j.id} className="hover:bg-muted/20 transition-colors">
                                    <td className="px-5 py-3 font-mono text-xs font-bold text-indigo-500">{j.id}</td>
                                    <td className="px-5 py-3 font-mono text-xs text-muted-foreground max-w-[160px] truncate">{j.input}</td>
                                    <td className="px-5 py-3"><span className="text-xs bg-indigo-100 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded">{j.type}</span></td>
                                    <td className="px-5 py-3 text-sm">{j.images.toLocaleString("tr-TR")}</td>
                                    <td className="px-5 py-3 text-sm font-bold text-green-500">{j.detected.toLocaleString("tr-TR")}</td>
                                    <td className="px-5 py-3 text-sm font-bold text-indigo-500">{j.confidence}</td>
                                    <td className="px-5 py-3 text-xs text-muted-foreground">{j.duration}</td>
                                    <td className="px-5 py-3"><StatusBadge status={j.status} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </PageShell>
    );
}
