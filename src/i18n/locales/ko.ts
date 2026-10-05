const ko = {
  language: {
    label: '언어',
    ko: '한국어',
    en: 'EN',
  },
  common: {
    serverError: '서버와 통신 중 오류가 발생했습니다.',
    networkError: '네트워크 오류가 발생했습니다.',
  },
  login: {
    submit: '로그인',
    or: 'Or',
    invalidEmail: '유효하지 않은 이메일 형식입니다.',
    invalidPassword: '잘못된 비밀번호 형식입니다.',
    demoPrompt: '가입 없이 체험',
    demoLabel: '데모 {{number}}',
    noAccount: '아직 모어모어온 회원이 아니신가요?',
    signupLink: '회원가입',
    privacyLink: '개인정보처리방침',
    failed: '로그인 실패',
    serverError: '서버 오류가 발생했습니다.',
    errors: {
      googleLoginFailed: '구글 로그인이 취소되었거나 실패했습니다. 다시 시도해주세요.',
    },
  },
  signup: {
    title: '회원가입',
    subtitle: '원활한 서비스 이용을 위해 회원가입을 해주세요.',
    emailLabel: '이메일',
    emailPlaceholder: '아이디로 사용할 이메일을 입력해 주세요',
    nicknameLabel: '닉네임',
    nicknamePlaceholder: '한글, 영어, 숫자, 특수문자 2-20자',
    passwordLabel: '비밀번호',
    passwordPlaceholder: '영문, 숫자, 특수문자가 모두 들어간 8-20자',
    passwordConfirmPlaceholder: '비밀번호를 한번 더 입력해 주세요',
    passwordMismatch: '비밀번호가 일치하지 않습니다!',
    submit: '회원가입',
    success: '회원가입이 완료되었습니다!',
    failed: '회원가입 실패: {{message}}',
  },
  googleSignup: {
    title: '거의 다 왔어요!',
    subtitle: '사용하실 닉네임을 설정해주세요',
    nicknameLabel: '닉네임',
    nicknamePlaceholder: '닉네임 (2-20자)',
    nicknameHint: '한글, 영문, 숫자, 특수문자 사용 가능 (특수문자로 시작 불가)',
    checkFailed: '닉네임 확인 중 오류가 발생했습니다.',
    checkRequired: '닉네임 중복 확인을 해주세요.',
    failed: '회원가입에 실패했습니다.',
    processing: '처리 중...',
    submit: '시작하기',
  },
  validation: {
    email: {
      required: '이메일을 입력해주세요!',
      noSpaces: '이메일에 공백을 포함할 수 없습니다.',
      invalid: '올바른 이메일 형식이 아닙니다.',
      tooLong: '이메일 길이가 너무 깁니다.',
    },
    nickname: {
      required: '닉네임을 입력해주세요!',
      length: '닉네임은 최소 2자 이상 최대 20자 이하여야 합니다!',
      noSpaces: '닉네임에 공백을 포함할 수 없습니다!',
      startsWithSpecial: '닉네임은 특수문자로 시작할 수 없습니다!',
      invalidChars: '닉네임은 한글, 영어, 숫자, 특수문자만 사용 가능합니다!',
    },
    password: {
      required: '비밀번호를 입력해주세요!',
      noSpaces: '비밀번호에 공백을 포함할 수 없습니다!',
      length: '비밀번호는 최소 8자 이상 최대 20자 이하여야 합니다!',
      invalidChars: '비밀번호에는 영문, 숫자, 특수문자만 사용할 수 있습니다!',
      needsLetter: '비밀번호에는 최소 1개의 영문자가 포함되어야 합니다!',
      needsNumber: '비밀번호에는 최소 1개의 숫자가 포함되어야 합니다!',
      needsSpecial: '비밀번호에는 최소 1개의 특수문자가 포함되어야 합니다!',
    },
  },
  privacy: {
    backToLogin: '← 로그인 화면으로',
    title: '개인정보처리방침',
    effectiveDate: '시행일: {{date}}',
    intro:
      '모어모어온(Moremore On)은 그룹 스터디를 위한 화상·음성 스터디룸 서비스입니다. 서비스 제공에 필요한 최소한의 정보만 수집하며, 아래와 같이 처리합니다.',
    contactLink: 'GitHub 이슈로 문의하기 →',
    sections: [
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
        title: '4. 쿠키와 브라우저 저장소',
        items: [
          '로그인 유지를 위한 쿠키(accessToken, refreshToken)와 구글 회원가입 진행용 임시 쿠키만 사용합니다.',
          '선택한 화면 언어를 기억하기 위해 브라우저 저장소(localStorage)를 사용합니다.',
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
    ],
  },
};

export type Messages = typeof ko;

export default ko;
