import Background from '../components/Background';
import WelcomeImage from '../assets/images/welcomeImage.svg?react';
import MoremoreOnImage from '../assets/images/moremoreOn.svg?react';
import GoogleSignUp from '../assets/images/signup-google.svg?react';
import Input from '../components/Input';
import { useState } from 'react';
import { Link } from 'react-router-dom';

function LoginPage() {
  const [emailValue, setEmailValue] = useState('');
  const [isEmailValid, setEmailValid] = useState(false);
  const [passwordValue, setPasswordValue] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(false);

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

  return (
    <div className="relative min-h-screen bg-blue-400">
      <Background size="medium">
        <WelcomeImage className="w-48 h-48 mx-auto mb-5" />
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
          <button className="w-full bg-black text-white py-3 rounded-lg font-medium active:bg-gray-700 hover:bg-gray-800 transition-colors">
            로그인
          </button>
          <div className="flex items-center my-8 mt-3">
            <div className="flex-1 border-t-2 border-gray-300"></div>
            <span className="px-4 text-black-600 text-lg">Or</span>
            <div className="flex-1 border-t-2 border-gray-300"></div>
          </div>
          <button className="block mx-auto -mt-6">
            <GoogleSignUp />
          </button>
        </div>
        <div className="text-center mt-4">
          <span className="text-gray-600">
            아직 모어모어온 회원이 아니신가요?{' '}
          </span>
          <Link to="/signup" className="text-blue-500 hover:underline">
            회원가입
          </Link>
        </div>
      </Background>
    </div>
  );
}

export default LoginPage;
