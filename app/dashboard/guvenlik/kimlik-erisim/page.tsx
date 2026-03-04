"use client";

import { Users, Plus, Shield, Key, Activity, Search, RefreshCw, Lock } from "lucide-react";
import { PageShell, StatsCard, StatusBadge } from "@/components/dashboard/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const users = [
    { name: "admin", type: "Kullanıcı", mfa: true, lastLogin: "Bugün 19:14", status: "active" as const, groups: ["Yöneticiler", "Geliştiriciler"], policies: 3 },
    { name: "deploy_bot", type: "Servis Hesabı", mfa: false, lastLogin: "Bugün 18:00", status: "active" as const, groups: ["CI/CD"], policies: 2 },
    { name: "read_only_analyst", type: "Kullanıcı", mfa: true, lastLogin: "Dün 14:30", status: "active" as const, groups: ["Analistler"], policies: 1 },
    { name: "old_service_account", type: "Servis Hesabı", mfa: false, lastLogin: "45 gün önce", status: "stopped" as const, groups: [], policies: 4 },
    { name: "backup_operator", type: "Kullanıcı", mfa: true, lastLogin: "3 gün önce", status: "active" as const, groups: ["Operatörler"], policies: 2 },
];

const groups = [
    { name: "Yöneticiler", members: 2, policies: 5 },
    { name: "Geliştiriciler", members: 8, policies: 3 },
    { name: "Analistler", members: 5, policies: 2 },
    { name: "Operatörler", members: 3, policies: 4 },
    { name: "CI/CD", members: 2, policies: 2 },
];

export default function KimlikErisimPage() {
    const [search, setSearch] = useState("");
    const filtered = users.filter(u => u.name.includes(search));
    return (
        <PageShell
            title="Kimlik & Erişim Yönetimi (IAM)"
            description="Kullanıcılar, gruplar ve politikalar aracılığıyla kaynaklara erişimi kontrol edin"
            icon={<Users className="w-6 h-6" />}
            iconColor="#EC4899"
            breadcrumbs={[{ label: "Kimlik Yönetimi" }, { label: "IAM" }]}
            actions={
                <Button size="sm" className="gap-1.5 text-xs text-white" style={{ background: "linear-gradient(135deg,#FF9900,#FF6B00)", border: "none" }}>
                    <Plus className="w-3.5 h-3.5" />Kullanıcı Ekle
                </Button>
            }
        >
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <StatsCard label="Toplam Kullanıcı" value={String(users.length)} sub={`${users.filter(u => u.status === "active").length} aktif`} color="#EC4899" icon={<Users className="w-5 h-5" />} />
                <StatsCard label="Grup" value={String(groups.length)} color="#8B5CF6" icon={<Shield className="w-5 h-5" />} />
                <StatsCard label="MFA Aktif" value={String(users.filter(u => u.mfa).length)} sub={`${users.length} kullanıcıdan`} color="#10B981" icon={<Lock className="w-5 h-5" />} />
                <StatsCard label="Politika" value="14" sub="Toplam politika" color="#3B82F6" icon={<Key className="w-5 h-5" />} />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Kullanıcı tablosu */}
                <div className="xl:col-span-2 rounded-xl border bg-card overflow-hidden">
                    <div className="flex items-center gap-3 px-5 py-4 border-b">
                        <h2 className="font-semibold text-sm shrink-0">Kullanıcılar</h2>
                        <div className="relative max-w-xs w-full ml-auto">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                            <Input placeholder="Kullanıcı ara..." value={search} onChange={e => setSearch(e.target.value)} className="h-8 pl-8 text-xs" />
                        </div>
                    </div>
                    <div className="divide-y divide-border">
                        {filtered.map(u => (
                            <div key={u.name} className="flex items-center gap-4 px-5 py-3 hover:bg-muted/20 transition-colors">
                                <div className="w-8 h-8 rounded-full bg-pink-100 dark:bg-pink-950/30 flex items-center justify-center shrink-0">
                                    <span className="text-xs font-bold text-pink-500">{u.name.charAt(0).toUpperCase()}</span>
                                </div>
                                <div className="flex-1">
                                    <div className="text-xs font-semibold font-mono">{u.name}</div>
                                    <div className="text-xs text-muted-foreground">{u.type} · Son giriş: {u.lastLogin}</div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`text-xs ${u.mfa ? "text-green-500" : "text-red-500"} font-medium`}>{u.mfa ? "MFA ✓" : "MFA ✗"}</span>
                                    <StatusBadge status={u.status} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Gruplar */}
                <div className="rounded-xl border bg-card overflow-hidden">
                    <div className="px-5 py-4 border-b"><h2 className="font-semibold text-sm">Gruplar</h2></div>
                    <div className="divide-y divide-border">
                        {groups.map(g => (
                            <div key={g.name} className="flex items-center justify-between px-5 py-3 hover:bg-muted/20 transition-colors">
                                <div>
                                    <div className="text-xs font-semibold">{g.name}</div>
                                    <div className="text-xs text-muted-foreground">{g.members} üye</div>
                                </div>
                                <span className="text-xs bg-pink-100 dark:bg-pink-950/30 text-pink-600 dark:text-pink-400 px-2 py-0.5 rounded">{g.policies} politika</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </PageShell>
    );
}
