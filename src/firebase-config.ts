// Firebase konsolu → Proje ayarları → "Web uygulaman" bölümündeki değerleri buraya yapıştır.
// Bu değerler gizli değildir (her web uygulamasında tarayıcıya gider); verileri koruyan şey
// firestore.rules ve Firestore'daki `allowed` listesidir.
export const firebaseConfig = {
  apiKey: 'AIzaSyDSkR8s5q5ASjvSyLzEucUz3aF48LWDtOY',
  authDomain: 'bizim-takvim-48b62.firebaseapp.com',
  projectId: 'bizim-takvim-48b62',
  storageBucket: 'bizim-takvim-48b62.firebasestorage.app',
  messagingSenderId: '334070201655',
  appId: '1:334070201655:web:ce1e8305a07fb946802eb2',
};

// Firebase konsolu → Proje ayarları → Cloud Messaging → Web Push sertifikaları → "Anahtar çifti" (public key)
export const vapidKey = 'BGEQqaaUTbKKS_SK1Q-AahXbb4F1FwIrn2EC66xJzUABPpABhbusOawTLKvxrk1wriS7AoDa26Ro3C5ujXIRVYc';

export const isConfigured = !firebaseConfig.apiKey.startsWith('BURAYA');
