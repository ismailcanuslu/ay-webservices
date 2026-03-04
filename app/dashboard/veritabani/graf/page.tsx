"use client";

import { GitBranch, Plus, RefreshCw, Network, Activity, Layers, Search } from "lucide-react";
import { PageShell, StatsCard, StatusBadge } from "@/components/dashboard/page-shell";
import { Button } from "@/components/ui/button";

const graphs = [
    {
        name: "kullanici_iliski_agi",
        nodes: 2_400_000,
        edges: 18_700_000,
        type: "Yönsüz",
        algorithm: "PageRank",
        status: "active" as const,
        desc: "Kullanıcılar arası takip ve arkadaşlık ilişkileri",
    },
    {
        name: "urun_oneri_agi",
        nodes: 142_000,
        edges: 4_500_000,
        type: "Yönlü",
        algorithm: "Collaborative Filtering",
        status: "active" as const,
        desc: "Ürün-kullanıcı satın alma ve görüntüleme grafı",
    },
    {
        name: "fraud_detection",
        nodes: 890_000,
        edges: 6_200_000,
        type: "Yönlü",
        algorithm: "GNN (Graph Neural Net)",
        status: "active" as const,
        desc: "Şüpheli işlem zinciri tespiti",
    },
    {
        name: "bilgi_grafı",
        nodes: 5_000_000,
        edges: 34_000_000,
        type: "RDF",
        algorithm: "SPARQL Query",
        status: "maintenance" as const,
        desc: "Kurumsal bilgi tabanı ve ilişki ağı",
    },
];

function formatNumber(n: number) {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
    return String(n);
}

// Basit graf görselleştirme (SVG)
function MiniGraphViz({ color }: { color: string }) {
    const nodes = [
        { cx: 40, cy: 25 }, { cx: 70, cy: 10 }, { cx: 80, cy: 40 },
        { cx: 50, cy: 50 }, { cx: 20, cy: 45 }, { cx: 30, cy: 10 },
    ];
    const edges = [[0, 1], [0, 2], [0, 3], [0, 4], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0]];
    return (
        <svg width="100" height="60" className="overflow-visible" style={{ opacity: 0.8 }}>
            {edges.map(([a, b], i) => (
                <line key={i} x1={nodes[a].cx} y1={nodes[a].cy} x2={nodes[b].cx} y2={nodes[b].cy} stroke={color} strokeWidth="1" strokeOpacity="0.4" />
            ))}
            {nodes.map((n, i) => (
                <circle key={i} cx={n.cx} cy={n.cy} r={i === 0 ? 5 : 3} fill={color} fillOpacity={i === 0 ? 1 : 0.6} />
            ))}
        </svg>
    );
}

export default function GrafVtPage() {
    const totalNodes = graphs.reduce((s, g) => s + g.nodes, 0);
    const totalEdges = graphs.reduce((s, g) => s + g.edges, 0);

    return (
        <PageShell
            title="Graf Veritabanı"
            description="Karmaşık ilişki ağlarını grafik yapısında depolayan ve sorgulayan veritabanı"
            icon={<GitBranch className="w-6 h-6" />}
            iconColor="#EC4899"
            breadcrumbs={[{ label: "Veritabanı" }, { label: "Graf Veritabanı" }]}
            actions={
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="text-xs gap-1.5"><RefreshCw className="w-3.5 h-3.5" />Yenile</Button>
                    <Button size="sm" className="text-xs gap-1.5 text-white" style={{ background: "linear-gradient(135deg,#FF9900,#FF6B00)", border: "none" }}>
                        <Plus className="w-3.5 h-3.5" />Yeni Graf
                    </Button>
                </div>
            }
        >
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <StatsCard label="Toplam Graf" value={String(graphs.length)} sub="Aktif graflar" color="#EC4899" icon={<Network className="w-5 h-5" />} />
                <StatsCard label="Toplam Düğüm" value={formatNumber(totalNodes)} sub="Tüm graflarda" color="#6366F1" icon={<Layers className="w-5 h-5" />} />
                <StatsCard label="Toplam Kenar" value={formatNumber(totalEdges)} sub="İlişki sayısı" color="#10B981" icon={<GitBranch className="w-5 h-5" />} />
                <StatsCard label="Sorgu/Saniye" value="3.2K" sub="Geçişsel sorgular" color="#F59E0B" icon={<Activity className="w-5 h-5" />} />
            </div>

            {/* Graf Kartları */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {graphs.map((graph) => (
                    <div key={graph.name} className="rounded-xl border bg-card p-5 card-hover">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <div className="font-mono text-sm font-semibold text-pink-500">{graph.name}</div>
                                <div className="text-xs text-muted-foreground mt-0.5">{graph.desc}</div>
                            </div>
                            <StatusBadge status={graph.status} />
                        </div>

                        <div className="flex items-end justify-between">
                            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                                <div>
                                    <p className="text-xs text-muted-foreground">Düğüm</p>
                                    <p className="text-lg font-bold text-foreground">{formatNumber(graph.nodes)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Kenar</p>
                                    <p className="text-lg font-bold text-foreground">{formatNumber(graph.edges)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Tür</p>
                                    <span className="text-xs bg-pink-100 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 px-2 py-0.5 rounded-full font-medium">{graph.type}</span>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Algoritma</p>
                                    <p className="text-xs font-medium truncate max-w-[120px]">{graph.algorithm}</p>
                                </div>
                            </div>
                            <MiniGraphViz color="#EC4899" />
                        </div>

                        <div className="mt-4 pt-4 border-t flex gap-3">
                            <button className="text-xs text-blue-500 hover:text-blue-600 font-medium transition-colors">Grafı Görselleştir →</button>
                            <button className="text-xs text-orange-500 hover:text-orange-600 font-medium transition-colors">Sorgula →</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Sorgu Kutusu */}
            <div className="rounded-xl border bg-card overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-4 border-b">
                    <Search className="w-4 h-4 text-muted-foreground" />
                    <h2 className="font-semibold text-sm">Graf Sorgu Konsolu (Cypher)</h2>
                    <span className="ml-auto text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">Sadece önizleme</span>
                </div>
                <div className="p-5">
                    <div className="rounded-lg bg-muted/40 border p-4 font-mono text-xs text-green-500 leading-relaxed">
                        <span className="text-blue-400">MATCH</span> (u:Kullanici)<span className="text-pink-400">-</span>[r:TAKIP_EDIYOR]<span className="text-pink-400">-&gt;</span>(hedef:Kullanici)<br />
                        <span className="text-blue-400">WHERE</span> u.id = <span className="text-amber-400">&apos;usr_12345&apos;</span><br />
                        <span className="text-blue-400">RETURN</span> hedef.isim, hedef.email, r.baslangic<br />
                        <span className="text-blue-400">LIMIT</span> <span className="text-orange-400">25</span>
                    </div>
                    <div className="mt-3 flex justify-end">
                        <Button size="sm" className="text-xs gap-1.5 text-white" style={{ background: "linear-gradient(135deg,#EC4899,#BE185D)", border: "none" }}>
                            Sorguyu Çalıştır
                        </Button>
                    </div>
                </div>
            </div>
        </PageShell>
    );
}
