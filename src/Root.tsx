import { useEffect } from 'react';
import { getRedirectResult, signInWithPopup, signInWithRedirect, signOut } from 'firebase/auth';
import { auth, googleProvider } from './firebase';
import { useSession } from './lib/store';
import { Denied, Loading, Login } from './components/Gates';
import Home from './Home';

const standalone = () => window.matchMedia('(display-mode: standalone)').matches || (navigator as { standalone?: boolean }).standalone === true;

async function signIn() {
  // Ana ekrana eklenmiş uygulamada açılır pencere ayrı bir tarayıcıda açılır ve sonuç geri dönemez:
  // orada doğrudan yönlendirmeyle giriş yap.
  if (standalone()) return signInWithRedirect(auth, googleProvider);
  try {
    await signInWithPopup(auth, googleProvider);
  } catch (e: unknown) {
    const code = (e as { code?: string }).code ?? '';
    if (code.includes('popup-closed') || code.includes('cancelled-popup')) return;
    // Ana ekrana eklenmiş uygulamada açılır pencere engellenirse yönlendirme ile dene.
    if (code.includes('popup-blocked') || code.includes('operation-not-supported')) return signInWithRedirect(auth, googleProvider);
    throw e;
  }
}

export default function Root() {
  const { user, access } = useSession();
  useEffect(() => {
    getRedirectResult(auth).catch((e) => console.error('Yönlendirmeli giriş hatası', e));
  }, []);
  if (access === 'loading') return <Loading />;
  if (access === 'signed-out' || !user) return <Login onSignIn={signIn} />;
  if (access === 'denied') return <Denied email={user.email} onSignOut={() => signOut(auth)} />;
  return <Home user={user} />;
}
