// Giriş için tek adres: web.app → firebaseapp.com (CSP satır içi koda izin vermediği için ayrı dosya).
// Ana ekrana eski adresten eklenmiş uygulamada yönlendirme iOS'ta bildirim iznini bozar:
// orada yönlendirmek yerine "sil ve yeni adresten kur" uyarısı göster.
(function () {
  if (location.hostname !== 'bizim-takvim-48b62.web.app') return;
  var standalone = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  if (!standalone) {
    location.replace('https://bizim-takvim-48b62.firebaseapp.com' + location.pathname + location.search + location.hash);
    return;
  }
  document.addEventListener('DOMContentLoaded', function () {
    document.body.innerHTML =
      '<main style="min-height:100dvh;display:grid;place-items:center;padding:24px;font-family:-apple-system,system-ui,sans-serif;background:#fbf6f1;color:#2b1d26;text-align:center">' +
      '<div style="max-width:340px"><div style="font-size:52px">📲</div>' +
      '<h1 style="font-size:24px;margin:8px 0">Bu kurulum eski adreste</h1>' +
      '<p style="color:#8b7682;line-height:1.5">Bildirimlerin çalışması için:<br>1. Bu simgeyi ana ekrandan sil<br>2. Safari\'de <b>bizim-takvim-48b62.firebaseapp.com</b> adresini aç<br>3. Paylaş → <b>Ana Ekrana Ekle</b></p>' +
      '<p style="color:#8b7682;font-size:14px">Verilerin sunucuda, silmek hiçbir şeyi kaybettirmez.</p></div></main>';
  });
})();
