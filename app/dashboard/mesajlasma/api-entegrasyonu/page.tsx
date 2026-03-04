"use client";

import { Send, Plus, Webhook, RefreshCw, Activity, CheckCircle, Zap } from "lucide-react";
import { PageShell, StatsCard, StatusBadge } from "@/components/dashboard/page-shell";
import { Button } from "@/components/ui/button";

const integrations = [
    { name: "Stripe Ödeme", type: "REST", endpoint: "https://api.stripe.com/v1", events: "12.4K/gün", auth: "API Key", status: "active" as const },
    { name: "Slack Bildirimleri", type: "Webhook", endpoint: "https://hooks.slack.com/services/...", events: "890/gün", auth: "OAuth 2.0", status: "active" as const },
    { name: "HubSpot CRM", type: "REST", endpoint: "https://api.hubapi.com", events: "2.4K/gün", auth: "OAuth 2.0", status: "active" as const },
    { name: "Sendgrid E-posta", type: "REST", endpoint: "https://api.sendgrid.com/v3", events: "8.9K/gün", auth: "API Key", status: "active" as const },
    { name: "Twilio SMS", type: "REST", endpoint: "https://api.twilio.com/2010-04-01", events: "340/gün", auth: "Basic Auth", status: "maintenance" as const },
];

export default function ApiEntegrasyonuPage() {
    return (
        <PageShell
            title="API Entegrasyonu"
            description="Üçüncü taraf servislerle bağlantıları yönetin ve entegrasyon akışlarını izleyin"
            icon={<Send className="w-6 h-6" />}
            iconColor="#A855F7"
            breadcrumbs={[{ label: "Entegrasyon" }, { label: "API Entegrasyonu" }]}
            actions={
                <Button size="sm" className="gap-1.5 text-xs text-white" style={{ background: "linear-gradient(135deg,#FF9900,#FF6B00)", border: "none" }}>
                    <Plus className="w-3.5 h-3.5" />Entegrasyon Ekle
                </Button>
            }
        >
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <StatsCard label="Entegrasyon" value={String(integrations.length)} sub={`${integrations.filter(i => i.status === "active").length} aktif`} color="#A855F7" icon={<Webhook className="w-5 h-5" />} />
                <StatsCard label="Çağrı/Gün" value="25K+" sub="Toplam API çağrısı" color="#10B981" icon={<Activity className="w-5 h-5" />} />
                <StatsCard label="Başarı Oranı" value="%99.7" color="#3B82F6" icon={<CheckCircle className="w-5 h-5" />} />
                <StatsCard label="Ort. Yanıt" value="145 ms" color="#F59E0B" icon={<Zap className="w-5 h-5" />} />
            </div>

            <div className="space-y-3">
                {integrations.map(i => (
                    <div key={i.name} className="rounded-xl border bg-card p-5 card-hover">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold text-sm text-purple-500">{i.name}</span>
                                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${i.type === "REST" ? "bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400" : "bg-orange-100 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400"}`}>{i.type}</span>
                                </div>
                                <div className="font-mono text-xs text-muted-foreground">{i.endpoint}</div>
                                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                    <span>Kimlik: <span className="font-medium">{i.auth}</span></span>
                                    <span>Olay: <span className="font-medium text-purple-400">{i.events}</span></span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                                <StatusBadge status={i.status} />
                                <Button variant="outline" size="sm" className="text-xs h-7 gap-1"><RefreshCw className="w-3 h-3" />Test</Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </PageShell>
    );
}
