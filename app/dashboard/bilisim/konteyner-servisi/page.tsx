"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
    Box, Plus, RefreshCw, Search, Square, Play, Trash2, Activity,
    HardDrive, Layers, AlertCircle, Loader2, X, ChevronRight,
    Network, Database, Terminal, Cpu, MemoryStick, Globe, Clock,
    ArrowUpDown, FolderOpen, Info, Zap,
} from "lucide-react";
import { PageShell, StatsCard, StatusBadge } from "@/components/dashboard/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    containerApi, networkApi, volumeApi,
    type Container, type ContainerDetails, type ContainerStats,
    type NetworkInfo, type VolumeInfo, type CreateContainerRequest, type MountSpec, type PortMapping,
} from "@/lib/compute";

// ── Helpers ────────────────────────────────────────────────────────────────────
function toMB(bytes: number) { return (bytes / 1024 / 1024).toFixed(1); }
function fmt(bytes: number): string {
    if (bytes >= 1073741824) return `${(bytes / 1073741824).toFixed(2)} GB`;
    if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)} MB`;
    if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${bytes} B`;
}
function containerStatus(s: Container["state"]): "active" | "stopped" | "maintenance" {
    return s === "running" ? "active" : s === "paused" ? "maintenance" : "stopped";
}

// ── Toast ──────────────────────────────────────────────────────────────────────
function Toast({ msg, ok, onClose }: { msg: string; ok: boolean; onClose: () => void }) {
    useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
    return (
        <div className={`fixed bottom-6 right-6 z-[100] px-4 py-3 rounded-xl shadow-xl border text-sm font-medium flex items-center gap-2 animate-in slide-in-from-bottom-2 ${ok ? "bg-green-50 border-green-200 text-green-700 dark:bg-green-950/70 dark:text-green-300 dark:border-green-800" : "bg-red-50 border-red-200 text-red-700 dark:bg-red-950/70 dark:text-red-300 dark:border-red-800"}`}>
            {ok ? <Activity className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {msg}
        </div>
    );
}

// ── Stats Mini Bar ─────────────────────────────────────────────────────────────
function StatBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
    const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
    return (
        <div>
            <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">{label}</span><span className="font-mono font-medium">{pct.toFixed(1)}%</span></div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: color }} />
            </div>
        </div>
    );
}

