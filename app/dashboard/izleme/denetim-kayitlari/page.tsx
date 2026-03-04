"use client";

import { FileText, Search, Filter, RefreshCw, Activity, User, Shield } from "lucide-react";
import { PageShell, StatsCard } from "@/components/dashboard/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const logs = [
    { time: "19:14:32.421", user: "admin", action: "ConsoleLogin", resource: "AWS Console", ip: "85.23.45.67", result: "Başarılı", region: "eu-west-1" },
    { time: "19:12:11.089", user: "deploy_bot", action: "CreateInstance", resource: "EC2 i-0abc123", ip: "10.0.1.10", result: "Başarılı", region: "eu-west-1" },
    { time: "19:09:44.332", user: "admin", action: "PutBucketPolicy", resource: "s3://ay-prod-assets", ip: "85.23.45.67", result: "Başarılı", region: "eu-west-1" },
    { time: "19:05:23.118", user: "read_only_analyst", action: "GetSecretValue", resource: "prod/db/postgres-password", ip: "10.0.2.15", result: "Reddedildi", region: "eu-west-1" },
    { time: "18:58:02.756", user: "deploy_bot", action: "UpdateFunctionCode", resource: "lambda: api-handler", ip: "10.0.1.10", result: "Başarılı", region: "eu-west-1" },
    { time: "18:45:33.209", user: "admin", action: "CreateKey", resource: "KMS", ip: "85.23.45.67", result: "Başarılı", region: "eu-west-1" },
    { time: "18:30:11.443", user: "root", action: "CreateAccessKey", resource: "IAM User: old_service", ip: "45.67.89.12", result: "Başarılı", region: "global" },
];

export default function DenetimKayitlariPage() {
    const [search, setSearch] = useState("");
    const filtered = logs.filter(l => l.user.includes(search) || l.action.includes(search) || l.resource.includes(search));
    return (
        <PageShell
            title="Denetim Kayıtları"
            description="API çağrılarını ve kullanıcı eylemlerini kaydeden eksiksiz denetim izi (CloudTrail eşdeğeri)"
            icon={<FileText className="w-6 h-6" />}
            iconColor="#8B5CF6"
            breadcrumbs={[{ label: "İzleme" }, { label: "Denetim Kayıtları" }]}
            actions={<Button variant="outline" size="sm" className="gap-1.5 text-xs"><RefreshCw className="w-3.5 h-3.5" />Yenile</Button>}
        >
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <StatsCard label="Bugünkü Olay" value="1.4K" sub="Toplam etkinlik" color="#8B5CF6" icon={<Activity className="w-5 h-5" />} />
                <StatsCard label="Aktif Kullanıcı" value="3" sub="Son 1 saatte" color="#10B981" icon={<User className="w-5 h-5" />} />
                <StatsCard label="Reddedilen" value="1" sub="Yetki ihlali" color="#EF4444" icon={<Shield className="w-5 h-5" />} />
                <StatsCard label="Saklama" value="365 gün" sub="Log tutma süresi" color="#3B82F6" icon={<FileText className="w-5 h-5" />} />
            </div>

            {/* Tehlikeli eylem uyarısı */}
            <div className="rounded-xl border border-orange-500/30 bg-orange-50 dark:bg-orange-950/20 p-4 flex items-start gap-3">
                <Shield className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                <div>
                    <div className="text-sm font-semibold text-orange-700 dark:text-orange-400">Dikkat Edilmesi Gereken Eylem</div>
                    <div className="text-xs text-orange-600 dark:text-orange-500 mt-0.5">
                        <span className="font-mono">root</span> hesabından <span className="font-mono">CreateAccessKey</span> eylemi algılandı — root hesabı kullanımı önerilmez.
                    </div>
                </div>
            </div>

            <div className="rounded-xl border bg-card overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-4 border-b flex-wrap">
                    <h2 className="font-semibold text-sm shrink-0">Olay Günlüğü</h2>
                    <div className="relative max-w-xs w-full ml-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                        <Input placeholder="Kullanıcı, eylem veya kaynak..." value={search} onChange={e => setSearch(e.target.value)} className="h-8 pl-8 text-xs" />
                    </div>
                    <Button variant="outline" size="sm" className="h-8 text-xs gap-1"><Filter className="w-3 h-3" />Filtrele</Button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/30">
                                {["Zaman", "Kullanıcı", "Eylem", "Kaynak", "IP Adresi", "Sonuç", "Bölge"].map(c => (
                                    <th key={c} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{c}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filtered.map((l, i) => (
                                <tr key={i} className="hover:bg-muted/20 transition-colors">
                                    <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{l.time}</td>
                                    <td className="px-5 py-3">
                                        <span className={`font-mono text-xs font-medium ${l.user === "root" ? "text-red-500" : "text-purple-500"}`}>{l.user}</span>
                                    </td>
                                    <td className="px-5 py-3 font-mono text-xs">{l.action}</td>
                                    <td className="px-5 py-3 font-mono text-xs text-muted-foreground max-w-[180px] truncate">{l.resource}</td>
                                    <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{l.ip}</td>
                                    <td className="px-5 py-3">
                                        <span className={`text-xs font-semibold ${l.result === "Başarılı" ? "text-green-500" : l.result === "Reddedildi" ? "text-red-500" : "text-yellow-500"}`}>{l.result}</span>
                                    </td>
                                    <td className="px-5 py-3 text-xs text-muted-foreground">{l.region}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </PageShell>
    );
}
