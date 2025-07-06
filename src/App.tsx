import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import MainPage from './pages/MainPage';
import SettingPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import RoomPage from './pages/RoomPage';
import GoogleSignup from './pages/GoogleSignup';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/googleSignup" element={<GoogleSignup />} />
      <Route path="/main" element={<MainPage />} />
      <Route path="/main/settings" element={<SettingPage />} />
      <Route path="/main/profile" element={<ProfilePage />} />
      <Route path="/main/romm/:roomId" element={<RoomPage />} />
    </Routes>
  );
}

export default App;
