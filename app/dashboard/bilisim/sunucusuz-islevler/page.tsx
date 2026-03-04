"use client";

import { Zap, Plus, Activity, Clock, TrendingUp, Code2, Play, RefreshCw } from "lucide-react";
import { PageShell, StatsCard, StatusBadge } from "@/components/dashboard/page-shell";
import { Button } from "@/components/ui/button";

const functions = [
    { name: "api-request-handler", runtime: "Node.js 20", memory: "512 MB", timeout: "30 sn", invocations: "1.24M", avgDuration: "48 ms", status: "active" as const, trigger: "API Gateway" },
    { name: "image-processor", runtime: "Python 3.11", memory: "1024 MB", timeout: "60 sn", invocations: "340K", avgDuration: "420 ms", status: "active" as const, trigger: "S3 Olayı" },
    { name: "email-sender", runtime: "Go 1.21", memory: "128 MB", timeout: "10 sn", invocations: "89K", avgDuration: "12 ms", status: "active" as const, trigger: "SQS Kuyruğu" },
    { name: "db-backup-cron", runtime: "Python 3.11", memory: "256 MB", timeout: "300 sn", invocations: "720", avgDuration: "180 sn", status: "active" as const, trigger: "Zamanlayıcı (cron)" },
    { name: "analytics-aggregator", runtime: "Node.js 18", memory: "2048 MB", timeout: "900 sn", invocations: "2.1M", avgDuration: "1.2 sn", status: "active" as const, trigger: "Kinesis" },
    { name: "auth-webhook", runtime: "Python 3.12", memory: "256 MB", timeout: "5 sn", invocations: "450K", avgDuration: "8 ms", status: "maintenance" as const, trigger: "HTTP" },
];

const runtimeColors: Record<string, string> = {
    "Node.js": "#3ECF8E",
    "Python": "#3B82F6",
    "Go": "#00ACD7",
};

export default function SunucusuzIslevlerPage() {
    const totalInvocations = "5.2M";
    return (
        <PageShell
            title="Sunucusuz İşlevler"
            description="Altyapı yönetimi gerektirmeden olay güdümlü kod çalıştırın (Lambda eşdeğeri)"
            icon={<Zap className="w-6 h-6" />}
            iconColor="#F59E0B"
            breadcrumbs={[{ label: "Bilişim & İşlem" }, { label: "Sunucusuz İşlevler" }]}
            actions={
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs"><RefreshCw className="w-3.5 h-3.5" />Yenile</Button>
                    <Button size="sm" className="gap-1.5 text-xs text-white" style={{ background: "linear-gradient(135deg,#FF9900,#FF6B00)", border: "none" }}>
                        <Plus className="w-3.5 h-3.5" />Fonksiyon Oluştur
                    </Button>
                </div>
            }
        >
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <StatsCard label="Toplam Fonksiyon" value={String(functions.length)} sub={`${functions.filter(f => f.status === "active").length} aktif`} color="#F59E0B" icon={<Zap className="w-5 h-5" />} />
                <StatsCard label="Aylık Çağrı" value={totalInvocations} sub="Bu ay toplam" color="#10B981" icon={<Activity className="w-5 h-5" />} />
                <StatsCard label="Ort. Süre" value="312 ms" sub="Tüm fonksiyonlar" color="#3B82F6" icon={<Clock className="w-5 h-5" />} />
                <StatsCard label="Başarı Oranı" value="99.97%" sub="Hata oranı: 0.03%" color="#8B5CF6" icon={<TrendingUp className="w-5 h-5" />} />
            </div>

            <div className="rounded-xl border bg-card overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b">
                    <h2 className="font-semibold text-sm">Fonksiyonlar</h2>
                    <Button variant="outline" size="sm" className="text-xs h-8 gap-1.5"><RefreshCw className="w-3 h-3" />Yenile</Button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/30">
                                {["Fonksiyon Adı", "Çalışma Ortamı", "Bellek", "Zaman Aşımı", "Aylık Çağrı", "Ort. Süre", "Tetikleyici", "Durum", "Test"].map(c => (
                                    <th key={c} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{c}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {functions.map(fn => {
                                const rtName = fn.runtime.split(" ")[0];
                                const rtColor = runtimeColors[rtName] || "#6B7280";
                                return (
                                    <tr key={fn.name} className="hover:bg-muted/20 transition-colors">
                                        <td className="px-5 py-3">
                                            <div className="font-medium text-xs text-amber-500">{fn.name}</div>
                                        </td>
                                        <td className="px-5 py-3">
                                            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium" style={{ backgroundColor: `${rtColor}15`, color: rtColor }}>
                                                <Code2 className="w-3 h-3" />{fn.runtime}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-xs text-muted-foreground">{fn.memory}</td>
                                        <td className="px-5 py-3 text-xs text-muted-foreground">{fn.timeout}</td>
                                        <td className="px-5 py-3 text-sm font-semibold">{fn.invocations}</td>
                                        <td className="px-5 py-3 text-xs font-mono text-cyan-500">{fn.avgDuration}</td>
                                        <td className="px-5 py-3"><span className="text-xs bg-muted px-2 py-0.5 rounded">{fn.trigger}</span></td>
                                        <td className="px-5 py-3"><StatusBadge status={fn.status} /></td>
                                        <td className="px-5 py-3">
                                            <button className="inline-flex items-center gap-1 text-xs text-green-600 hover:text-green-700 font-medium transition-colors">
                                                <Play className="w-3 h-3" />Test
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Runtime dağılımı */}
            <div className="grid grid-cols-3 gap-4">
                {Object.entries(
                    functions.reduce((acc, f) => {
                        const rt = f.runtime.split(" ")[0];
                        acc[rt] = (acc[rt] || 0) + 1;
                        return acc;
                    }, {} as Record<string, number>)
                ).map(([rt, count]) => (
                    <div key={rt} className="rounded-xl border bg-card p-4 card-hover flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${runtimeColors[rt] || "#6B7280"}18` }}>
                            <Code2 className="w-4 h-4" style={{ color: runtimeColors[rt] || "#6B7280" }} />
                        </div>
                        <div>
                            <div className="text-xs font-semibold">{rt}</div>
                            <div className="text-xs text-muted-foreground">{count} fonksiyon</div>
                        </div>
                    </div>
                ))}
            </div>
        </PageShell>
    );
}
