import { lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';

const SignUpPage = lazy(() => import('./pages/SignUpPage'));
const MainPage = lazy(() => import('./pages/MainPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const RoomPage = lazy(() => import('./pages/RoomPage'));
const GoogleSignup = lazy(() => import('./pages/GoogleSignup'));
const JoinStudyRoomPage = lazy(() => import('./pages/JoinStudyRoomPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));

function PageFallback() {
  const { t } = useTranslation();

  return (
    <div role="status" className="flex min-h-screen items-center justify-center bg-blue-400">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/40 border-t-white" />
      <span className="sr-only">{t('common.loading')}</span>
    </div>
  );
}

function App() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/googleSignup" element={<GoogleSignup />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/main/settings" element={<SettingsPage />} />
        <Route path="/studyroom/:roomId" element={<RoomPage />} />
        <Route path="/studyroom/join/:inviteCode" element={<JoinStudyRoomPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;
