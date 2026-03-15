"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageShellProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    iconColor: string;
    breadcrumbs?: { label: string; href?: string }[];
    children: React.ReactNode;
    actions?: React.ReactNode;
}

export function PageShell({
    title,
    description,
    icon,
    iconColor,
    breadcrumbs = [],
    children,
    actions,
}: PageShellProps) {
    return (
        <div className="p-6 space-y-6 fade-in">
            {/* Breadcrumb */}
            {breadcrumbs.length > 0 && (
                <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Link href="/dashboard" className="hover:text-foreground transition-colors">Konsol</Link>
                    {breadcrumbs.map((crumb, i) => (
                        <React.Fragment key={i}>
                            <ChevronRight className="w-3 h-3" />
                            {crumb.href ? (
                                <Link href={crumb.href} className="hover:text-foreground transition-colors">{crumb.label}</Link>
                            ) : (
                                <span className="text-foreground font-medium">{crumb.label}</span>
                            )}
                        </React.Fragment>
                    ))}
                </nav>
            )}

            {/* Page Header */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${iconColor}18`, border: `1.5px solid ${iconColor}35` }}
                    >
                        <span style={{ color: iconColor }}>{icon}</span>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-foreground">{title}</h1>
                        <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
                    </div>
                </div>
                {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
            </div>

            {children}
        </div>
    );
}

interface StatsCardProps {
    label: string;
    value: string;
    sub?: string;
    color?: string;
    icon?: React.ReactNode;
}

export function StatsCard({ label, value, sub, color = "#10B981", icon }: StatsCardProps) {
    return (
        <div className="rounded-xl border bg-card p-5 card-hover">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs text-muted-foreground font-medium">{label}</p>
                    <p className="text-2xl font-bold mt-1 text-foreground">{value}</p>
                    {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
                </div>
                {icon && (
                    <div className="p-2.5 rounded-lg" style={{ backgroundColor: `${color}15` }}>
                        <span style={{ color }}>{icon}</span>
                    </div>
                )}
            </div>
        </div>
    );
}

interface StatusBadgeProps {
    status: "active" | "stopped" | "maintenance" | "creating" | "deleting" | "error";
}

const statusConfig = {
    active: { label: "Aktif", className: "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400" },
    stopped: { label: "Durduruldu", className: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" },
    maintenance: { label: "Bakım", className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/50 dark:text-yellow-400" },
    creating: { label: "Oluşturuluyor", className: "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400" },
    deleting: { label: "Siliniyor", className: "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400" },
    error: { label: "Hata", className: "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400" },
};

export function StatusBadge({ status }: StatusBadgeProps) {
    const cfg = statusConfig[status];
    return (
        <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium", cfg.className)}>
            <span className={cn("w-1.5 h-1.5 rounded-full", status === "active" ? "bg-green-500 animate-pulse" : status === "creating" ? "bg-blue-500 animate-pulse" : "bg-current opacity-60")} />
            {cfg.label}
        </span>
    );
}

export function DataTable({
    columns,
    rows,
}: {
    columns: string[];
    rows: (string | React.ReactNode)[][];
}) {
    return (
        <div className="rounded-xl border overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b bg-muted/40">
                            {columns.map((col) => (
                                <th key={col} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {rows.map((row, i) => (
                            <tr key={i} className="hover:bg-muted/30 transition-colors group">
                                {row.map((cell, j) => (
                                    <td key={j} className="px-4 py-3 text-sm text-foreground whitespace-nowrap">
                                        {cell}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
