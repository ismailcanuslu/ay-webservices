"use client";

import { Lock, Plus, Shield, Eye, EyeOff, RefreshCw, Clock } from "lucide-react";
import { PageShell, StatsCard, StatusBadge } from "@/components/dashboard/page-shell";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const secrets = [
    { name: "prod/db/postgres-password", type: "Veritabanı", rotation: true, rotationDays: 30, lastRotated: "15.02.2024", nextRotation: "16.03.2024", accessed: "Bugün 14:23", status: "active" as const },
    { name: "prod/api/stripe-secret-key", type: "API Anahtarı", rotation: false, rotationDays: null, lastRotated: "12.01.2024", nextRotation: "—", accessed: "Bugün 12:00", status: "active" as const },
    { name: "prod/mail/smtp-credentials", type: "Kimlik Bilgisi", rotation: true, rotationDays: 60, lastRotated: "01.02.2024", nextRotation: "01.04.2024", accessed: "Dün 09:45", status: "active" as const },
    { name: "staging/db/mysql-password", type: "Veritabanı", rotation: true, rotationDays: 30, lastRotated: "28.02.2024", nextRotation: "29.03.2024", accessed: "2 gün önce", status: "active" as const },
    { name: "dev/oauth/github-token", type: "OAuth Token", rotation: false, rotationDays: null, lastRotated: "05.01.2024", nextRotation: "—", accessed: "7 gün önce", status: "maintenance" as const },
];

export default function GizliBilgiPage() {
    const [revealed, setRevealed] = useState<Set<string>>(new Set());
    const toggleReveal = (name: string) => {
        setRevealed(prev => { const n = new Set(prev); n.has(name) ? n.delete(name) : n.add(name); return n; });
    };

    return (
        <PageShell
            title="Gizli Bilgi Yöneticisi"
            description="API anahtarları, şifreler ve kimlik bilgilerini güvenli şekilde saklayın ve yönetin (Secrets Manager eşdeğeri)"
            icon={<Lock className="w-6 h-6" />}
            iconColor="#8B5CF6"
            breadcrumbs={[{ label: "Kimlik Yönetimi" }, { label: "Gizli Bilgi Yöneticisi" }]}
            actions={
                <Button size="sm" className="gap-1.5 text-xs text-white" style={{ background: "linear-gradient(135deg,#FF9900,#FF6B00)", border: "none" }}>
                    <Plus className="w-3.5 h-3.5" />Gizli Bilgi Ekle
                </Button>
            }
        >
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <StatsCard label="Toplam Gizli Bilgi" value={String(secrets.length)} sub={`${secrets.filter(s => s.status === "active").length} aktif`} color="#8B5CF6" icon={<Lock className="w-5 h-5" />} />
                <StatsCard label="Otomatik Döndürme" value={String(secrets.filter(s => s.rotation).length)} sub="Politika aktif" color="#10B981" icon={<RefreshCw className="w-5 h-5" />} />
                <StatsCard label="Bugün Erişilen" value="3" sub="Gizli bilgi" color="#3B82F6" icon={<Shield className="w-5 h-5" />} />
                <StatsCard label="Şifreli" value="5/5" sub="KMS ile şifreli" color="#F59E0B" icon={<Shield className="w-5 h-5" />} />
            </div>

            <div className="rounded-xl border bg-card overflow-hidden">
                <div className="px-5 py-4 border-b"><h2 className="font-semibold text-sm">Gizli Bilgiler</h2></div>
                <div className="divide-y divide-border">
                    {secrets.map(s => (
                        <div key={s.name} className="px-5 py-4 hover:bg-muted/20 transition-colors">
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <div className="font-mono text-xs font-semibold text-purple-500">{s.name}</div>
                                    <div className="text-xs text-muted-foreground mt-0.5">{s.type}</div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <StatusBadge status={s.status} />
                                    <button onClick={() => toggleReveal(s.name)} className="text-muted-foreground hover:text-foreground transition-colors">
                                        {revealed.has(s.name) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                            {/* Maskelenmiş değer */}
                            <div className="font-mono text-xs bg-muted/40 rounded px-3 py-1.5 mb-3">
                                {revealed.has(s.name) ? <span className="text-green-500">••••• (örnek değer gizlenmiş) •••••</span> : "••••••••••••••••••••••••••••••"}
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-muted-foreground">
                                <div><span>Son Döndürme:</span> <span className="font-medium">{s.lastRotated}</span></div>
                                <div><span>Sonraki:</span> <span className="font-medium">{s.nextRotation}</span></div>
                                <div><span>Otomatik:</span> <span className={`font-medium ${s.rotation ? "text-green-500" : "text-muted-foreground"}`}>{s.rotation ? `${s.rotationDays} günde bir` : "Kapalı"}</span></div>
                                <div><Clock className="w-3 h-3 inline mr-1" /><span>{s.accessed}</span></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </PageShell>
    );
}
