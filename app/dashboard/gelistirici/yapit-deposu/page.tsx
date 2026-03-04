"use client";

import { Archive, Plus, Package, HardDrive, Activity, RefreshCw, Download } from "lucide-react";
import { PageShell, StatsCard, StatusBadge } from "@/components/dashboard/page-shell";
import { Button } from "@/components/ui/button";

const repositories = [
    { name: "docker-internal", type: "Docker", images: 24, size: "8.4 GB", pulls: "1.2K/gün", status: "active" as const },
    { name: "npm-private", type: "npm", images: 48, size: "2.1 GB", pulls: "4.5K/gün", status: "active" as const },
    { name: "pypi-internal", type: "PyPI", images: 12, size: "890 MB", pulls: "340/gün", status: "active" as const },
    { name: "maven-central", type: "Maven", images: 8, size: "1.2 GB", pulls: "120/gün", status: "active" as const },
];

const artifacts = [
    { name: "api-backend", version: "v2.4.1", repo: "docker-internal", size: "124 MB", pushed: "Bugün 18:15", type: "Docker İmajı" },
    { name: "frontend-app", version: "v3.1.0", repo: "npm-private", size: "2.4 MB", pushed: "Bugün 17:05", type: "npm Paketi" },
    { name: "ml-trainer", version: "v1.5.2-beta", repo: "docker-internal", size: "4.2 GB", pushed: "Dün 02:30", type: "Docker İmajı" },
    { name: "@ay/ui-kit", version: "v0.9.4", repo: "npm-private", size: "890 KB", pushed: "3 gün önce", type: "npm Paketi" },
    { name: "ay-shared-lib", version: "1.0.8", repo: "pypi-internal", size: "45 KB", pushed: "Bir hafta önce", type: "Python Paketi" },
];

const typeColors: Record<string, string> = { "Docker İmajı": "#2496ED", "npm Paketi": "#CB3837", "Python Paketi": "#3776AB", "Maven Artefaktı": "#E76F00" };

export default function YapitDeposuPage() {
    return (
        <PageShell
            title="Yapıt Deposu"
            description="Docker imajları, npm paketleri ve diğer yapıtları güvenli şekilde depolayın ve dağıtın"
            icon={<Archive className="w-6 h-6" />}
            iconColor="#84CC16"
            breadcrumbs={[{ label: "Geliştirici Araçları" }, { label: "Yapıt Deposu" }]}
            actions={
                <Button size="sm" className="gap-1.5 text-xs text-white" style={{ background: "linear-gradient(135deg,#FF9900,#FF6B00)", border: "none" }}>
                    <Plus className="w-3.5 h-3.5" />Depo Oluştur
                </Button>
            }
        >
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <StatsCard label="Depo Sayısı" value={String(repositories.length)} color="#84CC16" icon={<Package className="w-5 h-5" />} />
                <StatsCard label="Toplam Yapıt" value="92" sub="Tüm depolar" color="#10B981" icon={<Archive className="w-5 h-5" />} />
                <StatsCard label="Toplam Boyut" value="12.6 GB" color="#3B82F6" icon={<HardDrive className="w-5 h-5" />} />
                <StatsCard label="İndirme/Gün" value="6.1K" sub="Toplam pull" color="#F59E0B" icon={<Download className="w-5 h-5" />} />
            </div>

            {/* Depo kartları */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {repositories.map(r => (
                    <div key={r.name} className="rounded-xl border bg-card p-4 card-hover">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold font-mono text-lime-500">{r.name}</span>
                            <StatusBadge status={r.status} />
                        </div>
                        <div className="space-y-1 text-xs">
                            <div className="text-muted-foreground">Tür: <span className="font-medium">{r.type}</span></div>
                            <div className="text-muted-foreground">Paket: <span className="font-medium">{r.images}</span></div>
                            <div className="text-muted-foreground">Boyut: <span className="font-medium">{r.size}</span></div>
                            <div className="text-orange-500 font-medium">{r.pulls}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Son yapıtlar */}
            <div className="rounded-xl border bg-card overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b">
                    <h2 className="font-semibold text-sm">Son Yüklenen Yapıtlar</h2>
                    <Button variant="outline" size="sm" className="text-xs h-8 gap-1"><RefreshCw className="w-3 h-3" />Yenile</Button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/30">
                                {["Yapıt Adı", "Sürüm", "Depo", "Tür", "Boyut", "Yüklenme"].map(c => (
                                    <th key={c} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{c}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {artifacts.map(a => {
                                const tc = typeColors[a.type] || "#6B7280";
                                return (
                                    <tr key={`${a.name}-${a.version}`} className="hover:bg-muted/20 transition-colors">
                                        <td className="px-5 py-3 font-mono text-xs font-semibold text-lime-500">{a.name}</td>
                                        <td className="px-5 py-3 font-mono text-xs text-blue-500">{a.version}</td>
                                        <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{a.repo}</td>
                                        <td className="px-5 py-3">
                                            <span className="text-xs font-medium px-2 py-0.5 rounded" style={{ backgroundColor: `${tc}18`, color: tc }}>{a.type}</span>
                                        </td>
                                        <td className="px-5 py-3 text-xs font-medium">{a.size}</td>
                                        <td className="px-5 py-3 text-xs text-muted-foreground">{a.pushed}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </PageShell>
    );
}
