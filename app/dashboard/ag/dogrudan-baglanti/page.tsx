"use client";

import { Server, Plus, Activity, Zap, Globe, RefreshCw, Network } from "lucide-react";
import { PageShell, StatsCard, StatusBadge } from "@/components/dashboard/page-shell";
import { Button } from "@/components/ui/button";

const connections = [
    { name: "hq-to-cloud", location: "İstanbul, TR", bandwidth: "10 Gbps", vlan: 100, bgpAsn: "65001", peerIp: "192.168.1.1", cloudIp: "192.168.1.2", status: "active" as const, uptime: "99.99%", type: "Özel" },
    { name: "datacenter-link", location: "Ankara, TR", bandwidth: "1 Gbps", vlan: 200, bgpAsn: "65002", peerIp: "192.168.2.1", cloudIp: "192.168.2.2", status: "active" as const, uptime: "99.95%", type: "Ortak" },
    { name: "dr-site-link", location: "Almanya, DE", bandwidth: "5 Gbps", vlan: 300, bgpAsn: "65003", peerIp: "192.168.3.1", cloudIp: "192.168.3.2", status: "maintenance" as const, uptime: "—", type: "Özel" },
];

const bgpRoutes = [
    { prefix: "10.100.0.0/16", nexthop: "192.168.1.1", asPath: "65001", origin: "igp", prefType: "Yerel" },
    { prefix: "10.200.0.0/16", nexthop: "192.168.2.1", asPath: "65002", origin: "igp", prefType: "Yerel" },
    { prefix: "172.16.0.0/12", nexthop: "192.168.1.1", asPath: "65001 65100", origin: "egp", prefType: "Uzak" },
    { prefix: "192.168.10.0/24", nexthop: "192.168.3.1", asPath: "65003", origin: "igp", prefType: "Yerel" },
];

export default function DogruданBaglantıPage() {
    return (
        <PageShell
            title="Doğrudan Bağlantı"
            description="Veri merkezinizi buluta özel ağ bağlantısıyla bağlayın — düşük gecikme, yüksek güvenlik (Direct Connect eşdeğeri)"
            icon={<Server className="w-6 h-6" />}
            iconColor="#F59E0B"
            breadcrumbs={[{ label: "Ağ" }, { label: "Doğrudan Bağlantı" }]}
            actions={
                <Button size="sm" className="gap-1.5 text-xs text-white" style={{ background: "linear-gradient(135deg,#FF9900,#FF6B00)", border: "none" }}>
                    <Plus className="w-3.5 h-3.5" />Bağlantı İste
                </Button>
            }
        >
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <StatsCard label="Bağlantı Sayısı" value={String(connections.length)} sub={`${connections.filter(c => c.status === "active").length} aktif`} color="#F59E0B" icon={<Network className="w-5 h-5" />} />
                <StatsCard label="Toplam Bant" value="16 Gbps" sub="Ayrılmış kapasite" color="#3B82F6" icon={<Activity className="w-5 h-5" />} />
                <StatsCard label="Ort. Gecikme" value="4.2 ms" sub="Tüm bağlantılar" color="#10B981" icon={<Zap className="w-5 h-5" />} />
                <StatsCard label="BGP Rota" value={String(bgpRoutes.length)} sub="Öğrenilen prefix" color="#8B5CF6" icon={<Globe className="w-5 h-5" />} />
            </div>

            {/* Bağlantı Kartları */}
            <div className="space-y-3">
                {connections.map(con => (
                    <div key={con.name} className="rounded-xl border bg-card p-5 card-hover">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/30 flex items-center justify-center">
                                    <Server className="w-4.5 h-4.5" style={{ color: "#F59E0B" }} />
                                </div>
                                <div>
                                    <div className="font-semibold text-sm font-mono text-amber-500">{con.name}</div>
                                    <div className="text-xs text-muted-foreground">{con.location} · {con.type} bağlantı</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <StatusBadge status={con.status} />
                                <Button variant="outline" size="sm" className="text-xs h-7"><RefreshCw className="w-3 h-3 mr-1" />Yönet</Button>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            <div>
                                <p className="text-xs text-muted-foreground">Bant Genişliği</p>
                                <p className="text-sm font-bold text-amber-500">{con.bandwidth}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">VLAN</p>
                                <p className="text-sm font-mono font-medium">{con.vlan}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">BGP ASN</p>
                                <p className="text-sm font-mono font-medium">{con.bgpAsn}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Eşleşme IP</p>
                                <p className="text-sm font-mono text-blue-500">{con.peerIp}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Uptime</p>
                                <p className="text-sm font-bold text-green-500">{con.uptime}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* BGP tablosu */}
            <div className="rounded-xl border bg-card overflow-hidden">
                <div className="px-5 py-4 border-b"><h2 className="font-semibold text-sm">BGP Yönlendirme Tablosu</h2></div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/30">
                                {["Prefix", "Next-Hop", "AS Path", "Origin", "Tür"].map(c => (
                                    <th key={c} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{c}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {bgpRoutes.map((r, i) => (
                                <tr key={i} className="hover:bg-muted/20 transition-colors">
                                    <td className="px-5 py-3 font-mono text-xs font-medium text-amber-500">{r.prefix}</td>
                                    <td className="px-5 py-3 font-mono text-xs text-blue-500">{r.nexthop}</td>
                                    <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{r.asPath}</td>
                                    <td className="px-5 py-3"><span className="text-xs font-mono bg-muted px-2 py-0.5 rounded">{r.origin}</span></td>
                                    <td className="px-5 py-3">
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.prefType === "Yerel" ? "bg-green-100 dark:bg-green-950/30 text-green-600 dark:text-green-400" : "bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400"}`}>{r.prefType}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </PageShell>
    );
}
