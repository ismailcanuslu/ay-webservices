"use client";

import { Cpu, Plus, Zap, HardDrive, Activity, Server, RefreshCw } from "lucide-react";
import { PageShell, StatsCard, StatusBadge } from "@/components/dashboard/page-shell";
import { Button } from "@/components/ui/button";

const instances = [
    { id: "lh-01fa2b3c4d5e", name: "nano-api-01", type: "nano_2_0", vcpu: 2, ram: "0.5 GB", storage: "20 GB SSD", ip: "10.0.10.1", publicIp: "45.12.34.56", status: "active" as const, monthly: "₺28" },
    { id: "lh-02bc3d4e5f60", name: "micro-web-01", type: "micro_2_0", vcpu: 2, ram: "1 GB", storage: "40 GB SSD", ip: "10.0.10.2", publicIp: "45.12.34.57", status: "active" as const, monthly: "₺56" },
    { id: "lh-03cd4e5f6071", name: "small-app-01", type: "small_2_0", vcpu: 2, ram: "2 GB", storage: "60 GB SSD", ip: "10.0.10.3", publicIp: "45.12.34.58", status: "active" as const, monthly: "₺112" },
    { id: "lh-04de5f607182", name: "dev-sandbox-01", type: "micro_2_0", vcpu: 2, ram: "1 GB", storage: "40 GB SSD", ip: "10.0.10.4", publicIp: "—", status: "stopped" as const, monthly: "₺56" },
];

export default function IsikHesaplamaPage() {
    return (
        <PageShell
            title="Işık Hesaplama"
            description="Düşük maliyetli, basit sanal sunucu örnekleri — geliştirme ve küçük ölçekli uygulamalar için (Lightsail eşdeğeri)"
            icon={<Cpu className="w-6 h-6" />}
            iconColor="#8B5CF6"
            breadcrumbs={[{ label: "Bilişim & İşlem" }, { label: "Işık Hesaplama" }]}
            actions={
                <Button size="sm" className="gap-1.5 text-xs text-white" style={{ background: "linear-gradient(135deg,#FF9900,#FF6B00)", border: "none" }}>
                    <Plus className="w-3.5 h-3.5" />Örnek Oluştur
                </Button>
            }
        >
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <StatsCard label="Toplam Örnek" value={String(instances.length)} sub={`${instances.filter(i => i.status === "active").length} çalışıyor`} color="#8B5CF6" icon={<Server className="w-5 h-5" />} />
                <StatsCard label="Aylık Maliyet" value="₺252" sub="Tüm örnekler" color="#10B981" icon={<Zap className="w-5 h-5" />} />
                <StatsCard label="Toplam Depolama" value="160 GB" sub="SSD" color="#3B82F6" icon={<HardDrive className="w-5 h-5" />} />
                <StatsCard label="Bant Genişliği" value="4 TB" sub="Aylık dahil" color="#F59E0B" icon={<Activity className="w-5 h-5" />} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {instances.map(inst => (
                    <div key={inst.id} className="rounded-xl border bg-card p-5 card-hover">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950/30 flex items-center justify-center">
                                    <Cpu className="w-4.5 h-4.5" style={{ color: "#8B5CF6" }} />
                                </div>
                                <div>
                                    <div className="font-semibold text-sm" style={{ color: "#8B5CF6" }}>{inst.name}</div>
                                    <div className="text-[10px] font-mono text-muted-foreground">{inst.id}</div>
                                </div>
                            </div>
                            <StatusBadge status={inst.status} />
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                            <div><span className="text-muted-foreground">Tür:</span> <span className="font-mono font-medium">{inst.type}</span></div>
                            <div><span className="text-muted-foreground">vCPU:</span> <span className="font-medium">{inst.vcpu}</span></div>
                            <div><span className="text-muted-foreground">RAM:</span> <span className="font-medium">{inst.ram}</span></div>
                            <div><span className="text-muted-foreground">Disk:</span> <span className="font-medium">{inst.storage}</span></div>
                            <div><span className="text-muted-foreground">Özel IP:</span> <span className="font-mono">{inst.ip}</span></div>
                            <div><span className="text-muted-foreground">Genel IP:</span> <span className="font-mono text-blue-500">{inst.publicIp}</span></div>
                        </div>
                        <div className="mt-4 pt-4 border-t flex items-center justify-between">
                            <span className="text-lg font-bold" style={{ color: "#8B5CF6" }}>{inst.monthly}<span className="text-xs text-muted-foreground font-normal">/ay</span></span>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="text-xs h-7"><RefreshCw className="w-3 h-3 mr-1" />Yönet</Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Plan karşılaştırma */}
            <div className="rounded-xl border bg-card overflow-hidden">
                <div className="px-5 py-4 border-b"><h2 className="font-semibold text-sm">Mevcut Planlar</h2></div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/30">
                                {["Plan", "vCPU", "RAM", "Depolama", "Aylık Fiyat"].map(c => (
                                    <th key={c} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">{c}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {[
                                { plan: "nano_2_0", cpu: 2, ram: "0.5 GB", disk: "20 GB", price: "₺28" },
                                { plan: "micro_2_0", cpu: 2, ram: "1 GB", disk: "40 GB", price: "₺56" },
                                { plan: "small_2_0", cpu: 2, ram: "2 GB", disk: "60 GB", price: "₺112" },
                                { plan: "medium_2_0", cpu: 2, ram: "4 GB", disk: "80 GB", price: "₺224" },
                                { plan: "large_2_0", cpu: 4, ram: "8 GB", disk: "160 GB", price: "₺420" },
                            ].map(p => (
                                <tr key={p.plan} className="hover:bg-muted/20 transition-colors">
                                    <td className="px-5 py-3 font-mono text-xs font-medium text-purple-500">{p.plan}</td>
                                    <td className="px-5 py-3 text-sm">{p.cpu}</td>
                                    <td className="px-5 py-3 text-sm">{p.ram}</td>
                                    <td className="px-5 py-3 text-sm">{p.disk}</td>
                                    <td className="px-5 py-3 text-sm font-bold" style={{ color: "#8B5CF6" }}>{p.price}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </PageShell>
    );
}
