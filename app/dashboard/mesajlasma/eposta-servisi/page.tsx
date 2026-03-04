"use client";

import { Mail, Plus, Send, CheckCircle, XCircle, Activity, BarChart3 } from "lucide-react";
import { PageShell, StatsCard } from "@/components/dashboard/page-shell";
import { Button } from "@/components/ui/button";

const campaigns = [
    { name: "Hoş Geldin E-postası", type: "Tetikleyici", sent: 1240, delivered: 1235, opened: 892, clicked: 456, status: "active", rate: "72.1%" },
    { name: "Aylık Bülten - Mart", type: "Kampanya", sent: 8900, delivered: 8845, opened: 3240, clicked: 890, status: "done", rate: "36.6%" },
    { name: "Şifremi Unuttum", type: "Tetikleyici", sent: 340, delivered: 340, opened: 320, clicked: 318, status: "active", rate: "94.1%" },
    { name: "Ürün Güncellemesi v3.1", type: "Kampanya", sent: 4200, delivered: 4180, opened: 1680, clicked: 540, status: "done", rate: "40.0%" },
];

const stats = {
    today: { sent: 2340, delivered: 2325, bounced: 15, spam: 2, rate: 99.4 },
};

export default function EpostaServisiPage() {
    return (
        <PageShell
            title="E-posta Servisi"
            description="Yüksek teslim edilebilirlik oranıyla işlemsel ve pazarlama e-postalarını gönderin (SES eşdeğeri)"
            icon={<Mail className="w-6 h-6" />}
            iconColor="#F97316"
            breadcrumbs={[{ label: "Mesajlaşma" }, { label: "E-posta Servisi" }]}
            actions={
                <Button size="sm" className="gap-1.5 text-xs text-white" style={{ background: "linear-gradient(135deg,#FF9900,#FF6B00)", border: "none" }}>
                    <Plus className="w-3.5 h-3.5" />Kampanya Oluştur
                </Button>
            }
        >
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <StatsCard label="Bugün Gönderilen" value={stats.today.sent.toLocaleString("tr-TR")} color="#F97316" icon={<Send className="w-5 h-5" />} />
                <StatsCard label="Teslim Oranı" value={`%${stats.today.rate}`} color="#10B981" icon={<CheckCircle className="w-5 h-5" />} />
                <StatsCard label="Geri Dönen" value={String(stats.today.bounced)} sub="Hard/soft bounce" color="#EF4444" icon={<XCircle className="w-5 h-5" />} />
                <StatsCard label="Spam Raporu" value={String(stats.today.spam)} color="#8B5CF6" icon={<Activity className="w-5 h-5" />} />
            </div>

            <div className="rounded-xl border bg-card overflow-hidden">
                <div className="px-5 py-4 border-b"><h2 className="font-semibold text-sm">Kampanyalar ve Tetikleyiciler</h2></div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/30">
                                {["Ad", "Tür", "Gönderildi", "Ulaştı", "Açıldı", "Tıklandı", "Açılma Oranı", "Durum"].map(c =>
                                    <th key={c} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{c}</th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {campaigns.map(c => (
                                <tr key={c.name} className="hover:bg-muted/20 transition-colors">
                                    <td className="px-5 py-3 text-xs font-semibold">{c.name}</td>
                                    <td className="px-5 py-3">
                                        <span className={`text-xs px-2 py-0.5 rounded font-medium ${c.type === "Tetikleyici" ? "bg-orange-100 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400" : "bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400"}`}>{c.type}</span>
                                    </td>
                                    <td className="px-5 py-3 text-sm">{c.sent.toLocaleString("tr-TR")}</td>
                                    <td className="px-5 py-3 text-sm text-green-500">{c.delivered.toLocaleString("tr-TR")}</td>
                                    <td className="px-5 py-3 text-sm text-blue-500">{c.opened.toLocaleString("tr-TR")}</td>
                                    <td className="px-5 py-3 text-sm text-purple-500">{c.clicked.toLocaleString("tr-TR")}</td>
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 bg-muted rounded-full h-1.5 min-w-[60px]">
                                                <div className="h-full rounded-full bg-orange-500" style={{ width: c.rate }} />
                                            </div>
                                            <span className="text-xs font-bold text-orange-500">{c.rate}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3">
                                        <span className={`text-xs font-semibold ${c.status === "active" ? "text-green-500" : "text-muted-foreground"}`}>{c.status === "active" ? "Aktif" : "Tamamlandı"}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </PageShell>
    );
}
