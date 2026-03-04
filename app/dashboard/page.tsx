"use client";

import { useEffect, useState } from "react";
import {
    Server, Database, Shield, Globe, Cloud, Cpu,
    HardDrive, BarChart3, Bot, TrendingUp, Activity,
    AlertTriangle, CheckCircle, Clock, ArrowUpRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUser } from "@/lib/auth";

const quickAccessServices = [
    { icon: Server, label: "Sanal Makineler", count: "12 aktif", color: "#FF9900", href: "/dashboard/bilisim/sanal-makineler" },
    { icon: Cloud, label: "Nesne Depolama", count: "4.2 TB", color: "#3B82F6", href: "/dashboard/depolama/nesne-depolama" },
    { icon: Database, label: "Veritabanları", count: "3 aktif", color: "#10B981", href: "/dashboard/veritabani/iliskisel" },
    { icon: Globe, label: "DNS Hizmeti", count: "8 bölge", color: "#8B5CF6", href: "/dashboard/ag/dns-hizmeti" },
    { icon: Shield, label: "Kimlik Yönetimi", count: "24 kullanıcı", color: "#EF4444", href: "/dashboard/guvenlik/kimlik-erisim" },
    { icon: Cpu, label: "Sunucusuz", count: "1.2M çağrı", color: "#F59E0B", href: "/dashboard/bilisim/sunucusuz-islevler" },
    { icon: HardDrive, label: "Blok Depolama", count: "800 GB", color: "#06B6D4", href: "/dashboard/depolama/blok-depolama" },
    { icon: Bot, label: "Yapay Zeka", count: "2 model", color: "#6366F1", href: "/dashboard/yapay-zeka/model-egitimi" },
];

const stats = [
    { label: "Toplam Kaynak", value: "247", change: "+12", trend: "up", icon: BarChart3 },
    { label: "Aylık Maliyet", value: "₺18.420", change: "-3.2%", trend: "down", icon: TrendingUp },
    { label: "Aktif Alarm", value: "2", change: "Kritik", trend: "warn", icon: AlertTriangle },
    { label: "Servis Sağlığı", value: "99.8%", change: "Çevrimiçi", trend: "up", icon: Activity },
];

const recentActivity = [
    { time: "2 dk önce", action: "Sanal makine başlatıldı", resource: "web-server-01", status: "success" },
    { time: "15 dk önce", action: "DB yedekleme tamamlandı", resource: "prod-db-main", status: "success" },
    { time: "1 sa önce", action: "DNS kaydı güncellendi", resource: "app.ayws.com", status: "success" },
    { time: "3 sa önce", action: "Yük dengeleyici oluşturuldu", resource: "lb-frontend-v2", status: "success" },
    { time: "5 sa önce", action: "Sertifika yenilendi", resource: "*.ayws.com", status: "success" },
    { time: "1 gün önce", action: "Lambda fonksiyonu dağıtıldı", resource: "api-processor-v3", status: "success" },
];

export default function DashboardPage() {
    const [username, setUsername] = useState("admin");
    const [greeting, setGreeting] = useState("İyi günler");

    useEffect(() => {
        const user = getUser();
        if (user) setUsername(user.username);
        const h = new Date().getHours();
        if (h < 12) setGreeting("Günaydın");
        else if (h < 18) setGreeting("İyi günler");
        else setGreeting("İyi akşamlar");
    }, []);

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            {/* Başlık */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">
                        {greeting}, <span style={{ color: "#FF9900" }}>{username}</span> 👋
                    </h1>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        Altyapınıza genel bakış — {new Date().toLocaleDateString("tr-TR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                    </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-full px-3 py-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                    Tüm sistemler çalışıyor
                </div>
            </div>

            {/* İstatistik Kartları */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={stat.label} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-5">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
                                        <p className="text-2xl font-bold mt-1">{stat.value}</p>
                                    </div>
                                    <div className={`p-2 rounded-lg ${stat.trend === "warn" ? "bg-amber-50 dark:bg-amber-950/30" : "bg-blue-50 dark:bg-blue-950/30"}`}>
                                        <Icon className={`w-5 h-5 ${stat.trend === "warn" ? "text-amber-500" : "text-blue-500"}`} />
                                    </div>
                                </div>
                                <div className="mt-3 flex items-center gap-1.5">
                                    {stat.trend === "up" && <ArrowUpRight className="w-3.5 h-3.5 text-green-500" />}
                                    {stat.trend === "warn" && <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />}
                                    <span className={`text-xs font-medium ${stat.trend === "up" ? "text-green-600" : stat.trend === "warn" ? "text-amber-600" : "text-muted-foreground"
                                        }`}>
                                        {stat.change}
                                    </span>
                                    <span className="text-xs text-muted-foreground">bu ay</span>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Hızlı Erişim */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold">Hızlı Erişim</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3">
                        {quickAccessServices.map(({ icon: Icon, label, count, color, href }) => (
                            <a
                                key={label}
                                href={href}
                                className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-accent transition-all duration-150 group cursor-pointer"
                            >
                                <div
                                    className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-150 group-hover:scale-105"
                                    style={{ backgroundColor: `${color}15`, border: `1px solid ${color}25` }}
                                >
                                    <Icon className="w-5 h-5" style={{ color }} />
                                </div>
                                <div className="text-center">
                                    <p className="text-xs font-medium text-foreground leading-tight">{label}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">{count}</p>
                                </div>
                            </a>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Son Aktiviteler */}
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-semibold">Son Aktiviteler</CardTitle>
                        <a href="/dashboard/izleme/denetim-kayitlari" className="text-xs text-orange-500 hover:text-orange-600 font-medium">
                            Tümünü gör →
                        </a>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-1">
                        {recentActivity.map((item, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent/50 transition-colors"
                            >
                                <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <span className="text-sm text-foreground">{item.action} </span>
                                    <span className="text-sm font-mono text-muted-foreground">— {item.resource}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
                                    <Clock className="w-3 h-3" />
                                    {item.time}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
