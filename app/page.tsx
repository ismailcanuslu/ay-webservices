import Link from "next/link";
import { Cloud, Server, Database, Shield, Globe, Cpu, ArrowRight, CheckCircle } from "lucide-react";

const features = [
  { icon: Server, title: "Sanal Makineler", desc: "Ölçeklenebilir bulut sunucuları", color: "#FF9900" },
  { icon: Database, title: "Yönetilen Veritabanları", desc: "SQL ve NoSQL çözümleri", color: "#3B82F6" },
  { icon: Shield, title: "Güvenlik & Kimlik", desc: "IAM ve erişim kontrolü", color: "#10B981" },
  { icon: Globe, title: "DNS Hizmeti", desc: "Global DNS yönetimi", color: "#8B5CF6" },
  { icon: Cpu, title: "Sunucusuz İşlevler", desc: "Olay güdümlü hesaplama", color: "#F59E0B" },
  { icon: Cloud, title: "Nesne Depolama", desc: "Sınırsız bulut depolama", color: "#06B6D4" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "hsl(215 25% 10%)" }}>
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #FF9900 0%, #FF6B00 100%)" }}
          >
            <Cloud className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold text-white">AY Web Services</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all duration-200 hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #FF9900 0%, #FF6B00 100%)" }}
          >
            Oturum Aç
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6" style={{ backgroundColor: "rgba(255,153,0,0.12)", color: "#FF9900", border: "1px solid rgba(255,153,0,0.25)" }}>
            <CheckCircle className="w-3.5 h-3.5" />
            Tüm sistemler çalışıyor
          </div>
          <h1 className="text-5xl font-bold text-white mb-5 leading-tight">
            Bulut Altyapınızı<br />
            <span style={{ background: "linear-gradient(135deg, #FF9900 0%, #FF6B00 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Kolayca Yönetin
            </span>
          </h1>
          <p className="text-lg text-gray-400 mb-8">
            AY Web Services ile tüm bulut hizmetlerinizi tek bir konsoldan yönetin. Sanal makinelerden veritabanlarına, DNS&apos;ten güvenliğe kadar kapsamlı çözümler.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/login"
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #FF9900 0%, #FF6B00 100%)" }}
            >
              Konsola Giriş Yap
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#"
              className="px-6 py-3 rounded-xl text-sm font-semibold transition-colors"
              style={{ backgroundColor: "rgba(255,255,255,0.06)", color: "#d1d5db", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              Dökümantasyon
            </a>
          </div>
        </div>

        {/* Servis kartları */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 max-w-5xl w-full">
          {features.map(({ icon: Icon, title, desc, color }) => (
            <Link
              key={title}
              href="/login"
              className="flex flex-col items-center gap-3 p-4 rounded-xl text-center group transition-all duration-200 hover:scale-105"
              style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${color}18`, border: `1px solid ${color}30` }}
              >
                <Icon className="w-6 h-6" style={{ color }} />
              </div>
              <div>
                <p className="text-xs font-semibold text-white leading-tight">{title}</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-tight">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-6 border-t text-center" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <p className="text-xs text-gray-600">© 2026 AY Web Services. Tüm hakları saklıdır.</p>
      </footer>
    </div>
  );
}
