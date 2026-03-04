"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidenav } from "@/components/dashboard/sidenav";
import { Header } from "@/components/dashboard/header";
import { isAuthenticated } from "@/lib/auth";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (!isAuthenticated()) {
            router.replace("/login");
        } else {
            setReady(true);
        }
    }, [router]);

    if (!ready) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[hsl(215_25%_10%)]">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
                    <span className="text-sm text-muted-foreground">Yükleniyor...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
                    style={{ animation: "fadeIn 0.15s ease" }}
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidenav - desktop (collapse destekli) */}
            <div className="hidden lg:flex h-full shrink-0" style={{ transition: "width 0.25s cubic-bezier(0.4,0,0.2,1)" }}>
                <Sidenav collapsed={collapsed} onCollapseToggle={() => setCollapsed(!collapsed)} />
            </div>

            {/* Sidenav - mobile drawer */}
            <div
                className="fixed inset-y-0 left-0 z-50 lg:hidden"
                style={{
                    transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
                    transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1)",
                }}
            >
                <Sidenav onClose={() => setMobileOpen(false)} />
            </div>

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Header onMenuToggle={() => setMobileOpen(!mobileOpen)} />
                <main className="flex-1 overflow-y-auto">
                    <div className="fade-in">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
