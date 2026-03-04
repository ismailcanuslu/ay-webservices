"use client";

import { Webhook, Plus, Activity, Zap, CheckCircle, RefreshCw } from "lucide-react";
import { PageShell, StatsCard, StatusBadge } from "@/components/dashboard/page-shell";
import { Button } from "@/components/ui/button";

const buses = [
    { name: "prod-event-bus", sources: 8, rules: 24, events: "45K/gün", status: "active" as const },
    { name: "staging-event-bus", sources: 4, rules: 12, events: "4.2K/gün", status: "active" as const },
    { name: "crm-integration-bus", sources: 2, rules: 6, events: "1.8K/gün", status: "active" as const },
];

const rules = [
    { name: "order-created-handler", bus: "prod-event-bus", source: "com.ayws.orders", detail: "OrderCreated", target: "Lambda: process-order", triggered: "12.4K" },
    { name: "user-signup-notify", bus: "prod-event-bus", source: "com.ayws.auth", detail: "UserRegistered", target: "SNS: welcome-topic", triggered: "890" },
    { name: "payment-completed", bus: "prod-event-bus", source: "com.ayws.payments", detail: "PaymentSuccess", target: "SQS: receipt-queue", triggered: "8.2K" },
    { name: "inventory-low-alert", bus: "prod-event-bus", source: "com.ayws.inventory", detail: "StockLow", target: "SNS: ops-alerts", triggered: "45" },
    { name: "crm-sync-trigger", bus: "crm-integration-bus", source: "com.ayws.crm", detail: "*", target: "Lambda: crm-sync", triggered: "1.8K" },
];

export default function OlayYonetimPage() {
    return (
        <PageShell
            title="Olay Yönetimi"
            description="Uygulama olaylarını yakalayın ve kurumsal entegrasyon kuralları ile işleyin (EventBridge eşdeğeri)"
            icon={<Webhook className="w-6 h-6" />}
            iconColor="#A855F7"
            breadcrumbs={[{ label: "Entegrasyon" }, { label: "Olay Yönetimi" }]}
            actions={
                <Button size="sm" className="gap-1.5 text-xs text-white" style={{ background: "linear-gradient(135deg,#FF9900,#FF6B00)", border: "none" }}>
                    <Plus className="w-3.5 h-3.5" />Kural Oluştur
                </Button>
            }
        >
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <StatsCard label="Event Bus" value={String(buses.length)} color="#A855F7" icon={<Webhook className="w-5 h-5" />} />
                <StatsCard label="Toplam Kural" value={String(rules.length)} color="#3B82F6" icon={<Zap className="w-5 h-5" />} />
                <StatsCard label="Olay/Gün" value="51K+" sub="Tüm bus'lar" color="#10B981" icon={<Activity className="w-5 h-5" />} />
                <StatsCard label="Tetikleme" value="23.3K" sub="Toplam kural tetikleme" color="#F59E0B" icon={<CheckCircle className="w-5 h-5" />} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {buses.map(b => (
                    <div key={b.name} className="rounded-xl border bg-card p-4 card-hover">
                        <div className="flex items-center justify-between mb-3">
                            <span className="font-mono text-xs font-semibold text-purple-500">{b.name}</span>
                            <StatusBadge status={b.status} />
                        </div>
                        <div className="space-y-1 text-xs">
                            <div className="text-muted-foreground">Kaynak: <span className="font-medium">{b.sources}</span></div>
                            <div className="text-muted-foreground">Kural: <span className="font-medium">{b.rules}</span></div>
                            <div className="text-purple-500 font-medium">{b.events}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="rounded-xl border bg-card overflow-hidden">
                <div className="px-5 py-4 border-b"><h2 className="font-semibold text-sm">Yönlendirme Kuralları</h2></div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/30">
                                {["Kural Adı", "Bus", "Kaynak", "Olay", "Hedef", "Tetikleme"].map(c =>
                                    <th key={c} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{c}</th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {rules.map(r => (
                                <tr key={r.name} className="hover:bg-muted/20 transition-colors">
                                    <td className="px-5 py-3 text-xs font-semibold text-purple-500">{r.name}</td>
                                    <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{r.bus}</td>
                                    <td className="px-5 py-3 font-mono text-xs text-blue-500">{r.source}</td>
                                    <td className="px-5 py-3"><span className="font-mono text-xs bg-muted px-2 py-0.5 rounded">{r.detail}</span></td>
                                    <td className="px-5 py-3 font-mono text-xs text-green-500">{r.target}</td>
                                    <td className="px-5 py-3 text-sm font-bold">{r.triggered}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </PageShell>
    );
}
