"use client";

import { Box, Plus, Activity, HardDrive, Layers, RefreshCw, Server } from "lucide-react";
import { PageShell, StatsCard, StatusBadge } from "@/components/dashboard/page-shell";
import { Button } from "@/components/ui/button";

const services = [
    { name: "web-frontend", image: "nginx:1.25-alpine", replicas: "3/3", cpu: "0.25 vCPU", memory: "128 MB", port: 80, cluster: "prod-cluster", status: "active" as const },
    { name: "api-backend", image: "node:20-alpine", replicas: "5/5", cpu: "0.5 vCPU", memory: "512 MB", port: 3000, cluster: "prod-cluster", status: "active" as const },
    { name: "worker-service", image: "python:3.11-slim", replicas: "4/4", cpu: "1 vCPU", memory: "1 GB", port: null, cluster: "prod-cluster", status: "active" as const },
    { name: "redis-sidecar", image: "redis:7-alpine", replicas: "1/1", cpu: "0.1 vCPU", memory: "256 MB", port: 6379, cluster: "prod-cluster", status: "active" as const },
    { name: "analytics-ingester", image: "custom/ingest:v2.1", replicas: "2/2", cpu: "0.5 vCPU", memory: "512 MB", port: null, cluster: "analytics-cluster", status: "active" as const },
    { name: "email-processor", image: "custom/mailer:v1.4", replicas: "0/1", cpu: "0.25 vCPU", memory: "256 MB", port: null, cluster: "prod-cluster", status: "stopped" as const },
];

export default function KonteynerServisiPage() {
    return (
        <PageShell
            title="Konteyner Servisi"
            description="Docker konteynerlarını kolayca çalıştırın ve ölçeklendirin (ECS eşdeğeri)"
            icon={<Box className="w-6 h-6" />}
            iconColor="#3B82F6"
            breadcrumbs={[{ label: "Bilişim & İşlem" }, { label: "Konteyner Servisi" }]}
            actions={
                <Button size="sm" className="gap-1.5 text-xs text-white" style={{ background: "linear-gradient(135deg,#FF9900,#FF6B00)", border: "none" }}>
                    <Plus className="w-3.5 h-3.5" />Servis Oluştur
                </Button>
            }
        >
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <StatsCard label="Toplam Servis" value={String(services.length)} sub="2 kümede" color="#3B82F6" icon={<Box className="w-5 h-5" />} />
                <StatsCard label="Çalışan Konteyner" value="15" sub="Toplam replika" color="#10B981" icon={<Activity className="w-5 h-5" />} />
                <StatsCard label="Toplam CPU" value="7.85 vCPU" sub="Ayrılmış" color="#F59E0B" icon={<HardDrive className="w-5 h-5" />} />
                <StatsCard label="Küme Sayısı" value="2" sub="prod, analytics" color="#8B5CF6" icon={<Layers className="w-5 h-5" />} />
            </div>

            {/* Küme grupları */}
            {["prod-cluster", "analytics-cluster"].map(cluster => {
                const clusterServices = services.filter(s => s.cluster === cluster);
                return (
                    <div key={cluster} className="rounded-xl border bg-card overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-4 border-b">
                            <div className="flex items-center gap-2">
                                <Layers className="w-4 h-4 text-blue-500" />
                                <h2 className="font-semibold text-sm font-mono">{cluster}</h2>
                                <span className="text-xs bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">{clusterServices.length} servis</span>
                            </div>
                            <Button variant="outline" size="sm" className="text-xs h-8 gap-1"><RefreshCw className="w-3 h-3" />Yenile</Button>
                        </div>
                        <div className="divide-y divide-border">
                            {clusterServices.map(svc => (
                                <div key={svc.name} className="flex items-center gap-4 px-5 py-3 hover:bg-muted/20 transition-colors">
                                    <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/30 flex items-center justify-center shrink-0">
                                        <Box className="w-4 h-4 text-blue-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-sm">{svc.name}</div>
                                        <div className="text-xs font-mono text-muted-foreground">{svc.image}</div>
                                    </div>
                                    <div className="text-center hidden md:block">
                                        <div className="text-xs text-muted-foreground">Replika</div>
                                        <div className="text-sm font-semibold">{svc.replicas}</div>
                                    </div>
                                    <div className="text-center hidden lg:block">
                                        <div className="text-xs text-muted-foreground">CPU</div>
                                        <div className="text-sm font-medium">{svc.cpu}</div>
                                    </div>
                                    <div className="text-center hidden lg:block">
                                        <div className="text-xs text-muted-foreground">Bellek</div>
                                        <div className="text-sm font-medium">{svc.memory}</div>
                                    </div>
                                    {svc.port && (
                                        <div className="text-center hidden xl:block">
                                            <div className="text-xs text-muted-foreground">Port</div>
                                            <div className="text-sm font-mono text-cyan-500">:{svc.port}</div>
                                        </div>
                                    )}
                                    <StatusBadge status={svc.status} />
                                    <button className="text-xs text-orange-500 hover:text-orange-600 font-medium text-nowrap transition-colors ml-2">Yönet →</button>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </PageShell>
    );
}
