/** Günün kasası: Ankara'da kışın yapılacak, üzerine düşünülmüş date fikirleri. Hiçbir veriye bağlı değildir. */

export type Tier = 'iyi' | 'ozel' | 'nadir' | 'efsane';

export interface Idea {
  id: string;
  emoji: string;
  title: string;
  detail: string;
  tier: Tier;
}

export const TIERS: Record<Tier, { label: string; color: string; weight: number }> = {
  iyi: { label: 'Sağlam fikir', color: '#4b8fe8', weight: 46 },
  ozel: { label: 'Özel', color: '#8b5cf6', weight: 30 },
  nadir: { label: 'Nadir', color: '#e0409f', weight: 17 },
  efsane: { label: 'Efsane', color: '#e8a917', weight: 7 },
};

export const IDEAS: Idea[] = [
  // ---- Sağlam fikir ----
  { id: 'aspava', emoji: '🌯', tier: 'iyi', title: 'Aspava düellosu',
    detail: 'Aynı akşam iki farklı Aspava. İkisinde de aynı şeyi söyleyin, ikramları tek tek puanlayın. Ankara\'nın en eski tartışmasını siz bitirin.' },
  { id: 'garip-eser', emoji: '🏺', tier: 'iyi', title: 'En garip eser avı',
    detail: 'Anadolu Medeniyetleri Müzesi\'nde herkes en tuhaf 3 eseri gizlice fotoğraflar. Çıkışta Kale\'de çay içerken oylama: kazanan eserin adı o günün lakabı olur.' },
  { id: 'kartpostal', emoji: '✉️', tier: 'iyi', title: 'Kendinize kartpostal',
    detail: 'Ulus\'taki PTT Pul Müzesi\'ni gezin, sonra birbirinize birer kartpostal yazıp postaya verin. Ne yazdığını söylemek yok; eve ulaşınca öğrenirsiniz.' },
  { id: 'hamamonu', emoji: '🥛', tier: 'iyi', title: 'Hamamönü\'nde salep turu',
    detail: 'Eski Ankara evlerinin arasında salep içip Sanat Sokağı\'nı gezin. Kural: herkes karşısındakine 150 lirayı geçmeyen, el yapımı bir şey seçer.' },
  { id: 'dinozor', emoji: '🦕', tier: 'iyi', title: 'Dinozorla randevu',
    detail: 'MTA Tabiat Tarihi Müzesi: dev iskeletler, Maraş fili, parlayan taşlar. Herkes "evde beslerdim" dediği bir fosil seçsin ve nedenini savunsun.' },
  { id: 'sahaf', emoji: '📚', tier: 'iyi', title: 'Sahafta kör seçim',
    detail: 'Kızılay Olgunlar\'daki sahaflarda 20 dakika ayrılın. Herkes diğerine tek kitap alır, ilk sayfasına tarih ve bir cümle yazar. Paket evde açılır.' },
  { id: 'tadim', emoji: '🍫', tier: 'iyi', title: 'Gözü kapalı tadım',
    detail: 'Marketten 6 farklı çikolata (ya da cips, peynir, ne isterseniz). Gözler bağlı, puan kartı elde. En düşük puanı veren markayı bilen kazanır.' },
  { id: 'sunum', emoji: '📽️', tier: 'iyi', title: 'Saçma sunum gecesi',
    detail: 'Herkes 5 dakikalık, slaytlı ve tamamen gereksiz bir konuda sunum hazırlar: "Neden en iyi dürümcü benim seçtiğim?" gibi. Soru-cevap kısmı zorunlu.' },
  { id: 'pizza', emoji: '🍕', tier: 'iyi', title: 'Yarım yarım pizza',
    detail: 'Tek hamur, iki yarı. Herkes kendi yarısını gizlice tasarlar, malzemeyi diğeri görmeden koyar. Fırından çıkınca dilim takası ve dürüst yorum.' },
  { id: 'kutu-oyunu', emoji: '🎲', tier: 'iyi', title: 'Üç oyunluk turnuva',
    detail: 'Bir kutu oyunu kafesinde hiç oynamadığınız üç oyun seçin. Skor tutulur, kaybeden bir sonraki date\'in tatlısını ısmarlar.' },
  { id: 'koc-muzesi', emoji: '🚂', tier: 'iyi', title: 'Çengelhan\'da zaman yolculuğu',
    detail: 'Rahmi M. Koç Müzesi\'nde eski oyuncaklar, arabalar, dükkânlar. Oyun: "Çocukken bunu görsem çıldırırdım" dediğin şeyi bul, hikâyesini anlat.' },
  { id: 'altinkoy', emoji: '🛖', tier: 'iyi', title: 'Altınköy\'de köy günü',
    detail: 'Şehrin içinde eski bir Anadolu köyü: asma köprü, değirmen, köy evleri. Soğukta gezip sonra sobalı bir yerde gözleme-çay. Kış günü en güzel hâli.' },
  { id: 'luna', emoji: '🎡', tier: 'iyi', title: 'Gece dönme dolabı',
    detail: 'Hava kararınca Gençlik Parkı. Dönme dolabın tepesinde Ankara ışıkları, aşağıda pamuk şeker. Üşüdüğünüz an plan tamamlanmış sayılır.' },

  // ---- Özel ----
  { id: 'buz-pateni', emoji: '⛸️', tier: 'ozel', title: 'Buz pateni: düşen ısmarlar',
    detail: 'Bahçelievler\'deki buz pateni sarayında bir seans. Her düşüş bir çizgi; çizgisi çok olan çıkışta sıcak çikolataları alır. Eldiven şart.' },
  { id: 'seramik', emoji: '🏺', tier: 'ozel', title: 'Birbirinize kupa yapın',
    detail: 'Bir seramik atölyesinde çark denemesi. Herkes diğerinin kullanacağı kupayı yapar; yamuk çıkması bonus. Fırından çıkınca ikinci bir buluşma bahanesi.' },
  { id: 'cso', emoji: '🎻', tier: 'ozel', title: 'Şık giyinip senfoniye',
    detail: 'CSO Ada Ankara\'da bir konser seçin, gerçekten şık giyinin. Arada bina turu, çıkışta "en sevdiğin an neydi" sorusu. Biletleri erkenden alın.' },
  { id: 'kacis', emoji: '🗝️', tier: 'ozel', title: 'İki kişilik kaçış odası',
    detail: 'İpucu istemeden çıkmayı deneyin. Kimin panik yaptığı, kimin sakin kaldığı ortaya çıkar. Çıkışta fotoğraf ve hesaplaşma yemeği.' },
  { id: 'tek-makara', emoji: '📸', tier: 'ozel', title: 'Tek makara, 27 poz',
    detail: 'Tek kullanımlık bir analog makine alın. Ulus\'tan Kale\'ye yürürken sırayla çekin; silmek ve bakmak yok. Banyo edilince çıkanlar sürpriz olur.' },
  { id: 'cermodern', emoji: '🎨', tier: 'ozel', title: 'CerModern: "bu sensin"',
    detail: 'Sergiyi ayrı ayrı gezin. Herkes karşısındakini anlatan bir eser seçer ve nedenini açıklar. Savunma zayıfsa kahveyi o ısmarlar.' },
  { id: 'atakule', emoji: '🗼', tier: 'ozel', title: 'Atakule\'de gün batımı',
    detail: 'Gün batımından 20 dakika önce seyir terasında olun. Şehir yavaş yavaş yanarken evinizi, okulunuzu, ilk buluştuğunuz yeri bulmaya çalışın.' },
  { id: 'tiyatro', emoji: '🎭', tier: 'ozel', title: 'Afişe göre oyun seç',
    detail: 'Devlet Tiyatroları programına bakın, konusunu okumadan sadece afişine göre bir oyun seçin. Çıkışta tek cümlelik eleştiri yazıp karşılaştırın.' },
  { id: 'eymir', emoji: '🦆', tier: 'ozel', title: 'Eymir\'de buzlu göl yürüyüşü',
    detail: 'Termosa bir şey koyun, sıkı giyinin. Göl kenarında yürürken telefonlar cepte; her bankta bir soru sorulur. Dönüşte sıcak bir çorba.' },
  { id: 'hava-muzesi', emoji: '✈️', tier: 'ozel', title: 'Uçakların arasında',
    detail: 'Etimesgut\'taki Hava Kuvvetleri Müzesi. Biri rehberlik eder, diğeri "en havalı uçak" ödülünü verir. Açık alan soğuk olur, atkıyı unutmayın.' },
  { id: 'manti', emoji: '🥟', tier: 'ozel', title: 'Mantı açma maratonu',
    detail: 'Hamur sıfırdan. Kim daha küçük mantı kapatırsa kazanır, cetvelle ölçmek serbest. Yoğurdu, sosu ve müzik listesini önceden ayarlayın.' },
  { id: 'buyulu-fener', emoji: '🎞️', tier: 'ozel', title: 'Hiç duymadığınız film',
    detail: 'Kızılay\'da Büyülü Fener\'in programından ikinizin de adını bilmediği bir film. Fragman izlemek yasak. Çıkışta Sakarya\'da yürüyerek kritik.' },

  // ---- Nadir ----
  { id: 'elmadag', emoji: '🛷', tier: 'nadir', title: 'Elmadağ\'da kızak',
    detail: 'Kayak bilmeye gerek yok: kızak kiralayın, tepeden kayın. Gitmeden kar durumuna bakın. Termosta sıcak çikolata, yedek çorap çantada.' },
  { id: 'soguksu', emoji: '🌲', tier: 'nadir', title: 'Karlı orman + kaplıca',
    detail: 'Kızılcahamam Soğuksu Milli Parkı\'nda çamların arasında kar yürüyüşü, ardından günübirlik termal. Donup sonra ısınmak: kışın en iyi ikilisi.' },
  { id: 'beypazari', emoji: '🥕', tier: 'nadir', title: 'Beypazarı kaçamağı',
    detail: 'Sabah erken çıkın. Tarihi evler, 80 katlı baklava, havuçlu lokum, güveç. Görev: birbirinize çarşıdan en saçma hediyelik eşyayı bulun.' },
  { id: 'ilk-kar', emoji: '☃️', tier: 'nadir', title: 'İlk kar planı',
    detail: 'Bu kart ilk ciddi kar yağışında geçerli: Seğmenler Parkı\'nda kardan adam yarışması, jüri yoldan geçenler. Sonra Tunalı\'da ısınma molası.' },
  { id: 'ankara-palas', emoji: '🏛️', tier: 'nadir', title: '1920\'lerde bir akşam',
    detail: 'Ankara Palas Müzesi\'ni gezin, sonra Ulus\'ta eski bir lokantada Ankara tava. O akşamlık konu: 100 yıl önce burada yaşasaydık ne iş yapardık?' },
  { id: 'dans', emoji: '💃', tier: 'nadir', title: 'Tek seferlik dans dersi',
    detail: 'Bir dans okulunun deneme dersine yazılın: salsa, tango, hangisi denk gelirse. Ayağa basma sayısı tutulur. Kötü olmak işin eğlencesi.' },
  { id: 'ahlatlibel', emoji: '🌃', tier: 'nadir', title: 'Tepeden şehir ışıkları',
    detail: 'Açık bir gecede Ahlatlıbel\'e çıkın. Arabada battaniye, termos ve sırayla seçilen şarkılar. Kural: her şarkının bir hikâyesi anlatılacak.' },
  { id: 'fondu', emoji: '🫕', tier: 'nadir', title: 'Fondü ve film maratonu',
    detail: 'Peynir ya da çikolata fondüsü, yere serilmiş minderler. Film seçimi: herkes çocukluğunun en sevdiği filmini getirir, ikisi de izlenir.' },

  // ---- Efsane ----
  { id: 'eskisehir', emoji: '🚄', tier: 'efsane', title: 'Hızlı trenle Eskişehir',
    detail: 'Sabah YHT, akşam dönüş. Odunpazarı evleri, OMM, Porsuk kenarı ve çibörek. Biletleri önceden alın; tren yolculuğu planın yarısı.' },
  { id: 'abant', emoji: '🏔️', tier: 'efsane', title: 'Karlı Abant günü',
    detail: 'Erken yola çıkın. Göl çevresinde kar yürüyüşü, şömineli bir yerde uzun kahvaltı, dönüşte Bolu\'da mola. Yol ve hava durumuna önce bakın.' },
  { id: 'surpriz-gun', emoji: '🎁', tier: 'efsane', title: 'Sürpriz gün',
    detail: 'Biri günü baştan sona planlar, diğeri sadece saat ve kıyafet bilgisini alır. Sıradaki sefer roller değişir. Kimin planlayacağına yazı tura karar verir.' },
  { id: 'mini-tatil', emoji: '🧖', tier: 'efsane', title: 'Şehirde mini tatil',
    detail: 'Bir günlüğüne turist olun: spa ya da hamam, uzun bir öğle yemeği, akşam Kale\'de manzara. Telefonlar sadece fotoğraf için çıkar.' },
];

export const ideaById = (id: string) => IDEAS.find((i) => i.id === id);

/** Nadirlik ağırlığına göre rastgele fikir. `skip` verilirse aynı fikir üst üste gelmez. */
export function pickIdea(skip?: string): Idea {
  const total = Object.values(TIERS).reduce((s, t) => s + t.weight, 0);
  let r = Math.random() * total;
  let tier: Tier = 'iyi';
  for (const [k, t] of Object.entries(TIERS) as [Tier, (typeof TIERS)[Tier]][]) {
    r -= t.weight;
    if (r <= 0) { tier = k; break; }
  }
  const pool = IDEAS.filter((i) => i.tier === tier && i.id !== skip);
  return pool[Math.floor(Math.random() * pool.length)];
}
