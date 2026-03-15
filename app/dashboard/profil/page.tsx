"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    User, Mail, Shield, Building2, Calendar, Edit3, Save, X,
    Smartphone, Key, Clock, CheckCircle2, AlertCircle, ChevronRight,
    Copy, Eye, EyeOff, LogOut, QrCode
} from "lucide-react";
import { getUser, logout, getInitials, ROLE_LABELS, type AuthUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// ─── Avatar ─────────────────────────────────────────────────────────────────
function Avatar({ user, size = "lg" }: { user: AuthUser; size?: "sm" | "lg" | "xl" }) {
    const sizes = { sm: "w-10 h-10 text-sm", lg: "w-16 h-16 text-xl", xl: "w-24 h-24 text-3xl" };
    return (
        <div
            className={`${sizes[size]} rounded-full flex items-center justify-center font-bold text-white shrink-0`}
            style={{ background: "linear-gradient(135deg, #FF9900 0%, #FF6B00 100%)" }}
        >
            {getInitials(user)}
        </div>
    );
}

// ─── Info Row ────────────────────────────────────────────────────────────────
function InfoRow({ icon: Icon, label, value, copyable }: {
    icon: React.ElementType; label: string; value: string; copyable?: boolean;
}) {
    const [copied, setCopied] = useState(false);
    const copy = async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };
    return (
        <div className="flex items-center gap-4 py-3 border-b border-border last:border-0">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-orange-500" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
                <p className="text-sm font-medium truncate">{value}</p>
            </div>
            {copyable && (
                <button onClick={copy} className="text-muted-foreground hover:text-foreground transition-colors">
                    {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
            )}
        </div>
    );
}

// ─── MFA Section ─────────────────────────────────────────────────────────────
function MfaSection() {
    const [mfaEnabled] = useState(false);
    const [showSetup, setShowSetup] = useState(false);

    return (
        <div className="rounded-2xl border bg-card p-6 space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                        <Smartphone className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                        <h3 className="font-semibold">İki Faktörlü Kimlik Doğrulama</h3>
                        <p className="text-xs text-muted-foreground">Hesabınıza ekstra güvenlik katmanı ekleyin</p>
                    </div>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${mfaEnabled ? "bg-green-500/15 text-green-600" : "bg-yellow-500/15 text-yellow-600"}`}>
                    {mfaEnabled ? "Aktif" : "Pasif"}
                </span>
            </div>

            {!mfaEnabled && !showSetup && (
                <div className="p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 flex items-start gap-3">
                    <AlertCircle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium text-yellow-600">MFA etkin değil</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Hesabınız risk altında olabilir. Google Authenticator veya uyumlu bir uygulama ile MFA kurun.
                        </p>
                    </div>
                </div>
            )}

            {showSetup && (
                <div className="space-y-4 mt-2">
                    <div className="p-5 rounded-xl border bg-muted/30 space-y-4">
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <span className="w-5 h-5 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center font-bold">1</span>
                            Google Authenticator&apos;ı indirin
                        </div>
                        <div className="flex gap-3 pl-7">
                            {["App Store", "Google Play"].map(s => (
                                <span key={s} className="text-xs px-3 py-1.5 rounded-lg border bg-background font-medium">{s}</span>
                            ))}
                        </div>

                        <div className="flex items-center gap-2 text-sm font-medium">
                            <span className="w-5 h-5 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center font-bold">2</span>
                            QR kodu tarayın
                        </div>
                        <div className="pl-7">
                            <div className="w-40 h-40 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 text-muted-foreground">
                                <QrCode className="w-8 h-8" />
                                <span className="text-xs text-center leading-tight">QR kodu burada<br />görünecek</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm font-medium">
                            <span className="w-5 h-5 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center font-bold">3</span>
                            Doğrulama kodunu girin
                        </div>
                        <div className="pl-7 space-y-3">
                            <Input
                                placeholder="000 000"
                                className="w-40 text-center text-xl tracking-[0.5em] font-mono h-12"
                                maxLength={6}
                                disabled
                            />
                            <p className="text-xs text-muted-foreground">
                                ⚠️ MFA kurulumu yakında aktif hale gelecek. Şu an yapılandırma aşamasındadır.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            disabled
                            className="flex-1 text-white"
                            style={{ background: "linear-gradient(135deg, #FF9900 0%, #FF6B00 100%)", border: "none" }}
                        >
                            MFA&apos;yı Etkinleştir
                        </Button>
                        <Button variant="outline" onClick={() => setShowSetup(false)}>İptal</Button>
                    </div>
                </div>
            )}

            {!showSetup && (
                <Button
                    onClick={() => setShowSetup(true)}
                    variant={mfaEnabled ? "outline" : "default"}
                    className={mfaEnabled ? "" : "text-white"}
                    style={mfaEnabled ? {} : { background: "linear-gradient(135deg, #FF9900 0%, #FF6B00 100%)", border: "none" }}
                >
                    <Smartphone className="w-4 h-4 mr-2" />
                    {mfaEnabled ? "MFA Yönet" : "MFA Kur"}
                </Button>
            )}
        </div>
    );
}

// ─── Active Sessions ──────────────────────────────────────────────────────────
function SessionsSection({ user }: { user: AuthUser }) {
    return (
        <div className="rounded-2xl border bg-card p-6 space-y-4">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                    <h3 className="font-semibold">Oturum Bilgisi</h3>
                    <p className="text-xs text-muted-foreground">Aktif oturum detayları</p>
                </div>
            </div>
            <div className="p-4 rounded-xl border bg-muted/20 space-y-2">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm font-medium">Bu Oturum</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground pl-4">
                    <span>Realm: <strong className="text-foreground">{user.realmName}</strong></span>
                    <span>Giriş: <strong className="text-foreground">{new Date(user.loggedInAt).toLocaleString("tr-TR")}</strong></span>
                    <span>Rol: <strong className="text-orange-500">{ROLE_LABELS[user.primaryRole] ?? user.primaryRole}</strong></span>
                </div>
            </div>
        </div>
    );
}

// ─── Ana Sayfa ───────────────────────────────────────────────────────────────
export default function ProfilPage() {
    const router = useRouter();
    const [user, setUser] = useState<AuthUser | null>(null);
    const [editing, setEditing] = useState(false);
    const [displayName, setDisplayName] = useState("");

    useEffect(() => {
        const u = getUser();
        if (!u) { router.replace("/login"); return; }
        setUser(u);
        setDisplayName(u.fullName);
    }, [router]);

    if (!user) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
            {/* Başlık kartı */}
            <div className="rounded-2xl border bg-card p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                    <Avatar user={user} size="xl" />
                    <div className="flex-1 min-w-0">
                        {editing ? (
                            <div className="flex items-center gap-2 mb-1">
                                <Input
                                    value={displayName}
                                    onChange={e => setDisplayName(e.target.value)}
                                    className="h-9 text-lg font-semibold max-w-xs"
                                />
                                <Button size="sm" onClick={() => setEditing(false)} className="text-white" style={{ background: "linear-gradient(135deg,#FF9900,#FF6B00)", border: "none" }}>
                                    <Save className="w-3.5 h-3.5" />
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => { setEditing(false); setDisplayName(user.fullName); }}>
                                    <X className="w-3.5 h-3.5" />
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 mb-1">
                                <h1 className="text-2xl font-bold">{user.fullName || user.username}</h1>
                                <button onClick={() => setEditing(true)} className="text-muted-foreground hover:text-foreground transition-colors">
                                    <Edit3 className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                        <p className="text-sm text-muted-foreground mb-3">{user.email}</p>
                        <div className="flex flex-wrap gap-2">
                            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: "rgba(255,153,0,0.15)", color: "#FF9900" }}>
                                <Shield className="w-3 h-3" />
                                {ROLE_LABELS[user.primaryRole] ?? user.primaryRole}
                            </span>
                            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium bg-muted text-muted-foreground">
                                <Building2 className="w-3 h-3" />
                                {user.realmName}
                            </span>
                            {(user.roles ?? []).filter(r => r !== user.primaryRole && ROLE_LABELS[r]).map(r => (
                                <span key={r} className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                                    {ROLE_LABELS[r]}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Kişisel Bilgiler */}
                <div className="rounded-2xl border bg-card p-6 space-y-1">
                    <h3 className="font-semibold mb-4">Kişisel Bilgiler</h3>
                    <InfoRow icon={User} label="Ad Soyad" value={user.fullName || "-"} />
                    <InfoRow icon={Mail} label="E-posta" value={user.email} copyable />
                    <InfoRow icon={Key} label="Kullanıcı Adı" value={user.username} copyable />
                    <InfoRow icon={Building2} label="Hesap (Realm)" value={user.realmName} copyable />
                    <InfoRow icon={Shield} label="Birincil Rol" value={ROLE_LABELS[user.primaryRole] ?? user.primaryRole} />
                    <InfoRow icon={Calendar} label="Son Giriş" value={new Date(user.loggedInAt).toLocaleString("tr-TR")} />
                </div>

                {/* Güvenlik */}
                <div className="space-y-6">
                    <MfaSection />
                    <SessionsSection user={user} />
                </div>
            </div>

            {/* Tehlike Bölgesi */}
            <div className="rounded-2xl border border-red-200 dark:border-red-900/40 bg-card p-6">
                <h3 className="font-semibold text-red-600 mb-1">Tehlike Bölgesi</h3>
                <p className="text-xs text-muted-foreground mb-4">Bu işlemler geri alınamaz.</p>
                <div className="flex flex-wrap gap-3">
                    <Button
                        variant="outline"
                        size="sm"
                        className="border-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                        onClick={() => { logout(); router.push("/login"); }}
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Tüm Oturumları Kapat
                    </Button>
                </div>
            </div>
        </div>
    );
}
