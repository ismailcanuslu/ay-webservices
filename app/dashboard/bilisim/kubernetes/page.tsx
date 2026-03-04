"use client";

import { Layers, Plus, RefreshCw, Activity, Server, Globe, HardDrive, AlertTriangle } from "lucide-react";
import { PageShell, StatsCard, StatusBadge } from "@/components/dashboard/page-shell";
import { Button } from "@/components/ui/button";

const clusters = [
    { name: "prod-k8s-cluster", version: "1.28.5", nodes: 12, running: 89, pending: 2, failed: 0, region: "eu-west-1", status: "active" as const },
    { name: "staging-k8s-cluster", version: "1.29.0", nodes: 4, running: 23, pending: 0, failed: 1, region: "eu-west-1", status: "maintenance" as const },
    { name: "ml-training-cluster", version: "1.28.5", nodes: 6, running: 14, pending: 3, failed: 0, region: "us-east-1", status: "active" as const },
];

const namespaces = [
    { name: "production", pods: 58, services: 12, deployments: 8, cpu: "34.2 vCPU", memory: "87 GB" },
    { name: "staging", pods: 24, services: 7, deployments: 5, cpu: "12.4 vCPU", memory: "32 GB" },
    { name: "monitoring", pods: 15, services: 6, deployments: 4, cpu: "8.1 vCPU", memory: "18 GB" },
    { name: "kube-system", pods: 18, services: 9, deployments: 6, cpu: "4.2 vCPU", memory: "8 GB" },
    { name: "ml-jobs", pods: 14, services: 3, deployments: 2, cpu: "48 vCPU", memory: "192 GB" },
];

export default function KubernetesPage() {
    return (
        <PageShell
            title="Kubernetes Yönetimi"
            description="Yönetilen Kubernetes kümeleri ve uygulamalarınızı denetleyin (EKS eşdeğeri)"
            icon={<Layers className="w-6 h-6" />}
            iconColor="#326CE5"
            breadcrumbs={[{ label: "Bilişim & İşlem" }, { label: "Kubernetes Yönetimi" }]}
            actions={
                <Button size="sm" className="gap-1.5 text-xs text-white" style={{ background: "linear-gradient(135deg,#FF9900,#FF6B00)", border: "none" }}>
                    <Plus className="w-3.5 h-3.5" />Küme Oluştur
                </Button>
            }
        >
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <StatsCard label="Küme Sayısı" value="3" sub="2 bölgede" color="#326CE5" icon={<Layers className="w-5 h-5" />} />
                <StatsCard label="Toplam Düğüm" value="22" sub="Çalışan worker" color="#10B981" icon={<Server className="w-5 h-5" />} />
                <StatsCard label="Çalışan Pod" value="126" sub="3 kümede" color="#F59E0B" icon={<Activity className="w-5 h-5" />} />
                <StatsCard label="Namespace" value={String(namespaces.length)} sub="Tüm kümeler" color="#8B5CF6" icon={<Globe className="w-5 h-5" />} />
            </div>

            {/* Kümeler */}
            <div className="space-y-3">
                {clusters.map(c => (
                    <div key={c.name} className="rounded-xl border bg-card p-5 card-hover">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[#326CE5]/10 flex items-center justify-center">
                                    <Layers className="w-5 h-5" style={{ color: "#326CE5" }} />
                                </div>
                                <div>
                                    <div className="font-semibold text-sm font-mono" style={{ color: "#326CE5" }}>{c.name}</div>
                                    <div className="text-xs text-muted-foreground">Kubernetes {c.version} · {c.region} · {c.nodes} düğüm</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <StatusBadge status={c.status} />
                                <button className="text-xs text-orange-500 hover:text-orange-600 font-medium transition-colors">Yönet →</button>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-muted/40 rounded-lg p-3">
                                <div className="text-xs text-muted-foreground mb-1">Çalışan Podlar</div>
                                <div className="text-xl font-bold text-green-500">{c.running}</div>
                            </div>
                            <div className="bg-muted/40 rounded-lg p-3">
                                <div className="text-xs text-muted-foreground mb-1">Bekleyen Podlar</div>
                                <div className="text-xl font-bold text-yellow-500">{c.pending}</div>
                            </div>
                            <div className="bg-muted/40 rounded-lg p-3">
                                <div className="text-xs text-muted-foreground mb-1">Hatalı Podlar</div>
                                <div className={`text-xl font-bold ${c.failed > 0 ? "text-red-500" : "text-muted-foreground"}`}>{c.failed}</div>
                            </div>
                        </div>
                        {c.failed > 0 && (
                            <div className="mt-3 flex items-center gap-2 text-xs text-red-600 dark:text-red-400">
                                <AlertTriangle className="w-3.5 h-3.5" />{c.failed} pod başlatılamıyor — incelemeniz önerilir
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Namespace tablosu */}
            <div className="rounded-xl border bg-card overflow-hidden">
                <div className="px-5 py-4 border-b">
                    <h2 className="font-semibold text-sm">Namespace Özeti</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/30">
                                {["Namespace", "Pod", "Servis", "Deployment", "CPU", "Bellek"].map(c => (
                                    <th key={c} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{c}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {namespaces.map(ns => (
                                <tr key={ns.name} className="hover:bg-muted/20 transition-colors">
                                    <td className="px-5 py-3 font-mono text-xs font-semibold" style={{ color: "#326CE5" }}>{ns.name}</td>
                                    <td className="px-5 py-3 text-sm font-medium">{ns.pods}</td>
                                    <td className="px-5 py-3 text-xs text-muted-foreground">{ns.services}</td>
                                    <td className="px-5 py-3 text-xs text-muted-foreground">{ns.deployments}</td>
                                    <td className="px-5 py-3 text-xs text-orange-500 font-mono">{ns.cpu}</td>
                                    <td className="px-5 py-3 text-xs text-blue-500 font-mono">{ns.memory}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </PageShell>
    );
}
