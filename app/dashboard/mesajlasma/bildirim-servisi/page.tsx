"use client";

import { Bell, Plus, Users, Send, Mail, Activity, RefreshCw } from "lucide-react";
import { PageShell, StatsCard, StatusBadge } from "@/components/dashboard/page-shell";
import { Button } from "@/components/ui/button";

const topics = [
    { name: "prod-alerts", subscribers: 5, type: "Email+Slack", messages: "1.2K/gün", status: "active" as const },
    { name: "order-notifications", subscribers: 3, type: "SQS+Lambda", messages: "45K/gün", status: "active" as const },
    { name: "system-health", subscribers: 8, type: "Email+PagerDuty", messages: "890/gün", status: "active" as const },
    { name: "ml-pipeline-events", subscribers: 2, type: "SQS", messages: "120/gün", status: "maintenance" as const },
];

const recentMessages = [
    { topic: "prod-alerts", time: "18:45:12", subject: "CPU yüksek uyarısı", recipients: 3, status: "Teslim Edildi" },
    { topic: "order-notifications", time: "18:44:30", subject: "Yeni sipariş #41230", recipients: 1, status: "Teslim Edildi" },
    { topic: "system-health", time: "18:43:00", subject: "Sistem kontrol raporu", recipients: 5, status: "Teslim Edildi" },
    { topic: "prod-alerts", time: "17:30:00", subject: "Disk doluluk uyarısı", recipients: 3, status: "Teslim Edildi" },
];

export default function BildirimServisiPage() {
    return (
        <PageShell
            title="Bildirim Servisi"
            description="Uygulamalarınızdan e-posta, SMS ve push bildirimlerini kolayca gönderin (SNS eşdeğeri)"
            icon={<Bell className="w-6 h-6" />}
            iconColor="#F97316"
            breadcrumbs={[{ label: "Mesajlaşma" }, { label: "Bildirim Servisi" }]}
            actions={
                <Button size="sm" className="gap-1.5 text-xs text-white" style={{ background: "linear-gradient(135deg,#FF9900,#FF6B00)", border: "none" }}>
                    <Plus className="w-3.5 h-3.5" />Konu Oluştur
                </Button>
            }
        >
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <StatsCard label="Konu Sayısı" value={String(topics.length)} sub={`${topics.filter(t => t.status === "active").length} aktif`} color="#F97316" icon={<Bell className="w-5 h-5" />} />
                <StatsCard label="Toplam Abone" value={String(topics.reduce((s, t) => s + t.subscribers, 0))} color="#3B82F6" icon={<Users className="w-5 h-5" />} />
                <StatsCard label="Mesaj/Gün" value="47.2K" sub="Toplam gönderim" color="#10B981" icon={<Send className="w-5 h-5" />} />
                <StatsCard label="Teslim Oranı" value="%99.8" color="#8B5CF6" icon={<Activity className="w-5 h-5" />} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {topics.map(t => (
                    <div key={t.name} className="rounded-xl border bg-card p-5 card-hover">
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <div className="font-mono text-sm font-semibold text-orange-500">{t.name}</div>
                                <div className="text-xs text-muted-foreground mt-0.5">Teslim: {t.type}</div>
                            </div>
                            <StatusBadge status={t.status} />
                        </div>
                        <div className="grid grid-cols-2 gap-3 mt-3">
                            <div className="bg-muted/40 rounded-lg p-2.5">
                                <p className="text-[10px] text-muted-foreground">Abone</p>
                                <p className="text-sm font-bold">{t.subscribers}</p>
                            </div>
                            <div className="bg-muted/40 rounded-lg p-2.5">
                                <p className="text-[10px] text-muted-foreground">Mesaj/Gün</p>
                                <p className="text-sm font-bold text-orange-500">{t.messages}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="rounded-xl border bg-card overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b">
                    <h2 className="font-semibold text-sm">Son Gönderilen Mesajlar</h2>
                    <Button variant="outline" size="sm" className="text-xs h-8 gap-1"><RefreshCw className="w-3 h-3" />Yenile</Button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/30">
                                {["Konu", "Zaman", "Başlık", "Alıcı", "Durum"].map(c =>
                                    <th key={c} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{c}</th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {recentMessages.map((m, i) => (
                                <tr key={i} className="hover:bg-muted/20 transition-colors">
                                    <td className="px-5 py-3 font-mono text-xs text-orange-500">{m.topic}</td>
                                    <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{m.time}</td>
                                    <td className="px-5 py-3 text-xs">{m.subject}</td>
                                    <td className="px-5 py-3 text-xs">{m.recipients} alıcı</td>
                                    <td className="px-5 py-3 text-xs font-semibold text-green-500">{m.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </PageShell>
    );
}
