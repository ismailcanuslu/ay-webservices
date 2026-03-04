"use client";

import { useState } from "react";
import {
    Server, Plus, RefreshCw, Search, Play, Square, RotateCcw,
    Cpu, HardDrive, Activity, Globe, Terminal, Filter,
} from "lucide-react";
import { PageShell, StatsCard, StatusBadge } from "@/components/dashboard/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const instances = [
    { id: "i-08fa3c1a2b3d4e5f6", name: "web-server-prod-01", type: "c5.xlarge", vcpu: 4, ram: "8 GB", os: "Ubuntu 22.04", ip: "10.0.1.10", publicIp: "54.123.45.67", az: "eu-west-1a", status: "active" as const, uptime: "34 gün" },
    { id: "i-09ab2c3d4e5f60718", name: "web-server-prod-02", type: "c5.xlarge", vcpu: 4, ram: "8 GB", os: "Ubuntu 22.04", ip: "10.0.1.11", publicIp: "54.123.45.68", az: "eu-west-1b", status: "active" as const, uptime: "34 gün" },
    { id: "i-07cd4e5f60718293a", name: "api-server-01", type: "m5.2xlarge", vcpu: 8, ram: "32 GB", os: "Amazon Linux 2023", ip: "10.0.2.10", publicIp: "34.245.12.89", az: "eu-west-1a", status: "active" as const, uptime: "21 gün" },
    { id: "i-06ef8012345678901", name: "worker-01", type: "c5.large", vcpu: 2, ram: "4 GB", os: "Ubuntu 22.04", ip: "10.0.3.10", publicIp: "—", az: "eu-west-1c", status: "active" as const, uptime: "12 gün" },
    { id: "i-05fa1b2c3d4e5f607", name: "db-bastion", type: "t3.micro", vcpu: 1, ram: "1 GB", os: "Amazon Linux 2023", ip: "10.0.4.10", publicIp: "52.67.89.12", az: "eu-west-1a", status: "active" as const, uptime: "90 gün" },
    { id: "i-04bc2d3e4f5067819", name: "staging-app-01", type: "t3.medium", vcpu: 2, ram: "4 GB", os: "Ubuntu 20.04", ip: "10.0.5.10", publicIp: "54.123.45.70", az: "eu-central-1a", status: "maintenance" as const, uptime: "5 gün" },
    { id: "i-03de4f5067891a2b3", name: "old-worker-02", type: "t2.micro", vcpu: 1, ram: "1 GB", os: "Ubuntu 18.04", ip: "10.0.3.11", publicIp: "—", az: "eu-west-1b", status: "stopped" as const, uptime: "—" },
];