// ── Detail Drawer ──────────────────────────────────────────────────────────────
function ContainerDrawer({
    containerId, onClose, onAction,
}: {
    containerId: string; onClose: () => void; onAction: (msg: string, ok: boolean) => void;
}) {
    const [details, setDetails] = useState<ContainerDetails | null>(null);
    const [stats, setStats] = useState<ContainerStats | null>(null);
    const [loadingDetails, setLoadingDetails] = useState(true);
    const [tab, setTab] = useState<"info" | "env" | "mounts" | "network" | "stats">("info");
    const statsInterval = useRef<ReturnType<typeof setInterval> | null>(null);

    const fetchDetails = useCallback(async () => {
        setLoadingDetails(true);
        try { setDetails(await containerApi.get(containerId)); }
        catch { onAction("Detaylar alınamadı", false); }
        finally { setLoadingDetails(false); }
    }, [containerId, onAction]);

    const fetchStats = useCallback(async () => {
        try { setStats(await containerApi.stats(containerId)); }
        catch { /* container stopped */ }
    }, [containerId]);

    useEffect(() => {
        fetchDetails();
        fetchStats();
        statsInterval.current = setInterval(fetchStats, 3000);
        return () => { if (statsInterval.current) clearInterval(statsInterval.current); };
    }, [fetchDetails, fetchStats]);

    const doAction = async (action: "start" | "stop" | "remove") => {
        try {
            if (action === "start") await containerApi.start(containerId);
            else if (action === "stop") await containerApi.stop(containerId);
            else { await containerApi.remove(containerId, true); onClose(); return; }
            onAction(`Container ${action === "start" ? "başlatıldı" : "durduruldu"}`, true);
            setTimeout(fetchDetails, 800);
        } catch (e) { onAction(e instanceof Error ? e.message : "Hata", false); }
    };

    return (
        <div className="fixed inset-0 z-50 flex" onClick={onClose}>
            {/* Backdrop */}
            <div className="flex-1 bg-black/40 backdrop-blur-sm" />
            {/* Drawer */}
            <div className="w-full max-w-xl bg-background border-l shadow-2xl overflow-y-auto flex flex-col" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-start justify-between p-5 border-b sticky top-0 bg-background z-10">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/40 flex items-center justify-center shrink-0">
                                <Box className="w-4 h-4 text-blue-500" />
                            </div>
                            <div className="min-w-0">
                                <h2 className="font-semibold text-sm truncate">{details?.name ?? containerId}</h2>
                                <p className="text-xs font-mono text-muted-foreground">{containerId}</p>
                            </div>
                        </div>
                        {details && (
                            <div className="flex items-center gap-2 mt-2">
                                <StatusBadge status={containerStatus(details.state)} />
                                <span className="text-xs text-muted-foreground font-mono">{details.image}</span>
                            </div>
                        )}
                    </div>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors ml-2 shrink-0">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Action buttons */}
                {details && (
                    <div className="flex gap-2 px-5 py-3 border-b bg-muted/30">
                        {details.state !== "running"
                            ? <Button size="sm" className="gap-1.5 text-xs h-7 bg-green-500 hover:bg-green-600 text-white border-0" onClick={() => doAction("start")}><Play className="w-3 h-3" />Başlat</Button>
                            : <Button size="sm" variant="outline" className="gap-1.5 text-xs h-7" onClick={() => doAction("stop")}><Square className="w-3 h-3" />Durdur</Button>
                        }
                        <Button size="sm" variant="outline" className="gap-1.5 text-xs h-7 text-red-500 border-red-200 hover:bg-red-50 dark:hover:bg-red-950/30 ml-auto" onClick={() => doAction("remove")}>
                            <Trash2 className="w-3 h-3" />Sil
                        </Button>
                    </div>
                )}

                {/* Tabs */}
                <div className="flex border-b">
                    {(["info", "stats", "env", "mounts", "network"] as const).map(t => (
                        <button key={t} onClick={() => setTab(t)}
                            className={`flex-1 py-2.5 text-xs font-medium transition-colors ${tab === t ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400" : "text-muted-foreground hover:text-foreground"}`}>
                            {t === "info" ? "Bilgi" : t === "stats" ? "Performans" : t === "env" ? "Ortam" : t === "mounts" ? "Volume" : "Ağ"}
                        </button>
                    ))}
                </div>

                {/* Content */}
                {loadingDetails ? (
                    <div className="flex-1 flex items-center justify-center py-16">
                        <Loader2 className="w-7 h-7 animate-spin text-blue-500" />
                    </div>
                ) : !details ? null : (
                    <div className="flex-1 p-5 space-y-4">
                        {tab === "info" && (
                            <div className="space-y-3">
                                {[
                                    { icon: Box, label: "Image", value: details.image },
                                    { icon: Clock, label: "Oluşturulma", value: details.created ? new Date(details.created).toLocaleString("tr-TR") : "—" },
                                    { icon: Zap, label: "Yeniden Başlatma", value: details.restart_policy || "no" },
                                    { icon: Cpu, label: "CPU Kotası", value: details.cpu_quota ? `${(details.cpu_quota / 1000).toFixed(0)}%` : "Sınırsız" },
                                    { icon: MemoryStick, label: "Bellek Limiti", value: details.memory_limit_mb && details.memory_limit_mb > 0 ? `${details.memory_limit_mb} MB` : "Sınırsız" },
                                    { icon: Terminal, label: "Komut", value: details.command || "—" },
                                    { icon: Info, label: "PID", value: details.pid ? String(details.pid) : "—" },
                                    { icon: ChevronRight, label: "Exit Kodu", value: details.state !== "running" ? String(details.exit_code ?? 0) : "—" },
                                    { icon: Clock, label: "Başlatma", value: details.started_at ? new Date(details.started_at).toLocaleString("tr-TR") : "—" },
                                ].map(({ icon: Icon, label, value }) => (
                                    <div key={label} className="flex items-start gap-3">
                                        <Icon className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                                        <span className="text-xs text-muted-foreground w-28 shrink-0">{label}</span>
                                        <span className="text-xs font-medium break-all">{value}</span>
                                    </div>
                                ))}
                                {details.labels && Object.keys(details.labels).length > 0 && (
                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Etiketler</p>
                                        <div className="space-y-1">
                                            {Object.entries(details.labels).slice(0, 10).map(([k, v]) => (
                                                <div key={k} className="flex items-center gap-2 text-xs">
                                                    <span className="font-mono text-muted-foreground truncate max-w-[160px]">{k}</span>
                                                    <span className="text-muted-foreground">=</span>
                                                    <span className="font-mono truncate max-w-[140px]">{v}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {tab === "stats" && (
                            <div className="space-y-5">
                                {!stats ? (
                                    <div className="text-center py-8 text-muted-foreground text-sm">
                                        {details.state !== "running" ? "Container çalışmıyor — performans verisi yok" : <Loader2 className="w-5 h-5 animate-spin mx-auto" />}
                                    </div>
                                ) : (
                                    <>
                                        <div className="grid grid-cols-2 gap-3">
                                            {[
                                                { label: "CPU Kullanımı", value: `${stats.cpu_percent.toFixed(2)}%`, icon: Cpu, color: "#3B82F6" },
                                                { label: "Bellek", value: `${toMB(stats.mem_used_mb * 1024 * 1024)} MB`, icon: MemoryStick, color: "#10B981" },
                                                { label: "Ağ Alışverişi", value: `↓${fmt(stats.net_rx_bytes)} ↑${fmt(stats.net_tx_bytes)}`, icon: Network, color: "#8B5CF6" },
                                                { label: "PID Sayısı", value: String(stats.pids), icon: Activity, color: "#F59E0B" },
                                            ].map(({ label, value, icon: Icon, color }) => (
                                                <div key={label} className="rounded-xl border bg-card p-3">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Icon className="w-3.5 h-3.5" style={{ color }} />
                                                        <span className="text-xs text-muted-foreground">{label}</span>
                                                    </div>
                                                    <p className="text-sm font-bold">{value}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="space-y-3">
                                            <StatBar label="CPU" value={stats.cpu_percent} max={100} color="#3B82F6" />
                                            <StatBar label="Bellek" value={stats.mem_used_mb} max={stats.mem_limit_mb} color="#10B981" />
                                        </div>
                                        <div className="text-xs text-muted-foreground text-right">3sn aralıklarla güncelleniyor</div>
                                    </>
                                )}
                            </div>
                        )}

                        {tab === "env" && (
                            <div className="space-y-1">
                                {!details.env || details.env.length === 0 ? (
                                    <p className="text-xs text-muted-foreground text-center py-4">Ortam değişkeni yok</p>
                                ) : details.env.map((e, i) => {
                                    const [k, ...rest] = e.split("=");
                                    const v = rest.join("=");
                                    const isSensitive = /(password|secret|token|key|pass)/i.test(k);
                                    return (
                                        <div key={i} className="flex items-center gap-2 py-1.5 border-b border-border/50">
                                            <span className="font-mono text-xs text-blue-600 dark:text-blue-400 w-44 truncate shrink-0">{k}</span>
                                            <span className="font-mono text-xs text-muted-foreground truncate">= {isSensitive ? "••••••••" : v}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {tab === "mounts" && (
                            <div className="space-y-3">
                                {!details.mounts || details.mounts.length === 0 ? (
                                    <p className="text-xs text-muted-foreground text-center py-4">Volume/mount yok</p>
                                ) : details.mounts.map((m, i) => (
                                    <div key={i} className="rounded-xl border bg-card p-3 space-y-1.5">
                                        <div className="flex items-center gap-2">
                                            <FolderOpen className="w-3.5 h-3.5 text-orange-500" />
                                            <span className="text-xs font-semibold uppercase">{m.type}</span>
                                            <span className={`ml-auto text-[10px] px-1.5 py-0.5 rounded font-medium ${m.rw ? "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400" : "bg-gray-100 text-gray-600 dark:bg-gray-800"}`}>{m.rw ? "R/W" : "R/O"}</span>
                                        </div>
                                        <div className="text-xs text-muted-foreground font-mono">{m.source}</div>
                                        <div className="flex items-center gap-1 text-xs">
                                            <ArrowUpDown className="w-3 h-3 text-muted-foreground" />
                                            <span className="font-mono">{m.destination}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {tab === "network" && (
                            <div className="space-y-3">
                                {details.ports && details.ports.length > 0 && (
                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Port Yönlendirmeleri</p>
                                        {details.ports.map((p, i) => (
                                            <div key={i} className="flex items-center gap-2 py-1.5 border-b border-border/50 text-xs font-mono">
                                                <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                                                <span>{p.host_ip || "0.0.0.0"}:{p.host_port}</span>
                                                <ArrowUpDown className="w-3 h-3 text-muted-foreground" />
                                                <span className="text-blue-500">{p.container_port}/{p.protocol}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {details.networks && details.networks.length > 0 && (
                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Bağlı Ağlar</p>
                                        {details.networks.map((n, i) => (
                                            <div key={i} className="rounded-xl border bg-card p-3 mb-2 space-y-1">
                                                <div className="flex items-center gap-2"><Network className="w-3.5 h-3.5 text-purple-500" /><span className="text-xs font-semibold">{n.network}</span></div>
                                                {n.ip_address && <div className="text-xs font-mono text-muted-foreground">IP: {n.ip_address}</div>}
                                                {n.gateway && <div className="text-xs font-mono text-muted-foreground">GW: {n.gateway}</div>}
                                                {n.mac_address && <div className="text-xs font-mono text-muted-foreground">MAC: {n.mac_address}</div>}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

// ── Create Wizard ──────────────────────────────────────────────────────────────
const WIZARD_STEPS = ["Image", "Temel", "Portlar", "Volume", "Ağ", "Ortam", "Özet"] as const;
type WizardStep = typeof WIZARD_STEPS[number];

function CreateWizard({
    networks, volumes, onClose, onCreated,
}: {
    networks: NetworkInfo[]; volumes: VolumeInfo[];
    onClose: () => void; onCreated: () => void;
}) {
    const [step, setStep] = useState<WizardStep>("Image");
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState("");

    const [req, setReq] = useState<CreateContainerRequest>({
        name: "", image: "", restart: "no",
        ports: [], env_vars: {}, mounts: [], networks: [], memory_mb: 0, cpu_percent: 0,
    });

    // Temp state for adding items
    const [portRow, setPortRow] = useState<PortMapping>({ host_port: "", container_port: "", protocol: "tcp" });
    const [envKey, setEnvKey] = useState(""); const [envVal, setEnvVal] = useState("");
    const [mountSpec, setMountSpec] = useState<MountSpec>({ type: "volume", source: "", destination: "" });
    const [newNetName, setNewNetName] = useState(""); const [newVolName, setNewVolName] = useState("");

    const idx = WIZARD_STEPS.indexOf(step);
    const canNext = () => {
        if (step === "Image") return !!req.image.trim();
        if (step === "Temel") return !!req.name.trim();
        return true;
    };

    const submit = async () => {
        setCreating(true); setError("");
        try {
            await containerApi.create(req);
            onCreated();
        } catch (e) { setError(e instanceof Error ? e.message : "Hata oluştu"); setCreating(false); }
    };

    const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
        <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</label>
            {children}
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="w-full max-w-2xl bg-background rounded-2xl border shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <div>
                        <h2 className="font-bold text-base">Yeni Container Oluştur</h2>
                        <p className="text-xs text-muted-foreground">{step} — {idx + 1}/{WIZARD_STEPS.length}</p>
                    </div>
                    <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-lg transition-colors"><X className="w-4 h-4" /></button>
                </div>

                {/* Progress */}
                <div className="flex">
                    {WIZARD_STEPS.map((s, i) => (
                        <div key={s} className={`flex-1 h-0.5 transition-all ${i <= idx ? "bg-blue-500" : "bg-muted"}`} />
                    ))}
                </div>

                {/* Step content */}
                <div className="p-6 space-y-4 min-h-[340px]">
                    {step === "Image" && (
                        <>
                            <Field label="Docker Image">
                                <Input placeholder="nginx:latest, python:3.11-slim, redis:7-alpine…" value={req.image}
                                    onChange={e => setReq(r => ({ ...r, image: e.target.value }))} className="font-mono" />
                            </Field>
                            <div className="grid grid-cols-3 gap-2">
                                {["nginx:latest", "redis:7-alpine", "postgres:16-alpine", "node:20-alpine", "python:3.11-slim", "mongo:7"].map(img => (
                                    <button key={img} onClick={() => setReq(r => ({ ...r, image: img }))}
                                        className={`text-xs py-2 px-3 rounded-lg border font-mono transition-all ${req.image === img ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300" : "hover:border-blue-300 hover:bg-muted/50"}`}>
                                        {img}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}

                    {step === "Temel" && (
                        <>
                            <Field label="Container Adı">
                                <Input placeholder="my-nginx, api-server…" value={req.name}
                                    onChange={e => setReq(r => ({ ...r, name: e.target.value }))} />
                            </Field>
                            <div className="grid grid-cols-2 gap-4">
                                <Field label="RAM Limiti (MB)">
                                    <Input type="number" placeholder="0 = sınırsız" value={req.memory_mb || ""}
                                        onChange={e => setReq(r => ({ ...r, memory_mb: +e.target.value }))} />
                                </Field>
                                <Field label="CPU Limiti (%)">
                                    <Input type="number" placeholder="0 = sınırsız, max 100" min={0} max={100} value={req.cpu_percent || ""}
                                        onChange={e => setReq(r => ({ ...r, cpu_percent: +e.target.value }))} />
                                </Field>
                            </div>
                            <Field label="Yeniden Başlatma Politikası">
                                <div className="grid grid-cols-4 gap-2">
                                    {["no", "always", "on-failure", "unless-stopped"].map(p => (
                                        <button key={p} onClick={() => setReq(r => ({ ...r, restart: p }))}
                                            className={`text-xs py-2 rounded-lg border transition-all ${req.restart === p ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300" : "hover:border-blue-300 hover:bg-muted/50"}`}>
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </Field>
                        </>
                    )}

                    {step === "Portlar" && (
                        <>
                            <div className="flex gap-2 items-end">
                                <div className="flex-1"><label className="text-xs text-muted-foreground">Host Port</label><Input placeholder="8080" value={portRow.host_port} onChange={e => setPortRow(p => ({ ...p, host_port: e.target.value }))} /></div>
                                <div className="flex-1"><label className="text-xs text-muted-foreground">Container Port</label><Input placeholder="80" value={portRow.container_port} onChange={e => setPortRow(p => ({ ...p, container_port: e.target.value }))} /></div>
                                <div className="w-24"><label className="text-xs text-muted-foreground">Protokol</label>
                                    <select className="w-full h-9 rounded-md border bg-background px-2 text-sm" value={portRow.protocol} onChange={e => setPortRow(p => ({ ...p, protocol: e.target.value }))}>
                                        <option>tcp</option><option>udp</option>
                                    </select>
                                </div>
                                <Button size="sm" className="h-9" onClick={() => { if (portRow.host_port && portRow.container_port) { setReq(r => ({ ...r, ports: [...(r.ports ?? []), portRow] })); setPortRow({ host_port: "", container_port: "", protocol: "tcp" }); } }}>
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>
                            <div className="space-y-1 mt-2">
                                {(req.ports ?? []).map((p, i) => (
                                    <div key={i} className="flex items-center gap-2 text-xs bg-muted/40 px-3 py-2 rounded-lg">
                                        <span className="font-mono flex-1">{p.host_port} → {p.container_port}/{p.protocol}</span>
                                        <button onClick={() => setReq(r => ({ ...r, ports: r.ports?.filter((_, j) => j !== i) }))} className="text-red-400 hover:text-red-500"><X className="w-3.5 h-3.5" /></button>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {step === "Volume" && (
                        <>
                            <div className="flex gap-2 items-end">
                                <div className="flex-1">
                                    <label className="text-xs text-muted-foreground">Volume / Dizin</label>
                                    <select className="w-full h-9 rounded-md border bg-background px-2 text-sm" value={mountSpec.source} onChange={e => setMountSpec(m => ({ ...m, source: e.target.value }))}>
                                        <option value="">— Seç veya yaz —</option>
                                        {volumes.map(v => <option key={v.name} value={v.name}>{v.name}</option>)}
                                    </select>
                                </div>
                                <div className="flex-1"><label className="text-xs text-muted-foreground">Container Yolu</label><Input placeholder="/data" value={mountSpec.destination} onChange={e => setMountSpec(m => ({ ...m, destination: e.target.value }))} /></div>
                                <div className="w-24"><label className="text-xs text-muted-foreground">Tür</label>
                                    <select className="w-full h-9 rounded-md border bg-background px-2 text-sm" value={mountSpec.type} onChange={e => setMountSpec(m => ({ ...m, type: e.target.value as MountSpec["type"] }))}>
                                        <option value="volume">volume</option><option value="bind">bind</option><option value="tmpfs">tmpfs</option>
                                    </select>
                                </div>
                                <Button size="sm" className="h-9" onClick={() => { if (mountSpec.source && mountSpec.destination) { setReq(r => ({ ...r, mounts: [...(r.mounts ?? []), mountSpec] })); setMountSpec({ type: "volume", source: "", destination: "" }); } }}>
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>
                            <div className="flex gap-2">
                                <Input placeholder="Yeni volume adı" value={newVolName} onChange={e => setNewVolName(e.target.value)} className="text-sm" />
                                <Button variant="outline" size="sm" className="text-xs shrink-0" onClick={async () => {
                                    if (!newVolName) return;
                                    try { await volumeApi.create(newVolName); setNewVolName(""); volumes.push({ name: newVolName, driver: "local", mountpoint: "" }); }
                                    catch { /* ignore */ }
                                }}>Volume Oluştur</Button>
                            </div>
                            <div className="space-y-1">
                                {(req.mounts ?? []).map((m, i) => (
                                    <div key={i} className="flex items-center gap-2 text-xs bg-muted/40 px-3 py-2 rounded-lg">
                                        <span className="font-mono flex-1">{m.type}: {m.source} → {m.destination}</span>
                                        <button onClick={() => setReq(r => ({ ...r, mounts: r.mounts?.filter((_, j) => j !== i) }))} className="text-red-400"><X className="w-3.5 h-3.5" /></button>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {step === "Ağ" && (
                        <>
                            <Field label="Ağ Seç">
                                <div className="grid grid-cols-2 gap-2 max-h-44 overflow-y-auto">
                                    {networks.map(n => (
                                        <button key={n.id} onClick={() => setReq(r => ({
                                            ...r, networks: r.networks?.includes(n.name) ? r.networks.filter(x => x !== n.name) : [...(r.networks ?? []), n.name]
                                        }))} className={`flex items-center gap-2 text-xs py-2 px-3 rounded-lg border transition-all ${req.networks?.includes(n.name) ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300" : "hover:border-blue-300 hover:bg-muted/50"}`}>
                                            <Network className="w-3.5 h-3.5 shrink-0" /><span className="truncate">{n.name} <span className="text-muted-foreground">({n.driver})</span></span>
                                        </button>
                                    ))}
                                </div>
                            </Field>
                            <div className="flex gap-2">
                                <Input placeholder="Yeni ağ adı" value={newNetName} onChange={e => setNewNetName(e.target.value)} className="text-sm" />
                                <Button variant="outline" size="sm" className="text-xs shrink-0" onClick={async () => {
                                    if (!newNetName) return;
                                    try { const n = await networkApi.create(newNetName); setNewNetName(""); networks.push(n); }
                                    catch { /* ignore */ }
                                }}>Ağ Oluştur</Button>
                            </div>
                        </>
                    )}

                    {step === "Ortam" && (
                        <>
                            <div className="flex gap-2 items-center">
                                <Input placeholder="ANAHTAR" value={envKey} onChange={e => setEnvKey(e.target.value)} className="font-mono text-xs flex-1" />
                                <span className="text-muted-foreground">=</span>
                                <Input placeholder="değer" value={envVal} onChange={e => setEnvVal(e.target.value)} className="font-mono text-xs flex-1" />
                                <Button size="sm" className="shrink-0" onClick={() => { if (envKey) { setReq(r => ({ ...r, env_vars: { ...r.env_vars, [envKey]: envVal } })); setEnvKey(""); setEnvVal(""); } }}>
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>
                            <div className="space-y-1">
                                {Object.entries(req.env_vars ?? {}).map(([k, v]) => (
                                    <div key={k} className="flex items-center gap-2 text-xs bg-muted/40 px-3 py-2 rounded-lg">
                                        <span className="font-mono text-blue-600 dark:text-blue-400 shrink-0">{k}</span>
                                        <span className="text-muted-foreground">=</span>
                                        <span className="font-mono flex-1 truncate">{v}</span>
                                        <button onClick={() => setReq(r => { const ev = { ...r.env_vars }; delete ev[k]; return { ...r, env_vars: ev }; })} className="text-red-400"><X className="w-3.5 h-3.5" /></button>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {step === "Özet" && (
                        <div className="space-y-3">
                            <div className="rounded-xl border bg-muted/30 p-4 space-y-2 text-xs">
                                <p><span className="text-muted-foreground w-28 inline-block">Image</span><span className="font-mono font-medium">{req.image}</span></p>
                                <p><span className="text-muted-foreground w-28 inline-block">Ad</span><span className="font-medium">{req.name}</span></p>
                                <p><span className="text-muted-foreground w-28 inline-block">Restart</span><span>{req.restart}</span></p>
                                {(req.memory_mb ?? 0) > 0 && <p><span className="text-muted-foreground w-28 inline-block">RAM</span><span>{req.memory_mb} MB</span></p>}
                                {(req.cpu_percent ?? 0) > 0 && <p><span className="text-muted-foreground w-28 inline-block">CPU</span><span>{req.cpu_percent}%</span></p>}
                                {(req.ports?.length ?? 0) > 0 && <p><span className="text-muted-foreground w-28 inline-block">Portlar</span><span className="font-mono">{req.ports?.map(p => `${p.host_port}:${p.container_port}`).join(", ")}</span></p>}
                                {(req.mounts?.length ?? 0) > 0 && <p><span className="text-muted-foreground w-28 inline-block">Mountlar</span><span className="font-mono">{req.mounts?.map(m => m.destination).join(", ")}</span></p>}
                                {(req.networks?.length ?? 0) > 0 && <p><span className="text-muted-foreground w-28 inline-block">Ağlar</span><span>{req.networks?.join(", ")}</span></p>}
                                {Object.keys(req.env_vars ?? {}).length > 0 && <p><span className="text-muted-foreground w-28 inline-block">Ortam</span><span>{Object.keys(req.env_vars ?? {}).length} değişken</span></p>}
                            </div>
                            {error && <p className="text-xs text-red-500 bg-red-50 dark:bg-red-950/30 px-3 py-2 rounded-lg">{error}</p>}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-6 py-4 border-t bg-muted/20">
                    <Button variant="outline" size="sm" disabled={idx === 0} onClick={() => setStep(WIZARD_STEPS[idx - 1])}>Geri</Button>
                    <div className="flex gap-1">
                        {WIZARD_STEPS.map((_, i) => (
                            <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i === idx ? "bg-blue-500 w-4" : i < idx ? "bg-blue-300" : "bg-muted-foreground/30"}`} />
                        ))}
                    </div>
                    {step === "Özet" ? (
                        <Button size="sm" disabled={creating} className="gap-1.5 text-white" style={{ background: "linear-gradient(135deg,#3B82F6,#1D4ED8)", border: "none" }} onClick={submit}>
                            {creating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                            {creating ? "Oluşturuluyor…" : "Oluştur"}
                        </Button>
                    ) : (
                        <Button size="sm" disabled={!canNext()} onClick={() => setStep(WIZARD_STEPS[idx + 1])} className="gap-1">
                            İleri <ChevronRight className="w-3.5 h-3.5" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function KonteynerServisiPage() {
    const [containers, setContainers] = useState<Container[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [busy, setBusy] = useState<string | null>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [showWizard, setShowWizard] = useState(false);
    const [networks, setNetworks] = useState<NetworkInfo[]>([]);
    const [volumes, setVolumes] = useState<VolumeInfo[]>([]);
    const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

    const showToast = useCallback((msg: string, ok: boolean) => setToast({ msg, ok }), []);

    const fetchAll = useCallback(async () => {
        setLoading(true); setError(null);
        try { setContainers(await containerApi.list()); }
        catch (e) { setError(e instanceof Error ? e.message : "Bağlantı hatası"); }
        finally { setLoading(false); }
    }, []);

    const fetchMeta = useCallback(async () => {
        try {
            const [n, v] = await Promise.all([networkApi.list(), volumeApi.list()]);
            setNetworks(n); setVolumes(v);
        } catch { /* silently ignore */ }
    }, []);

    useEffect(() => { fetchAll(); fetchMeta(); }, [fetchAll, fetchMeta]);

    const doAction = async (id: string, action: "start" | "stop" | "remove") => {
        setBusy(id);
        try {
            if (action === "start") await containerApi.start(id);
            else if (action === "stop") await containerApi.stop(id);
            else { await containerApi.remove(id, true); setContainers(p => p.filter(c => c.id !== id)); setBusy(null); return; }
            showToast(`Container ${action === "start" ? "başlatıldı" : "durduruldu"}`, true);
            setTimeout(fetchAll, 800);
        } catch (e) { showToast(e instanceof Error ? e.message : "Hata", false); }
        finally { setBusy(null); }
    };

    const filtered = containers.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.image.toLowerCase().includes(search.toLowerCase()) ||
        c.id.includes(search)
    );

    const running = containers.filter(c => c.state === "running").length;

    return (
        <PageShell
            title="Konteyner Servisi"
            description="Docker containerlarını gerçek zamanlı izleyin, yönetin ve oluşturun"
            icon={<Box className="w-6 h-6" />}
            iconColor="#3B82F6"
            breadcrumbs={[{ label: "Bilişim & İşlem" }, { label: "Konteyner Servisi" }]}
            actions={
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={fetchAll} disabled={loading}>
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />Yenile
                    </Button>
                    <Button size="sm" className="gap-1.5 text-xs text-white" style={{ background: "linear-gradient(135deg,#3B82F6,#1D4ED8)", border: "none" }}
                        onClick={() => { fetchMeta(); setShowWizard(true); }}>
                        <Plus className="w-3.5 h-3.5" />Konteyner Başlat
                    </Button>
                </div>
            }
        >
            {/* Stats */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <StatsCard label="Toplam" value={String(containers.length)} sub={`${running} çalışıyor`} color="#3B82F6" icon={<Box className="w-5 h-5" />} />
                <StatsCard label="Çalışıyor" value={String(running)} sub="aktif container" color="#10B981" icon={<Activity className="w-5 h-5" />} />
                <StatsCard label="Ağ Sayısı" value={String(networks.length)} sub="Docker ağları" color="#8B5CF6" icon={<Network className="w-5 h-5" />} />
                <StatsCard label="Volume" value={String(volumes.length)} sub="kalıcı depolama" color="#F59E0B" icon={<Database className="w-5 h-5" />} />
            </div>

            {/* Table */}
            <div className="rounded-xl border bg-card overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-4 border-b flex-wrap">
                    <h2 className="font-semibold text-sm shrink-0">Containerlar</h2>
                    <div className="relative max-w-xs w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                        <Input placeholder="Container ara..." value={search} onChange={e => setSearch(e.target.value)} className="h-8 pl-8 text-xs" />
                    </div>
                    <div className="flex gap-2 ml-auto">
                        <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => containerApi.prune().then(fetchAll)}>
                            <HardDrive className="w-3 h-3 mr-1" />Temizle
                        </Button>
                    </div>
                </div>

                {loading && (
                    <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
                        <Loader2 className="w-7 h-7 animate-spin text-blue-500" />
                        <p className="text-sm">Containerlar yükleniyor...</p>
                    </div>
                )}

                {!loading && error && (
                    <div className="flex flex-col items-center justify-center py-16 gap-4">
                        <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/40 flex items-center justify-center">
                            <AlertCircle className="w-6 h-6 text-red-500" />
                        </div>
                        <div className="text-center">
                            <p className="font-medium text-sm">Bağlantı kurulamadı</p>
                            <p className="text-xs text-muted-foreground mt-1">{error}</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={fetchAll}>Tekrar Dene</Button>
                    </div>
                )}

                {!loading && !error && filtered.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
                        <Box className="w-10 h-10 opacity-30" />
                        <p className="text-sm">{containers.length === 0 ? "Hiç container yok. Yeni bir container başlatın." : "Sonuç bulunamadı."}</p>
                    </div>
                )}

                {!loading && !error && filtered.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b bg-muted/30">
                                    {["ID", "Ad", "Image", "Durum", "Portlar", "Oluşturulma", "İşlemler"].map(c => (
                                        <th key={c} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{c}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filtered.map(c => (
                                    <tr key={c.id} className="hover:bg-muted/20 transition-colors cursor-pointer"
                                        onClick={() => setSelectedId(c.id)}>
                                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{c.id}</td>
                                        <td className="px-4 py-3 font-medium text-xs">{c.name || <span className="text-muted-foreground italic">isimsiz</span>}</td>
                                        <td className="px-4 py-3">
                                            <span className="text-xs bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded font-mono">{c.image}</span>
                                        </td>
                                        <td className="px-4 py-3"><StatusBadge status={containerStatus(c.state)} /></td>
                                        <td className="px-4 py-3 text-xs font-mono text-cyan-500">
                                            {c.ports && c.ports.filter(p => p.host_port !== "0").length > 0
                                                ? c.ports.filter(p => p.host_port !== "0").map(p => `${p.host_port}→${p.container_port}`).join(", ")
                                                : "—"}
                                        </td>
                                        <td className="px-4 py-3 text-xs text-muted-foreground">
                                            {new Date(c.created).toLocaleDateString("tr-TR")}
                                        </td>
                                        <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                                            <div className="flex items-center gap-1">
                                                {c.state !== "running" && (
                                                    <button title="Başlat" disabled={busy === c.id}
                                                        onClick={() => doAction(c.id, "start")}
                                                        className="p-1.5 rounded-md hover:bg-green-100 dark:hover:bg-green-950/30 text-green-600 disabled:opacity-40 transition-colors">
                                                        {busy === c.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                                                    </button>
                                                )}
                                                {c.state === "running" && (
                                                    <button title="Durdur" disabled={busy === c.id}
                                                        onClick={() => doAction(c.id, "stop")}
                                                        className="p-1.5 rounded-md hover:bg-yellow-100 dark:hover:bg-yellow-950/30 text-yellow-600 disabled:opacity-40 transition-colors">
                                                        {busy === c.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Square className="w-3.5 h-3.5" />}
                                                    </button>
                                                )}
                                                <button title="Detay" onClick={() => setSelectedId(c.id)}
                                                    className="p-1.5 rounded-md hover:bg-blue-100 dark:hover:bg-blue-950/30 text-blue-500 transition-colors">
                                                    <Layers className="w-3.5 h-3.5" />
                                                </button>
                                                <button title="Sil" disabled={busy === c.id}
                                                    onClick={() => doAction(c.id, "remove")}
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

            {/* Networks + Volumes info */}
            {(networks.length > 0 || volumes.length > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[ 
                        { title: "Ağlar", icon: Network, color: "#8B5CF6", items: networks.map(n => ({ primary: n.name, secondary: `${n.driver} · ${n.ipam_subnet || "—"}`, badge: n.scope })) },
                        { title: "Volumeler", icon: Database, color: "#F59E0B", items: volumes.map(v => ({ primary: v.name, secondary: v.driver, badge: "" })) },
                    ].map(({ title, icon: Icon, color, items }) => (
                        <div key={title} className="rounded-xl border bg-card overflow-hidden">
                            <div className="flex items-center gap-2 px-4 py-3 border-b">
                                <Icon className="w-4 h-4" style={{ color }} /><h3 className="font-semibold text-sm">{title}</h3>
                                <span className="ml-auto text-xs text-muted-foreground">{items.length} adet</span>
                            </div>
                            <div className="divide-y divide-border max-h-40 overflow-y-auto">
                                {items.map(item => (
                                    <div key={item.primary} className="flex items-center gap-3 px-4 py-2">
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs font-medium truncate">{item.primary}</div>
                                            <div className="text-xs text-muted-foreground">{item.secondary}</div>
                                        </div>
                                        {item.badge && <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{item.badge}</span>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Detail Drawer */}
            {selectedId && (
                <ContainerDrawer
                    containerId={selectedId}
                    onClose={() => setSelectedId(null)}
                    onAction={(msg, ok) => { showToast(msg, ok); fetchAll(); }}
                />
            )}

            {/* Create Wizard */}
            {showWizard && (
                <CreateWizard
                    networks={networks} volumes={volumes}
                    onClose={() => setShowWizard(false)}
                    onCreated={() => { setShowWizard(false); showToast("Container başarıyla oluşturuldu!", true); fetchAll(); }}
                />
            )}

            {toast && <Toast msg={toast.msg} ok={toast.ok} onClose={() => setToast(null)} />}
        </PageShell>
    );
}
