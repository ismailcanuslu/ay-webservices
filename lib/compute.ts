/**
 * Compute Service API client — gateway /api/compute/*
 */

const GATEWAY = process.env.NEXT_PUBLIC_GATEWAY_URL ?? "http://localhost:8000";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("ay_webservices_auth");
    if (!raw) return null;
    return JSON.parse(raw)?.accessToken ?? null;
  } catch { return null; }
}

async function computeFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken();
  const res = await fetch(`${GATEWAY}/api/compute${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });
  const json = await res.json().catch(() => ({ error: res.statusText }));
  if (!res.ok) throw new Error(json.error ?? `HTTP ${res.status}`);
  return json.data as T;
}

// ─── VM ───────────────────────────────────────────────────────────────────────
export interface VM {
  id: number; name: string; node: string;
  status: "running" | "stopped" | "paused" | "unknown";
  cpus: number; memory_mb: number; disk_gb: number;
  ip_address?: string; uptime_seconds?: number;
}
export interface VMMetrics {
  vm_id: number; cpu_usage_percent: number;
  mem_used_mb: number; mem_total_mb: number;
}
export const vmApi = {
  list: () => computeFetch<VM[]>("/vms"),
  get: (id: number) => computeFetch<VM>(`/vms/${id}`),
  start: (id: number) => computeFetch<{ task_id: string }>(`/vms/${id}/start`, { method: "POST" }),
  stop: (id: number) => computeFetch<{ task_id: string }>(`/vms/${id}/stop`, { method: "POST" }),
  reboot: (id: number) => computeFetch<{ task_id: string }>(`/vms/${id}/reboot`, { method: "POST" }),
  delete: (id: number) => computeFetch<void>(`/vms/${id}`, { method: "DELETE" }),
  metrics: (id: number) => computeFetch<VMMetrics>(`/vms/${id}/metrics`),
};

// ─── Container Types ──────────────────────────────────────────────────────────
export interface PortMapping { host_ip?: string; host_port: string; container_port: string; protocol: string; }
export interface MountInfo { type: string; source: string; destination: string; mode: string; rw: boolean; }
export interface NetworkAttach { network: string; ip_address?: string; gateway?: string; mac_address?: string; }

export interface Container {
  id: string; name: string; image: string;
  state: "running" | "stopped" | "exited" | "paused";
  status: string; ports?: PortMapping[];
  labels?: Record<string, string>; created: string;
}
export interface ContainerDetails extends Container {
  command?: string; entrypoint?: string[];
  env?: string[]; mounts?: MountInfo[]; networks?: NetworkAttach[];
  restart_policy?: string; memory_limit_mb?: number; cpu_quota?: number;
  pid?: number; started_at?: string; finished_at?: string; exit_code?: number;
}
export interface ContainerStats {
  id: string; timestamp: string; cpu_percent: number;
  mem_used_mb: number; mem_limit_mb: number; mem_percent: number;
  net_rx_bytes: number; net_tx_bytes: number;
  block_read_bytes: number; block_write_bytes: number; pids: number;
}
export interface NetworkInfo { id: string; name: string; driver: string; scope: string; ipam_subnet?: string; }
export interface VolumeInfo { name: string; driver: string; mountpoint: string; labels?: Record<string, string>; created_at?: string; }

export interface MountSpec { type: "volume" | "bind" | "tmpfs"; source: string; destination: string; read_only?: boolean; }
export interface CreateContainerRequest {
  name: string; image: string;
  ports?: PortMapping[]; env_vars?: Record<string, string>;
  mounts?: MountSpec[]; networks?: string[];
  memory_mb?: number; cpu_percent?: number;
  restart?: string; auto_remove?: boolean; command?: string[];
}

// ─── Container API ────────────────────────────────────────────────────────────
export const containerApi = {
  list: () => computeFetch<Container[]>("/containers"),
  get: (id: string) => computeFetch<ContainerDetails>(`/containers/${id}`),
  create: (req: CreateContainerRequest) =>
    computeFetch<Container>("/containers", { method: "POST", body: JSON.stringify(req) }),
  start: (id: string) => computeFetch<{ status: string }>(`/containers/${id}/start`, { method: "POST" }),
  stop: (id: string) => computeFetch<{ status: string }>(`/containers/${id}/stop`, { method: "POST" }),
  remove: (id: string, force = false) =>
    computeFetch<void>(`/containers/${id}?force=${force}`, { method: "DELETE" }),
  logs: (id: string, tail = 100) =>
    computeFetch<{ logs: string }>(`/containers/${id}/logs?tail=${tail}`),
  stats: (id: string) => computeFetch<ContainerStats>(`/containers/${id}/stats`),
  prune: () => computeFetch<{ status: string }>("/containers/prune", { method: "POST" }),
};

// ─── Network & Volume API ─────────────────────────────────────────────────────
export const networkApi = {
  list: () => computeFetch<NetworkInfo[]>("/networks"),
  create: (name: string, driver?: string) =>
    computeFetch<NetworkInfo>("/networks", { method: "POST", body: JSON.stringify({ name, driver }) }),
};
export const volumeApi = {
  list: () => computeFetch<VolumeInfo[]>("/volumes"),
  create: (name: string, driver?: string) =>
    computeFetch<VolumeInfo>("/volumes", { method: "POST", body: JSON.stringify({ name, driver }) }),
};

// ─── K8s API ──────────────────────────────────────────────────────────────────
export interface K8sDeployment { name: string; namespace: string; image: string; replicas: number; ready: number; created_at: string; }
export interface K8sPod { name: string; namespace: string; status: string; node?: string; ip?: string; age: string; }
export const k8sApi = {
  namespaces: () => computeFetch<{ name: string; status: string }[]>("/k8s/namespaces"),
  pods: (ns: string) => computeFetch<K8sPod[]>(`/k8s/namespaces/${ns}/pods`),
  deployments: (ns?: string) => computeFetch<K8sDeployment[]>(`/k8s/deployments${ns ? `?namespace=${ns}` : ""}`),
  createDeployment: (req: object) =>
    computeFetch<K8sDeployment>("/k8s/deployments", { method: "POST", body: JSON.stringify(req) }),
  scale: (name: string, replicas: number, ns?: string) =>
    computeFetch<K8sDeployment>(`/k8s/deployments/${name}${ns ? `?namespace=${ns}` : ""}`, { method: "PUT", body: JSON.stringify({ replicas }) }),
  deleteDeployment: (name: string, ns?: string) =>
    computeFetch<void>(`/k8s/deployments/${name}${ns ? `?namespace=${ns}` : ""}`, { method: "DELETE" }),
};
