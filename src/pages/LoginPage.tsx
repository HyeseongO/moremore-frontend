import Background from '../components/Background';
import welcomeAvif from '../assets/images/welcome.avif';
import welcomeJpg from '../assets/images/welcome.jpg';
import MoremoreOnImage from '../assets/images/moremoreOn.svg?react';
import GoogleSignUp from '../assets/images/signup-google.svg?react';
import Input from '../components/Input';
import { API_URL } from '../services/api';
import { DEMO_ACCOUNTS, type DemoAccount } from '../utils/demoAccounts';
import { translateErrorBody } from '../utils/apiError';
import LanguageToggle from '../components/LanguageToggle';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

const LOGIN_ERROR_MESSAGES: Record<string, string> = {
  google_login_failed: 'login.errors.googleLoginFailed',
};

function LoginPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const loginErrorKey = LOGIN_ERROR_MESSAGES[searchParams.get('error') ?? ''];
  const [emailValue, setEmailValue] = useState('');
  const [isEmailValid, setEmailValid] = useState(false);
  const [passwordValue, setPasswordValue] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  const navigate = useNavigate();

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setEmailValue(value);
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    setEmailValid(isValidEmail);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPasswordValue(value);
    const isValidPassword = value.trim().length >= 8;
    setIsPasswordValid(isValidPassword);
  };

  const loginWith = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => null);
        alert(translateErrorBody(error, 'login.failed'));
        return;
      }

      navigate('/main');
    } catch (error) {
      console.error('Login error:', error);
      alert(t('login.serverError'));
    }
  };

  const handleLogin = () => loginWith(emailValue, passwordValue);

  const handleDemoLogin = (account: DemoAccount) => loginWith(account.email, account.password);

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  return (
    <div className="relative min-h-screen bg-blue-400">
      <LanguageToggle />
      <Background size="medium">
        <picture>
          <source srcSet={welcomeAvif} type="image/avif" />
          <img
            src={welcomeJpg}
            alt={t('login.welcomeImageAlt')}
            width={176}
            height={176}
            fetchPriority="high"
            className="w-44 h-44 mx-auto mb-3 mt-3 rounded-full"
          />
        </picture>
        <MoremoreOnImage />
        <div className="mb-5" />
        <div className="w-64 mx-auto">
          <Input
            type="email"
            placeholder="example@moremore.com"
            value={emailValue}
            onChange={handleEmailChange}
            name="email"
            className="w-full border-2 px-6 py-2 rounded-lg hover:bg-gray-50 invalid:border-red-600 invalid:text-red-600 focus:border-blue-600"
          />
          {emailValue && !isEmailValid && (
            <p style={{ color: 'red' }}>{t('login.invalidEmail')}</p>
          )}
          <div className="mb-2" />
          <Input
            type="password"
            placeholder="******"
            value={passwordValue}
            onChange={handlePasswordChange}
            name="password"
            className="w-full border-2 px-6 py-2 rounded-lg hover:bg-gray-50 focus:border-blue-600"
          />
          {passwordValue && !isPasswordValid && (
            <p style={{ color: 'red' }}>{t('login.invalidPassword')}</p>
          )}
          <div className="mb-8" />
          <button
            className="w-full bg-black text-white py-3 rounded-lg font-medium active:bg-gray-700 hover:bg-gray-800 transition-colors"
            onClick={handleLogin}
          >
            {t('login.submit')}
          </button>
          <div className="flex items-center my-8 mt-3">
            <div className="flex-1 border-t-2 border-gray-300"></div>
            <span className="px-4 text-black-600 text-lg">{t('login.or')}</span>
            <div className="flex-1 border-t-2 border-gray-300"></div>
          </div>
          <button onClick={handleGoogleLogin} className="block mx-auto -mt-6">
            <GoogleSignUp />
          </button>
          {DEMO_ACCOUNTS.length > 0 && (
            <div className="mt-3 flex items-center justify-center gap-2 text-sm">
              <span className="whitespace-nowrap text-gray-500">{t('login.demoPrompt')}</span>
              {DEMO_ACCOUNTS.map((account) => (
                <button
                  key={account.number}
                  onClick={() => handleDemoLogin(account)}
                  className="whitespace-nowrap rounded-full border border-blue-500 px-3 py-1 text-blue-500 hover:bg-blue-50 transition-colors"
                >
                  {t('login.demoLabel', { number: account.number })}
                </button>
              ))}
            </div>
          )}
          {loginErrorKey && (
            <p role="alert" className="mt-3 text-sm text-center text-red-600 break-keep">
              {t(loginErrorKey)}
            </p>
          )}
        </div>
        <div className="text-center mt-4">
          <span className="text-gray-600">{t('login.noAccount')} </span>
          <Link to="/signup" className="text-blue-500 hover:underline">
            {t('login.signupLink')}
          </Link>
        </div>
        <Link to="/privacy" className="mt-2 text-xs text-gray-400 hover:underline">
          {t('login.privacyLink')}
        </Link>
      </Background>
    </div>
  );
}

export default LoginPage;
