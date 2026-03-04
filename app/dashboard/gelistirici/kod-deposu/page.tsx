"use client";

import { FileText, Plus, GitBranch, GitCommit, Users, Clock, RefreshCw } from "lucide-react";
import { PageShell, StatsCard, StatusBadge } from "@/components/dashboard/page-shell";
import { Button } from "@/components/ui/button";

const repos = [
    { name: "ay-api-backend", lang: "Go", stars: 12, forks: 4, size: "8.4 MB", lastCommit: "Bugün 17:45", branches: 8, prs: 3, status: "active" as const },
    { name: "ay-frontend", lang: "TypeScript", stars: 28, forks: 7, size: "32 MB", lastCommit: "Bugün 16:20", branches: 12, prs: 5, status: "active" as const },
    { name: "ay-ml-platform", lang: "Python", stars: 9, forks: 2, size: "15 MB", lastCommit: "Dün 09:00", branches: 5, prs: 1, status: "active" as const },
    { name: "ay-infrastructure", lang: "HCL (Terraform)", stars: 6, forks: 1, size: "2.1 MB", lastCommit: "3 gün önce", branches: 3, prs: 0, status: "active" as const },
    { name: "ay-legacy-api", lang: "Java", stars: 3, forks: 1, size: "45 MB", lastCommit: "2 ay önce", branches: 2, prs: 0, status: "stopped" as const },
];

const langColors: Record<string, string> = { "Go": "#00ADD8", "TypeScript": "#3178C6", "Python": "#3776AB", "HCL (Terraform)": "#7B42BC", "Java": "#E76F00" };

export default function KodDeposuPage() {
    return (
        <PageShell
            title="Kod Deposu"
            description="Git tabanlı kaynak kodu depolarını yönetin — branch'ler, PR'lar ve commit geçmişi"
            icon={<FileText className="w-6 h-6" />}
            iconColor="#84CC16"
            breadcrumbs={[{ label: "Geliştirici Araçları" }, { label: "Kod Deposu" }]}
            actions={
                <Button size="sm" className="gap-1.5 text-xs text-white" style={{ background: "linear-gradient(135deg,#FF9900,#FF6B00)", border: "none" }}>
                    <Plus className="w-3.5 h-3.5" />Depo Oluştur
                </Button>
            }
        >
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <StatsCard label="Depo Sayısı" value={String(repos.length)} sub={`${repos.filter(r => r.status === "active").length} aktif`} color="#84CC16" icon={<FileText className="w-5 h-5" />} />
                <StatsCard label="Toplam Branch" value={String(repos.reduce((s, r) => s + r.branches, 0))} color="#3B82F6" icon={<GitBranch className="w-5 h-5" />} />
                <StatsCard label="Açık PR" value={String(repos.reduce((s, r) => s + r.prs, 0))} sub="İnceleme bekliyor" color="#F59E0B" icon={<GitCommit className="w-5 h-5" />} />
                <StatsCard label="Katkıda Bulunan" value="12" color="#8B5CF6" icon={<Users className="w-5 h-5" />} />
            </div>

            <div className="space-y-3">
                {repos.map(r => {
                    const lc = langColors[r.lang] || "#6B7280";
                    return (
                        <div key={r.name} className="rounded-xl border bg-card p-5 card-hover">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-sm font-bold font-mono" style={{ color: "#84CC16" }}>{r.name}</span>
                                        <span className="text-xs px-2 py-0.5 rounded-full font-mono font-medium" style={{ backgroundColor: `${lc}18`, color: lc }}>{r.lang}</span>
                                        <StatusBadge status={r.status} />
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs text-muted-foreground">
                                        <span>⭐ {r.stars} yıldız</span>
                                        <span>🍴 {r.forks} fork</span>
                                        <span>📁 {r.size}</span>
                                        <span>🌿 {r.branches} branch</span>
                                        <span>🔀 {r.prs} açık PR</span>
                                    </div>
                                </div>
                                <div className="text-right ml-4 shrink-0">
                                    <div className="text-xs text-muted-foreground flex items-center gap-1 justify-end"><Clock className="w-3 h-3" />{r.lastCommit}</div>
                                    <Button variant="outline" size="sm" className="text-xs h-7 mt-2"><RefreshCw className="w-3 h-3 mr-1" />Aç</Button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </PageShell>
    );
}
