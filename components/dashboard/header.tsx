"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
    Bell, ChevronDown, LogOut, Settings, User, HelpCircle,
    CreditCard, Moon, Sun, Search, X, Command,
} from "lucide-react";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { getUser, logout, type AuthUser } from "@/lib/auth";
import { SidenavToggle } from "@/components/dashboard/sidenav";
import { cn } from "@/lib/utils";

const QUICK_LINKS = [
    { label: "Sanal Makineler", href: "/dashboard/bilisim/sanal-makineler", cat: "Bilişim" },
    { label: "İlişkisel Veritabanı", href: "/dashboard/veritabani/iliskisel", cat: "Veritabanı" },
    { label: "NoSQL Veritabanı", href: "/dashboard/veritabani/nosql", cat: "Veritabanı" },
    { label: "Önbellek", href: "/dashboard/veritabani/onbellek", cat: "Veritabanı" },
    { label: "Nesne Depolama", href: "/dashboard/depolama/nesne-depolama", cat: "Depolama" },
    { label: "DNS Hizmeti", href: "/dashboard/ag/dns-hizmeti", cat: "Ağ" },
    { label: "Kimlik & Erişim Yönetimi", href: "/dashboard/guvenlik/kimlik-erisim", cat: "Güvenlik" },
    { label: "E-posta Servisi", href: "/dashboard/mesajlasma/eposta-servisi", cat: "Mesajlaşma" },
    { label: "Model Eğitimi", href: "/dashboard/yapay-zeka/model-egitimi", cat: "Yapay Zeka" },
    { label: "İzleme Merkezi", href: "/dashboard/izleme/izleme-merkezi", cat: "İzleme" },
    { label: "Sunucusuz İşlevler", href: "/dashboard/bilisim/sunucusuz-islevler", cat: "Bilişim" },
    { label: "Blok Depolama", href: "/dashboard/depolama/blok-depolama", cat: "Depolama" },
    { label: "Yük Dengeleyici", href: "/dashboard/ag/yuk-dengeleyici", cat: "Ağ" },
    { label: "Anahtar Yönetimi", href: "/dashboard/guvenlik/anahtar-yonetimi", cat: "Güvenlik" },
    { label: "CI/CD Hattı", href: "/dashboard/gelistirici/cicd-hatti", cat: "Geliştirici" },
];

interface HeaderProps {
    onMenuToggle: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
    const router = useRouter();
    const { theme, setTheme } = useTheme();
    const [user, setUser] = useState<AuthUser | null>(null);
    const [searchOpen, setSearchOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [mounted, setMounted] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => { setMounted(true); setUser(getUser()); }, []);

    // Kısayol: Cmd+K
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setSearchOpen(true);
                setTimeout(() => inputRef.current?.focus(), 50);
            }
            if (e.key === "Escape") { setSearchOpen(false); setQuery(""); }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, []);

    // Dışarı tıklama
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setSearchOpen(false); setQuery("");
            }
        };
        if (searchOpen) document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [searchOpen]);

    const filtered = query.length > 1
        ? QUICK_LINKS.filter(l => l.label.toLowerCase().includes(query.toLowerCase()) || l.cat.toLowerCase().includes(query.toLowerCase()))
        : [];

    const handleLogout = () => { logout(); router.push("/login"); };

    const isDark = theme === "dark";

    return (
        <header className="h-14 border-b bg-background/80 backdrop-blur-sm flex items-center px-4 gap-3 sticky top-0 z-30">
            <SidenavToggle onClick={onMenuToggle} />

            {/* Arama */}
            <div className="flex-1 max-w-md relative" ref={searchRef}>
                <button
                    onClick={() => { setSearchOpen(true); setTimeout(() => inputRef.current?.focus(), 50); }}
                    className={cn(
                        "w-full flex items-center gap-2 px-3 py-2 rounded-lg border text-sm text-muted-foreground transition-all duration-150",
                        searchOpen ? "opacity-0 pointer-events-none" : "hover:border-primary/50 hover:text-foreground"
                    )}
                    style={{ borderColor: "hsl(var(--border))" }}
                >
                    <Search className="w-4 h-4 shrink-0" />
                    <span className="flex-1 text-left">Hizmet ara...</span>
                    <kbd className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] border" style={{ borderColor: "hsl(var(--border))" }}>
                        <Command className="w-3 h-3" />K
                    </kbd>
                </button>

                {/* Açık arama */}
                {searchOpen && (
                    <div className="absolute inset-x-0 top-0 scale-in">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                            <input
                                ref={inputRef}
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Hizmet ara... (Esc ile kapat)"
                                className="w-full h-10 pl-9 pr-9 rounded-lg border bg-background text-sm outline-none focus:ring-2 focus:ring-orange-400/40"
                                style={{ borderColor: "hsl(var(--ring))" }}
                            />
                            <button onClick={() => { setSearchOpen(false); setQuery(""); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {filtered.length > 0 && (
                            <div className="absolute top-full mt-1 left-0 right-0 rounded-xl border bg-popover shadow-xl overflow-hidden z-50 scale-in">
                                {filtered.map((item) => (
                                    <button
                                        key={item.href}
                                        onClick={() => { router.push(item.href); setSearchOpen(false); setQuery(""); }}
                                        className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-accent transition-colors text-left"
                                    >
                                        <span className="font-medium">{item.label}</span>
                                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{item.cat}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="flex items-center gap-1.5 ml-auto">
                {/* Tema toggle */}
                {mounted && (
                    <Button
                        variant="ghost" size="icon" className="w-8 h-8"
                        onClick={() => setTheme(isDark ? "light" : "dark")}
                        title={isDark ? "Aydınlık tema" : "Karanlık tema"}
                    >
                        {isDark
                            ? <Sun className="w-4 h-4 transition-transform hover:rotate-12" />
                            : <Moon className="w-4 h-4 transition-transform hover:-rotate-12" />
                        }
                    </Button>
                )}

                {/* Bildirimler */}
                <Button variant="ghost" size="icon" className="w-8 h-8 relative">
                    <Bell className="w-4 h-4" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full pulse-badge" />
                </Button>

                <Button variant="ghost" size="icon" className="w-8 h-8">
                    <HelpCircle className="w-4 h-4" />
                </Button>

                {/* User dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-accent transition-colors text-sm">
                            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                                style={{ background: "linear-gradient(135deg, #FF9900 0%, #FF6B00 100%)" }}>
                                {user?.username?.charAt(0).toUpperCase() || "A"}
                            </div>
                            <div className="hidden sm:flex flex-col text-left leading-tight">
                                <span className="font-medium text-xs">{user?.username || "admin"}</span>
                                <span className="text-xs text-muted-foreground truncate max-w-[100px]">{user?.accountId || "123456789012"}</span>
                            </div>
                            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-60">
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex items-center gap-3 py-1">
                                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
                                    style={{ background: "linear-gradient(135deg, #FF9900 0%, #FF6B00 100%)" }}>
                                    {user?.username?.charAt(0).toUpperCase() || "A"}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">{user?.username || "admin"}</p>
                                    <p className="text-xs text-muted-foreground">Hesap: {user?.accountId || "123456789012"}</p>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.push("/dashboard/profil")}><User className="mr-2 h-4 w-4" />Profilim</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push("/dashboard/ayarlar")}><Settings className="mr-2 h-4 w-4" />Hesap Ayarları</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push("/dashboard/faturalama")}><CreditCard className="mr-2 h-4 w-4" />Fatura & Ödemeler</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/30">
                            <LogOut className="mr-2 h-4 w-4" />Oturumu Kapat
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
