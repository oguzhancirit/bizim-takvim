// Giriş için tek adres: web.app → firebaseapp.com (CSP satır içi koda izin vermediği için ayrı dosya)
if (location.hostname === 'bizim-takvim-48b62.web.app') {
  location.replace('https://bizim-takvim-48b62.firebaseapp.com' + location.pathname + location.search + location.hash);
}
