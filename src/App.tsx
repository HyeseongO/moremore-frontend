import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import MainPage from './pages/MainPage';
import SettingsPage from './pages/SettingsPage';
import RoomPage from './pages/RoomPage';
import GoogleSignup from './pages/GoogleSignup';
import JoinStudyRoomPage from './pages/JoinStudyRoomPage';
import PrivacyPage from './pages/PrivacyPage';

function App() {
  return (
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
  );
}

export default App;
