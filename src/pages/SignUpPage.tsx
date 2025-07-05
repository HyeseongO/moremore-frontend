import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Background from '../components/Background';
import Input from '../components/Input';
import BackIcon from '../assets/images/arrow-back.svg?react';
import { validateEmail, validateNickname, validatePassword } from '../utils/validation';
import { Link } from 'react-router-dom';

function SignUpPage() {
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
    setRePasswordError(password === value ? [] : ['비밀번호가 일치하지 않습니다!']);
  };

  const handleSignup = async () => {
    try {
      const response = await fetch('http://localhost:8000/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, nickname, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('회원가입 실패:', errorData);

        const errorMessage = Array.isArray(errorData.message)
          ? errorData.message.join(', ')
          : errorData.message || '서버 오류';

        alert(`회원가입 실패: ${errorMessage}`);
        return;
      }

      const data = await response.json();
      console.log('회원가입 성공:', data);
      alert('회원가입이 완료되었습니다!');
      navigate('/');
    } catch (error) {
      console.error('서버 오류:', error);
      alert('서버와 통신 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="relative min-h-screen bg-blue-400">
      <Background size="small">
        <div className="relative flex items-center justify-center w-full">
          <Link to="/" className="absolute left-8 top-6">
            <BackIcon className="w-8 h-8" />
          </Link>
          <span className="text-3xl mt-5">회원가입</span>
        </div>
        <div className="text-gray-500 mt-4">원할한 서비스 이용을 위해 회원가입을 해주세요.</div>
        <div className="flex flex-col w-full max-w-md gap-2">
          <div className="mt-4">
            <label htmlFor="email" className="text-base font-semibold text-gray-800 mt-4">
              이메일
            </label>
            <Input
              type="email"
              name="email"
              placeholder="아이디로 사용할 이메일을 입력해 주세요"
              value={email}
              onChange={handleEmailChange}
              className="w-full border-2 px-6 py-2 rounded-lg hover:bg-gray-50"
            />
            {emailError.map((error, index) => (
              <p key={index} className="text-sm text-red-500 mt-1">
                {error}
              </p>
            ))}
          </div>
          <div className="mt-4">
            <label htmlFor="nickname" className="text-base font-semibold text-gray-800 mt-4">
              닉네임
            </label>
            <Input
              type="nickname"
              name="nickname"
              placeholder="한글, 영어, 숫자, 특수문자 2-20자"
              value={nickname}
              onChange={handleNickChange}
              className="w-full border-2 px-6 py-2 rounded-lg hover:bg-gray-50"
            />
            {nicknameError.map((error, index) => (
              <p key={index} className="text-sm text-red-500 mt-1">
                {error}
              </p>
            ))}
          </div>
          <div className="mt-4">
            <label htmlFor="password" className="text-base font-semibold text-gray-800 mt-4">
              비밀번호
            </label>
            <Input
              type="password"
              name="password"
              placeholder="영문, 숫자, 특수문자가 모두 들어간 8-20자"
              value={password}
              onChange={handlePassChange}
              className="w-full border-2 px-6 py-2 rounded-lg hover:bg-gray-50"
            />
            {passwordError.map((error, index) => (
              <p key={index} className="text-sm text-red-500 mt-1">
                {error}
              </p>
            ))}
            <Input
              type="password"
              name="password"
              placeholder="비밀번호를 한번 더 입력해 주세요"
              value={repassword}
              onChange={handleRepassChange}
              className="w-full border-2 mt-2 px-6 py-2 rounded-lg hover:bg-gray-50"
            />
            {repasswordError.map((error, index) => (
              <p key={index} className="text-sm text-red-500 mt-1">
                {error}
              </p>
            ))}
          </div>
          <button
            className="w-full py-3 mt-5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
            onClick={handleSignup}
          >
            회원가입
          </button>
        </div>
      </Background>
    </div>
  );
}

export default SignUpPage;
