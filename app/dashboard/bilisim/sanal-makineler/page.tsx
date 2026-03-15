"use client";

import { useEffect, useState, useCallback } from "react";
import {
    Server, Plus, RefreshCw, Search, Play, Square, RotateCcw,
    Cpu, HardDrive, Activity, AlertCircle, Loader2, Filter, Trash2,
} from "lucide-react";
import { PageShell, StatsCard, StatusBadge } from "@/components/dashboard/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { vmApi, type VM } from "@/lib/compute";

// ── Status mapping ─────────────────────────────────────────────────────────────
function vmStatusToPageStatus(s: VM["status"]): "active" | "stopped" | "maintenance" | "error" {
    switch (s) {
        case "running": return "active";
        case "stopped": return "stopped";
        case "paused": return "maintenance";
        default: return "error";
    }
}

function formatUptime(sec?: number) {
    if (!sec) return "—";
    if (sec < 3600) return `${Math.floor(sec / 60)} dk`;
    if (sec < 86400) return `${Math.floor(sec / 3600)} sa`;
    return `${Math.floor(sec / 86400)} gün`;
}

// ── Toast notification (basit) ─────────────────────────────────────────────────
function Toast({ msg, ok }: { msg: string; ok: boolean }) {
    return (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium flex items-center gap-2 ${ok ? "bg-green-50 border-green-200 text-green-700 dark:bg-green-950/60 dark:text-green-300" : "bg-red-50 border-red-200 text-red-700 dark:bg-red-950/60 dark:text-red-300"}`}>
            {ok ? <Activity className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {msg}
        </div>
    );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function SanalMakinelerPage() {
    const [vms, setVms] = useState<VM[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<number[]>([]);
    const [busy, setBusy] = useState<number | null>(null);
    const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

    const showToast = (msg: string, ok: boolean) => {
        setToast({ msg, ok });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchVMs = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await vmApi.list();
            setVms(data);
        } catch (e) {
            const msg = e instanceof Error ? e.message : "Bağlantı hatası";
            setError(msg);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchVMs(); }, [fetchVMs]);

    const action = async (id: number, fn: () => Promise<unknown>, label: string) => {
        setBusy(id);
        try {
            await fn();
            showToast(`${label} işlemi başlatıldı.`, true);
            setTimeout(fetchVMs, 2000); // Proxmox task bitince yenile
        } catch (e) {
            showToast(e instanceof Error ? e.message : "Hata oluştu", false);
        } finally {
            setBusy(null);
        }
    };

    const filtered = vms.filter(v =>
        v.name.toLowerCase().includes(search.toLowerCase()) ||
        String(v.id).includes(search) ||
        (v.ip_address ?? "").includes(search)
    );

    const running = vms.filter(v => v.status === "running").length;
    const totalCPU = vms.filter(v => v.status === "running").reduce((s, v) => s + v.cpus, 0);
    const totalRAM = vms.filter(v => v.status === "running").reduce((s, v) => s + v.memory_mb, 0);

    return (
        <PageShell
            title="Sanal Makineler"
            description="Proxmox altyapısındaki sanal makine örneklerini yönetin"
            icon={<Server className="w-6 h-6" />}
            iconColor="#FF9900"
            breadcrumbs={[{ label: "Bilişim & İşlem" }, { label: "Sanal Makineler" }]}
            actions={
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={fetchVMs} disabled={loading}>
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                        Yenile
                    </Button>
                    <Button size="sm" className="gap-1.5 text-xs text-white" style={{ background: "linear-gradient(135deg,#FF9900,#FF6B00)", border: "none" }}>
                        <Plus className="w-3.5 h-3.5" />VM Oluştur
                    </Button>
                </div>
            }
        >
            {/* Stats */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <StatsCard label="Toplam VM" value={String(vms.length)} sub={`${running} çalışıyor`} color="#FF9900" icon={<Server className="w-5 h-5" />} />
                <StatsCard label="Toplam vCPU" value={String(totalCPU)} sub="Çalışan örnekler" color="#3B82F6" icon={<Cpu className="w-5 h-5" />} />
                <StatsCard label="Toplam RAM" value={`${(totalRAM / 1024).toFixed(0)} GB`} sub="Çalışan örnekler" color="#10B981" icon={<HardDrive className="w-5 h-5" />} />
                <StatsCard label="Durdurulmuş" value={String(vms.filter(v => v.status === "stopped").length)} sub="VM" color="#6B7280" icon={<Square className="w-5 h-5" />} />
            </div>

            {/* Bulk action bar */}
            {selected.length > 0 && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl border bg-orange-50 dark:bg-orange-950/20">
                    <span className="text-xs font-medium text-orange-700 dark:text-orange-400">{selected.length} VM seçildi</span>
                    <div className="flex gap-2 ml-auto">
                        <Button variant="outline" size="sm" className="text-xs h-7 gap-1" onClick={() => selected.forEach(id => action(id, () => vmApi.start(id), "Başlat"))}>
                            <Play className="w-3 h-3" />Başlat
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs h-7 gap-1" onClick={() => selected.forEach(id => action(id, () => vmApi.stop(id), "Durdur"))}>
                            <Square className="w-3 h-3" />Durdur
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs h-7 gap-1" onClick={() => selected.forEach(id => action(id, () => vmApi.reboot(id), "Yeniden Başlat"))}>
                            <RotateCcw className="w-3 h-3" />Yeniden Başlat
                        </Button>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="rounded-xl border bg-card overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-4 border-b flex-wrap">
                    <h2 className="font-semibold text-sm shrink-0">VM Listesi</h2>
                    <div className="relative max-w-xs w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                        <Input placeholder="VM ara..." value={search} onChange={e => setSearch(e.target.value)} className="h-8 pl-8 text-xs" />
                    </div>
                    <Button variant="outline" size="sm" className="h-8 text-xs gap-1 ml-auto"><Filter className="w-3 h-3" />Filtrele</Button>
                </div>

                {/* Loading state */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                        <p className="text-sm">Proxmox&apos;tan VM listesi alınıyor...</p>
                    </div>
                )}

                {/* Error state */}
                {!loading && error && (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/40 flex items-center justify-center">
                            <AlertCircle className="w-6 h-6 text-red-500" />
                        </div>
                        <div className="text-center">
                            <p className="font-medium text-sm">Bağlantı kurulamadı</p>
                            <p className="text-xs text-muted-foreground mt-1">{error}</p>
                            <p className="text-xs text-muted-foreground mt-1">Compute service çalışıyor mu? <code className="bg-muted px-1 rounded">make run</code></p>
                        </div>
                        <Button variant="outline" size="sm" onClick={fetchVMs}>Tekrar Dene</Button>
                    </div>
                )}

                {/* Empty state */}
                {!loading && !error && filtered.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
                        <Server className="w-10 h-10 opacity-30" />
                        <p className="text-sm">{vms.length === 0 ? "Henüz VM yok. Yeni bir VM oluşturun." : "Arama sonucu bulunamadı."}</p>
                    </div>
                )}

                {/* Table rows */}
                {!loading && !error && filtered.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b bg-muted/30">
                                    <th className="w-10 px-4 py-3">
                                        <input type="checkbox" className="rounded accent-orange-500"
                                            onChange={e => setSelected(e.target.checked ? filtered.map(v => v.id) : [])} />
                                    </th>
                                    {["Ad / ID", "Node", "vCPU / RAM", "Disk", "IP", "Durum", "Çalışma", "İşlemler"].map(c => (
                                        <th key={c} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{c}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filtered.map(v => (
                                    <tr key={v.id} className="hover:bg-muted/20 transition-colors">
                                        <td className="px-4 py-3">
                                            <input type="checkbox" className="rounded accent-orange-500"
                                                checked={selected.includes(v.id)}
                                                onChange={() => setSelected(p => p.includes(v.id) ? p.filter(x => x !== v.id) : [...p, v.id])} />
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="font-medium text-xs">{v.name}</div>
                                            <div className="text-[10px] font-mono text-muted-foreground">VM-{v.id}</div>
                                        </td>
                                        <td className="px-4 py-3 text-xs text-muted-foreground">{v.node}</td>
                                        <td className="px-4 py-3 text-xs text-muted-foreground">{v.cpus} vCPU / {(v.memory_mb / 1024).toFixed(0)} GB</td>
                                        <td className="px-4 py-3 text-xs text-muted-foreground">{v.disk_gb.toFixed(0)} GB</td>
                                        <td className="px-4 py-3 font-mono text-xs">{v.ip_address ?? "—"}</td>
                                        <td className="px-4 py-3"><StatusBadge status={vmStatusToPageStatus(v.status)} /></td>
                                        <td className="px-4 py-3 text-xs text-muted-foreground">{formatUptime(v.uptime_seconds)}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1">
                                                {v.status !== "running" && (
                                                    <button title="Başlat" disabled={busy === v.id}
                                                        onClick={() => action(v.id, () => vmApi.start(v.id), "Başlat")}
                                                        className="p-1.5 rounded-md hover:bg-green-100 dark:hover:bg-green-950/30 text-green-600 disabled:opacity-40 transition-colors">
                                                        {busy === v.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                                                    </button>
                                                )}
                                                {v.status === "running" && (
                                                    <button title="Durdur" disabled={busy === v.id}
                                                        onClick={() => action(v.id, () => vmApi.stop(v.id), "Durdur")}
                                                        className="p-1.5 rounded-md hover:bg-yellow-100 dark:hover:bg-yellow-950/30 text-yellow-600 disabled:opacity-40 transition-colors">
                                                        {busy === v.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Square className="w-3.5 h-3.5" />}
                                                    </button>
                                                )}
                                                <button title="Yeniden Başlat" disabled={busy === v.id || v.status !== "running"}
                                                    onClick={() => action(v.id, () => vmApi.reboot(v.id), "Yeniden Başlat")}
                                                    className="p-1.5 rounded-md hover:bg-blue-100 dark:hover:bg-blue-950/30 text-blue-500 disabled:opacity-30 transition-colors">
                                                    <RotateCcw className="w-3.5 h-3.5" />
                                                </button>
                                                <button title="Sil" disabled={busy === v.id || v.status === "running"}
                                                    onClick={() => action(v.id, () => vmApi.delete(v.id), "Silindi")}
                                                    className="p-1.5 rounded-md hover:bg-red-100 dark:hover:bg-red-950/30 text-red-500 disabled:opacity-30 transition-colors">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {toast && <Toast msg={toast.msg} ok={toast.ok} />}
        </PageShell>
    );
}
