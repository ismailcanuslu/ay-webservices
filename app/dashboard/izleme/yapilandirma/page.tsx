"use client";

import { Settings, RefreshCw, CheckCircle, XCircle, Activity, FileText, AlertTriangle } from "lucide-react";
import { PageShell, StatsCard, StatusBadge } from "@/components/dashboard/page-shell";
import { Button } from "@/components/ui/button";

const resources = [
    { id: "EC2 i-08fa3c1a", type: "Sanal Makine", config: "c5.xlarge / Ubuntu 22.04", compliant: true, rules: 12, violations: 0, lastEval: "5 dk önce" },
    { id: "S3 ay-dev-temp", type: "Nesne Depolama", config: "Genel erişim açık", compliant: false, rules: 8, violations: 2, lastEval: "5 dk önce" },
    { id: "RDS db-prod-main-01", type: "Veritabanı", config: "PostgreSQL 16.2", compliant: true, rules: 10, violations: 0, lastEval: "10 dk önce" },
    { id: "SG sg-web-prod", type: "Güvenlik Grubu", config: "22 portu açık", compliant: false, rules: 6, violations: 1, lastEval: "5 dk önce" },
    { id: "CloudTrail prod-trail", type: "İz Kaydı", config: "Tüm bölgeler aktif", compliant: true, rules: 5, violations: 0, lastEval: "15 dk önce" },
];

const rules = [
    { name: "S3 genel erişim engeli aktif olmalı", category: "S3", compliant: 5, noncompliant: 1 },
    { name: "Şifreli EBS birimler", category: "EC2", compliant: 4, noncompliant: 1 },
    { name: "MFA zorunluluğu (IAM)", category: "IAM", compliant: 4, noncompliant: 1 },
    { name: "CloudTrail tüm bölgelerde aktif", category: "Denetim", compliant: 3, noncompliant: 0 },
];

export default function YapilandirmaYonetimiPage() {
    const complianceRate = Math.round((resources.filter(r => r.compliant).length / resources.length) * 100);
    return (
        <PageShell
            title="Yapılandırma Yönetimi"
            description="Kaynak yapılandırmalarını izleyin, değişiklikleri takip edin ve uyumluluk politikalarını uygulayın"
            icon={<Settings className="w-6 h-6" />}
            iconColor="#64748B"
            breadcrumbs={[{ label: "Yönetim" }, { label: "Yapılandırma Yönetimi" }]}
            actions={<Button variant="outline" size="sm" className="gap-1.5 text-xs"><RefreshCw className="w-3.5 h-3.5" />Tara</Button>}
        >
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <StatsCard label="İzlenen Kaynak" value={String(resources.length)} color="#64748B" icon={<Activity className="w-5 h-5" />} />
                <StatsCard label="Uyumlu" value={String(resources.filter(r => r.compliant).length)} sub={`%${complianceRate} uyum oranı`} color="#10B981" icon={<CheckCircle className="w-5 h-5" />} />
                <StatsCard label="Uyumsuz" value={String(resources.filter(r => !r.compliant).length)} sub="Düzeltme gerekiyor" color="#EF4444" icon={<XCircle className="w-5 h-5" />} />
                <StatsCard label="Aktif Kural" value={String(rules.length)} color="#8B5CF6" icon={<FileText className="w-5 h-5" />} />
            </div>

            <div className="rounded-xl border bg-card overflow-hidden">
                <div className="px-5 py-4 border-b"><h2 className="font-semibold text-sm">Kaynak Uyumluluk Durumu</h2></div>
                <div className="divide-y divide-border">
                    {resources.map(r => (
                        <div key={r.id} className="flex items-center gap-4 px-5 py-3 hover:bg-muted/20 transition-colors">
                            <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${r.compliant ? "bg-green-500" : "bg-red-500 animate-pulse"}`} />
                            <div className="flex-1">
                                <div className="font-mono text-xs font-semibold">{r.id}</div>
                                <div className="text-xs text-muted-foreground">{r.type} · {r.config}</div>
                            </div>
                            <div className="text-right">
                                <div className={`text-xs font-semibold ${r.compliant ? "text-green-500" : "text-red-500"}`}>{r.compliant ? "Uyumlu" : "Uyumsuz"}</div>
                                {r.violations > 0 && <div className="text-xs text-red-500">{r.violations} ihlal</div>}
                            </div>
                            <div className="text-xs text-muted-foreground w-24 text-right">{r.lastEval}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="rounded-xl border bg-card p-5">
                <h3 className="font-semibold text-sm mb-4">Uyumluluk Kuralları</h3>
                <div className="space-y-3">
                    {rules.map(r => {
                        const total = r.compliant + r.noncompliant;
                        const pct = Math.round((r.compliant / total) * 100);
                        return (
                            <div key={r.name} className="flex items-center gap-3">
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-medium">{r.name}</span>
                                        <span className="text-xs text-muted-foreground">{r.compliant}/{total}</span>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-1.5">
                                        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: pct === 100 ? "#10B981" : "#F59E0B" }} />
                                    </div>
                                </div>
                                {r.noncompliant > 0 && <AlertTriangle className="w-3.5 h-3.5 text-orange-500 shrink-0" />}
                            </div>
                        );
                    })}
                </div>
            </div>
        </PageShell>
    );
}
