import { lazy, Suspense } from 'react';
import { MotionConfig } from 'motion/react';
import { isConfigured } from './firebase-config';
import { Loading, NotConfigured } from './components/Gates';

const Root = lazy(() => import('./Root'));

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      {isConfigured ? (
        <Suspense fallback={<Loading />}>
          <Root />
        </Suspense>
      ) : (
        <NotConfigured />
      )}
    </MotionConfig>
  );
}
