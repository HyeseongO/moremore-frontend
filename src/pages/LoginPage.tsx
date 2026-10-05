import Background from '../components/Background';
import WelcomeImage from '../assets/images/welcomeImage.svg?react';
import MoremoreOnImage from '../assets/images/moremoreOn.svg?react';
import GoogleSignUp from '../assets/images/signup-google.svg?react';
import Input from '../components/Input';
import { API_URL } from '../services/api';
import { DEMO_ACCOUNTS, type DemoAccount } from '../utils/demoAccounts';
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

const LOGIN_ERROR_MESSAGES: Record<string, string> = {
  google_login_failed: '구글 로그인이 취소되었거나 실패했습니다. 다시 시도해주세요.',
};

function LoginPage() {
  const [searchParams] = useSearchParams();
  const loginErrorMessage = LOGIN_ERROR_MESSAGES[searchParams.get('error') ?? ''];
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
        const error = await response.json();
        alert(error.message || '로그인 실패');
        return;
      }

      navigate('/main');
    } catch (error) {
      console.error('로그인 에러:', error);
      alert('서버 오류가 발생했습니다.');
    }
  };

  const handleLogin = () => loginWith(emailValue, passwordValue);

  const handleDemoLogin = (account: DemoAccount) => loginWith(account.email, account.password);

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  return (
    <div className="relative min-h-screen bg-blue-400">
      <Background size="medium">
        <WelcomeImage className="w-44 h-44 mx-auto mb-3 mt-3" />
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
            <p style={{ color: 'red' }}>유효하지 않은 이메일 형식입니다.</p>
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
            <p style={{ color: 'red' }}>잘못된 비밀번호 형식입니다.</p>
          )}
          <div className="mb-8" />
          <button
            className="w-full bg-black text-white py-3 rounded-lg font-medium active:bg-gray-700 hover:bg-gray-800 transition-colors"
            onClick={handleLogin}
          >
            로그인
          </button>
          <div className="flex items-center my-8 mt-3">
            <div className="flex-1 border-t-2 border-gray-300"></div>
            <span className="px-4 text-black-600 text-lg">Or</span>
            <div className="flex-1 border-t-2 border-gray-300"></div>
          </div>
          <button onClick={handleGoogleLogin} className="block mx-auto -mt-6">
            <GoogleSignUp />
          </button>
          {DEMO_ACCOUNTS.length > 0 && (
            <div className="mt-3 flex items-center justify-center gap-2 text-sm">
              <span className="text-gray-500">가입 없이 체험</span>
              {DEMO_ACCOUNTS.map((account) => (
                <button
                  key={account.label}
                  onClick={() => handleDemoLogin(account)}
                  className="rounded-full border border-blue-500 px-3 py-1 text-blue-500 hover:bg-blue-50 transition-colors"
                >
                  {account.label}
                </button>
              ))}
            </div>
          )}
          {loginErrorMessage && (
            <p role="alert" className="mt-3 text-sm text-center text-red-600 break-keep">
              {loginErrorMessage}
            </p>
          )}
        </div>
        <div className="text-center mt-4">
          <span className="text-gray-600">아직 모어모어온 회원이 아니신가요? </span>
          <Link to="/signup" className="text-blue-500 hover:underline">
            회원가입
          </Link>
        </div>
        <Link to="/privacy" className="mt-2 text-xs text-gray-400 hover:underline">
          개인정보처리방침
        </Link>
      </Background>
    </div>
  );
}

export default LoginPage;
