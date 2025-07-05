import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateNickname } from '../utils/validation';

function GoogleSignup() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [nicknameAvailable, setNicknameAvailable] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);

  const checkNickname = async () => {
    const validationErrors = validateNickname(nickname);

    if (validationErrors.length > 0) {
      setError(validationErrors[0]);
      setNicknameAvailable(false);
      return;
    }

    setChecking(true);
    setError('');

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/check-nickname?nickname=${nickname}`,
        {
          credentials: 'include',
        }
      );

      const result = await response.json();
      setNicknameAvailable(result.data.available);
      setError(result.data.available ? '' : result.data.message);
    } catch (error) {
      setError('닉네임 확인 중 오류가 발생했습니다.');
    } finally {
      setChecking(false);
    }
  };

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
    setNicknameAvailable(null);
    setError('');
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    const validationErrors = validateNickname(nickname);
    if (validationErrors.length > 0) {
      setError(validationErrors[0]);
      return;
    }

    if (!nicknameAvailable) {
      setError('닉네임 중복 확인을 해주세요.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/google/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ nickname }),
      });

      if (response.ok) {
        navigate('/main');
      } else {
        const error = await response.json();
        setError(error.message || '회원가입에 실패했습니다.');
      }
    } catch (error) {
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4">
            <span className="text-3xl">👋</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">거의 다 왔어요!</h1>
          <p className="text-gray-600">사용하실 닉네임을 설정해주세요</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">닉네임</label>
            <div className="relative">
              <input
                type="text"
                placeholder="닉네임 (2-20자)"
                value={nickname}
                onChange={(e) => {
                  setNickname(e.target.value);
                  setNicknameAvailable(null);
                  setError('');
                }}
                onBlur={checkNickname}
                className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 ${
                  nicknameAvailable === false
                    ? 'border-red-300'
                    : nicknameAvailable === true
                    ? 'border-green-300'
                    : 'border-gray-300'
                }`}
                minLength={2}
                maxLength={20}
                required
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                {checking && (
                  <svg
                    className="animate-spin h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                )}
                {!checking && nicknameAvailable === true && (
                  <svg
                    className="h-5 w-5 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
                {!checking && nicknameAvailable === false && (
                  <svg
                    className="h-5 w-5 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </div>
            </div>
            <p className="mt-1 text-sm text-gray-500">한글, 영문, 숫자, -, _ 사용 가능</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center">
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !nicknameAvailable}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                처리 중...
              </span>
            ) : (
              '시작하기'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default GoogleSignup;
