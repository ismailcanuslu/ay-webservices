"use client";

import { Activity, BarChart3, RefreshCw, Bell, TrendingUp, AlertTriangle } from "lucide-react";
import { PageShell, StatsCard } from "@/components/dashboard/page-shell";
import { Button } from "@/components/ui/button";

const alarms = [
    { name: "CPU-Yüksek-Prod", metric: "CPU Kullanımı", threshold: "> %80", current: "%73", state: "normal" as const },
    { name: "DB-Bağlantı-Limiti", metric: "Veritabanı Bağlantısı", threshold: "> 90", current: "87", state: "alarm" as const },
    { name: "API-Latency-P99", metric: "API Gecikme (p99)", threshold: "> 500ms", current: "312ms", state: "normal" as const },
    { name: "Error-Rate-Yüksek", metric: "5xx Hata Oranı", threshold: "> %1", current: "%0.03", state: "normal" as const },
    { name: "Disk-Doluluk", metric: "Disk Kullanımı", threshold: "> %85", current: "%89", state: "alarm" as const },
];

// Mini sparkline SVG
function Sparkline({ data, color }: { data: number[]; color: string }) {
    const max = Math.max(...data), min = Math.min(...data);
    const range = max - min || 1;
    const h = 40, w = 100;
    const pts = data.map((v, i) => ({ x: (i / (data.length - 1)) * w, y: h - ((v - min) / range) * h }));
    const d = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
    return (
        <svg width={w} height={h}>
            <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
            <circle cx={pts[pts.length - 1].x} cy={pts[pts.length - 1].y} r="2.5" fill={color} />
        </svg>
    );
}

const metricsData = [
    { label: "CPU (%)", values: [32, 41, 38, 55, 71, 68, 74, 65, 70, 73], color: "#FF9900", unit: "%" },
    { label: "Bellek (%)", values: [54, 56, 58, 60, 61, 59, 62, 63, 60, 61], color: "#3B82F6", unit: "%" },
    { label: "Ağ (MB/s)", values: [120, 145, 132, 180, 210, 195, 220, 205, 215, 198], color: "#10B981", unit: "MB/s" },
    { label: "Disk G/Ç (MB/s)", values: [45, 52, 48, 80, 120, 95, 110, 88, 102, 98], color: "#8B5CF6", unit: "MB/s" },
];

export default function IzlemeMerkeziPage() {
    return (
        <PageShell
            title="İzleme Merkezi"
            description="Altyapı metriklerini izleyin, alarmlar oluşturun ve sistem sağlığını takip edin (CloudWatch eşdeğeri)"
            icon={<Activity className="w-6 h-6" />}
            iconColor="#06B6D4"
            breadcrumbs={[{ label: "İzleme" }, { label: "İzleme Merkezi" }]}
            actions={
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs"><RefreshCw className="w-3.5 h-3.5" />Yenile</Button>
                    <Button size="sm" className="gap-1.5 text-xs text-white" style={{ background: "linear-gradient(135deg,#FF9900,#FF6B00)", border: "none" }}>
                        <Bell className="w-3.5 h-3.5" />Alarm Oluştur
                    </Button>
                </div>
            }
        >
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <StatsCard label="Toplam Alarm" value={String(alarms.length)} sub={`${alarms.filter(a => a.state === "alarm").length} tetiklendi`} color="#06B6D4" icon={<Bell className="w-5 h-5" />} />
                <StatsCard label="Aktif Alarm" value={String(alarms.filter(a => a.state === "alarm").length)} sub="Müdahale gerekiyor" color="#EF4444" icon={<AlertTriangle className="w-5 h-5" />} />
                <StatsCard label="Metrik Sayısı" value="248" sub="İzlenen metrik" color="#10B981" icon={<BarChart3 className="w-5 h-5" />} />
                <StatsCard label="Kontrol Paneli" value="6" sub="Özel dashboard" color="#8B5CF6" icon={<TrendingUp className="w-5 h-5" />} />
            </div>

            {/* Metric kartları / sparklines */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                {metricsData.map(m => (
                    <div key={m.label} className="rounded-xl border bg-card p-4 card-hover">
                        <div className="flex items-start justify-between mb-2">
                            <div>
                                <p className="text-xs text-muted-foreground">{m.label}</p>
                                <p className="text-xl font-bold mt-0.5" style={{ color: m.color }}>{m.values[m.values.length - 1]}{m.unit}</p>
                            </div>
                        </div>
                        <Sparkline data={m.values} color={m.color} />
                        <p className="text-xs text-muted-foreground mt-1">Son 30 dakika</p>
                    </div>
                ))}
            </div>

            {/* Alarmlar */}
            <div className="rounded-xl border bg-card overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-4 border-b">
                    <Bell className="w-4 h-4 text-cyan-500" />
                    <h2 className="font-semibold text-sm">Alarmlar</h2>
                </div>
                <div className="divide-y divide-border">
                    {alarms.map(a => (
                        <div key={a.name} className="flex items-center gap-4 px-5 py-3 hover:bg-muted/20 transition-colors">
                            <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${a.state === "alarm" ? "bg-red-500 animate-pulse" : "bg-green-500"}`} />
                            <div className="flex-1">
                                <div className="text-xs font-semibold">{a.name}</div>
                                <div className="text-xs text-muted-foreground">{a.metric} · Eşik: <span className="font-mono">{a.threshold}</span></div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-bold">{a.current}</div>
                                <div className={`text-xs font-medium ${a.state === "alarm" ? "text-red-500" : "text-green-500"}`}>{a.state === "alarm" ? "⚠ Alarm" : "✓ Normal"}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </PageShell>
    );
}
