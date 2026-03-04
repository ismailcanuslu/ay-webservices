"use client";

import { RefreshCw, Plus, Activity, CheckCircle, HardDrive, Clock, ArrowRight } from "lucide-react";
import { PageShell, StatsCard, StatusBadge } from "@/components/dashboard/page-shell";
import { Button } from "@/components/ui/button";

const jobs = [
    { name: "Yedek Aktarımı", src: "ay-prod-backups (eu-west-1)", dst: "ay-prod-backups-dr (eu-central-1)", size: "2.1 TB", transferred: "1.8 TB", progress: 86, speed: "180 MB/s", eta: "28 dk", status: "creating" as const },
    { name: "ML Veri Kopyası", src: "ay-ml-datasets (us-east-1)", dst: "ay-ml-staging (eu-west-1)", size: "4.7 TB", transferred: "4.7 TB", progress: 100, speed: "—", eta: "—", status: "active" as const },
    { name: "Log Arşivi", src: "ay-logs-archive (eu-west-1)", dst: "ay-logs-glacier (eu-west-1)", size: "890 GB", transferred: "890 GB", progress: 100, speed: "—", eta: "—", status: "active" as const },
    { name: "CDN Senkronizasyon", src: "ay-static-cdn (eu-west-1)", dst: "CloudFront Dağıtım", size: "12.3 GB", transferred: "12.3 GB", progress: 100, speed: "—", eta: "—", status: "active" as const },
    { name: "DR Replikasyon", src: "ay-prod-assets (eu-west-1)", dst: "ay-prod-assets-us (us-east-1)", size: "420 GB", transferred: "380 GB", progress: 90, speed: "95 MB/s", eta: "12 dk", status: "creating" as const },
];

export default function VeriAktarimiPage() {
    return (
        <PageShell
            title="Veri Aktarımı"
            description="Veri kopyalama, senkronizasyon ve bölgeler arası aktarım işlerini yönetin"
            icon={<RefreshCw className="w-6 h-6" />}
            iconColor="#EC4899"
            breadcrumbs={[{ label: "Depolama" }, { label: "Veri Aktarımı" }]}
            actions={
                <Button size="sm" className="gap-1.5 text-xs text-white" style={{ background: "linear-gradient(135deg,#FF9900,#FF6B00)", border: "none" }}>
                    <Plus className="w-3.5 h-3.5" />Aktarım Görevi Oluştur
                </Button>
            }
        >
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <StatsCard label="Toplam Görev" value={String(jobs.length)} sub={`${jobs.filter(j => j.status === "creating").length} aktif`} color="#EC4899" icon={<Activity className="w-5 h-5" />} />
                <StatsCard label="Aktarılan" value="8.9 TB" sub="Bu ay" color="#10B981" icon={<HardDrive className="w-5 h-5" />} />
                <StatsCard label="Başarı Oranı" value="100%" sub="Aktarım doğruluğu" color="#3B82F6" icon={<CheckCircle className="w-5 h-5" />} />
                <StatsCard label="Ort. Hız" value="275 MB/s" sub="Aktif transferler" color="#F59E0B" icon={<Activity className="w-5 h-5" />} />
            </div>

            <div className="space-y-3">
                {jobs.map(j => (
                    <div key={j.name} className="rounded-xl border bg-card p-5 card-hover">
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <div className="font-semibold text-sm text-pink-500">{j.name}</div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                    <span className="font-mono">{j.src}</span>
                                    <ArrowRight className="w-3 h-3 text-pink-400" />
                                    <span className="font-mono">{j.dst}</span>
                                </div>
                            </div>
                            <StatusBadge status={j.status} />
                        </div>
                        <div className="mb-2">
                            <div className="flex items-center justify-between text-xs mb-1.5">
                                <span className="text-muted-foreground">{j.transferred} / {j.size}</span>
                                <span className="font-semibold" style={{ color: j.progress === 100 ? "#10B981" : "#EC4899" }}>{j.progress}%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                                <div
                                    className="h-full rounded-full transition-all duration-700"
                                    style={{ width: `${j.progress}%`, background: j.progress === 100 ? "#10B981" : "linear-gradient(90deg,#EC4899,#BE185D)" }}
                                />
                            </div>
                        </div>
                        {j.status === "creating" && (
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                <span>Hız: <span className="font-medium text-pink-400">{j.speed}</span></span>
                                <Clock className="w-3 h-3" />
                                <span>Tahmini süre: <span className="font-medium">{j.eta}</span></span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </PageShell>
    );
}
