"use client";

import { RefreshCw, Plus, CheckCircle, Clock, Server, Activity } from "lucide-react";
import { PageShell, StatsCard, StatusBadge } from "@/components/dashboard/page-shell";
import { Button } from "@/components/ui/button";

const deployments = [
    { id: "dep-20240304-001", app: "api-backend", env: "prod", version: "v2.4.1", strategy: "Mavi/Yeşil", status: "active" as const, duration: "2 dk 30 sn", time: "Bugün 18:20", deployer: "admin" },
    { id: "dep-20240304-002", app: "frontend-app", env: "prod", version: "v3.1.0", strategy: "Kayan", status: "active" as const, duration: "4 dk 15 sn", time: "Bugün 17:00", deployer: "deploy_bot" },
    { id: "dep-20240303-001", app: "ml-api", env: "staging", version: "v1.5.2-beta", strategy: "Anlık", status: "maintenance" as const, duration: "1 dk 05 sn", time: "Dün 14:00", deployer: "ml_bot" },
    { id: "dep-20240303-002", app: "mobile-api", env: "prod", version: "v1.3.8", strategy: "Anlık", status: "stopped" as const, duration: "—", time: "Dün 12:30", deployer: "admin" },
];

const strategyColors: Record<string, string> = { "Mavi/Yeşil": "#3B82F6", "Kayan": "#10B981", "Anlık": "#F59E0B", "Canary": "#8B5CF6" };

export default function KodDagitimiPage() {
    return (
        <PageShell
            title="Kod Dağıtımı"
            description="Uygulamalarınızı otomatik ve kontrollü şekilde üretim ortamına dağıtın (CodeDeploy eşdeğeri)"
            icon={<RefreshCw className="w-6 h-6" />}
            iconColor="#84CC16"
            breadcrumbs={[{ label: "Geliştirici Araçları" }, { label: "Kod Dağıtımı" }]}
            actions={
                <Button size="sm" className="gap-1.5 text-xs text-white" style={{ background: "linear-gradient(135deg,#FF9900,#FF6B00)", border: "none" }}>
                    <Plus className="w-3.5 h-3.5" />Dağıtım Başlat
                </Button>
            }
        >
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <StatsCard label="Bu Ay Dağıtım" value="28" sub="Toplam dağıtım" color="#84CC16" icon={<RefreshCw className="w-5 h-5" />} />
                <StatsCard label="Başarı Oranı" value="%96.4" sub="Son 30 gün" color="#10B981" icon={<CheckCircle className="w-5 h-5" />} />
                <StatsCard label="Ort. Süre" value="2 dk 54 sn" sub="Tüm stratejiler" color="#3B82F6" icon={<Clock className="w-5 h-5" />} />
                <StatsCard label="Hedef Örnek" value="22" sub="Aktif deployment" color="#8B5CF6" icon={<Server className="w-5 h-5" />} />
            </div>

            <div className="rounded-xl border bg-card overflow-hidden">
                <div className="px-5 py-4 border-b"><h2 className="font-semibold text-sm">Dağıtım Geçmişi</h2></div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/30">
                                {["Dağıtım ID", "Uygulama", "Ortam", "Sürüm", "Strateji", "Süre", "Zaman", "Yapan", "Durum"].map(c => (
                                    <th key={c} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{c}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {deployments.map(d => {
                                const sc = strategyColors[d.strategy] || "#6B7280";
                                return (
                                    <tr key={d.id} className="hover:bg-muted/20 transition-colors">
                                        <td className="px-5 py-3 font-mono text-xs text-lime-500 font-bold">{d.id}</td>
                                        <td className="px-5 py-3 text-xs font-semibold">{d.app}</td>
                                        <td className="px-5 py-3">
                                            <span className={`text-xs px-2 py-0.5 rounded font-medium ${d.env === "prod" ? "bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400" : "bg-yellow-100 dark:bg-yellow-950/30 text-yellow-600 dark:text-yellow-400"}`}>{d.env}</span>
                                        </td>
                                        <td className="px-5 py-3 font-mono text-xs text-blue-500">{d.version}</td>
                                        <td className="px-5 py-3">
                                            <span className="text-xs font-medium px-2 py-0.5 rounded" style={{ backgroundColor: `${sc}18`, color: sc }}>{d.strategy}</span>
                                        </td>
                                        <td className="px-5 py-3 text-xs text-muted-foreground">{d.duration}</td>
                                        <td className="px-5 py-3 text-xs text-muted-foreground">{d.time}</td>
                                        <td className="px-5 py-3 font-mono text-xs">{d.deployer}</td>
                                        <td className="px-5 py-3"><StatusBadge status={d.status} /></td>
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
