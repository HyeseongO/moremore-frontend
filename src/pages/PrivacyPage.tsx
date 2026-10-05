import { Link } from 'react-router-dom';

const EFFECTIVE_DATE = '2026-10-05';
const ISSUES_URL = 'https://github.com/HyeseongO/moremore-frontend/issues';

interface PolicySection {
  title: string;
  items: string[];
}

const KOREAN_SECTIONS: PolicySection[] = [
  {
    title: '1. 수집하는 정보',
    items: [
      '이메일 회원가입: 이메일, 닉네임, 비밀번호(암호화된 형태로만 저장)',
      '구글 로그인: 구글 계정 이메일, 구글 계정 고유 ID, 프로필 사진 주소, 직접 입력한 닉네임',
      '서비스 이용 중 작성한 정보: 스터디룸 제목과 설명, 채팅 메시지, 참여한 스터디룸 목록',
    ],
  },
  {
    title: '2. 이용 목적',
    items: [
      '회원 식별과 로그인 유지',
      '스터디룸 생성, 참여, 채팅 기능 제공',
      '수집한 정보는 광고나 마케팅에 사용하지 않으며, 제3자에게 판매하지 않습니다.',
    ],
  },
  {
    title: '3. 영상·음성 통화',
    items: [
      '통화 영상과 음성은 참가자 브라우저끼리 직접 연결(WebRTC)되며 서버에 저장하거나 녹화하지 않습니다.',
      '네트워크 환경상 직접 연결이 어려우면 Cloudflare 중계 서버를 거치지만, 이때도 암호화된 상태로 전달만 되고 저장되지 않습니다.',
    ],
  },
  {
    title: '4. 쿠키',
    items: [
      '로그인 유지를 위한 쿠키(accessToken, refreshToken)와 구글 회원가입 진행용 임시 쿠키만 사용합니다.',
      '분석·광고용 쿠키나 추적 도구는 사용하지 않습니다.',
    ],
  },
  {
    title: '5. 보관 위치와 처리 위탁',
    items: [
      '데이터베이스: Supabase (서울 리전)',
      '서버: Amazon Web Services (서울 리전)',
      '웹사이트 호스팅: Vercel',
      '통화 중계: Cloudflare',
    ],
  },
  {
    title: '6. 보관 기간과 삭제',
    items: [
      '회원 정보는 계정이 유지되는 동안 보관합니다.',
      '계정과 관련 데이터 삭제를 원하시면 아래 GitHub 이슈로 요청해주세요. 확인 후 지체 없이 삭제합니다.',
    ],
  },
  {
    title: '7. 문의',
    items: ['개인정보 관련 문의와 삭제 요청은 GitHub 이슈로 남겨주세요.'],
  },
];

const ENGLISH_SUMMARY = [
  'We collect your email, nickname, and a hashed password, or for Google sign-in your Google email, Google account ID, and profile picture URL.',
  'We also store study room titles, descriptions, chat messages, and room memberships you create.',
  'This data is used only to provide sign-in, study rooms, and chat. It is never sold or used for advertising.',
  'Video and audio calls are peer-to-peer (WebRTC) and are never recorded or stored. A Cloudflare relay may forward encrypted media when a direct connection is not possible.',
  'Only essential sign-in cookies are used. No analytics or tracking cookies.',
  'Data is stored with Supabase and AWS in Seoul, Korea. The site is hosted on Vercel.',
  'To request deletion of your account and data, please open a GitHub issue.',
];

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-blue-400 px-4 py-10">
      <main className="mx-auto max-w-3xl rounded-[40px] bg-white p-8 shadow-lg break-keep sm:p-12">
        <Link to="/" className="text-sm text-blue-500 hover:underline">
          ← 로그인 화면으로
        </Link>

        <h1 className="mt-4 text-2xl font-bold text-gray-900">개인정보처리방침</h1>
        <p className="mt-2 text-sm text-gray-500">시행일: {EFFECTIVE_DATE}</p>
        <p className="mt-4 text-gray-700">
          모어모어온(Moremore On)은 그룹 스터디를 위한 화상·음성 스터디룸 서비스입니다. 서비스 제공에
          필요한 최소한의 정보만 수집하며, 아래와 같이 처리합니다.
        </p>

        {KOREAN_SECTIONS.map((section) => (
          <section key={section.title} className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900">{section.title}</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-gray-700">
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ))}

        <p className="mt-4">
          <a
            href={ISSUES_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            GitHub 이슈로 문의하기 →
          </a>
        </p>

        <hr className="my-10 border-gray-200" />

        <section lang="en">
          <h2 className="text-xl font-bold text-gray-900">Privacy Policy (English Summary)</h2>
          <p className="mt-2 text-sm text-gray-500">Effective date: {EFFECTIVE_DATE}</p>
          <ul className="mt-4 list-disc space-y-1 pl-5 text-gray-700">
            {ENGLISH_SUMMARY.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mt-4">
            <a
              href={ISSUES_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Contact us via GitHub Issues →
            </a>
          </p>
        </section>
      </main>
    </div>
  );
}

export default PrivacyPage;
