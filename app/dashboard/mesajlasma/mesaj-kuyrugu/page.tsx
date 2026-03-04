"use client";

import { MessageSquare, Plus, Activity, Clock, CheckCircle, RefreshCw, Filter } from "lucide-react";
import { PageShell, StatsCard, StatusBadge } from "@/components/dashboard/page-shell";
import { Button } from "@/components/ui/button";

const queues = [
    { name: "prod-orders-queue", type: "Standart", messages: 142, inflight: 12, dlq: 0, retention: "4 gün", delay: "0 sn", status: "active" as const },
    { name: "prod-notifications-queue.fifo", type: "FIFO", messages: 8, inflight: 2, dlq: 0, retention: "1 gün", delay: "0 sn", status: "active" as const },
    { name: "prod-email-queue", type: "Standart", messages: 340, inflight: 45, dlq: 3, retention: "14 gün", delay: "5 sn", status: "active" as const },
    { name: "staging-test-queue", type: "Standart", messages: 0, inflight: 0, dlq: 0, retention: "1 gün", delay: "0 sn", status: "maintenance" as const },
    { name: "prod-orders-queue-dlq", type: "DLQ", messages: 5, inflight: 0, dlq: 0, retention: "14 gün", delay: "0 sn", status: "active" as const },
];

export default function MesajKuyruguPage() {
    return (
        <PageShell
            title="Mesaj Kuyruğu"
            description="Uygulamalar arasında asenkron mesajlaşmayı yönetilen kuyruk altyapısıyla sağlayın (SQS eşdeğeri)"
            icon={<MessageSquare className="w-6 h-6" />}
            iconColor="#F97316"
            breadcrumbs={[{ label: "Mesajlaşma" }, { label: "Mesaj Kuyruğu" }]}
            actions={
                <Button size="sm" className="gap-1.5 text-xs text-white" style={{ background: "linear-gradient(135deg,#FF9900,#FF6B00)", border: "none" }}>
                    <Plus className="w-3.5 h-3.5" />Kuyruk Oluştur
                </Button>
            }
        >
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <StatsCard label="Kuyruk Sayısı" value={String(queues.length)} sub={`${queues.filter(q => q.status === "active").length} aktif`} color="#F97316" icon={<MessageSquare className="w-5 h-5" />} />
                <StatsCard label="Bekleyen Mesaj" value={String(queues.reduce((s, q) => s + q.messages, 0))} sub="Tüm kuyruklarda" color="#3B82F6" icon={<Activity className="w-5 h-5" />} />
                <StatsCard label="Uçuştaki" value={String(queues.reduce((s, q) => s + q.inflight, 0))} sub="İşleniyor" color="#F59E0B" icon={<Clock className="w-5 h-5" />} />
                <StatsCard label="DLQ Mesajı" value={String(queues.reduce((s, q) => s + q.dlq, 0))} sub="Hata kuyruğu" color="#EF4444" icon={<CheckCircle className="w-5 h-5" />} />
            </div>

            <div className="rounded-xl border bg-card overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b">
                    <h2 className="font-semibold text-sm">Kuyruklar</h2>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="text-xs h-8 gap-1"><Filter className="w-3 h-3" />Filtrele</Button>
                        <Button variant="outline" size="sm" className="text-xs h-8 gap-1"><RefreshCw className="w-3 h-3" />Yenile</Button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/30">
                                {["Kuyruk Adı", "Tür", "Mesaj", "Uçuştaki", "DLQ", "Saklama", "Gecikme", "Durum"].map(c => (
                                    <th key={c} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{c}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {queues.map(q => (
                                <tr key={q.name} className="hover:bg-muted/20 transition-colors">
                                    <td className="px-5 py-3 font-mono text-xs font-semibold text-orange-500">{q.name}</td>
                                    <td className="px-5 py-3">
                                        <span className={`text-xs px-2 py-0.5 rounded font-medium ${q.type === "FIFO" ? "bg-purple-100 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400" : q.type === "DLQ" ? "bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400" : "bg-orange-100 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400"}`}>{q.type}</span>
                                    </td>
                                    <td className="px-5 py-3 text-sm font-semibold">{q.messages}</td>
                                    <td className="px-5 py-3 text-sm text-yellow-500 font-medium">{q.inflight}</td>
                                    <td className="px-5 py-3 text-sm font-medium" style={{ color: q.dlq > 0 ? "#EF4444" : undefined }}>{q.dlq}</td>
                                    <td className="px-5 py-3 text-xs text-muted-foreground">{q.retention}</td>
                                    <td className="px-5 py-3 text-xs font-mono">{q.delay}</td>
                                    <td className="px-5 py-3"><StatusBadge status={q.status} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </PageShell>
    );
}
