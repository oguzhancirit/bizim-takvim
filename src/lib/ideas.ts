/** Günün kasası: Ankara içinde, hafta sonu yapılabilecek kış date fikirleri (şehir dışı yok). Hiçbir veriye bağlı değildir. */

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
  { id: 'buyuk-perde', emoji: '🍿', tier: 'iyi', title: 'Büyük film, büyük perde',
    detail: 'Vizyondaki en büyük filmi şehrin en büyük perdesinde izleyin. Fragmanlara yetişmek zorunlu, mısır büyük boy. Çıkışta herkes filme 10 üzerinden puan verir, aynı anda açıklanır.' },
  { id: 'bowling', emoji: '🎳', tier: 'iyi', title: 'Bowling turnuvası',
    detail: 'Üç oyun, skor tabelası fotoğraflanır. Ek kurallar: bir atış ters elle, bir atış gözler kapalı. Kaybeden haftanın tatlısını ısmarlar.' },
  { id: 'asagidan-yukari', emoji: '🏛️', tier: 'iyi', title: 'Aşağıdan yukarı Ankara',
    detail: 'Anıtkabir, CSO Ada, Atakule. Tek kural: sadece aşağıdan yukarı çekim serbest. Gün sonunda en iyi üç kare seçilir, biri ekran kilidi olur.' },
  { id: 'paylasilmamislar', emoji: '🖼️', tier: 'iyi', title: 'Paylaşılmamışlar gecesi',
    detail: 'Herkes telefonundan hiç paylaşmadığı 10 gezi karesini seçer, televizyona yansıtır, hikâyesini anlatır. En iyi beşi bastırıp duvara asın.' },
  { id: 'sebepsiz-siklik', emoji: '🤵', tier: 'iyi', title: 'Sebepsiz şıklık',
    detail: 'En şık hâlinizle tamamen sıradan bir yere gidin: mahalle dürümcüsü, tost büfesi. Kimseye açıklama yapmak yok. Fotoğraf şart.' },
  { id: 'tatli-turu', emoji: '🍰', tier: 'iyi', title: 'Üç durakta tatlı turu',
    detail: 'Tunalı ya da Bahçeli\'de üç farklı yerden aynı tatlı: San Sebastian, tiramisu, hangisini seçerseniz. Tek porsiyon, iki çatal, puan kartı. Şampiyon ilan edilir.' },
  { id: 'atari', emoji: '🕹️', tier: 'iyi', title: 'Atari salonu günü',
    detail: 'Bir AVM\'nin oyun salonunda eşit bütçe. Hava hokeyi, basket atışı, dans makinesi. En çok bilet toplayan ödül tezgâhından diğerine en saçma hediyeyi seçer.' },
  { id: 'bilardo-dart', emoji: '🎯', tier: 'iyi', title: 'Bilardo ve dart gecesi',
    detail: 'İki set bilardo, iki set dart. Skor eşitse son atışı ters elle yaparsınız. Kaybeden bir sonraki mekânı seçme hakkını kaybeder.' },
  { id: 'burger', emoji: '🍔', tier: 'iyi', title: 'Burger düellosu',
    detail: 'Herkes şehrin en iyi burgercisi dediği yeri savunur. Aynı gün ikisine de gidilir, yarım yarım yenir. Kaybeden taraf kararı sosyal medyada kabul eder.' },
  { id: 'legolar', emoji: '🧩', tier: 'iyi', title: 'Tek kutu, iki kişi',
    detail: 'Büyük bir Lego seti ya da 1000 parçalık puzzle alın. Arkada dizi, önde atıştırmalık. Bitene kadar kalkmak yok; bitince tarih atıp rafa koyun.' },

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
  { id: 'eskimis-ankara', emoji: '🚪', tier: 'ozel', title: 'Eskimiş Ankara düellosu',
    detail: 'Kale ve Samanpazarı\'nın arka sokaklarında herkes 10 kare çeker: eski kapılar, tabelalar, pencereler. En iyi kareyi karşı taraf seçer, kazanan çayı ısmarlatır.' },
  { id: 'fotografci', emoji: '📷', tier: 'ozel', title: 'Birbirinin fotoğrafçısı',
    detail: 'Üç mekân seçin. Her mekânda biri model, diğeri fotoğrafçı; sonra roller değişir. En iyi kare paylaşılır, komik çıkanlar özel arşive.' },
  { id: 'suslu-tavanlar', emoji: '🕌', tier: 'ozel', title: 'Süslü tavanlar turu',
    detail: 'Ulus\'ta Ziraat Bankası Müzesi, Resim ve Heykel Müzesi, Etnografya Müzesi. Görev: en güzel tavanı ve en güzel küçük detayı bulmak. İkisi de fotoğraflanır.' },
  { id: 'rota-pazarligi', emoji: '🗺️', tier: 'ozel', title: 'Rota pazarlığı',
    detail: 'Herkes bir sonraki gezi için bir şehir sunar: 3 fotoğraf, bütçe ve tek cümlelik gerekçe. Oylama yazı turayla değil ikna ile yapılır. Kaybeden rota sıraya girer.' },
  { id: 'kokteyl-kesfi', emoji: '🍸', tier: 'ozel', title: 'Adını bilmediğin kokteyl',
    detail: 'Tunalı ya da Bestekar\'da bir kokteyl barı. Kural: herkes diğerine, menüde adını ilk kez duyduğu bir kokteyl seçer. İkinci turda barmene bırakın.' },
  { id: 'akvaryum', emoji: '🐠', tier: 'ozel', title: 'Kışın ortasında deniz',
    detail: 'Tünel akvaryumda köpekbalıklarının altından yürüyün. Herkes karşısındakine benzeyen bir balık seçer ve savunur. Çıkışta balık yemek etik tartışmaya açıktır.' },
  { id: 'karting', emoji: '🏎️', tier: 'ozel', title: 'Karting: üç tur',
    detail: 'Kapalı bir karting pistinde üç yarış. Tur zamanları fotoğraflanır, bahaneler kabul edilmez. Kaybeden eve dönüş yolunda şoförlük yapar.' },
  { id: 'kombin', emoji: '🛍️', tier: 'ozel', title: 'Kombin düellosu',
    detail: 'Bir AVM\'de 30 dakika: herkes diğeri için baştan aşağı bir kombin seçer. Denemek ve fotoğraf çektirmek zorunlu, satın almak değil.' },
  { id: 'internet-kafe', emoji: '🎮', tier: 'ozel', title: 'İnternet kafede ikili',
    detail: 'Yan yana iki bilgisayar, kulaklıklar takılı. Önce aynı takımda, sonra birebir. Kaybeden çıkışta tostları ısmarlar; bahane olarak ping sayılmaz.' },
  { id: 'tirmanis', emoji: '🧗', tier: 'ozel', title: 'Tırmanış denemesi',
    detail: 'Kapalı bir tırmanma salonunda başlangıç dersi. Birbirinize aşağıdan rota tarif edin. Ertesi gün kollar ağrıyacak, baştan bilin.' },
  { id: 'yilbasi', emoji: '🎄', tier: 'ozel', title: 'Işık turu ve süs avı',
    detail: 'Akşam şehrin süslenmiş caddelerinde yürüyün, her biriniz ağaç için bir süs seçin: biri güzel, biri bilerek çirkin. Evde sıcak bir şeyle asılır.' },
  { id: 'yeni-mutfak', emoji: '🍜', tier: 'ozel', title: 'Hiç yemediğiniz mutfak',
    detail: 'İkinizin de hiç denemediği bir mutfak seçin: Kore, Hint, Gürcü, hangisi denk gelirse. Menüden adını okuyamadığınız en az bir şey söylenir.' },

  // ---- Nadir ----
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
  { id: 'yaz-gecesi', emoji: '🏖️', tier: 'nadir', title: 'Kışın ortasında yaz gecesi',
    detail: 'Kaloriferi açın, yaz çalma listesi, soğuk içecekler, terlikler. Asıl iş: önümüzdeki yazın deniz rotasını haritada çıkarmak ve ilk durağı seçmek.' },
  { id: 'ev-bari', emoji: '🍹', tier: 'nadir', title: 'Evde kokteyl barı',
    detail: 'Herkes diğeri için bir imza kokteyl tasarlar ve ona bir isim koyar. Malzeme alışverişi beraber, tarif gizli. En iyi isim de ödül alır.' },
  { id: 'standup', emoji: '🎤', tier: 'nadir', title: 'Gülmekten yorulma gecesi',
    detail: 'Bir stand-up ya da doğaçlama gösterisine bilet alın, ön sıralara oturmayı göze alın. Çıkışta herkes en çok güldüğü espriyi anlatmayı dener.' },
  { id: 'caz', emoji: '🎷', tier: 'nadir', title: 'Canlı müzik gecesi',
    detail: 'Canlı caz ya da akustik çalan küçük bir mekân bulun. Telefonlar masada ters durur. Aradaki sohbet konusu: ikinizin ortak üç şarkısı hangisi?' },

  // ---- Efsane ----
  { id: 'surpriz-gun', emoji: '🎁', tier: 'efsane', title: 'Sürpriz gün',
    detail: 'Biri günü baştan sona planlar, diğeri sadece saat ve kıyafet bilgisini alır. Sıradaki sefer roller değişir. Kimin planlayacağına yazı tura karar verir.' },
  { id: 'mini-tatil', emoji: '🧖', tier: 'efsane', title: 'Şehirde mini tatil',
    detail: 'Bir günlüğüne turist olun: spa ya da hamam, uzun bir öğle yemeği, akşam Kale\'de manzara. Telefonlar sadece fotoğraf için çıkar.' },
  { id: 'otel', emoji: '🛎️', tier: 'efsane', title: 'Şehirde tek gecelik kaçamak',
    detail: 'Ankara\'da güzel bir otelde tek gece: cumartesi giriş, pazar geç kahvaltı. Havuz ya da spa varsa kullanılır. Yol yok, bavul yok, iş konuşmak yasak.' },
  { id: 'tadim-menusu', emoji: '🍽️', tier: 'efsane', title: 'Tadım menüsü akşamı',
    detail: 'Şehrin iddialı bir restoranında şefin menüsü. Şık giyinin, her tabağa puan verin. Bütçeyi önceden konuşun; bu kart yılda bir iki kez çıkar.' },
  { id: 'bes-durak', emoji: '🧭', tier: 'efsane', title: 'Beş duraklı cumartesi',
    detail: 'Kahvaltı, bir müze, bir oyun, bir tatlı, bir manzara. Durakları sırayla biriniz seçer, diğeri ancak varınca öğrenir. Gün sonunda en iyi durak oylanır.' },
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
