import Background from '../components/Background';

import WelcomeImage from '../assets/images/welcomeImage.svg?react';
import MoremoreOnImage from '../assets/images/moremoreOn.svg?react';
import GoogleSignUp from '../assets/images/signup-google.svg?react';
import Input from '../components/Input';
import { useState } from 'react';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="relative min-h-screen bg-blue-400">
      <Background>
        <WelcomeImage className="w-48 h-48 mx-auto mb-5" />
        <MoremoreOnImage />
        <div className="mb-5" />
        <div className="w-64 mx-auto">
          <Input
            type="email"
            placeholder="example@library.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            name="email"
            className="w-full border-2 px-6 py-2 rounded-lg hover:bg-gray-50 invalid:border-red-600 invalid:text-red-600 focus:border-blue-600"
          />
          <div className="mb-2" />
          <Input
            type="password"
            placeholder="******"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name="password"
            className="w-full border-2 px-6 py-2 rounded-lg hover:bg-gray-50 focus:border-blue-600"
          />
          <div className="mb-8" />
          <button className="w-full bg-black text-white py-3 rounded-lg font-medium active:bg-gray-700 hover:bg-gray-800 transition-colors">
            로그인
          </button>
          <div className="flex items-center my-8">
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
          <a href="#" className="text-blue-500 hover:underline">
            회원가입
          </a>
        </div>
      </Background>
    </div>
  );
}

export default LoginPage;
