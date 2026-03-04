"use client";

import { Webhook, Plus, Activity, Zap, Shield, RefreshCw, Clock } from "lucide-react";
import { PageShell, StatsCard, StatusBadge } from "@/components/dashboard/page-shell";
import { Button } from "@/components/ui/button";

const apis = [
    { name: "REST API v2", id: "abc123defg", type: "REST", stage: "prod", endpoint: "https://api.ayws.com/v2", requests: "4.5M/gün", latency: "42 ms", throttle: "10K/sn", status: "active" as const },
    { name: "GraphQL API", id: "bcd234efgh", type: "GraphQL", stage: "prod", endpoint: "https://gql.ayws.com/graphql", requests: "890K/gün", latency: "78 ms", throttle: "5K/sn", status: "active" as const },
    { name: "WebSocket API", id: "cde345fghi", type: "WebSocket", stage: "prod", endpoint: "wss://ws.ayws.com", requests: "120K/bağ", latency: "8 ms", throttle: "1K/sn", status: "active" as const },
    { name: "Internal API v1", id: "def456ghij", type: "REST", stage: "staging", endpoint: "https://internal-api.ayws.com/v1", requests: "45K/gün", latency: "22 ms", throttle: "500/sn", status: "maintenance" as const },
];

const routes = [
    { method: "GET", path: "/users/{id}", integration: "Lambda: user-handler", auth: "JWT", cache: "300s" },
    { method: "POST", path: "/auth/login", integration: "Lambda: auth-handler", auth: "Yok", cache: "Yok" },
    { method: "GET", path: "/products", integration: "HTTP: products-svc", auth: "API Key", cache: "60s" },
    { method: "PUT", path: "/orders/{id}", integration: "Lambda: order-handler", auth: "JWT", cache: "Yok" },
    { method: "DELETE", path: "/sessions/{id}", integration: "Lambda: session-handler", auth: "JWT", cache: "Yok" },
];

const methodColors: Record<string, string> = { GET: "#10B981", POST: "#3B82F6", PUT: "#F59E0B", DELETE: "#EF4444", PATCH: "#8B5CF6" };

export default function ApiGecidiPage() {
    return (
        <PageShell
            title="API Geçidi"
            description="REST, GraphQL ve WebSocket API'lerini oluşturun, yönetin ve güvenli hale getirin"
            icon={<Webhook className="w-6 h-6" />}
            iconColor="#EC4899"
            breadcrumbs={[{ label: "Ağ" }, { label: "API Geçidi" }]}
            actions={
                <Button size="sm" className="gap-1.5 text-xs text-white" style={{ background: "linear-gradient(135deg,#FF9900,#FF6B00)", border: "none" }}>
                    <Plus className="w-3.5 h-3.5" />API Oluştur
                </Button>
            }
        >
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <StatsCard label="Toplam API" value={String(apis.length)} sub={`${apis.filter(a => a.status === "active").length} yayında`} color="#EC4899" icon={<Webhook className="w-5 h-5" />} />
                <StatsCard label="İstek/Gün" value="5.4M+" sub="Tüm API'ler" color="#10B981" icon={<Activity className="w-5 h-5" />} />
                <StatsCard label="Ort. Gecikme" value="38 ms" sub="p50 ortalama" color="#3B82F6" icon={<Clock className="w-5 h-5" />} />
                <StatsCard label="Hız Sınırı" value="16.5K/sn" sub="Toplam kota" color="#F59E0B" icon={<Zap className="w-5 h-5" />} />
            </div>

            {/* API Kartları */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {apis.map(api => (
                    <div key={api.id} className="rounded-xl border bg-card p-5 card-hover">
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <div className="flex items-center gap-2">
                                    <div className="font-semibold text-sm text-pink-500">{api.name}</div>
                                    <span className="text-xs bg-pink-100 dark:bg-pink-950/30 text-pink-600 dark:text-pink-400 px-2 py-0.5 rounded-full font-mono font-medium">{api.type}</span>
                                </div>
                                <div className="text-[10px] font-mono text-muted-foreground mt-0.5">{api.endpoint}</div>
                            </div>
                            <StatusBadge status={api.status} />
                        </div>
                        <div className="grid grid-cols-3 gap-3 mt-3">
                            <div className="bg-muted/40 rounded-lg p-2.5">
                                <p className="text-[10px] text-muted-foreground">İstek</p>
                                <p className="text-xs font-bold">{api.requests}</p>
                            </div>
                            <div className="bg-muted/40 rounded-lg p-2.5">
                                <p className="text-[10px] text-muted-foreground">Gecikme</p>
                                <p className="text-xs font-bold text-pink-500">{api.latency}</p>
                            </div>
                            <div className="bg-muted/40 rounded-lg p-2.5">
                                <p className="text-[10px] text-muted-foreground">Throttle</p>
                                <p className="text-xs font-bold">{api.throttle}</p>
                            </div>
                        </div>
                        <div className="mt-3 pt-3 border-t flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Sahne: <span className="font-mono font-medium">{api.stage}</span></span>
                            <button className="text-xs text-orange-500 hover:text-orange-600 font-medium transition-colors">Yönet →</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Rota tablosu */}
            <div className="rounded-xl border bg-card overflow-hidden">
                <div className="px-5 py-4 border-b">
                    <h2 className="font-semibold text-sm">Rotalar (REST API v2 - prod)</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/30">
                                {["Metot", "Rota", "Entegrasyon", "Kimlik Doğrulama", "Önbellek"].map(c => (
                                    <th key={c} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{c}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {routes.map((r, i) => (
                                <tr key={i} className="hover:bg-muted/20 transition-colors">
                                    <td className="px-5 py-3">
                                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded" style={{ backgroundColor: `${methodColors[r.method] || "#6B7280"}15`, color: methodColors[r.method] || "#6B7280" }}>{r.method}</span>
                                    </td>
                                    <td className="px-5 py-3 font-mono text-xs">{r.path}</td>
                                    <td className="px-5 py-3 text-xs text-muted-foreground">{r.integration}</td>
                                    <td className="px-5 py-3">
                                        <span className={`text-xs px-2 py-0.5 rounded font-medium ${r.auth === "Yok" ? "text-muted-foreground" : "text-orange-500"}`}>{r.auth}</span>
                                    </td>
                                    <td className="px-5 py-3 text-xs text-cyan-500 font-mono">{r.cache}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </PageShell>
    );
}
