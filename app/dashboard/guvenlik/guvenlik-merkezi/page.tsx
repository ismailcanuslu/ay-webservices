"use client";

import { Eye, Shield, AlertTriangle, CheckCircle, Activity, TrendingUp, RefreshCw } from "lucide-react";
import { PageShell, StatsCard } from "@/components/dashboard/page-shell";
import { Button } from "@/components/ui/button";

const findings = [
    { id: "FIND-001", severity: "Kritik", title: "Genel erişime açık S3 kovası tespit edildi", resource: "ay-dev-temp", category: "Veri Koruması", status: "Açık", age: "2 saat" },
    { id: "FIND-002", severity: "Yüksek", title: "MFA devre dışı bırakılmış IAM kullanıcısı", resource: "iam-user: old_service", category: "IAM", status: "Açık", age: "1 gün" },
    { id: "FIND-003", severity: "Yüksek", title: "Şifrelenmemiş EBS birimi tespit edildi", resource: "vol-04de5f6071829304", category: "Depolama", status: "Düzeltiliyor", age: "3 gün" },
    { id: "FIND-004", severity: "Orta", title: "SSH portu (22) geniş IP aralığına açık", resource: "sg-prod-bastion", category: "Ağ", status: "Kabul Edildi", age: "7 gün" },
    { id: "FIND-005", severity: "Düşük", title: "CloudTrail kaydı bazı bölgelerde devre dışı", resource: "ap-southeast-1", category: "Denetim", status: "Açık", age: "14 gün" },
];

const severityConfig: Record<string, { cls: string; score: number }> = {
    "Kritik": { cls: "bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400", score: 9.5 },
    "Yüksek": { cls: "bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400", score: 7.2 },
    "Orta": { cls: "bg-yellow-100 dark:bg-yellow-950/40 text-yellow-700 dark:text-yellow-400", score: 4.8 },
    "Düşük": { cls: "bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400", score: 2.1 },
};

const controls = [
    { name: "Kimlik & Erişim Yönetimi", score: 78, total: 34, passed: 26 },
    { name: "Veri Koruma", score: 91, total: 22, passed: 20 },
    { name: "Altyapı Güvenliği", score: 84, total: 45, passed: 38 },
    { name: "Tehdit Tespiti", score: 95, total: 18, passed: 17 },
    { name: "Olay Müdahalesi", score: 67, total: 12, passed: 8 },
];

export default function GuvenlikMerkeziPage() {
    const secScore = 83;
    return (
        <PageShell
            title="Güvenlik Merkezi"
            description="Altyapı genelinde güvenlik bulgularını ve uyumluluk durumunu tek panelden izleyin"
            icon={<Eye className="w-6 h-6" />}
            iconColor="#EF4444"
            breadcrumbs={[{ label: "Güvenlik" }, { label: "Güvenlik Merkezi" }]}
            actions={<Button variant="outline" size="sm" className="gap-1.5 text-xs"><RefreshCw className="w-3.5 h-3.5" />Tara</Button>}
        >
            {/* Güvenlik skoru */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1 rounded-xl border bg-card p-6 flex items-center gap-5">
                    <div className="relative w-20 h-20 shrink-0">
                        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                            <circle cx="18" cy="18" r="15.9" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
                            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#10B981" strokeWidth="3" strokeDasharray={`${secScore} ${100 - secScore}`} strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xl font-bold">{secScore}</span>
                        </div>
                    </div>
                    <div>
                        <div className="text-sm font-semibold">Güvenlik Skoru</div>
                        <div className="text-xs text-green-500 font-medium mt-1">İyi · +3 bu ay</div>
                        <div className="text-xs text-muted-foreground mt-1">131 kontrol değerlendirildi</div>
                    </div>
                </div>
                <div className="md:col-span-2 grid grid-cols-3 gap-4">
                    <StatsCard label="Kritik Bulgu" value="1" sub="Acil müdahale" color="#EF4444" icon={<AlertTriangle className="w-5 h-5" />} />
                    <StatsCard label="Yüksek Bulgu" value="2" sub="Öncelikli" color="#F59E0B" icon={<Shield className="w-5 h-5" />} />
                    <StatsCard label="Düzeltildi (7g)" value="12" sub="Kapanan bulgular" color="#10B981" icon={<CheckCircle className="w-5 h-5" />} />
                </div>
            </div>

            {/* Bulgular */}
            <div className="rounded-xl border bg-card overflow-hidden">
                <div className="px-5 py-4 border-b"><h2 className="font-semibold text-sm">Güvenlik Bulguları</h2></div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/30">
                                {["ID", "Önem", "Başlık", "Kaynak", "Kategori", "Durum", "Yaş"].map(c => (
                                    <th key={c} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{c}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {findings.map(f => (
                                <tr key={f.id} className="hover:bg-muted/20 transition-colors">
                                    <td className="px-5 py-3 font-mono text-xs text-red-500">{f.id}</td>
                                    <td className="px-5 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${severityConfig[f.severity].cls}`}>{f.severity}</span></td>
                                    <td className="px-5 py-3 text-xs max-w-[240px]">{f.title}</td>
                                    <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{f.resource}</td>
                                    <td className="px-5 py-3 text-xs text-muted-foreground">{f.category}</td>
                                    <td className="px-5 py-3 text-xs font-medium">{f.status}</td>
                                    <td className="px-5 py-3 text-xs text-muted-foreground">{f.age}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Kontrol alanları */}
            <div className="rounded-xl border bg-card p-5">
                <h3 className="font-semibold text-sm mb-4">Kontrol Alanı Puanları</h3>
                <div className="space-y-3">
                    {controls.map(c => {
                        const color = c.score >= 90 ? "#10B981" : c.score >= 75 ? "#F59E0B" : "#EF4444";
                        return (
                            <div key={c.name} className="flex items-center gap-3">
                                <div className="w-40 text-xs text-muted-foreground shrink-0 truncate">{c.name}</div>
                                <div className="flex-1 bg-muted rounded-full h-2">
                                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${c.score}%`, backgroundColor: color }} />
                                </div>
                                <div className="text-xs font-bold w-8 text-right" style={{ color }}>{c.score}</div>
                                <div className="text-xs text-muted-foreground w-16 text-right">{c.passed}/{c.total} geçti</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </PageShell>
    );
}
