"use client";

import { Network, Plus, Shield, Server, Activity, Globe, RefreshCw } from "lucide-react";
import { PageShell, StatsCard, StatusBadge } from "@/components/dashboard/page-shell";
import { Button } from "@/components/ui/button";

const vpcs = [
    { id: "vpc-01fa2b3c4d5e6f7a", name: "prod-vpc", cidr: "10.0.0.0/16", region: "eu-west-1", subnets: 6, routeTables: 4, nacls: 3, status: "active" as const },
    { id: "vpc-02bc3d4e5f607182", name: "staging-vpc", cidr: "10.1.0.0/16", region: "eu-west-1", subnets: 4, routeTables: 2, nacls: 2, status: "active" as const },
    { id: "vpc-03cd4e5f60718293", name: "ml-vpc", cidr: "10.2.0.0/16", region: "us-east-1", subnets: 4, routeTables: 2, nacls: 2, status: "active" as const },
    { id: "vpc-04de5f6071829304", name: "dr-vpc", cidr: "10.3.0.0/16", region: "eu-central-1", subnets: 2, routeTables: 1, nacls: 1, status: "maintenance" as const },
];

const subnets = [
    { name: "prod-public-1a", vpc: "prod-vpc", cidr: "10.0.1.0/24", az: "eu-west-1a", type: "Genel", instances: 3 },
    { name: "prod-public-1b", vpc: "prod-vpc", cidr: "10.0.2.0/24", az: "eu-west-1b", type: "Genel", instances: 2 },
    { name: "prod-private-db-1a", vpc: "prod-vpc", cidr: "10.0.10.0/24", az: "eu-west-1a", type: "Özel", instances: 2 },
    { name: "prod-private-db-1b", vpc: "prod-vpc", cidr: "10.0.11.0/24", az: "eu-west-1b", type: "Özel", instances: 1 },
    { name: "prod-private-app-1a", vpc: "prod-vpc", cidr: "10.0.20.0/24", az: "eu-west-1a", type: "Özel", instances: 5 },
    { name: "prod-private-app-1b", vpc: "prod-vpc", cidr: "10.0.21.0/24", az: "eu-west-1b", type: "Özel", instances: 3 },
];

export default function SanalOzelBulutPage() {
    return (
        <PageShell
            title="Sanal Özel Bulut"
            description="İzole edilmiş ağ ortamları, alt ağlar ve ağ erişim kontrolü (VPC eşdeğeri)"
            icon={<Network className="w-6 h-6" />}
            iconColor="#8B5CF6"
            breadcrumbs={[{ label: "Ağ & İçerik Dağıtımı" }, { label: "Sanal Özel Bulut" }]}
            actions={
                <Button size="sm" className="gap-1.5 text-xs text-white" style={{ background: "linear-gradient(135deg,#FF9900,#FF6B00)", border: "none" }}>
                    <Plus className="w-3.5 h-3.5" />VPC Oluştur
                </Button>
            }
        >
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <StatsCard label="VPC Sayısı" value={String(vpcs.length)} sub="3 bölgede" color="#8B5CF6" icon={<Network className="w-5 h-5" />} />
                <StatsCard label="Alt Ağ" value={String(subnets.length)} sub="Prod VPC'de" color="#10B981" icon={<Server className="w-5 h-5" />} />
                <StatsCard label="Güvenlik Grubu" value="12" sub="Tüm VPC'ler" color="#EF4444" icon={<Shield className="w-5 h-5" />} />
                <StatsCard label="Eşleşme" value="4" sub="VPC peering bağlantısı" color="#F59E0B" icon={<Activity className="w-5 h-5" />} />
            </div>

            {/* VPCs */}
            <div className="rounded-xl border bg-card overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b">
                    <h2 className="font-semibold text-sm">VPC Listesi</h2>
                    <Button variant="outline" size="sm" className="text-xs h-8 gap-1"><RefreshCw className="w-3 h-3" />Yenile</Button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/30">
                                {["Ad / ID", "CIDR Bloğu", "Bölge", "Alt Ağ", "Yönlendirme Tablosu", "NACL", "Durum"].map(c => (
                                    <th key={c} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{c}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {vpcs.map(v => (
                                <tr key={v.id} className="hover:bg-muted/20 transition-colors">
                                    <td className="px-5 py-3">
                                        <div className="font-medium text-xs text-purple-500">{v.name}</div>
                                        <div className="text-[10px] font-mono text-muted-foreground">{v.id}</div>
                                    </td>
                                    <td className="px-5 py-3 font-mono text-xs font-medium">{v.cidr}</td>
                                    <td className="px-5 py-3 text-xs text-muted-foreground">{v.region}</td>
                                    <td className="px-5 py-3 text-sm font-semibold">{v.subnets}</td>
                                    <td className="px-5 py-3 text-sm">{v.routeTables}</td>
                                    <td className="px-5 py-3 text-sm">{v.nacls}</td>
                                    <td className="px-5 py-3"><StatusBadge status={v.status} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Alt ağlar */}
            <div className="rounded-xl border bg-card overflow-hidden">
                <div className="px-5 py-4 border-b"><h2 className="font-semibold text-sm">Alt Ağlar (prod-vpc)</h2></div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/30">
                                {["Alt Ağ Adı", "CIDR", "Availability Zone", "Tür", "Örnek Sayısı"].map(c => (
                                    <th key={c} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{c}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {subnets.map(s => (
                                <tr key={s.name} className="hover:bg-muted/20 transition-colors">
                                    <td className="px-5 py-3 font-mono text-xs font-medium text-purple-500">{s.name}</td>
                                    <td className="px-5 py-3 font-mono text-xs">{s.cidr}</td>
                                    <td className="px-5 py-3 text-xs text-muted-foreground">{s.az}</td>
                                    <td className="px-5 py-3">
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.type === "Genel" ? "bg-green-100 dark:bg-green-950/30 text-green-600 dark:text-green-400" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"}`}>{s.type}</span>
                                    </td>
                                    <td className="px-5 py-3 text-sm font-semibold">{s.instances}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </PageShell>
    );
}
