"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    Eye, EyeOff, Cloud, Server, Database, Shield, Globe,
    Cpu, HardDrive, Mail, BarChart3, Code2, Check, X,
    User, Building2, AtSign, Lock, ArrowRight
} from "lucide-react";
import { register } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const serviceIcons = [
    { icon: Server, label: "Sanal Makineler", color: "#FF9900" },
    { icon: Database, label: "Veritabanı", color: "#3B82F6" },
    { icon: Shield, label: "Kimlik & Erişim", color: "#10B981" },
    { icon: Globe, label: "DNS Hizmeti", color: "#8B5CF6" },
    { icon: Cloud, label: "Nesne Depolama", color: "#06B6D4" },
    { icon: Cpu, label: "Sunucusuz İşlevler", color: "#F59E0B" },
    { icon: HardDrive, label: "Blok Depolama", color: "#EF4444" },
    { icon: Mail, label: "E-posta Servisi", color: "#EC4899" },
    { icon: BarChart3, label: "İzleme", color: "#14B8A6" },
    { icon: Code2, label: "Geliştirici Araçları", color: "#6366F1" },
];

interface FormState {
    accountName: string;
    email: string;
    fullName: string;
    password: string;
    confirmPassword: string;
    terms: boolean;
}

function PasswordStrength({ password }: { password: string }) {
    const checks = [
        { label: "En az 8 karakter", ok: password.length >= 8 },
        { label: "Büyük harf", ok: /[A-Z]/.test(password) },
        { label: "Küçük harf", ok: /[a-z]/.test(password) },
        { label: "Rakam", ok: /[0-9]/.test(password) },
        { label: "Özel karakter (@#$!…)", ok: /[^A-Za-z0-9]/.test(password) },
    ];
    const score = checks.filter((c) => c.ok).length;

    const strengthLabel = ["", "Çok Zayıf", "Zayıf", "Orta", "Güçlü", "Çok Güçlü"][score];
    const strengthColor = [
        "",
        "#EF4444",
        "#F97316",
        "#EAB308",
        "#22C55E",
        "#10B981",
    ][score];

    if (!password) return null;

    return (
        <div className="mt-2 space-y-2">
            {/* Bar */}
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div
                        key={i}
                        className="h-1 flex-1 rounded-full transition-all duration-300"
                        style={{
                            backgroundColor: i <= score ? strengthColor : "#E5E7EB",
                        }}
                    />
                ))}
            </div>
            {/* Label */}
            <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Şifre gücü</span>
                <span className="text-xs font-medium" style={{ color: strengthColor }}>
                    {strengthLabel}
                </span>
            </div>
            {/* Checks */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 pt-1">
                {checks.map((c) => (
                    <div key={c.label} className="flex items-center gap-1.5">
                        {c.ok ? (
                            <Check className="w-3 h-3 text-green-500" />
                        ) : (
                            <X className="w-3 h-3 text-gray-300" />
                        )}
                        <span className={`text-xs ${c.ok ? "text-gray-600" : "text-gray-400"}`}>
                            {c.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function RegisterPage() {
    const router = useRouter();
    const [form, setForm] = useState<FormState>({
        accountName: "",
        email: "",
        fullName: "",
        password: "",
        confirmPassword: "",
        terms: false,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<1 | 2>(1);

    const updateForm = (key: keyof FormState, value: string | boolean) =>
        setForm((prev) => ({ ...prev, [key]: value }));

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!form.accountName.trim()) {
            setError("Hesap adı zorunludur.");
            return;
        }
        if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            setError("Geçerli bir e-posta adresi giriniz.");
            return;
        }
        if (!form.fullName.trim()) {
            setError("Ad soyad zorunludur.");
            return;
        }
        setStep(2);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (form.password.length < 8) {
            setError("Şifre en az 8 karakter olmalıdır.");
            return;
        }
        if (form.password !== form.confirmPassword) {
            setError("Şifreler eşleşmiyor.");
            return;
        }
        if (!form.terms) {
            setError("Devam etmek için kullanım koşullarını kabul etmelisiniz.");
            return;
        }

        // fullName'i ad + soyad olarak ayır
        const nameParts = form.fullName.trim().split(" ");
        const ownerFirstName = nameParts[0] ?? "";
        const ownerLastName = nameParts.slice(1).join(" ") || ownerFirstName;

        // accountName'i URL-safe slug'a dönüştür
        const realmName = form.accountName
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9-]/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, "");

        setLoading(true);
        const result = await register({
            realmName,
            displayName: form.fullName.trim(),
            ownerEmail: form.email.trim(),
            ownerFirstName,
            ownerLastName,
            ownerPassword: form.password,
        });
        setLoading(false);

        if (!result.ok) {
            setError(result.error ?? "Kayıt sırasında bir hata oluştu.");
            return;
        }

        setSuccess(true);
        await new Promise((r) => setTimeout(r, 1800));
        router.push("/login");
    };

    return (
        <div className="min-h-screen flex" style={{ backgroundColor: "hsl(215 25% 10%)" }}>
            {/* Sol: Form */}
            <div className="w-full lg:w-[480px] xl:w-[540px] flex flex-col min-h-screen bg-white overflow-y-auto">
                {/* Logo */}
                <div className="px-10 pt-10 pb-8 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ background: "linear-gradient(135deg, #FF9900 0%, #FF6B00 100%)" }}
                        >
                            <Cloud className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <div className="text-xl font-bold text-gray-900 tracking-tight">AY Web Services</div>
                            <div className="text-xs text-gray-500">Yeni Hesap Oluştur</div>
                        </div>
                    </div>
                </div>

                {/* Form body */}
                <div className="flex-1 flex flex-col px-10 py-8">
                    {/* Step indicator */}
                    <div className="flex items-center gap-3 mb-8">
                        {[
                            { n: 1, label: "Hesap Bilgileri" },
                            { n: 2, label: "Güvenlik" },
                        ].map(({ n, label }, idx) => {
                            const done = step > n;
                            const active = step === n;
                            return (
                                <div key={n} className="flex items-center gap-3">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
                                            style={{
                                                background: done
                                                    ? "linear-gradient(135deg, #FF9900 0%, #FF6B00 100%)"
                                                    : active
                                                    ? "linear-gradient(135deg, #FF9900 0%, #FF6B00 100%)"
                                                    : "#E5E7EB",
                                                color: active || done ? "#fff" : "#9CA3AF",
                                            }}
                                        >
                                            {done ? <Check className="w-3.5 h-3.5" /> : n}
                                        </div>
                                        <span
                                            className={`text-sm font-medium transition-colors duration-200 ${
                                                active ? "text-gray-900" : done ? "text-orange-600" : "text-gray-400"
                                            }`}
                                        >
                                            {label}
                                        </span>
                                    </div>
                                    {idx === 0 && (
                                        <div
                                            className="w-12 h-px transition-all duration-500"
                                            style={{ backgroundColor: step >= 2 ? "#FF9900" : "#E5E7EB" }}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Başlık */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-semibold text-gray-900 mb-1">
                            {step === 1 ? "Hesap Bilgileri" : "Güvenlik Ayarları"}
                        </h1>
                        <p className="text-sm text-gray-500">
                            {step === 1
                                ? "Hesabınızı oluşturmak için bilgilerinizi girin"
                                : "Kullanıcı adı ve şifrenizi belirleyin"}
                        </p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2">
                            <span className="mt-0.5">⚠</span>
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Success */}
                    {success && (
                        <div className="mb-5 p-4 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm flex items-start gap-2">
                            <Check className="w-4 h-4 mt-0.5 text-green-600 shrink-0" />
                            <div>
                                <p className="font-semibold">Hesabınız oluşturuldu!</p>
                                <p className="text-green-600">Giriş sayfasına yönlendiriliyorsunuz…</p>
                            </div>
                        </div>
                    )}

                    {/* Step 1 */}
                    {step === 1 && (
                        <form onSubmit={handleNext} className="space-y-5">
                            <div className="space-y-1.5">
                                <Label htmlFor="accountName" className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                                    <Building2 className="w-3.5 h-3.5 text-gray-400" />
                                    Hesap Adı
                                </Label>
                                <Input
                                    id="accountName"
                                    type="text"
                                    placeholder="şirket-adı veya takma-ad"
                                    value={form.accountName}
                                    onChange={(e) => updateForm("accountName", e.target.value)}
                                    className="h-10 border-gray-300 focus:border-orange-400 focus:ring-orange-400 text-gray-900 placeholder:text-gray-400"
                                    autoComplete="off"
                                />
                                <p className="text-xs text-gray-400">Hesabınızı tanımlayan benzersiz bir ad (küçük harf, tire ile ayrılmış)</p>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                                    <AtSign className="w-3.5 h-3.5 text-gray-400" />
                                    E-posta Adresi
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="ornek@sirket.com"
                                    value={form.email}
                                    onChange={(e) => updateForm("email", e.target.value)}
                                    className="h-10 border-gray-300 focus:border-orange-400 focus:ring-orange-400 text-gray-900 placeholder:text-gray-400"
                                    autoComplete="email"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="fullName" className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                                    <User className="w-3.5 h-3.5 text-gray-400" />
                                    Ad Soyad
                                </Label>
                                <Input
                                    id="fullName"
                                    type="text"
                                    placeholder="Adınızı ve soyadınızı girin"
                                    value={form.fullName}
                                    onChange={(e) => updateForm("fullName", e.target.value)}
                                    className="h-10 border-gray-300 focus:border-orange-400 focus:ring-orange-400 text-gray-900 placeholder:text-gray-400"
                                    autoComplete="name"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-10 text-sm font-semibold text-white rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                                style={{ background: "linear-gradient(135deg, #FF9900 0%, #FF6B00 100%)", border: "none" }}
                            >
                                Devam Et
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </form>
                    )}

                    {/* Step 2 */}
                    {step === 2 && (
                        <form onSubmit={handleSubmit} className="space-y-5">

                            <div className="space-y-1.5">
                                <Label htmlFor="password" className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                                    <Lock className="w-3.5 h-3.5 text-gray-400" />
                                    Şifre
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Güçlü bir şifre belirleyin"
                                        value={form.password}
                                        onChange={(e) => updateForm("password", e.target.value)}
                                        className="h-10 pr-10 border-gray-300 focus:border-orange-400 focus:ring-orange-400 text-gray-900 placeholder:text-gray-400"
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                <PasswordStrength password={form.password} />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                                    <Lock className="w-3.5 h-3.5 text-gray-400" />
                                    Şifre Tekrar
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirm ? "text" : "password"}
                                        placeholder="Şifrenizi tekrar girin"
                                        value={form.confirmPassword}
                                        onChange={(e) => updateForm("confirmPassword", e.target.value)}
                                        className={`h-10 pr-10 border-gray-300 focus:border-orange-400 focus:ring-orange-400 text-gray-900 placeholder:text-gray-400 ${
                                            form.confirmPassword && form.password !== form.confirmPassword
                                                ? "border-red-300 bg-red-50"
                                                : form.confirmPassword && form.password === form.confirmPassword
                                                ? "border-green-300 bg-green-50"
                                                : ""
                                        }`}
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirm(!showConfirm)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {form.confirmPassword && form.password !== form.confirmPassword && (
                                    <p className="text-xs text-red-500 flex items-center gap-1">
                                        <X className="w-3 h-3" /> Şifreler eşleşmiyor
                                    </p>
                                )}
                                {form.confirmPassword && form.password === form.confirmPassword && (
                                    <p className="text-xs text-green-600 flex items-center gap-1">
                                        <Check className="w-3 h-3" /> Şifreler eşleşiyor
                                    </p>
                                )}
                            </div>

                            <div className="pt-1">
                                <label className="flex items-start gap-2.5 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={form.terms}
                                        onChange={(e) => updateForm("terms", e.target.checked)}
                                        className="w-4 h-4 mt-0.5 accent-orange-500 rounded shrink-0"
                                    />
                                    <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
                                        <span className="text-orange-600 hover:underline cursor-pointer font-medium">Kullanım Koşulları</span>
                                        {" "}ve{" "}
                                        <span className="text-orange-600 hover:underline cursor-pointer font-medium">Gizlilik Politikası</span>
                                        {"'nı okudum ve kabul ediyorum."}
                                    </span>
                                </label>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => { setStep(1); setError(""); }}
                                    className="flex-1 h-10 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    ← Geri
                                </button>
                                <Button
                                    type="submit"
                                    disabled={loading || success}
                                    className="flex-[2] h-10 text-sm font-semibold text-white rounded-lg transition-all duration-200"
                                    style={{
                                        background: loading || success ? "#9CA3AF" : "linear-gradient(135deg, #FF9900 0%, #FF6B00 100%)",
                                        border: "none",
                                    }}
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                            Hesap oluşturuluyor…
                                        </span>
                                    ) : success ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <Check className="w-4 h-4" />
                                            Oluşturuldu!
                                        </span>
                                    ) : "Hesap Oluştur"}
                                </Button>
                            </div>
                        </form>
                    )}

                    <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                        <p className="text-sm text-gray-500">
                            Zaten hesabınız var mı?{" "}
                            <Link href="/login" className="text-orange-600 hover:text-orange-700 font-medium transition-colors">
                                Oturum açın
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="px-10 py-6 border-t border-gray-100">
                    <p className="text-xs text-gray-400">© 2026 AY Web Services. Tüm hakları saklıdır.</p>
                </div>
            </div>

            {/* Sağ: Görsel Alan */}
            <div className="hidden lg:flex flex-1 flex-col items-center justify-center p-12 relative overflow-hidden">
                {/* Arka plan efektleri */}
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            "radial-gradient(ellipse at 30% 50%, rgba(255,153,0,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 20%, rgba(59,130,246,0.08) 0%, transparent 60%)",
                    }}
                />

                <div className="relative z-10 max-w-lg w-full">
                    {/* Başlık */}
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-white mb-3">
                            Altyapınızı<br />Buluta Taşıyın
                        </h2>
                        <p className="text-gray-400 text-base">
                            Dakikalar içinde hesap oluşturun, hizmetlerinizi kullanmaya başlayın
                        </p>
                    </div>

                    {/* Servis İkonları Grid */}
                    <div className="grid grid-cols-5 gap-4 mb-10">
                        {serviceIcons.map(({ icon: Icon, label, color }) => (
                            <div key={label} className="flex flex-col items-center gap-2 group cursor-default">
                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-110"
                                    style={{ backgroundColor: `${color}18`, border: `1px solid ${color}30` }}
                                >
                                    <Icon className="w-6 h-6" style={{ color }} />
                                </div>
                                <span className="text-xs text-gray-500 text-center leading-tight">{label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Avantajlar */}
                    <div className="space-y-3 mb-8">
                        {[
                            { icon: Shield, text: "Ücretsiz 12 ay kredi ile başlayın", color: "#10B981" },
                            { icon: Cpu, text: "Sınırsız ölçeklenebilir altyapı", color: "#3B82F6" },
                            { icon: Globe, text: "Dünya genelinde veri merkezleri", color: "#8B5CF6" },
                        ].map(({ icon: Icon, text, color }) => (
                            <div
                                key={text}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl"
                                style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                            >
                                <div
                                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                                    style={{ backgroundColor: `${color}20` }}
                                >
                                    <Icon className="w-4 h-4" style={{ color }} />
                                </div>
                                <span className="text-sm text-gray-300">{text}</span>
                            </div>
                        ))}
                    </div>

                    {/* İstatistikler */}
                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { value: "99.99%", label: "Çalışma Süresi" },
                            { value: "50+", label: "Hizmet Türü" },
                            { value: "7/24", label: "Destek" },
                        ].map((stat) => (
                            <div
                                key={stat.label}
                                className="rounded-xl p-4 text-center"
                                style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                            >
                                <div className="text-xl font-bold text-white mb-1">{stat.value}</div>
                                <div className="text-xs text-gray-500">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
