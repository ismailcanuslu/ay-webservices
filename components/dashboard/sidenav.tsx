"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
    Server, Database, Shield, Globe, Cloud, Cpu, HardDrive,
    Mail, BarChart3, Code2, ChevronDown,
    Box, Network, Lock, Key, FileText, Bell, GitBranch,
    Activity, Layers, Zap, Archive, RefreshCw, MessageSquare,
    Send, Webhook, Bot, Eye, Languages, Image, LayoutDashboard,
    Users, Settings, CreditCard, X, Menu, PanelLeftClose, PanelLeftOpen,
    Boxes, Cog, Cpu as CpuIcon, Bolt,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavSubItem {
    label: string;
    href: string;
    icon?: React.ComponentType<{ className?: string }>;
}

interface NavCategory {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    items: NavSubItem[];
}

const navCategories: NavCategory[] = [
    // 1. Sunucular (EC2 / Lightsail benzeri)
    {
        id: "servers",
        label: "Sunucular",
        icon: Server,
        color: "#FF9900",
        items: [
            { label: "Sanal Makineler", href: "/dashboard/bilisim/sanal-makineler", icon: Server },
            { label: "Işık Hesaplama", href: "/dashboard/bilisim/isik-hesaplama", icon: Cpu },
        ],
    },
    // 2. İşlem Hizmetleri (Lambda / ECS / K8s / Batch)
    {
        id: "compute",
        label: "İşlem Hizmetleri",
        icon: Boxes,
        color: "#F59E0B",
        items: [
            { label: "Sunucusuz İşlevler", href: "/dashboard/bilisim/sunucusuz-islevler", icon: Zap },
            { label: "Konteyner Servisi", href: "/dashboard/bilisim/konteyner-servisi", icon: Box },
            { label: "Kubernetes Yönetimi", href: "/dashboard/bilisim/kubernetes", icon: Layers },
            { label: "Toplu İşlem", href: "/dashboard/bilisim/toplu-islem", icon: RefreshCw },
        ],
    },
    // 3. Depolama
    {
        id: "storage",
        label: "Depolama",
        icon: HardDrive,
        color: "#3B82F6",
        items: [
            { label: "Nesne Depolama", href: "/dashboard/depolama/nesne-depolama", icon: Cloud },
            { label: "Blok Depolama", href: "/dashboard/depolama/blok-depolama", icon: HardDrive },
            { label: "Ağ Dosya Sistemi", href: "/dashboard/depolama/ag-dosya-sistemi", icon: Network },
            { label: "Arşiv Depolama", href: "/dashboard/depolama/arsiv-depolama", icon: Archive },
            { label: "Veri Aktarımı", href: "/dashboard/depolama/veri-aktarimi", icon: RefreshCw },
        ],
    },
    // 4. Veritabanı
    {
        id: "database",
        label: "Veritabanı",
        icon: Database,
        color: "#10B981",
        items: [
            { label: "İlişkisel Veritabanı", href: "/dashboard/veritabani/iliskisel", icon: Database },
            { label: "NoSQL Veritabanı", href: "/dashboard/veritabani/nosql", icon: Layers },
            { label: "Önbellek", href: "/dashboard/veritabani/onbellek", icon: Zap },
            { label: "Belge Veritabanı", href: "/dashboard/veritabani/belge", icon: FileText },
            { label: "Zaman Serisi", href: "/dashboard/veritabani/zaman-serisi", icon: Activity },
            { label: "Graf Veritabanı", href: "/dashboard/veritabani/graf", icon: GitBranch },
        ],
    },
    // 5. Ağ
    {
        id: "network",
        label: "Ağ",
        icon: Network,
        color: "#8B5CF6",
        items: [
            { label: "Sanal Özel Bulut", href: "/dashboard/ag/sanal-ozel-bulut", icon: Network },
            { label: "Yük Dengeleyici", href: "/dashboard/ag/yuk-dengeleyici", icon: RefreshCw },
            { label: "Doğrudan Bağlantı", href: "/dashboard/ag/dogrudan-baglanti", icon: Server },
        ],
    },
    // 6. İçerik Dağıtımı
    {
        id: "cdn",
        label: "İçerik Dağıtımı",
        icon: Globe,
        color: "#06B6D4",
        items: [
            { label: "DNS Hizmeti", href: "/dashboard/ag/dns-hizmeti", icon: Globe },
            { label: "İçerik Dağıtım Ağı", href: "/dashboard/ag/icerik-dagitim-agi", icon: Layers },
            { label: "API Geçidi", href: "/dashboard/ag/api-gecidi", icon: Webhook },
        ],
    },
    // 7. Güvenlik
    {
        id: "security",
        label: "Güvenlik",
        icon: Shield,
        color: "#EF4444",
        items: [
            { label: "Web Uygulama Güvenlik Duvarı", href: "/dashboard/guvenlik/waf", icon: Shield },
            { label: "DDoS Koruması", href: "/dashboard/guvenlik/ddos-koruma", icon: Shield },
            { label: "Güvenlik Merkezi", href: "/dashboard/guvenlik/guvenlik-merkezi", icon: Eye },
            { label: "Sertifika Yöneticisi", href: "/dashboard/guvenlik/sertifika", icon: FileText },
        ],
    },
    // 8. Kimlik Yönetimi
    {
        id: "identity",
        label: "Kimlik Yönetimi",
        icon: Users,
        color: "#EC4899",
        items: [
            { label: "Kimlik & Erişim (IAM)", href: "/dashboard/guvenlik/kimlik-erisim", icon: Users },
            { label: "Anahtar Yönetimi", href: "/dashboard/guvenlik/anahtar-yonetimi", icon: Key },
            { label: "Gizli Bilgi Yöneticisi", href: "/dashboard/guvenlik/gizli-bilgi", icon: Lock },
        ],
    },
    // 9. İzleme
    {
        id: "monitoring",
        label: "İzleme",
        icon: BarChart3,
        color: "#06B6D4",
        items: [
            { label: "İzleme Merkezi", href: "/dashboard/izleme/izleme-merkezi", icon: Activity },
            { label: "Denetim Kayıtları", href: "/dashboard/izleme/denetim-kayitlari", icon: FileText },
            { label: "Uyarı Sistemi", href: "/dashboard/izleme/uyari-sistemi", icon: Bell },
        ],
    },
    // 10. Yönetim
    {
        id: "management",
        label: "Yönetim",
        icon: Cog,
        color: "#64748B",
        items: [
            { label: "Yapılandırma Yönetimi", href: "/dashboard/izleme/yapilandirma", icon: Settings },
            { label: "Maliyet Yönetimi", href: "/dashboard/izleme/maliyet", icon: CreditCard },
            { label: "Otomasyon", href: "/dashboard/izleme/otomasyon", icon: RefreshCw },
            { label: "Kaynak Grupları", href: "/dashboard/izleme/kaynak-gruplari", icon: Layers },
        ],
    },
    // 11. Geliştirici Araçları
    {
        id: "devtools",
        label: "Geliştirici Araçları",
        icon: Code2,
        color: "#84CC16",
        items: [
            { label: "CI/CD Hattı", href: "/dashboard/gelistirici/cicd-hatti", icon: GitBranch },
            { label: "Kod Derleme", href: "/dashboard/gelistirici/kod-derleme", icon: Code2 },
            { label: "Kod Deposu", href: "/dashboard/gelistirici/kod-deposu", icon: FileText },
            { label: "Kod Dağıtımı", href: "/dashboard/gelistirici/kod-dagitimi", icon: RefreshCw },
            { label: "Yapıt Deposu", href: "/dashboard/gelistirici/yapit-deposu", icon: Archive },
        ],
    },
    // 12. Mesajlaşma
    {
        id: "messaging",
        label: "Mesajlaşma",
        icon: MessageSquare,
        color: "#F97316",
        items: [
            { label: "Mesaj Kuyruğu", href: "/dashboard/mesajlasma/mesaj-kuyrugu", icon: MessageSquare },
            { label: "Bildirim Servisi", href: "/dashboard/mesajlasma/bildirim-servisi", icon: Bell },
            { label: "E-posta Servisi", href: "/dashboard/mesajlasma/eposta-servisi", icon: Mail },
        ],
    },
    // 13. Entegrasyon
    {
        id: "integration",
        label: "Entegrasyon",
        icon: Webhook,
        color: "#A855F7",
        items: [
            { label: "Olay Yönetimi", href: "/dashboard/mesajlasma/olay-yonetim", icon: Webhook },
            { label: "Veri Akışı", href: "/dashboard/mesajlasma/veri-akisi", icon: Activity },
            { label: "API Entegrasyonu", href: "/dashboard/mesajlasma/api-entegrasyonu", icon: Send },
        ],
    },
    // 14. Yapay Zeka
    {
        id: "ai",
        label: "Yapay Zeka",
        icon: Bot,
        color: "#6366F1",
        items: [
            { label: "Temel Modeller", href: "/dashboard/yapay-zeka/temel-modeller", icon: Layers },
            { label: "Görüntü Analizi", href: "/dashboard/yapay-zeka/goruntu-analizi", icon: Image },
            { label: "Dil İşleme", href: "/dashboard/yapay-zeka/dil-isleme", icon: Languages },
            { label: "Öneri Motoru", href: "/dashboard/yapay-zeka/oneri-motoru", icon: Zap },
        ],
    },
    // 15. Makine Öğrenmesi
    {
        id: "ml",
        label: "Makine Öğrenmesi",
        icon: CpuIcon,
        color: "#EC4899",
        items: [
            { label: "Model Eğitimi", href: "/dashboard/yapay-zeka/model-egitimi", icon: Bot },
            { label: "Veri Etiketleme", href: "/dashboard/yapay-zeka/veri-etiketleme", icon: FileText },
            { label: "Model Dağıtımı", href: "/dashboard/yapay-zeka/model-dagitimi", icon: RefreshCw },
        ],
    },
];

