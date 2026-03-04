"use client";

import { Bell, Plus, AlertTriangle, CheckCircle, RefreshCw, Send } from "lucide-react";
import { PageShell, StatsCard, StatusBadge } from "@/components/dashboard/page-shell";
import { Button } from "@/components/ui/button";

const alerts = [
    { id: "ALT-001", name: "CPU Yüksek — Prod", severity: "Yüksek", triggered: "Bugün 18:45", channel: "Slack, E-posta", status: "active" as const, resolved: false },
    { id: "ALT-002", name: "Disk Doluluk > %85", severity: "Kritik", triggered: "Bugün 17:30", channel: "PagerDuty, Slack", status: "active" as const, resolved: false },
    { id: "ALT-003", name: "API Hata Oranı %5+", severity: "Yüksek", triggered: "Dün 09:12", channel: "E-posta", status: "active" as const, resolved: true },
    { id: "ALT-004", name: "Sertifika Yakında Dolacak", severity: "Orta", triggered: "2 gün önce", channel: "E-posta", status: "maintenance" as const, resolved: false },
];

const channels = [
    { name: "Slack #ops-alerts", type: "Slack", events: 45, status: "active" as const },
    { name: "pagerduty@ayws.com", type: "PagerDuty", events: 12, status: "active" as const },
    { name: "ops-team@ayws.com", type: "E-posta", events: 89, status: "active" as const },
    { name: "webhook-prod", type: "Webhook", events: 234, status: "active" as const },
];

const sevColors: Record<string, string> = { "Kritik": "#EF4444", "Yüksek": "#F59E0B", "Orta": "#3B82F6", "Düşük": "#10B981" };

export default function UyariSistemiPage() {
    return (
        <PageShell
            title="Uyarı Sistemi"
            description="Altyapı olayları için uyarı kuralları oluşturun ve bildirim kanallarını yönetin"
            icon={<Bell className="w-6 h-6" />}
            iconColor="#F59E0B"
            breadcrumbs={[{ label: "İzleme" }, { label: "Uyarı Sistemi" }]}
            actions={
                <Button size="sm" className="gap-1.5 text-xs text-white" style={{ background: "linear-gradient(135deg,#FF9900,#FF6B00)", border: "none" }}>
                    <Plus className="w-3.5 h-3.5" />Uyarı Oluştur
                </Button>
            }
        >
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <StatsCard label="Toplam Uyarı" value={String(alerts.length)} sub="Tanımlı kural" color="#F59E0B" icon={<Bell className="w-5 h-5" />} />
                <StatsCard label="Tetiklenen" value={String(alerts.filter(a => !a.resolved).length)} sub="Çözümlenmedi" color="#EF4444" icon={<AlertTriangle className="w-5 h-5" />} />
                <StatsCard label="Çözümlenen" value={String(alerts.filter(a => a.resolved).length)} sub="Bu hafta" color="#10B981" icon={<CheckCircle className="w-5 h-5" />} />
                <StatsCard label="Kanal" value={String(channels.length)} sub="Bildirim kanalı" color="#8B5CF6" icon={<Send className="w-5 h-5" />} />
            </div>

            {/* Aktif uyarılar */}
            <div className="space-y-3">
                {alerts.filter(a => !a.resolved).map(a => (
                    <div key={a.id} className="rounded-xl border bg-card p-4 card-hover flex items-center gap-4" style={{ borderLeft: `3px solid ${sevColors[a.severity] || "#6B7280"}` }}>
                        <div className="w-2.5 h-2.5 rounded-full animate-pulse shrink-0" style={{ backgroundColor: sevColors[a.severity] }} />
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm">{a.name}</span>
                                <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: `${sevColors[a.severity]}18`, color: sevColors[a.severity] }}>{a.severity}</span>
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5">Tetiklendi: {a.triggered} · Kanal: {a.channel}</div>
                        </div>
                        <StatusBadge status={a.status} />
                        <Button variant="outline" size="sm" className="text-xs h-7">Çözümle</Button>
                    </div>
                ))}
            </div>

            {/* Bildirim kanalları */}
            <div className="rounded-xl border bg-card overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b">
                    <h2 className="font-semibold text-sm">Bildirim Kanalları</h2>
                    <Button variant="outline" size="sm" className="text-xs h-8 gap-1"><Plus className="w-3 h-3" />Kanal Ekle</Button>
                </div>
                <div className="divide-y divide-border">
                    {channels.map(c => (
                        <div key={c.name} className="flex items-center justify-between px-5 py-3 hover:bg-muted/20 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                <div>
                                    <div className="text-sm font-medium">{c.name}</div>
                                    <div className="text-xs text-muted-foreground">{c.type}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs text-muted-foreground">{c.events} bildirim</span>
                                <Button variant="outline" size="sm" className="text-xs h-7">Test</Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </PageShell>
    );
}
