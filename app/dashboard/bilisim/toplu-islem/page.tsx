"use client";

import { RefreshCw, Plus, Clock, Cpu, CheckCircle, XCircle, Activity } from "lucide-react";
import { PageShell, StatsCard, StatusBadge } from "@/components/dashboard/page-shell";
import { Button } from "@/components/ui/button";

const jobs = [
    { id: "job-2024-0301-001", name: "Veri Dışa Aktarımı", type: "Array", queued: 0, running: 0, succeeded: 1000, failed: 0, duration: "4s 12dk", created: "01.03.2024", status: "active" as const },
    { id: "job-2024-0302-002", name: "ML Model Eğitimi", type: "Paralel", queued: 5, running: 12, succeeded: 83, failed: 0, duration: "Devam ediyor", created: "Bugün", status: "creating" as const },
    { id: "job-2024-0302-003", name: "Medya İşleme", type: "Array", queued: 120, running: 50, succeeded: 830, failed: 2, duration: "Devam ediyor", created: "Bugün", status: "creating" as const },
    { id: "job-2024-0228-004", name: "Aylık Rapor Üretimi", type: "Tekli", queued: 0, running: 0, succeeded: 1, failed: 0, duration: "2s 34dk", created: "28.02.2024", status: "active" as const },
    { id: "job-2024-0228-005", name: "Veritabanı Temizleme", type: "Tekli", queued: 0, running: 0, succeeded: 0, failed: 1, duration: "12dk", created: "28.02.2024", status: "stopped" as const },
];

export default function TopluIslemPage() {
    return (
        <PageShell
            title="Toplu İşlem"
            description="Büyük ölçekli hesaplama işlerini yönetin ve izleyin (Batch eşdeğeri)"
            icon={<RefreshCw className="w-6 h-6" />}
            iconColor="#06B6D4"
            breadcrumbs={[{ label: "Bilişim & İşlem" }, { label: "Toplu İşlem" }]}
            actions={
                <Button size="sm" className="gap-1.5 text-xs text-white" style={{ background: "linear-gradient(135deg,#FF9900,#FF6B00)", border: "none" }}>
                    <Plus className="w-3.5 h-3.5" />İş Gönder
                </Button>
            }
        >
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <StatsCard label="Toplam İş" value={String(jobs.length)} sub="Tüm zamanlar" color="#06B6D4" icon={<Activity className="w-5 h-5" />} />
                <StatsCard label="Çalışıyor" value="62" sub="Aktif görev" color="#10B981" icon={<Cpu className="w-5 h-5" />} />
                <StatsCard label="Başarı" value="1914" sub="Tamamlanan görev" color="#8B5CF6" icon={<CheckCircle className="w-5 h-5" />} />
                <StatsCard label="Hata" value="3" sub="Başarısız görev" color="#EF4444" icon={<XCircle className="w-5 h-5" />} />
            </div>

            <div className="rounded-xl border bg-card overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b">
                    <h2 className="font-semibold text-sm">İş Kuyruğu</h2>
                    <Button variant="outline" size="sm" className="text-xs h-8 gap-1"><RefreshCw className="w-3 h-3" />Yenile</Button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/30">
                                {["İş Adı", "Tür", "Bekleyen", "Çalışan", "Başarılı", "Hatalı", "Süre", "Tarih", "Durum"].map(c => (
                                    <th key={c} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{c}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {jobs.map(j => (
                                <tr key={j.id} className="hover:bg-muted/20 transition-colors">
                                    <td className="px-5 py-3">
                                        <div className="font-medium text-xs text-cyan-500">{j.name}</div>
                                        <div className="text-[10px] font-mono text-muted-foreground">{j.id}</div>
                                    </td>
                                    <td className="px-5 py-3"><span className="text-xs bg-muted px-2 py-0.5 rounded">{j.type}</span></td>
                                    <td className="px-5 py-3 text-sm font-medium text-yellow-500">{j.queued}</td>
                                    <td className="px-5 py-3 text-sm font-medium text-blue-500">{j.running}</td>
                                    <td className="px-5 py-3 text-sm font-medium text-green-500">{j.succeeded}</td>
                                    <td className="px-5 py-3 text-sm font-medium text-red-500">{j.failed}</td>
                                    <td className="px-5 py-3 text-xs text-muted-foreground">
                                        <div className="flex items-center gap-1"><Clock className="w-3 h-3" />{j.duration}</div>
                                    </td>
                                    <td className="px-5 py-3 text-xs text-muted-foreground">{j.created}</td>
                                    <td className="px-5 py-3"><StatusBadge status={j.status} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </PageShell>
    );
}
