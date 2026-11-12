# Date Takvimi

Ece ile ortak date takvimi. Dolu günler kırmızı, ikinizin de boş olduğu günler yeşil.
Yeşil bir günü ayırıp **ortak taslak** açarsın, ikiniz de etkinlik ekleyip düzenlersiniz,
sonra **Onaya gönder** → karşı tarafa bildirim gider → onaylanınca konfeti 🎉 ve gün turuncu ✦ ile işaretlenir.

- React 19 + Vite, animasyonlar `motion`, konfeti `canvas-confetti`
- Firebase: Google girişi, Firestore (canlı senkron), Cloud Messaging (telefon bildirimi)
- Adres: **https://bizim-takvim-48b62.firebaseapp.com** (Firebase Hosting; GitHub'a push → otomatik yayın)
- Telefon bildirimleri: GitHub Actions (5 dakikada bir, ücretsiz)
- Neden Firebase Hosting + `firebaseapp.com`: Google girişinin açıldığı adres (`authDomain`) ile site aynı
  adreste olmalı (yoksa iPhone Safari girişi engelliyor) ve Google giriş anahtarı bu adrese hazır izinli.
  `web.app` ve eski GitHub Pages adresi buraya yönlendirir.
- `prefers-reduced-motion` açıksa animasyonlar kapanır; açık/koyu tema otomatik

## Akış

| Gün rengi | Anlamı |
|---|---|
| 🟩 Yeşil | İkiniz de boşsunuz → dokun, "Bu günü ayır & date planla" |
| 🟥 Kırmızı | En az biriniz dolu (altındaki renkli nokta kimin dolu olduğunu gösterir) |
| 🟨 Çizgili sarı | Planlanıyor: taslak ya da onay bekliyor |
| 🟧 Turuncu ✦ | Date günü (onaylandı) |

**Dolu günlerim** modunda günlere tek tek dokunarak dolu/boş işaretlersin.

## Kurulum (bir kez, ~10 dakika)

### 1. Firebase projesi
1. <https://console.firebase.google.com> → **Proje ekle** (Analytics gerekmez). Ücretsiz Spark planı yeterli.
2. **Authentication → Başlayın → Google** sağlayıcısını etkinleştir.
   **Ayarlar → Yetkili alan adları** listesinde `PROJE_ID.firebaseapp.com` olduğundan emin ol (varsayılan olarak vardır).
3. **Firestore Database → Veritabanı oluştur** (üretim modu, konum `eur3`).
   **Kurallar** sekmesine bu repodaki [`firestore.rules`](firestore.rules) içeriğini yapıştır → **Yayınla**.
4. Firestore'da **Koleksiyon başlat** → koleksiyon kimliği `allowed`:
   - Belge kimliği: senin e-postan (küçük harf), alan `name` = `Can`
   - Belge kimliği: Ece'nin e-postası (küçük harf), alan `name` = `Ece`

   Sadece bu iki e-posta giriş yapabilir. E-postalar koda yazılmaz, repo public olsa da görünmez.
5. **Proje ayarları → Genel → Uygulamalarınız → Web (</>)** ile uygulama ekle. Çıkan `firebaseConfig`
   değerlerini [`src/firebase-config.ts`](src/firebase-config.ts) içine yapıştır.
6. **Proje ayarları → Cloud Messaging → Web Push sertifikaları → Anahtar çifti oluştur.**
   Çıkan anahtarı `src/firebase-config.ts` içindeki `vapidKey`'e yapıştır.

### 2. GitHub
1. Repo **Settings → Pages → Source: GitHub Actions**.
2. Firebase **Proje ayarları → Hizmet hesapları → Yeni özel anahtar oluştur** → JSON iner.
   Repo **Settings → Secrets and variables → Actions → New repository secret**:
   ad `FIREBASE_SERVICE_ACCOUNT`, değer JSON dosyasının tamamı. Sonra indirilen dosyayı sil — asla commit'leme.
3. `main`'e push → uygulama `https://PROJE_ID.firebaseapp.com` adresinde yayında (iş akışı: `deploy.yml`).

### 3. Telefonlar
- **iPhone:** Safari'de adresi aç → Paylaş → **Ana Ekrana Ekle** → uygulamayı ana ekrandan aç →
  Google ile giriş → üstteki **Aç** ile bildirim izni ver (iOS 16.4+).
- **Android:** Chrome'da aç → giriş → bildirim izni ver (istersen "Ana ekrana ekle").

## Bildirimler hakkında
- Uygulama açıkken bildirimler **anında** gelir (toast + zil rozeti, onayda konfeti).
- Uygulama kapalıyken telefon bildirimi GitHub Actions ile gönderilir; GitHub zamanlamasına göre **5–15 dk** gecikebilir.
- GitHub, 60 gün hiç commit olmayan public repolarda zamanlanmış işleri durdurur. Durursa
  **Actions → Telefon bildirimleri → Enable workflow** ile tekrar aç.

## Geliştirme
```bash
npm install
npm run dev     # http://localhost:5173/
npm run build
```
Yerelde Google girişi için Firebase'de `localhost` yetkili alan adı olarak zaten ekli gelir.

## Veri modeli (Firestore)
| Koleksiyon | İçerik |
|---|---|
| `allowed/{email}` | Giriş izni olan iki e-posta (`name` alanı görünen isim) |
| `users/{uid}` | Ad, e-posta, fotoğraf, bildirim jetonları |
| `busy/{uid}` | `days: ["2026-11-14", ...]` dolu günler |
| `plans/{id}` | `date, title, time, place, activities[], status: draft · pending · accepted` |
| `notifications/{id}` | Alıcı e-postası, tür, okundu, telefona gönderildi mi |

## Animasyonlar ve kaynak
Aşağıdaki efektler [Magic UI](https://magicui.design) (MIT) bileşenlerinden esinlenip Tailwind'siz,
sade CSS + `motion` ile yeniden yazıldı: [`src/components/magic/`](src/components/magic/)

| Bileşen | Nerede |
|---|---|
| Animated Gradient Text | Giriş etiketi, üst barda partner adı |
| Dia Text Reveal | Başlıklar, sıradaki date, gün paneli, kutlama |
| Text Reveal | Tanıtım metni, "Bu ayın özeti" |
| Scroll Based Velocity | Date fikirleri şeridi |
| Spinning Text | Logo çevresi, geri sayım halkası, yükleniyor |
| Shimmer Button | Giriş, "Bu günü ayır", "Onaya gönder", "Onayla" |
| Dot Pattern | Giriş ve ana ekran arka planı |
| Floating 3D Particles | Giriş arka planı, kutlama kartı |

Telefonda "Hareketi azalt" açıksa hepsi durur.
