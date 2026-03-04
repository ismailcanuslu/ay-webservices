<div align="center">

<img src="https://img.shields.io/badge/AY%20Web%20Services-FF6B00?style=for-the-badge&logo=amazonaws&logoColor=white" height="40"/>

# ☁️ AY Web Services

### Yerli Bulut Altyapısı — Vizyon ve Mimari Belgesi

[![Status](https://img.shields.io/badge/Durum-Aktif%20Geliştirme-brightgreen?style=flat-square)](https://github.com)
[![Stack](https://img.shields.io/badge/Stack-.NET%20%7C%20Next.js%20%7C%20Rust%20%7C%20Go-blue?style=flat-square)](https://github.com)
[![Infra](https://img.shields.io/badge/Altyapı-Proxmox%20%7C%20Docker%20%7C%20K8s-blueviolet?style=flat-square)](https://github.com)
[![License](https://img.shields.io/badge/Lisans-Proprietary-red?style=flat-square)](https://github.com)

</div>

---

## 📖 İçindekiler

- [🎯 Vizyon ve Motivasyon](#-vizyon-ve-motivasyon)
- [🌑 Yerli Girişimlerin Gölgede Kalması](#-yerli-girişimlerin-gölgede-kalması)
- [🛠️ Teknoloji Yığını](#%EF%B8%8F-teknoloji-yığını)
- [📦 Modül Kataloğu](#-modül-kataloğu)
  - [🖥️ Sunucular](#%EF%B8%8F-sunucular)
  - [⚙️ İşlem Hizmetleri](#%EF%B8%8F-i̇şlem-hizmetleri)
  - [💾 Depolama](#-depolama)
  - [🗄️ Veritabanı](#%EF%B8%8F-veritabanı)
  - [🌐 Ağ](#-ağ)
  - [🚀 İçerik Dağıtımı](#-i̇çerik-dağıtımı)
  - [🛡️ Güvenlik](#%EF%B8%8F-güvenlik)
  - [🔐 Kimlik Yönetimi](#-kimlik-yönetimi)
  - [📊 İzleme](#-i̇zleme)
  - [🔧 Yönetim](#-yönetim)
  - [💻 Geliştirici Araçları](#-geliştirici-araçları)
  - [💬 Mesajlaşma](#-mesajlaşma)
  - [🔗 Entegrasyon](#-entegrasyon)
  - [🤖 Yapay Zeka](#-yapay-zeka)
  - [🧠 Makine Öğrenmesi](#-makine-öğrenmesi)
- [🎤 Kapanış](#-kapanış)
- [🙏 Teşekkür](#-teşekkür)

---

## 🎯 Vizyon ve Motivasyon

Türkiye'de teknoloji girişimleri, onlarca yıldır bir paradoks içinde büyüdü: yurt içinde dünya standartlarında yazılım üreten şirketler, kendi altyapıları için bir dışarıya bağımlı kaldı. Amazon Web Services, Google Cloud Platform ve Microsoft Azure; depolama, hesaplama, yapay zeka ve güvenlik ihtiyaçlarımızı karşılarken veri egemenliğimizi, rekabet gücümüzü ve bütçemizi yurt dışına taşıdı.

**AY Web Services bu paradoksu kırmak için doğdu.**

Vizyonumuz tek cümleyle özetlenebilir:

> *Türk geliştiricilere, küçük ve orta ölçekli işletmelere ve kurumsal şirketlere — global bulut devleriyle boy ölçüşen, ancak yerli dil ve kültürüyle konuşan, verilerini yurt içinde tutan ve fiyatlarını Türk Lirası bazlı sunan — bir bulut altyapısı sağlamak.*

---

## 🌑 Yerli Girişimlerin Gölgede Kalması

Global bulut sağlayıcılarının piyasaya hâkim olması, yerli bulut girişimcileri üzerinde derin bir caydırıcı etki yarattı. Geliştirici ekosistemi, bir noktada *"neden bir AWS alternatifi yapalım ki?"* sorusuyla teslim oldu. Bu sorunun cevabı aslında çok net:

| # | Sorun | Açıklama |
|---|-------|----------|
| 🏛️ | **Veri Egemenliği** | KVKK ve sektörel regülasyonlar, kritik verilerin yurt dışına çıkmamasını zorunlu kılıyor; ancak mevcut yerli seçenekler hem işlevsellik hem güvenilirlik açısından yetersiz kalıyor. |
| 💸 | **Döviz Baskısı** | USD/EUR bazlı faturalandırma, TL değer kayıplarını doğrudan operasyonel maliyete dönüştürüyor; start-up'ların bütçe planlamasını imkânsızlaştırıyor. |
| 🎧 | **Teknik Destek Boşluğu** | Türkçe dokümantasyon, yerli saat dilimine uygun 7/24 destek ve kültürel bağlamı olan mühendislik ekipleri pratikte bulunmuyor. |
| 🔄 | **Ekosistem Bağımlılığı** | Geliştirici toplulukları, eğitim içerikleri, sertifikasyon programları ve işe alım pratikleri tamamıyla yabancı platformlar etrafında şekilleniyor. |

AY Web Services yalnızca bir ürün değil, bu sorunlara verilen **sistemik bir yanıttır.** Yazılım mimarisi, Türkiye'nin teknik yeteneklerini gösterecek şekilde; .NET, Next.js, Rust, Go, Shell ile Proxmox ve Docker tabanlı modern ve savaşta test edilmiş teknoloji yığını üzerine inşa edilmektedir.

---

## 🛠️ Teknoloji Yığını

Platform, katmanlı ve birbirinden bağımsız ölçeklenebilen bir mimariye sahiptir:

```
┌─────────────────────────────────────────────────────────────┐
│                      YÖNETİM KONSOLU                        │
│                    Next.js + TypeScript                     │
├─────────────────────────────────────────────────────────────┤
│                   API & ORKESTRASYONCATMANı                 │
│                       ASP.NET Core                          │
├──────────────────────┬──────────────────────────────────────┤
│  PERFORMANS-KRİTİK   │      SİSTEM & OTOMASYON              │
│        Rust          │          Go  +  Shell                │
├──────────────────────┴──────────────────────────────────────┤
│              SANALLAŞTIRMA & KONTEYNERİZASYON               │
│                  Proxmox VE + Docker + K8s                  │
└─────────────────────────────────────────────────────────────┘
```

| Katman | Teknoloji | Kullanım Amacı |
|--------|-----------|----------------|
| 🖼️ **Ön Yüz** | `Next.js` `TypeScript` `Tailwind CSS` | Yönetim Konsolu, SSR/SSG, API yönlendirme |
| ⚡ **API & Orkestrasyon** | `ASP.NET Core` `.NET` | Merkezi API platformu, kurumsal güvenilirlik |
| 🦀 **Performans-Kritik** | `Rust` | Ağ yönlendirme, depolama motorları, veri düzlemi |
| 🐹 **Sistem Servisleri** | `Go` | Hafif mikroservisler, CLI araçları, kontrol düzlemi |
| 🐚 **Otomasyon** | `Shell` | Proxmox VM yaşam döngüsü, ağ kurulumu, sağlık kontrolleri |
| 🖧 **Sanallaştırma** | `Proxmox VE` `Docker` `Kubernetes` | Kurumsal hiper-visor, konteyner iş yükleri |

---

## 📦 Modül Kataloğu

Platform **15 ana hizmet kategorisi** ve **50'yi aşkın modülden** oluşmaktadır. Her modül bağımsız olarak ölçeklenebilir, faturalandırılabilir ve API üzerinden programlanabilir bir hizmet birimidir.

---

### 🖥️ Sunucular

<details>
<summary><b>Modülleri Göster</b></summary>

#### 🔲 Sanal Makineler
EC2 benzeri hizmetin yerli karşılığı. Proxmox VE altyapısı üzerinde KVM sanallaştırmasıyla çalışan, saniyeler içinde başlatılabilen Linux ve Windows VM'leri. Anlık görüntü, canlı migrasyon ve otomatik yedekleme dahil.

#### ⚡ Işık Hesaplama
AWS Lightsail'in yerini dolduran, önceden yapılandırılmış sanal makine şablonları ve sabit aylık fiyatlandırmayla hızlı başlangıç için tasarlanmış hafif hesaplama hizmeti. Blog motorlarından küçük API sunucularına kadar öngörülebilir iş yükleri için idealdir.

</details>

---

### ⚙️ İşlem Hizmetleri

<details>
<summary><b>Modülleri Göster</b></summary>

#### ⚡ Sunucusuz İşlevler
AWS Lambda benzeri olay-güdümlü işlev yürütme ortamı. Altyapı yönetimi gerektirmeden Go, .NET veya Python ile yazılmış kod parçacıklarını HTTP, zamanlayıcı veya kuyruk olaylarıyla tetikleyin.

#### 📦 Konteyner Servisi
Dockerfile ile paketlenmiş uygulamaları hiçbir Kubernetes bilgisi gerektirmeksizin çalıştırabileceğiniz yönetilen konteyner ortamı. Otomatik ölçekleme, sağlık kontrolleri ve trafik yönlendirme dahildir.

#### 🎛️ Kubernetes Yönetimi
Yönetilen K8s kümesi hizmeti. Kontrol düzlemi Proxmox üzerinde yönetilen, etcd yedekleme, otomatik sertifika yenileme ve tek tıkla küme yükseltme sağlayan kurumsal düzeyde orkestrasyon.

#### 🔄 Toplu İşlem
Makine öğrenmesi eğitimi, ETL boru hattı ve büyük ölçekli veri dönüşümü gibi kaynak-yoğun ve zaman-esnek iş yüklerini yönetmek için öncelikli kuyruk, iş bölümleme ve hata yeniden deneme mekanizması sunar.

</details>

---

### 💾 Depolama

<details>
<summary><b>Modülleri Göster</b></summary>

#### 🪣 Nesne Depolama
S3-uyumlu API ile sunulan, sınırsız kapasiteli nesne depolama. Versiyon kontrolü, erişim politikaları ve çoklu bölge replikasyonu desteklenir. Statik web sitesi barındırma, yedekleme ve medya depolama için kullanılabilir.

#### 💿 Blok Depolama
VM ve konteyner iş yüklerine eklenebilen, NVMe SSD tabanlı yüksek performanslı blok diskler. Anlık görüntü, şifreleme ve çevrimiçi yeniden boyutlandırma desteklenir.

#### 📂 Ağ Dosya Sistemi
Birden fazla VM veya podun aynı anda okuma/yazma yapabildiği paylaşımlı NFS/NFSv4 depolama alanı. Durum bilgili uygulamalar ve paylaşılan medya dizinleri için ideal.

#### 🧊 Arşiv Depolama
Uzun süreli saklama gerektiren ve nadiren erişilen veriler için düşük maliyetli, soğuk depolama katmanı. Otomatik yaşam döngüsü kurallarıyla nesneleri sıcak, soğuk ve arşiv katmanları arasında taşıyın.

#### 🔀 Veri Aktarımı
Büyük veri kümelerini veri merkezimize hızla aktarmak için yüksek bant genişlikli aktarım hizmeti. Veri göçü araçları ve şifrelenmiş transfer protokolleri dahildir.

</details>

---

### 🗄️ Veritabanı

<details>
<summary><b>Modülleri Göster</b></summary>

#### 🐘 İlişkisel Veritabanı
PostgreSQL ve MySQL motorları üzerinde yönetilen RDS benzeri hizmet. Otomatik yedekleme, okunabilir replikalar, noktasal kurtarma ve bakım penceresi yönetimiyle tam yönetilen veritabanı deneyimi.

#### 📄 NoSQL Veritabanı
Yüksek hacimli ve düşük gecikmeli okuma/yazma iş yükleri için anahtar-değer ve geniş sütun depoları. DynamoDB benzeri API ile belge ve tablolu veri modellerini destekler.

#### ⚡ Önbellek
Redis ve Memcached uyumlu yönetilen bellek içi önbellek hizmeti. Oturum yönetimi, gerçek zamanlı lider tahtaları ve API yanıt önbelleği için alt milisaniye gecikmeli performans.

#### 🗃️ Belge Veritabanı
MongoDB uyumlu, JSON belgelerini şemasız saklayan, zengin sorgu ve aggregation pipeline desteği sunan döküman odaklı veritabanı hizmeti.

#### 📈 Zaman Serisi
Metriklerin, telemetri verilerinin ve IoT akışlarının yüksek hızda yazılıp sorgulandığı, zaman damgası indekslemesi ile optimize edilmiş özel veritabanı. InfluxDB uyumlu sorgu arayüzü.

#### 🕸️ Graf Veritabanı
Sosyal ağ analizi, öneri motorları ve dolandırıcılık tespiti için düğüm-kenar modeliyle ilişki sorgulamayı milisaniyeler içinde gerçekleştiren graf veritabanı hizmeti.

</details>

---

### 🌐 Ağ

<details>
<summary><b>Modülleri Göster</b></summary>

#### 🏗️ Sanal Özel Bulut (VPC)
Kaynaklarınızı mantıksal olarak izole eden özel ağ ortamı. Alt ağlar, yönlendirme tabloları, güvenlik grupları ve ağ erişim denetim listeleriyle tam ağ mimarisi kontrolü.

#### ⚖️ Yük Dengeleyici
HTTP/HTTPS ve TCP trafiğini sağlıklı örnekler arasında akıllıca dağıtan Layer 4 ve Layer 7 yük dengeleme. Oturum yapışkanlığı, sağlık kontrolleri ve SSL/TLS sonlandırma dahildir.

#### 🔌 Doğrudan Bağlantı
Şirket içi veri merkezi ile AY Web Services altyapısı arasında internet üzerinden geçmeyen özel, düşük gecikmeli fiber bağlantı. Hibrit bulut mimarileri için tasarlanmıştır.

</details>

---

### 🚀 İçerik Dağıtımı

<details>
<summary><b>Modülleri Göster</b></summary>

#### 🌍 DNS Hizmeti
Yüksek erişilebilirlik garantisiyle küresel anycast ağı üzerinde çalışan yetkili DNS hizmeti. Route 53 benzeri coğrafi yönlendirme, ağırlıklı trafik ve sağlık kontrolü tabanlı yük devretme desteklenir.

#### 🌩️ İçerik Dağıtım Ağı (CDN)
Statik ve dinamik içerikleri son kullanıcıya yakın uç noktalarda önbelleğe alarak gecikmeyi minimize eden küresel CDN hizmeti. HTTPS zorunluluğu, başlık enjeksiyonu ve önbellek geçersiz kılma araçları dahildir.

#### 🔀 API Geçidi
Mikroservis mimarilerinin tek giriş noktası. Kimlik doğrulama, oran sınırlama, istek dönüşümü, canary dağıtım ve WebSocket desteğiyle kapsamlı API yönetimi.

</details>

---

### 🛡️ Güvenlik

<details>
<summary><b>Modülleri Göster</b></summary>

#### 🔥 Web Uygulama Güvenlik Duvarı (WAF)
OWASP Top 10 tehditlerine karşı gerçek zamanlı koruma. SQL enjeksiyonu, XSS, CSRF ve bot trafiğine karşı akıllı kural motoruyla yönetilen güvenlik duvarı.

#### 🌊 DDoS Koruması
Katman 3, 4 ve 7 DDoS saldırılarını otomatik olarak tespit edip filtreleyen always-on koruma hizmeti. Ani trafik artışlarında altyapı kesilmelerini önler.

#### 👁️ Güvenlik Merkezi
Tüm hesabın güvenlik duruşunu tek panelden gösteren, anormallikleri tespit eden ve uyum durumunu raporlayan merkezi görünürlük ve olay yönetimi platformu.

#### 📜 Sertifika Yöneticisi
TLS/SSL sertifikalarının temin edilmesi, yenilenmesi ve dağıtılmasını tamamen otomatize eden hizmet. Let's Encrypt entegrasyonu ve özel CA desteğiyle ücretsiz ve ücretli sertifika yönetimi.

</details>

---

### 🔐 Kimlik Yönetimi

<details>
<summary><b>Modülleri Göster</b></summary>

#### 👥 Kimlik & Erişim Yönetimi (IAM)
Kullanıcılar, roller ve politikalarla en az ayrıcalık ilkesine göre kaynak erişimini denetleyen IAM sistemi. Çok faktörlü kimlik doğrulama, SAML/OIDC federasyonu ve ayrıntılı izin matrisi desteklenir.

#### 🔑 Anahtar Yönetimi
Şifreleme anahtarlarının oluşturulması, rotasyonu ve yaşam döngüsü yönetimi için HSM destekli anahtar yönetimi hizmeti. FIPS 140-2 uyumlu anahtar koruma.

#### 🔒 Gizli Bilgi Yöneticisi
Veritabanı şifreleri, API anahtarları ve sertifikaların güvenli depolanması, otomatik rotasyonu ve uygulama çalışma zamanında güvenli enjeksiyonu için merkezi gizli bilgi kasası.

</details>

---

### 📊 İzleme

<details>
<summary><b>Modülleri Göster</b></summary>

#### 📡 İzleme Merkezi
CPU, bellek, ağ ve disk gibi altyapı metriklerinin gerçek zamanlı toplanması ve görselleştirilmesi. Prometheus/Grafana uyumlu API ile özel dashboard oluşturma ve uzun süreli metrik saklama.

#### 📋 Denetim Kayıtları
Hesap üzerinde gerçekleştirilen tüm API çağrılarının, kaynak değişikliklerinin ve kullanıcı eylemlerinin değiştirilemez biçimde kaydedildiği CloudTrail benzeri hizmet. Uyum ve adli analiz için zorunlu.

#### 🔔 Uyarı Sistemi
Metrik eşiği, log deseni veya anormallik tespitine dayalı akıllı uyarılar. SMS, e-posta, Slack veya webhook üzerinden bildirim ve çağrı nöbeti entegrasyonu.

</details>

---

### 🔧 Yönetim

<details>
<summary><b>Modülleri Göster</b></summary>

#### ⚙️ Yapılandırma Yönetimi
Kaynak yapılandırmalarının sürekli izlendiği, değişikliklerin takip edildiği ve uyumsuzlukların tespit edildiği konfigürasyon kayıt defteri. Altyapı sürüklenmesini önler.

#### 💰 Maliyet Yönetimi
Servis bazlı, etiket bazlı ve kullanıcı bazlı harcama analitiği. Bütçe eşiği uyarıları, maliyet anomali tespiti ve rezerve kapasite önerileriyle bulut harcamalarını optimize edin.

#### 🤖 Otomasyon
Tekrarlayan operasyonel görevleri — yedekleme, ölçekleme, yama yönetimi — zamanlayıcı veya tetikleyici tabanlı iş akışlarıyla otomatize eden düşük kodlu otomasyon motoru.

#### 🗂️ Kaynak Grupları
Farklı hizmetlerdeki kaynakları etiket veya proje bazlı mantıksal gruplar halinde bir arada yöneten, toplu işlem ve politika atamayı kolaylaştıran organizasyon katmanı.

</details>

---

### 💻 Geliştirici Araçları

<details>
<summary><b>Modülleri Göster</b></summary>

#### 🔁 CI/CD Hattı
Kod değişikliklerini otomatik derleme, test ve dağıtım aşamalarından geçiren entegre sürekli entegrasyon/sürekli dağıtım platformu. GitHub, GitLab ve Bitbucket entegrasyonu ile görsel boru hattı editörü.

#### 🏗️ Kod Derleme
Kaynak kodundan konteyner görüntüsüne kadar tüm derleme sürecini bulutta yöneten yönetilen derleme ortamı. Paralel derleme ve önbellekleme ile hızlı geri bildirim döngüsü.

#### 📁 Kod Deposu
Git uyumlu kaynak kod deposu. Dal koruma kuralları, kod inceleme akışı, erişim denetimi ve entegre güvenlik açığı taraması ile tam yazılım geliştirme yaşam döngüsü desteği.

#### 🚢 Kod Dağıtımı
Mavi-yeşil dağıtım, canary yayınlama ve anlık geri alma stratejileriyle EC2, Kubernetes veya sunucusuz hedeflere kod dağıtımını otomatize eden hizmet.

#### 📦 Yapıt Deposu
Docker görüntüleri, npm/Maven/NuGet paketleri ve özel ikili yapıların güvenli depolandığı, versiyonlandığı ve dağıtıldığı kurumsal yapıt deposu. Zararlı yazılım tarama entegrasyonu dahildir.

</details>

---

### 💬 Mesajlaşma

<details>
<summary><b>Modülleri Göster</b></summary>

#### 📨 Mesaj Kuyruğu
Mikro servisler ve dağıtık sistemler arasındaki eşzamansız iletişim için standart ve FIFO (sıra koruyan) kuyruklarla yönetilen mesaj kuyruğu hizmeti. Ölü mektup kuyruğu ve yeniden deneme politikası desteği.

#### 📲 Bildirim Servisi
Mobil push, SMS ve e-posta kanallarına fanout mantığıyla tek API üzerinden bildirim gönderen yayın/abone sistemi. Milyonlarca aboneye milisaniyeler içinde ulaşın.

#### 📧 E-posta Servisi
Yüksek iletişim oranı garantili, SPF/DKIM/DMARC yapılandırmalı, gönderim itibarı izleme ve şikayet yönetimi özellikli transaksiyonel ve toplu e-posta gönderim hizmeti.

</details>

---

### 🔗 Entegrasyon

<details>
<summary><b>Modülleri Göster</b></summary>

#### 📡 Olay Yönetimi
Hizmetler arasındaki olayları kural tabanlı filtreler ve hedeflerle yönlendiren, EventBridge benzeri merkezi olay veri yolu. Özel olay şemaları ve arşivleme desteğiyle tam olay geçmişi.

#### 🌊 Veri Akışı
Gerçek zamanlı veri akışlarını milyonlarca kaydı saniyede işleyecek şekilde ölçeklenebilen Kinesis benzeri akış işleme hizmeti. IoT telemetri, uygulama logları ve tıklama akışı analitiği için idealdir.

#### 🔌 API Entegrasyonu
Kurumsal uygulamaları, SaaS hizmetleri ve üçüncü taraf sistemleri standart konnektörler ve özel webhook'larla birbirine bağlayan düşük kodlu entegrasyon platformu.

</details>

---

### 🤖 Yapay Zeka

<details>
<summary><b>Modülleri Göster</b></summary>

#### 🧩 Temel Modeller
Metin üretimi, özetleme ve soru-cevap için API üzerinden erişilebilen, ince ayar yapılabilir büyük dil modelleri. Veri gizliliği tam koruma altında; model çıkarımı Türkiye sınırları içinde kalır.

#### 🖼️ Görüntü Analizi
Nesne tespiti, yüz analizi, doküman OCR ve içerik moderasyonu API'leri. Belge dijitalleştirme, güvenlik kamerası analizi ve e-ticaret katalog işleme için üretim ortamına hazır uç noktalar.

#### 🗣️ Dil İşleme
Türkçe için optimize edilmiş varlık tanıma, duygu analizi, metin sınıflandırma ve makine çevirisi hizmetleri. Türk dili morfolojisini anlayan yerli NLP modelleri.

#### 💡 Öneri Motoru
Kullanıcı davranışı ve içerik özelliklerine dayalı kişiselleştirilmiş öneri API'si. E-ticaret, içerik platformları ve medya siteleri için gerçek zamanlı öneri üretimi.

</details>

---

### 🧠 Makine Öğrenmesi

<details>
<summary><b>Modülleri Göster</b></summary>

#### 🎓 Model Eğitimi
GPU ve CPU kümelerinde dağıtık eğitim desteğiyle PyTorch ve TensorFlow iş yüklerini yöneten tam yönetilen ML eğitim platformu. Deney takibi, hiperparametre optimizasyonu ve maliyet tahminleme dahildir.

#### 🏷️ Veri Etiketleme
ML modeli eğitimi için görüntü, metin ve ses verilerinin insan destekli ya da ön etiketleme ile işaretlendiği kalite kontrollü veri etiketleme platformu. KVKK uyumlu veri izolasyonu.

#### 🚀 Model Dağıtımı
Eğitilmiş modelleri otomatik ölçekleme, A/B testi ve model izleme ile production ortamına dağıtan yönetilen çıkarım altyapısı. REST ve gRPC uç nokta desteği.

</details>

---

## 🎤 Kapanış

AY Web Services, bir ürünün çok ötesine geçmeyi hedefleyen bir **ekosistem kuruluşudur.** Her modül, aynı anda hem teknik bir ihtiyacı karşılamakta hem de Türk teknoloji sektörünün kendi altyapısını inşa etme kapasitesinin birer kanıtını sunmaktadır.

Önümüzdeki dönem, platformun altyapı katmanlarını pekiştirirken aynı zamanda geliştirici deneyimini, Türkçe dokümantasyonu ve topluluk ekosistemini oluşturmaya odaklanacak. Yerli bir bulut platformunun gerçek anlamda rekabetçi olabilmesi için yalnızca iyi bir ürün değil; güçlü bir kültür, açık bir ekosistem ve kalıcı bir güven ortamı da gerekmektedir.

Bu yolculukta en değerli şey, **cesarettir** — küresel devlerin gölgesinde de olsa bir şeyler inşa etme cesareti. AY Web Services bu cesaretten doğdu ve bu cesareti yaymak için var olmaya devam edecek.

---

## 🙏 Teşekkür

<div align="center">

### 🌟 RESYST HOSTING'e Özel Teşekkür 🌟

</div>

Bu projenin hayata geçirilmesinde **sunucu altyapısı başta olmak üzere** pek çok kritik katkıyı üstlenen **RESYST HOSTING**, AY Web Services'ın zeminini kuran destekçilerden biri olmuştur. Donanım güvenilirliği, ağ altyapısı ve operasyonel süreklilik konularındaki özverili desteği olmaksızın bu mimarinin bugünkü olgunluğa erişmesi mümkün olmazdı.

RESYST HOSTING'in bu projeye inancı ve sağladığı somut destek, yerli teknoloji ekosistemi için ortak bir sahiplenme duygusunun simgesidir. Bu ortaklıktan gurur duyuyor ve gelecekte birlikte daha büyük kilometre taşlarına ulaşacağımıza içtenlikle inanıyoruz.

<div align="center">

**Teşekkürler, RESYST HOSTING.**

*Birlikte daha güçlüyüz.* 🤝

---

<sub>© 2026 AY Web Services — Tüm hakları saklıdır.</sub>

</div>
