import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Background from '../components/Background';
import Input from '../components/Input';
import LanguageToggle from '../components/LanguageToggle';
import BackIcon from '../assets/images/arrow-back.svg?react';
import { API_URL } from '../services/api';
import { validateEmail, validateNickname, validatePassword } from '../utils/validation';
import { translateErrorBody } from '../utils/apiError';
import { Link } from 'react-router-dom';

function SignUpPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [repassword, setRePassword] = useState('');

  const [emailError, setEmailError] = useState<string[]>([]);
  const [nicknameError, setNicknameError] = useState<string[]>([]);
  const [passwordError, setPasswordError] = useState<string[]>([]);
  const [repasswordError, setRePasswordError] = useState<string[]>([]);

  const navigate = useNavigate();

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setEmail(value);
    setEmailError(validateEmail(value));
  };

  const handleNickChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setNickname(value);
    setNicknameError(validateNickname(value));
  };

  const handlePassChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPassword(value);
    setPasswordError(validatePassword(value));
  };

  const handleRepassChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setRePassword(value);
    setRePasswordError(password === value ? [] : ['signup.passwordMismatch']);
  };

  const handleSignup = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, nickname, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Sign-up failed:', errorData);

        const errorMessage = translateErrorBody(errorData, 'common.serverError');

        alert(t('signup.failed', { message: errorMessage }));
        return;
      }

      alert(t('signup.success'));
      navigate('/');
    } catch (error) {
      console.error('Server error:', error);
      alert(t('common.serverError'));
    }
  };

  return (
    <div className="relative min-h-screen bg-blue-400">
      <LanguageToggle />
      <Background size="small">
        <div className="relative flex items-center justify-center w-full">
          <Link to="/" className="absolute left-8 top-6">
            <BackIcon className="w-8 h-8" />
          </Link>
          <span className="text-3xl mt-5">{t('signup.title')}</span>
        </div>
        <div className="text-gray-500 mt-4">{t('signup.subtitle')}</div>
        <div className="flex flex-col w-full max-w-md gap-2">
          <div className="mt-4">
            <label htmlFor="email" className="text-base font-semibold text-gray-800 mt-4">
              {t('signup.emailLabel')}
            </label>
            <Input
              type="email"
              name="email"
              placeholder={t('signup.emailPlaceholder')}
              value={email}
              onChange={handleEmailChange}
              className="w-full border-2 px-6 py-2 rounded-lg hover:bg-gray-50"
            />
            {emailError.map((error, index) => (
              <p key={index} className="text-sm text-red-500 mt-1">
                {t(error)}
              </p>
            ))}
          </div>
          <div className="mt-4">
            <label htmlFor="nickname" className="text-base font-semibold text-gray-800 mt-4">
              {t('signup.nicknameLabel')}
            </label>
            <Input
              type="nickname"
              name="nickname"
              placeholder={t('signup.nicknamePlaceholder')}
              value={nickname}
              onChange={handleNickChange}
              className="w-full border-2 px-6 py-2 rounded-lg hover:bg-gray-50"
            />
            {nicknameError.map((error, index) => (
              <p key={index} className="text-sm text-red-500 mt-1">
                {t(error)}
              </p>
            ))}
          </div>
          <div className="mt-4">
            <label htmlFor="password" className="text-base font-semibold text-gray-800 mt-4">
              {t('signup.passwordLabel')}
            </label>
            <Input
              type="password"
              name="password"
              placeholder={t('signup.passwordPlaceholder')}
              value={password}
              onChange={handlePassChange}
              className="w-full border-2 px-6 py-2 rounded-lg hover:bg-gray-50"
            />
            {passwordError.map((error, index) => (
              <p key={index} className="text-sm text-red-500 mt-1">
                {t(error)}
              </p>
            ))}
            <Input
              type="password"
              name="password"
              placeholder={t('signup.passwordConfirmPlaceholder')}
              value={repassword}
              onChange={handleRepassChange}
              className="w-full border-2 mt-2 px-6 py-2 rounded-lg hover:bg-gray-50"
            />
            {repasswordError.map((error, index) => (
              <p key={index} className="text-sm text-red-500 mt-1">
                {t(error)}
              </p>
            ))}
          </div>
          <button
            className="w-full py-3 mt-5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
            onClick={handleSignup}
          >
            {t('signup.submit')}
          </button>
        </div>
      </Background>
    </div>
  );
}

export default SignUpPage;