export default function SanalMakinelerPage() {
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<string[]>([]);
    const filtered = instances.filter(i => i.name.includes(search) || i.id.includes(search) || i.type.includes(search));

    return (
        <PageShell
            title="Sanal Makineler"
            description="Bulut bilişim altyapısındaki sanal makine örneklerini yönetin (EC2 eşdeğeri)"
            icon={<Server className="w-6 h-6" />}
            iconColor="#FF9900"
            breadcrumbs={[{ label: "Bilişim & İşlem" }, { label: "Sanal Makineler" }]}
            actions={
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs"><RefreshCw className="w-3.5 h-3.5" />Yenile</Button>
                    <Button size="sm" className="gap-1.5 text-xs text-white" style={{ background: "linear-gradient(135deg,#FF9900,#FF6B00)", border: "none" }}>
                        <Plus className="w-3.5 h-3.5" />Örnek Başlat
                    </Button>
                </div>
            }
        >
            {/* Stats */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <StatsCard label="Toplam Örnek" value={String(instances.length)} sub={`${instances.filter(i => i.status === "active").length} çalışıyor`} color="#FF9900" icon={<Server className="w-5 h-5" />} />
                <StatsCard label="Toplam vCPU" value={String(instances.filter(i => i.status === "active").reduce((s, i) => s + i.vcpu, 0))} sub="Aktif çekirdekler" color="#3B82F6" icon={<Cpu className="w-5 h-5" />} />
                <StatsCard label="Toplam RAM" value="57 GB" sub="Aktif örnekler" color="#10B981" icon={<HardDrive className="w-5 h-5" />} />
                <StatsCard label="Bölge" value="3" sub="Aktif availability zone" color="#8B5CF6" icon={<Globe className="w-5 h-5" />} />
            </div>

            {/* Actions bar */}
            {selected.length > 0 && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl border bg-orange-50 dark:bg-orange-950/20">
                    <span className="text-xs font-medium text-orange-700 dark:text-orange-400">{selected.length} örnek seçildi</span>
                    <div className="flex gap-2 ml-auto">
                        {[{ icon: Play, label: "Başlat" }, { icon: Square, label: "Durdur" }, { icon: RotateCcw, label: "Yeniden Başlat" }, { icon: Terminal, label: "Bağlan" }].map(({ icon: Icon, label }) => (
                            <Button key={label} variant="outline" size="sm" className="text-xs h-7 gap-1"><Icon className="w-3 h-3" />{label}</Button>
                        ))}
                        <Button variant="outline" size="sm" className="text-xs h-7 text-red-600 border-red-200 hover:bg-red-50">Sonlandır</Button>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="rounded-xl border bg-card overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-4 border-b flex-wrap">
                    <h2 className="font-semibold text-sm shrink-0">Örnekler</h2>
                    <div className="relative max-w-xs w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                        <Input placeholder="Örnek ara..." value={search} onChange={e => setSearch(e.target.value)} className="h-8 pl-8 text-xs" />
                    </div>
                    <Button variant="outline" size="sm" className="h-8 text-xs gap-1 ml-auto"><Filter className="w-3 h-3" />Filtrele</Button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/30">
                                <th className="w-10 px-4 py-3"><input type="checkbox" className="rounded accent-orange-500" onChange={e => setSelected(e.target.checked ? instances.map(i => i.id) : [])} /></th>
                                {["Ad / ID", "Tür", "vCPU / RAM", "İşletim Sistemi", "Özel IP", "Genel IP", "AZ", "Durum", "Çalışma"].map(c => (
                                    <th key={c} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{c}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filtered.map(inst => (
                                <tr key={inst.id} className="hover:bg-muted/20 transition-colors cursor-pointer" onClick={() => setSelected(p => p.includes(inst.id) ? p.filter(x => x !== inst.id) : [...p, inst.id])}>
                                    <td className="px-4 py-3"><input type="checkbox" className="rounded accent-orange-500" checked={selected.includes(inst.id)} onChange={() => { }} onClick={e => e.stopPropagation()} /></td>
                                    <td className="px-4 py-3">
                                        <div className="font-medium text-xs">{inst.name}</div>
                                        <div className="text-[10px] font-mono text-muted-foreground">{inst.id}</div>
                                    </td>
                                    <td className="px-4 py-3"><span className="text-xs bg-orange-100 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded font-mono font-medium">{inst.type}</span></td>
                                    <td className="px-4 py-3 text-xs text-muted-foreground">{inst.vcpu} / {inst.ram}</td>
                                    <td className="px-4 py-3 text-xs text-muted-foreground">{inst.os}</td>
                                    <td className="px-4 py-3 font-mono text-xs">{inst.ip}</td>
                                    <td className="px-4 py-3 font-mono text-xs text-blue-500">{inst.publicIp}</td>
                                    <td className="px-4 py-3 text-xs text-muted-foreground">{inst.az}</td>
                                    <td className="px-4 py-3"><StatusBadge status={inst.status} /></td>
                                    <td className="px-4 py-3 text-xs text-muted-foreground">{inst.uptime}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Type distribution */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                    { family: "c5 (Compute)", count: 3, color: "#FF9900" },
                    { family: "m5 (Genel)", count: 1, color: "#3B82F6" },
                    { family: "t3 (Veri taşıma)", count: 2, color: "#10B981" },
                    { family: "t2 (Eski nesil)", count: 1, color: "#6B7280" },
                ].map(({ family, count, color }) => (
                    <div key={family} className="rounded-xl border bg-card p-4 card-hover flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}18` }}>
                            <Server className="w-4 h-4" style={{ color }} />
                        </div>
                        <div>
                            <div className="text-xs font-semibold">{family}</div>
                            <div className="text-xs text-muted-foreground">{count} örnek</div>
                        </div>
                    </div>
                ))}
            </div>
        </PageShell>
    );
}
