"use client";

import { RefreshCw, Plus, Play, CheckCircle, XCircle, Clock, Activity } from "lucide-react";
import { PageShell, StatsCard, StatusBadge } from "@/components/dashboard/page-shell";
import { Button } from "@/components/ui/button";

const runbooks = [
    { name: "EC2 Otomatik Ölçeklendirme", trigger: "CPU > %80, 5 dk", lastRun: "Bugün 17:30", runs: 145, success: 145, status: "active" as const },
    { name: "Veritabanı Yedekleme", trigger: "Cron: her gece 03:00", lastRun: "Bugün 03:00", runs: 90, success: 90, status: "active" as const },
    { name: "Log Rotasyonu", trigger: "Cron: Her Pazar", lastRun: "3 gün önce", runs: 12, success: 12, status: "active" as const },
    { name: "Güvenlik Tarama", trigger: "Manuel", lastRun: "1 gün önce", runs: 8, success: 7, status: "active" as const },
    { name: "SSL Sertifika Yenileme", trigger: "30 gün kalmışsa", lastRun: "Hiç çalışmadı", runs: 0, success: 0, status: "maintenance" as const },
];

const recentRuns = [
    { runbook: "EC2 Otomatik Ölçeklendirme", time: "17:30:12", duration: "2 dk 14 sn", result: "Başarılı", action: "2 örnek eklendi" },
    { runbook: "Veritabanı Yedekleme", time: "03:00:00", duration: "12 dk 45 sn", result: "Başarılı", action: "5 GB yedek alındı" },
    { runbook: "Güvenlik Tarama", time: "Dün 14:20", duration: "8 dk 30 sn", result: "Başarılı", action: "3 bulgu tespit edildi" },
    { runbook: "Log Rotasyonu", time: "3 gün önce", duration: "45 sn", result: "Başarılı", action: "12 GB log arşivlendi" },
];

export default function OtomasyonPage() {
    return (
        <PageShell
            title="Otomasyon"
            description="Tekrarlayan altyapı görevlerini otomatikleştirin ve runbook'ları yönetin (Systems Manager eşdeğeri)"
            icon={<RefreshCw className="w-6 h-6" />}
            iconColor="#84CC16"
            breadcrumbs={[{ label: "Yönetim" }, { label: "Otomasyon" }]}
            actions={
                <Button size="sm" className="gap-1.5 text-xs text-white" style={{ background: "linear-gradient(135deg,#FF9900,#FF6B00)", border: "none" }}>
                    <Plus className="w-3.5 h-3.5" />Runbook Oluştur
                </Button>
            }
        >
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <StatsCard label="Toplam Runbook" value={String(runbooks.length)} sub={`${runbooks.filter(r => r.status === "active").length} aktif`} color="#84CC16" icon={<RefreshCw className="w-5 h-5" />} />
                <StatsCard label="Toplam Çalışma" value={String(runbooks.reduce((s, r) => s + r.runs, 0))} sub="Tüm zamanlar" color="#3B82F6" icon={<Activity className="w-5 h-5" />} />
                <StatsCard label="Başarı Oranı" value="%99.2" sub="Ortalama" color="#10B981" icon={<CheckCircle className="w-5 h-5" />} />
                <StatsCard label="Başarısız" value="1" sub="Son 30 gün" color="#EF4444" icon={<XCircle className="w-5 h-5" />} />
            </div>

            <div className="rounded-xl border bg-card overflow-hidden">
                <div className="px-5 py-4 border-b"><h2 className="font-semibold text-sm">Runbook'lar</h2></div>
                <div className="divide-y divide-border">
                    {runbooks.map(r => (
                        <div key={r.name} className="flex items-center gap-4 px-5 py-3 hover:bg-muted/20 transition-colors">
                            <div className="flex-1">
                                <div className="text-xs font-semibold" style={{ color: "#84CC16" }}>{r.name}</div>
                                <div className="text-xs text-muted-foreground mt-0.5">Tetikleyici: {r.trigger}</div>
                            </div>
                            <div className="text-center hidden md:block">
                                <div className="text-xs text-muted-foreground">Son Çalışma</div>
                                <div className="text-xs font-medium"><Clock className="w-3 h-3 inline mr-1" />{r.lastRun}</div>
                            </div>
                            <div className="text-center">
                                <div className="text-xs text-muted-foreground">Başarı</div>
                                <div className="text-xs font-semibold text-green-500">{r.success}/{r.runs}</div>
                            </div>
                            <StatusBadge status={r.status} />
                            <Button variant="outline" size="sm" className="text-xs h-7 gap-1"><Play className="w-3 h-3" />Çalıştır</Button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="rounded-xl border bg-card overflow-hidden">
                <div className="px-5 py-4 border-b"><h2 className="font-semibold text-sm">Son Çalışma Geçmişi</h2></div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/30">
                                {["Runbook", "Çalışma Zamanı", "Süre", "Sonuç", "Gerçekleştirilen Eylem"].map(c => (
                                    <th key={c} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{c}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {recentRuns.map((r, i) => (
                                <tr key={i} className="hover:bg-muted/20 transition-colors">
                                    <td className="px-5 py-3 text-xs font-medium" style={{ color: "#84CC16" }}>{r.runbook}</td>
                                    <td className="px-5 py-3 text-xs font-mono text-muted-foreground">{r.time}</td>
                                    <td className="px-5 py-3 text-xs text-muted-foreground">{r.duration}</td>
                                    <td className="px-5 py-3"><span className="text-xs font-semibold text-green-500">{r.result}</span></td>
                                    <td className="px-5 py-3 text-xs text-muted-foreground">{r.action}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </PageShell>
    );
}
