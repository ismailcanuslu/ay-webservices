"use client";

import { RefreshCw, Plus, Activity, Server, Globe, Zap, ArrowRight, Shield } from "lucide-react";
import { PageShell, StatsCard, StatusBadge } from "@/components/dashboard/page-shell";
import { Button } from "@/components/ui/button";

const lbs = [
    { name: "prod-alb-main", type: "Uygulama (ALB)", dns: "prod-alb-main-12345.eu-west-1.elb.amazonaws.com", az: "Çok AZ", targets: 5, healthy: 5, requests: "12.4K/sn", status: "active" as const },
    { name: "prod-nlb-db", type: "Ağ (NLB)", dns: "prod-nlb-db-67890.eu-west-1.elb.amazonaws.com", az: "Çok AZ", targets: 2, healthy: 2, requests: "890/sn", status: "active" as const },
    { name: "staging-alb", type: "Uygulama (ALB)", dns: "staging-alb-11111.eu-west-1.elb.amazonaws.com", az: "eu-west-1a", targets: 2, healthy: 2, requests: "120/sn", status: "active" as const },
    { name: "internal-alb", type: "Uygulama (ALB)", dns: "internal-alb-22222.eu-west-1.elb.amazonaws.com", az: "Çok AZ", targets: 8, healthy: 7, requests: "4.2K/sn", status: "maintenance" as const },
];

const listenerRules = [
    { lb: "prod-alb-main", priority: 1, condition: "Yol: /api/*", action: "api-target-group", weight: "—" },
    { lb: "prod-alb-main", priority: 2, condition: "Host: api.ayws.com", action: "api-backend-tg", weight: "—" },
    { lb: "prod-alb-main", priority: 3, condition: "Yol: /static/*", action: "static-tg", weight: "30%" },
    { lb: "prod-alb-main", priority: 10, condition: "Varsayılan", action: "web-frontend-tg", weight: "—" },
];

export default function YukDengeleyiciPage() {
    return (
        <PageShell
            title="Yük Dengeleyici"
            description="Gelen trafiği birden fazla hedef arasında dağıtarak yüksek kullanılabilirlik sağlayın"
            icon={<RefreshCw className="w-6 h-6" />}
            iconColor="#06B6D4"
            breadcrumbs={[{ label: "Ağ" }, { label: "Yük Dengeleyici" }]}
            actions={
                <Button size="sm" className="gap-1.5 text-xs text-white" style={{ background: "linear-gradient(135deg,#FF9900,#FF6B00)", border: "none" }}>
                    <Plus className="w-3.5 h-3.5" />Yük Dengeleyici Oluştur
                </Button>
            }
        >
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <StatsCard label="Toplam LB" value={String(lbs.length)} sub={`${lbs.filter(l => l.status === "active").length} aktif`} color="#06B6D4" icon={<RefreshCw className="w-5 h-5" />} />
                <StatsCard label="Toplam Hedef" value={String(lbs.reduce((s, l) => s + l.targets, 0))} sub="Kayıtlı hedef" color="#10B981" icon={<Server className="w-5 h-5" />} />
                <StatsCard label="Sağlıklı" value={String(lbs.reduce((s, l) => s + l.healthy, 0))} sub="Sağlık kontrolü geçti" color="#3B82F6" icon={<Activity className="w-5 h-5" />} />
                <StatsCard label="İstek/Sn" value="17.6K" sub="Toplam throughput" color="#F59E0B" icon={<Zap className="w-5 h-5" />} />
            </div>

            {/* LB Kartları */}
            <div className="space-y-3">
                {lbs.map(lb => (
                    <div key={lb.name} className="rounded-xl border bg-card p-5 card-hover">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-cyan-100 dark:bg-cyan-950/30 flex items-center justify-center">
                                    <RefreshCw className="w-4.5 h-4.5" style={{ color: "#06B6D4" }} />
                                </div>
                                <div>
                                    <div className="font-semibold text-sm font-mono text-cyan-500">{lb.name}</div>
                                    <div className="text-[10px] font-mono text-muted-foreground truncate max-w-[320px]">{lb.dns}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs bg-cyan-100 dark:bg-cyan-950/30 text-cyan-600 dark:text-cyan-400 px-2 py-0.5 rounded font-medium">{lb.type}</span>
                                <StatusBadge status={lb.status} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Kullanılabilirlik Alanı</p>
                                <p className="text-sm font-medium">{lb.az}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Hedef Sağlığı</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-green-500">{lb.healthy}</span>
                                    <span className="text-xs text-muted-foreground">/ {lb.targets} sağlıklı</span>
                                    {lb.healthy < lb.targets && <Shield className="w-3.5 h-3.5 text-red-500" />}
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">İstek/Sn</p>
                                <p className="text-sm font-bold text-cyan-500">{lb.requests}</p>
                            </div>
                            <div className="flex items-center justify-end">
                                <button className="text-xs text-orange-500 hover:text-orange-600 font-medium transition-colors">Yönet →</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Listener rules */}
            <div className="rounded-xl border bg-card overflow-hidden">
                <div className="px-5 py-4 border-b"><h2 className="font-semibold text-sm">Yönlendirme Kuralları (prod-alb-main)</h2></div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/30">
                                {["Öncelik", "Koşul", "Aksiyon", "Ağırlık"].map(c => (
                                    <th key={c} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">{c}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {listenerRules.map((r, i) => (
                                <tr key={i} className="hover:bg-muted/20 transition-colors">
                                    <td className="px-5 py-3">
                                        <span className="w-7 h-7 rounded-lg bg-cyan-100 dark:bg-cyan-950/30 text-cyan-600 dark:text-cyan-400 font-bold text-xs flex items-center justify-center">{r.priority}</span>
                                    </td>
                                    <td className="px-5 py-3 text-xs font-mono">{r.condition}</td>
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-1.5">
                                            <ArrowRight className="w-3 h-3 text-muted-foreground" />
                                            <span className="text-xs font-mono text-green-500">{r.action}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3 text-xs text-muted-foreground">{r.weight}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </PageShell>
    );
}
