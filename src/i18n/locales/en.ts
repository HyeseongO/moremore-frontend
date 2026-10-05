import type { Messages } from './ko';

const en: Messages = {
  language: {
    label: 'Language',
    ko: '한국어',
    en: 'EN',
  },
  common: {
    serverError: 'Something went wrong while contacting the server.',
    networkError: 'A network error occurred.',
  },
  login: {
    submit: 'Log in',
    or: 'Or',
    invalidEmail: 'Please enter a valid email address.',
    invalidPassword: 'Password must be at least 8 characters.',
    demoPrompt: 'Try a demo',
    demoLabel: 'Demo {{number}}',
    noAccount: "Don't have an account yet?",
    signupLink: 'Sign up',
    privacyLink: 'Privacy Policy',
    failed: 'Login failed',
    serverError: 'A server error occurred.',
    errors: {
      googleLoginFailed: 'Google sign-in was cancelled or failed. Please try again.',
    },
  },
  signup: {
    title: 'Sign up',
    subtitle: 'Create an account to start using Moremore On.',
    emailLabel: 'Email',
    emailPlaceholder: 'Enter the email you will use to log in',
    nicknameLabel: 'Nickname',
    nicknamePlaceholder: '2-20 characters: letters, numbers, symbols',
    passwordLabel: 'Password',
    passwordPlaceholder: '8-20 characters with a letter, number, and symbol',
    passwordConfirmPlaceholder: 'Enter your password again',
    passwordMismatch: 'Passwords do not match!',
    submit: 'Sign up',
    success: 'Your account has been created!',
    failed: 'Sign-up failed: {{message}}',
  },
  googleSignup: {
    title: 'Almost there!',
    subtitle: 'Choose a nickname to use',
    nicknameLabel: 'Nickname',
    nicknamePlaceholder: 'Nickname (2-20 characters)',
    nicknameHint: 'Letters, numbers, and symbols allowed (cannot start with a symbol)',
    checkFailed: 'Something went wrong while checking the nickname.',
    checkRequired: 'Please check that the nickname is available.',
    failed: 'Sign-up failed.',
    processing: 'Processing...',
    submit: 'Get started',
  },
  validation: {
    email: {
      required: 'Please enter your email!',
      noSpaces: 'Email cannot contain spaces.',
      invalid: 'Please enter a valid email address.',
      tooLong: 'Email is too long.',
    },
    nickname: {
      required: 'Please enter a nickname!',
      length: 'Nickname must be 2-20 characters!',
      noSpaces: 'Nickname cannot contain spaces!',
      startsWithSpecial: 'Nickname cannot start with a symbol!',
      invalidChars: 'Nickname can only contain Korean, English letters, numbers, and symbols!',
    },
    password: {
      required: 'Please enter a password!',
      noSpaces: 'Password cannot contain spaces!',
      length: 'Password must be 8-20 characters!',
      invalidChars: 'Password can only contain English letters, numbers, and symbols!',
      needsLetter: 'Password must include at least one letter!',
      needsNumber: 'Password must include at least one number!',
      needsSpecial: 'Password must include at least one symbol!',
    },
  },
  privacy: {
    backToLogin: '← Back to login',
    title: 'Privacy Policy',
    effectiveDate: 'Effective date: {{date}}',
    intro:
      'Moremore On is a video and voice study room service for group study. We collect only the minimum information needed to provide the service and handle it as described below.',
    contactLink: 'Contact us via GitHub Issues →',
    sections: [
      {
        title: '1. Information We Collect',
        items: [
          'Email sign-up: email, nickname, and password (stored only in hashed form)',
          'Google sign-in: Google account email, Google account ID, profile picture URL, and the nickname you choose',
          'Content you create: study room titles and descriptions, chat messages, and the study rooms you join',
        ],
      },
      {
        title: '2. How We Use It',
        items: [
          'To identify members and keep you signed in',
          'To provide study rooms, room membership, and chat',
          'We never use this information for advertising or marketing, and we never sell it to third parties.',
        ],
      },
      {
        title: '3. Video and Voice Calls',
        items: [
          'Video and audio are sent directly between participants’ browsers (WebRTC) and are never stored or recorded on our servers.',
          'If a direct connection is not possible, media is relayed through Cloudflare servers, where it stays encrypted and is only forwarded, never stored.',
        ],
      },
      {
        title: '4. Cookies and Browser Storage',
        items: [
          'We only use sign-in cookies (accessToken, refreshToken) and a temporary cookie used during Google sign-up.',
          'We use browser storage (localStorage) to remember your selected display language.',
          'We do not use analytics or advertising cookies or any tracking tools.',
        ],
      },
      {
        title: '5. Where Data Is Stored and Processed',
        items: [
          'Database: Supabase (Seoul region)',
          'Servers: Amazon Web Services (Seoul region)',
          'Website hosting: Vercel',
          'Call relay: Cloudflare',
        ],
      },
      {
        title: '6. Retention and Deletion',
        items: [
          'Account information is kept for as long as your account exists.',
          'To delete your account and related data, please open a GitHub issue using the link below. We will delete it promptly after confirming the request.',
        ],
      },
      {
        title: '7. Contact',
        items: ['Please send privacy questions and deletion requests through GitHub Issues.'],
      },
    ],
  },
};

export default en;
