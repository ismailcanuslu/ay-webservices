"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Cloud, Server, Database, Shield, Globe, Cpu, HardDrive, Mail, BarChart3, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/lib/auth";

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

export default function LoginPage() {
    const router = useRouter();
    const [form, setForm] = useState({ accountId: "", username: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!form.accountId.trim()) {
            setError("Hesap ID veya takma adı girmelisiniz.");
            return;
        }
        if (!form.username.trim() || !form.password.trim()) {
            setError("Kullanıcı adı ve şifre zorunludur.");
            return;
        }
        setLoading(true);
        await new Promise((r) => setTimeout(r, 600));
        const success = login(form.accountId, form.username, form.password);
        if (success) {
            router.push("/dashboard");
        } else {
            setError("Kullanıcı adı veya şifre hatalı. İpucu: admin / admin");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex" style={{ backgroundColor: "hsl(215 25% 10%)" }}>
            {/* Sol: Form */}
            <div className="w-full lg:w-[440px] xl:w-[500px] flex flex-col min-h-screen bg-white">
                {/* Logo Alanı */}
                <div className="px-10 pt-10 pb-8 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #FF9900 0%, #FF6B00 100%)" }}>
                            <Cloud className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <div className="text-xl font-bold text-gray-900 tracking-tight">AY Web Services</div>
                            <div className="text-xs text-gray-500">Yönetim Konsolu</div>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="flex-1 flex flex-col justify-center px-10 py-8">
                    <div className="mb-8">
                        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Oturum Aç</h1>
                        <p className="text-sm text-gray-500">Hesabınıza erişmek için kimlik bilgilerinizi girin</p>
                    </div>

                    {error && (
                        <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2">
                            <span className="mt-0.5">⚠</span>
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <Label htmlFor="accountId" className="text-sm font-medium text-gray-700">
                                Hesap Kimliği veya Takma Ad
                            </Label>
                            <Input
                                id="accountId"
                                type="text"
                                placeholder="123456789012 veya takma-ad"
                                value={form.accountId}
                                onChange={(e) => setForm({ ...form, accountId: e.target.value })}
                                className="h-10 border-gray-300 focus:border-orange-400 focus:ring-orange-400 text-gray-900 placeholder:text-gray-400"
                                autoComplete="off"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                                Kullanıcı Adı
                            </Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="Kullanıcı adınızı girin"
                                value={form.username}
                                onChange={(e) => setForm({ ...form, username: e.target.value })}
                                className="h-10 border-gray-300 focus:border-orange-400 focus:ring-orange-400 text-gray-900 placeholder:text-gray-400"
                                autoComplete="username"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                                Şifre
                            </Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Şifrenizi girin"
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    className="h-10 pr-10 border-gray-300 focus:border-orange-400 focus:ring-orange-400 text-gray-900 placeholder:text-gray-400"
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="w-4 h-4 accent-orange-500 rounded" />
                                <span className="text-sm text-gray-600">Beni hatırla</span>
                            </label>
                            <button type="button" className="text-sm text-orange-600 hover:text-orange-700 font-medium">
                                Şifremi unuttum
                            </button>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-10 text-sm font-semibold text-white rounded-lg transition-all duration-200"
                            style={{ background: loading ? "#9CA3AF" : "linear-gradient(135deg, #FF9900 0%, #FF6B00 100%)", border: "none" }}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                    Oturum açılıyor...
                                </span>
                            ) : "Oturum Aç"}
                        </Button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-gray-100">
                        <p className="text-xs text-gray-400 text-center">
                            Test girişi: herhangi bir Account ID •{" "}
                            <span className="font-mono bg-gray-100 px-1 py-0.5 rounded">admin</span> /{" "}
                            <span className="font-mono bg-gray-100 px-1 py-0.5 rounded">admin</span>
                        </p>
                    </div>
                </div>

                <div className="px-10 py-6 border-t border-gray-100">
                    <p className="text-xs text-gray-400">
                        © 2026 AY Web Services. Tüm hakları saklıdır.
                    </p>
                </div>
            </div>

            {/* Sağ: Görsel Alan */}
            <div className="hidden lg:flex flex-1 flex-col items-center justify-center p-12 relative overflow-hidden">
                {/* Arka plan efektleri */}
                <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 30% 50%, rgba(255,153,0,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 20%, rgba(59,130,246,0.08) 0%, transparent 60%)" }} />

                <div className="relative z-10 max-w-lg w-full">
                    {/* Başlık */}
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-white mb-3">
                            Bulut Hizmetlerinize<br />Hoş Geldiniz
                        </h2>
                        <p className="text-gray-400 text-base">
                            Tüm altyapı hizmetlerinizi tek bir konsoldan yönetin
                        </p>
                    </div>

                    {/* Servis İkonları Grid */}
                    <div className="grid grid-cols-5 gap-4 mb-10">
                        {serviceIcons.map(({ icon: Icon, label, color }) => (
                            <div
                                key={label}
                                className="flex flex-col items-center gap-2 group cursor-default"
                            >
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

                    {/* İstatistik kartları */}
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
