"use client";

import { Code2, Plus, GitBranch, Clock, CheckCircle, Activity, RefreshCw } from "lucide-react";
import { PageShell, StatsCard, StatusBadge } from "@/components/dashboard/page-shell";
import { Button } from "@/components/ui/button";

const builds = [
    { id: "bld-2024030401", project: "api-backend", branch: "main", commit: "a3b4c5d", status: "active" as const, duration: "4 dk 12 sn", time: "Bugün 18:10", logs: 248 },
    { id: "bld-2024030402", project: "frontend-app", branch: "develop", commit: "e6f7a8b", status: "active" as const, duration: "2 dk 45 sn", time: "Bugün 17:55", logs: 134 },
    { id: "bld-2024030403", project: "ml-trainer", branch: "ml-main", commit: "c9d0e1f", status: "maintenance" as const, duration: "45 dk 30 sn", time: "Dün 02:00", logs: 1893 },
    { id: "bld-2024030404", project: "mobile-api", branch: "feature/auth", commit: "2a3b4c5", status: "stopped" as const, duration: "1 dk 23 sn", time: "Bugün 15:40", logs: 89 },
];

const buildEnvs = [
    { name: "Node.js 20", uses: 42 }, { name: "Python 3.11", uses: 38 },
    { name: "Go 1.22", uses: 12 }, { name: "Java 21", uses: 8 },
];

export default function KodDerlemePage() {
    return (
        <PageShell
            title="Kod Derleme"
            description="Kaynak kodu derleyin, test edin ve dağıtım paketleri oluşturun (CodeBuild eşdeğeri)"
            icon={<Code2 className="w-6 h-6" />}
            iconColor="#84CC16"
            breadcrumbs={[{ label: "Geliştirici Araçları" }, { label: "Kod Derleme" }]}
            actions={
                <Button size="sm" className="gap-1.5 text-xs text-white" style={{ background: "linear-gradient(135deg,#FF9900,#FF6B00)", border: "none" }}>
                    <Plus className="w-3.5 h-3.5" />Derleme Başlat
                </Button>
            }
        >
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <StatsCard label="Bugün Derleme" value="12" sub="Toplam tetikleme" color="#84CC16" icon={<Code2 className="w-5 h-5" />} />
                <StatsCard label="Başarılı" value="11" sub="%91.6 başarı" color="#10B981" icon={<CheckCircle className="w-5 h-5" />} />
                <StatsCard label="Ort. Süre" value="8 dk" sub="Genel ortalama" color="#3B82F6" icon={<Clock className="w-5 h-5" />} />
                <StatsCard label="Eşzamanlı" value="2" sub="Aktif derleme" color="#F59E0B" icon={<Activity className="w-5 h-5" />} />
            </div>

            <div className="rounded-xl border bg-card overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b">
                    <h2 className="font-semibold text-sm">Derleme Geçmişi</h2>
                    <Button variant="outline" size="sm" className="text-xs h-8 gap-1"><RefreshCw className="w-3 h-3" />Yenile</Button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/30">
                                {["Derleme ID", "Proje", "Branch", "Commit", "Süre", "Zaman", "Log Satırı", "Durum"].map(c => (
                                    <th key={c} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{c}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {builds.map(b => (
                                <tr key={b.id} className="hover:bg-muted/20 transition-colors">
                                    <td className="px-5 py-3 font-mono text-xs text-lime-500 font-bold">{b.id}</td>
                                    <td className="px-5 py-3 text-xs font-semibold">{b.project}</td>
                                    <td className="px-5 py-3 font-mono text-xs text-blue-500">{b.branch}</td>
                                    <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{b.commit}</td>
                                    <td className="px-5 py-3 text-xs">{b.duration}</td>
                                    <td className="px-5 py-3 text-xs text-muted-foreground">{b.time}</td>
                                    <td className="px-5 py-3 text-xs text-muted-foreground">{b.logs}</td>
                                    <td className="px-5 py-3"><StatusBadge status={b.status} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="rounded-xl border bg-card p-5">
                <h3 className="font-semibold text-sm mb-4">Derleme Ortamları</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {buildEnvs.map(e => (
                        <div key={e.name} className="bg-muted/40 rounded-lg p-3">
                            <div className="text-sm font-semibold">{e.name}</div>
                            <div className="text-xs text-muted-foreground mt-1">{e.uses} derleme</div>
                        </div>
                    ))}
                </div>
            </div>
        </PageShell>
    );
}
