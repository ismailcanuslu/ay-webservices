"use client";

import { GitBranch, Plus, Check, X, Clock, RefreshCw, Activity } from "lucide-react";
import { PageShell, StatsCard, StatusBadge } from "@/components/dashboard/page-shell";
import { Button } from "@/components/ui/button";

const pipelines = [
    { name: "prod-deploy-pipeline", branch: "main", lastRun: "Bugün 18:10", duration: "8 dk 23 sn", stages: ["Kaynak", "Derleme", "Test", "Dağıtım"], passed: 4, status: "active" as const },
    { name: "staging-deploy", branch: "develop", lastRun: "Bugün 16:44", duration: "5 dk 11 sn", stages: ["Kaynak", "Derleme", "Test", "Dağıtım"], passed: 4, status: "active" as const },
    { name: "ml-training-pipeline", branch: "ml-main", lastRun: "Dün 02:00", duration: "2 sa 14 dk", stages: ["Veri", "Eğitim", "Değerlendirme", "Kayıt"], passed: 3, status: "maintenance" as const },
    { name: "pr-validation", branch: "feature/*", lastRun: "15 dk önce", duration: "3 dk 45 sn", stages: ["Kaynak", "Lint", "Test"], passed: 3, status: "active" as const },
];

const recentRuns = [
    { pipeline: "prod-deploy-pipeline", commit: "a3b4c5d", author: "admin", time: "Bugün 18:10", result: "Başarılı" },
    { pipeline: "pr-validation", commit: "e6f7a8b", author: "dev01", time: "15 dk önce", result: "Başarılı" },
    { pipeline: "staging-deploy", commit: "c9d0e1f", author: "deploy_bot", time: "Bugün 16:44", result: "Başarılı" },
    { pipeline: "prod-deploy-pipeline", commit: "2a3b4c5", author: "admin", time: "Dün 14:20", result: "Başarısız" },
];

export default function CicdHattiPage() {
    return (
        <PageShell
            title="CI/CD Hattı"
            description="Sürekli entegrasyon ve dağıtım süreçlerini yönetin — otomatik derleme, test ve yayınlama"
            icon={<GitBranch className="w-6 h-6" />}
            iconColor="#84CC16"
            breadcrumbs={[{ label: "Geliştirici Araçları" }, { label: "CI/CD Hattı" }]}
            actions={
                <Button size="sm" className="gap-1.5 text-xs text-white" style={{ background: "linear-gradient(135deg,#FF9900,#FF6B00)", border: "none" }}>
                    <Plus className="w-3.5 h-3.5" />Hat Oluştur
                </Button>
            }
        >
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <StatsCard label="Pipeline Sayısı" value={String(pipelines.length)} sub={`${pipelines.filter(p => p.status === "active").length} aktif`} color="#84CC16" icon={<GitBranch className="w-5 h-5" />} />
                <StatsCard label="Bugün Çalışan" value="6" sub="Pipeline tetiklendi" color="#3B82F6" icon={<Activity className="w-5 h-5" />} />
                <StatsCard label="Başarı Oranı" value="%96.4" sub="Son 30 gün" color="#10B981" icon={<Check className="w-5 h-5" />} />
                <StatsCard label="Ort. Süre" value="6 dk" sub="Tüm pipeline'lar" color="#F59E0B" icon={<Clock className="w-5 h-5" />} />
            </div>

            <div className="space-y-4">
                {pipelines.map(p => (
                    <div key={p.name} className="rounded-xl border bg-card p-5 card-hover">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <div className="font-semibold text-sm" style={{ color: "#84CC16" }}>{p.name}</div>
                                <div className="text-xs text-muted-foreground mt-0.5">Branch: <span className="font-mono text-blue-500">{p.branch}</span> · Son çalışma: {p.lastRun} · Süre: {p.duration}</div>
                            </div>
                            <div className="flex items-center gap-2">
                                <StatusBadge status={p.status} />
                                <Button variant="outline" size="sm" className="text-xs h-7 gap-1"><RefreshCw className="w-3 h-3" />Çalıştır</Button>
                            </div>
                        </div>
                        {/* Stage göstergesi */}
                        <div className="flex items-center gap-1">
                            {p.stages.map((stage, idx) => {
                                const passed = idx < p.passed;
                                return (
                                    <div key={stage} className="flex items-center gap-1 flex-1">
                                        <div className={`flex-1 flex items-center justify-center gap-1.5 rounded px-2 py-1.5 text-xs font-medium ${passed ? "bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400" : "bg-muted text-muted-foreground"}`}>
                                            {passed ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                                            {stage}
                                        </div>
                                        {idx < p.stages.length - 1 && <div className="w-4 h-px bg-muted-foreground/30 shrink-0" />}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            <div className="rounded-xl border bg-card overflow-hidden">
                <div className="px-5 py-4 border-b"><h2 className="font-semibold text-sm">Son Çalışmalar</h2></div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/30">
                                {["Pipeline", "Commit", "Tetikleyen", "Zaman", "Sonuç"].map(c => (
                                    <th key={c} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{c}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {recentRuns.map((r, i) => (
                                <tr key={i} className="hover:bg-muted/20 transition-colors">
                                    <td className="px-5 py-3 text-xs font-medium" style={{ color: "#84CC16" }}>{r.pipeline}</td>
                                    <td className="px-5 py-3 font-mono text-xs text-blue-500">{r.commit}</td>
                                    <td className="px-5 py-3 font-mono text-xs">{r.author}</td>
                                    <td className="px-5 py-3 text-xs text-muted-foreground">{r.time}</td>
                                    <td className="px-5 py-3"><span className={`text-xs font-semibold ${r.result === "Başarılı" ? "text-green-500" : "text-red-500"}`}>{r.result}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </PageShell>
    );
}
