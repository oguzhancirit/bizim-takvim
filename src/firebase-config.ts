// Firebase konsolu → Proje ayarları → "Web uygulaman" bölümündeki değerleri buraya yapıştır.
// Bu değerler gizli değildir (her web uygulamasında tarayıcıya gider); verileri koruyan şey
// firestore.rules ve Firestore'daki `allowed` listesidir.
export const firebaseConfig = {
  apiKey: 'BURAYA_API_KEY',
  authDomain: 'BURAYA_PROJE_ID.firebaseapp.com',
  projectId: 'BURAYA_PROJE_ID',
  storageBucket: 'BURAYA_PROJE_ID.firebasestorage.app',
  messagingSenderId: 'BURAYA_SENDER_ID',
  appId: 'BURAYA_APP_ID',
};

// Firebase konsolu → Proje ayarları → Cloud Messaging → Web Push sertifikaları → "Anahtar çifti" (public key)
export const vapidKey = 'BURAYA_VAPID_PUBLIC_KEY';

export const isConfigured = !firebaseConfig.apiKey.startsWith('BURAYA');
