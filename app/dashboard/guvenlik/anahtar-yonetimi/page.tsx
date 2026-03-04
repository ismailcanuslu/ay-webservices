"use client";

import { Key, Plus, Shield, Clock, RefreshCw, Lock } from "lucide-react";
import { PageShell, StatsCard, StatusBadge } from "@/components/dashboard/page-shell";
import { Button } from "@/components/ui/button";

const keys = [
    { alias: "alias/prod-db-key", id: "mrk-01fa2b3c4d5e", type: "Simetrik", usage: "Şifreleme/Şifre Çözme", rotation: true, created: "12.01.2024", lastUsed: "Bugün", status: "active" as const },
    { alias: "alias/s3-media-key", id: "mrk-02bc3d4e5f60", type: "Simetrik", usage: "Şifreleme/Şifre Çözme", rotation: true, created: "15.01.2024", lastUsed: "Bugün", status: "active" as const },
    { alias: "alias/signing-key", id: "mrk-03cd4e5f6071", type: "Asimetrik RSA", usage: "İmzalama/Doğrulama", rotation: false, created: "20.01.2024", lastUsed: "3 gün önce", status: "active" as const },
    { alias: "alias/jwt-hmac-key", id: "mrk-04de5f607182", type: "HMAC", usage: "HMAC Üretimi", rotation: true, created: "01.02.2024", lastUsed: "Bugün", status: "active" as const },
    { alias: "alias/old-backup-key", id: "mrk-05ef60718293", type: "Simetrik", usage: "Şifreleme/Şifre Çözme", rotation: false, created: "10.01.2023", lastUsed: "90 gün önce", status: "stopped" as const },
];

export default function AnahtarYonetimiPage() {
    return (
        <PageShell
            title="Anahtar Yönetimi"
            description="Şifreleme anahtarlarını oluşturun, yönetin ve döndürün — verilerinizi güvende tutun (KMS eşdeğeri)"
            icon={<Key className="w-6 h-6" />}
            iconColor="#F59E0B"
            breadcrumbs={[{ label: "Kimlik Yönetimi" }, { label: "Anahtar Yönetimi" }]}
            actions={
                <Button size="sm" className="gap-1.5 text-xs text-white" style={{ background: "linear-gradient(135deg,#FF9900,#FF6B00)", border: "none" }}>
                    <Plus className="w-3.5 h-3.5" />Anahtar Oluştur
                </Button>
            }
        >
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <StatsCard label="Toplam Anahtar" value={String(keys.length)} sub={`${keys.filter(k => k.status === "active").length} aktif`} color="#F59E0B" icon={<Key className="w-5 h-5" />} />
                <StatsCard label="Otomatik Döndürme" value={String(keys.filter(k => k.rotation).length)} sub="Aktif politika" color="#10B981" icon={<RefreshCw className="w-5 h-5" />} />
                <StatsCard label="Bugün Kullanılan" value="3" sub="API çağrısı" color="#3B82F6" icon={<Lock className="w-5 h-5" />} />
                <StatsCard label="Bölge" value="3" sub="Çok bölge anahtar" color="#8B5CF6" icon={<Shield className="w-5 h-5" />} />
            </div>

            <div className="rounded-xl border bg-card overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b">
                    <h2 className="font-semibold text-sm">Anahtarlar</h2>
                    <Button variant="outline" size="sm" className="text-xs h-8 gap-1"><RefreshCw className="w-3 h-3" />Yenile</Button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/30">
                                {["Alias", "Anahtar ID", "Tür", "Kullanım Amacı", "Döndürme", "Oluşturulma", "Son Kullanım", "Durum"].map(c => (
                                    <th key={c} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{c}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {keys.map(k => (
                                <tr key={k.id} className="hover:bg-muted/20 transition-colors">
                                    <td className="px-5 py-3 font-mono text-xs font-semibold text-amber-500">{k.alias}</td>
                                    <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{k.id}</td>
                                    <td className="px-5 py-3"><span className="text-xs bg-muted px-2 py-0.5 rounded font-mono">{k.type}</span></td>
                                    <td className="px-5 py-3 text-xs text-muted-foreground">{k.usage}</td>
                                    <td className="px-5 py-3">
                                        <span className={`text-xs font-medium flex items-center gap-1 ${k.rotation ? "text-green-500" : "text-muted-foreground"}`}>
                                            {k.rotation ? <><RefreshCw className="w-3 h-3" />Aktif</> : "—"}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 text-xs text-muted-foreground">{k.created}</td>
                                    <td className="px-5 py-3 text-xs text-muted-foreground">
                                        <div className="flex items-center gap-1"><Clock className="w-3 h-3" />{k.lastUsed}</div>
                                    </td>
                                    <td className="px-5 py-3"><StatusBadge status={k.status} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </PageShell>
    );
}