interface SidenavProps {
    onClose?: () => void;
    collapsed?: boolean;
    onCollapseToggle?: () => void;
}

function Tooltip({ children, label }: { children: React.ReactNode; label: string }) {
    return (
        <div className="relative group/tip">
            {children}
            <div
                className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 rounded-md text-xs font-medium text-white pointer-events-none opacity-0 group-hover/tip:opacity-100 transition-opacity duration-150 z-50 whitespace-nowrap"
                style={{ backgroundColor: "hsl(224 71.4% 4.1%)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
                {label}
            </div>
        </div>
    );
}

export function Sidenav({ onClose, collapsed = false, onCollapseToggle }: SidenavProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [openCategories, setOpenCategories] = useState<Set<string>>(new Set());

    useEffect(() => {
        const activeCategory = navCategories.find((cat) =>
            cat.items.some((item) => pathname.startsWith(item.href))
        );
        if (activeCategory) {
            setOpenCategories((prev) => new Set([...prev, activeCategory.id]));
        }
    }, [pathname]);

    const toggleCategory = (id: string) => {
        if (collapsed) return;
        setOpenCategories((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const navigate = (href: string) => {
        router.push(href);
        if (onClose) onClose();
    };

    return (
        <aside
            className="flex flex-col h-full bg-[hsl(var(--sidebar-background))] border-r border-[hsl(var(--sidebar-border))]"
            style={{
                width: collapsed ? "60px" : "256px",
                minWidth: collapsed ? "60px" : "256px",
                transition: "width 0.25s cubic-bezier(0.4,0,0.2,1), min-width 0.25s cubic-bezier(0.4,0,0.2,1)",
                overflow: "hidden",
            }}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-4 border-b border-[hsl(var(--sidebar-border))] shrink-0">
                {!collapsed ? (
                    <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2.5 hover:opacity-80 transition-opacity fade-in">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #FF9900 0%, #FF6B00 100%)" }}>
                            <LayoutDashboard className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-[hsl(var(--sidebar-foreground))] leading-tight whitespace-nowrap">AY Web Services</div>
                            <div className="text-[10px] text-muted-foreground whitespace-nowrap">Yönetim Konsolu</div>
                        </div>
                    </button>
                ) : (
                    <button onClick={() => navigate("/dashboard")} className="w-full flex justify-center hover:opacity-80 transition-opacity">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #FF9900 0%, #FF6B00 100%)" }}>
                            <LayoutDashboard className="w-4 h-4 text-white" />
                        </div>
                    </button>
                )}

                <div className="flex items-center gap-1 shrink-0">
                    {onClose && (
                        <button onClick={onClose} className="lg:hidden p-1 rounded hover:bg-[hsl(var(--sidebar-accent))] text-muted-foreground transition-colors">
                            <X className="w-4 h-4" />
                        </button>
                    )}
                    {onCollapseToggle && !onClose && (
                        <button
                            onClick={onCollapseToggle}
                            className="hidden lg:flex p-1.5 rounded-md hover:bg-[hsl(var(--sidebar-accent))] text-muted-foreground hover:text-foreground transition-all duration-150"
                            title={collapsed ? "Genişlet" : "Daralt"}
                        >
                            {collapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
                        </button>
                    )}
                </div>
            </div>

            {/* Dashboard link */}
            <div className={cn("px-2 pt-2 pb-1 shrink-0", collapsed && "flex justify-center")}>
                {collapsed ? (
                    <Tooltip label="Genel Bakış">
                        <button
                            onClick={() => navigate("/dashboard")}
                            className={cn(
                                "w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-150",
                                pathname === "/dashboard"
                                    ? "bg-[hsl(var(--sidebar-primary))/0.2] text-[hsl(var(--sidebar-primary))]"
                                    : "text-muted-foreground hover:bg-[hsl(var(--sidebar-accent))] hover:text-foreground"
                            )}
                        >
                            <LayoutDashboard className="w-4 h-4" />
                        </button>
                    </Tooltip>
                ) : (
                    <button
                        onClick={() => navigate("/dashboard")}
                        className={cn(
                            "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150",
                            pathname === "/dashboard"
                                ? "bg-[hsl(var(--sidebar-primary))/0.2] text-[hsl(var(--sidebar-primary))]"
                                : "text-muted-foreground hover:bg-[hsl(var(--sidebar-accent))] hover:text-foreground"
                        )}
                    >
                        <LayoutDashboard className="w-4 h-4 shrink-0" />
                        <span className="fade-in">Genel Bakış</span>
                    </button>
                )}
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto pb-4 px-2 space-y-0.5">
                {!collapsed && (
                    <div className="pt-2 pb-1 px-3">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50">Hizmetler</span>
                    </div>
                )}

                {navCategories.map((category) => {
                    const Icon = category.icon;
                    const isCatOpen = openCategories.has(category.id);
                    const hasActiveItem = category.items.some((item) => pathname.startsWith(item.href));

                    if (collapsed) {
                        return (
                            <Tooltip key={category.id} label={category.label}>
                                <button
                                    onClick={() => navigate(category.items[0].href)}
                                    className={cn(
                                        "w-full flex justify-center py-1.5 rounded-lg transition-all duration-150",
                                        hasActiveItem ? "bg-[hsl(var(--sidebar-accent))]" : "hover:bg-[hsl(var(--sidebar-accent))]"
                                    )}
                                >
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${category.color}20` }}>
                                        <Icon className="w-4 h-4" style={{ color: category.color }} />
                                    </div>
                                </button>
                            </Tooltip>
                        );
                    }

                    return (
                        <div key={category.id}>
                            <button
                                onClick={() => toggleCategory(category.id)}
                                className={cn(
                                    "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150",
                                    hasActiveItem
                                        ? "bg-[hsl(var(--sidebar-accent))] text-foreground"
                                        : "text-muted-foreground hover:bg-[hsl(var(--sidebar-accent))] hover:text-foreground"
                                )}
                            >
                                <span className="flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center" style={{ backgroundColor: `${category.color}20` }}>
                                    <Icon className="w-3.5 h-3.5" style={{ color: category.color }} />
                                </span>
                                <span className="flex-1 text-left text-xs">{category.label}</span>
                                <ChevronDown
                                    className="w-3.5 h-3.5 shrink-0 opacity-50 transition-transform duration-200"
                                    style={{ transform: isCatOpen ? "rotate(0deg)" : "rotate(-90deg)" }}
                                />
                            </button>

                            <div
                                style={{
                                    maxHeight: isCatOpen ? `${category.items.length * 40}px` : "0px",
                                    opacity: isCatOpen ? 1 : 0,
                                    overflow: "hidden",
                                    transition: "max-height 0.25s cubic-bezier(0.4,0,0.2,1), opacity 0.2s ease",
                                }}
                            >
                                <div className="ml-2 mt-0.5 border-l border-[hsl(var(--sidebar-border))] pl-3 space-y-0.5 pb-0.5">
                                    {category.items.map((item) => {
                                        const ItemIcon = item.icon;
                                        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                                        return (
                                            <button
                                                key={item.href}
                                                onClick={() => navigate(item.href)}
                                                className={cn(
                                                    "w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition-all duration-150",
                                                    isActive
                                                        ? "bg-[hsl(var(--sidebar-primary))/0.15] text-[hsl(var(--sidebar-primary))] font-semibold"
                                                        : "text-muted-foreground/70 hover:bg-[hsl(var(--sidebar-accent))] hover:text-foreground hover:translate-x-0.5"
                                                )}
                                            >
                                                {ItemIcon && <ItemIcon className="w-3.5 h-3.5 shrink-0 opacity-70" />}
                                                <span className="text-left leading-tight">{item.label}</span>
                                                {isActive && (
                                                    <span className="ml-auto w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: "hsl(var(--sidebar-primary))" }} />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </nav>

            {/* Bottom */}
            <div className={cn("border-t border-[hsl(var(--sidebar-border))] py-3 space-y-0.5 shrink-0 px-2", collapsed && "")}>
                {collapsed ? (
                    <>
                        <Tooltip label="Ayarlar">
                            <button onClick={() => navigate("/dashboard/ayarlar")} className="w-full flex justify-center p-2 rounded-lg text-muted-foreground hover:bg-[hsl(var(--sidebar-accent))] hover:text-foreground transition-colors">
                                <Settings className="w-4 h-4" />
                            </button>
                        </Tooltip>
                        <Tooltip label="Destek">
                            <button onClick={() => navigate("/dashboard/destek")} className="w-full flex justify-center p-2 rounded-lg text-muted-foreground hover:bg-[hsl(var(--sidebar-accent))] hover:text-foreground transition-colors">
                                <Bell className="w-4 h-4" />
                            </button>
                        </Tooltip>
                    </>
                ) : (
                    <>
                        <button onClick={() => navigate("/dashboard/ayarlar")} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:bg-[hsl(var(--sidebar-accent))] hover:text-foreground transition-colors">
                            <Settings className="w-4 h-4 shrink-0" />Ayarlar
                        </button>
                        <button onClick={() => navigate("/dashboard/destek")} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:bg-[hsl(var(--sidebar-accent))] hover:text-foreground transition-colors">
                            <Bell className="w-4 h-4 shrink-0" />Destek & Yardım
                        </button>
                    </>
                )}
            </div>
        </aside>
    );
}

export function SidenavToggle({ onClick }: { onClick: () => void }) {
    return (
        <button onClick={onClick} className="lg:hidden p-2 rounded-md hover:bg-accent transition-colors" aria-label="Menüyü aç">
            <Menu className="w-5 h-5" />
        </button>
    );
}
