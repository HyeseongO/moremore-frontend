import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import StudyRoomService from '../services/studyroomService';

function JoinStudyRoomPage() {
  const { inviteCode } = useParams<{ inviteCode: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const requestedRef = useRef(false);

  useEffect(() => {
    if (requestedRef.current) return;
    requestedRef.current = true;

    const joinRoom = async () => {
      try {
        const room = await StudyRoomService.joinByInviteCode(inviteCode!);
        navigate(`/studyroom/${room.id}`, { replace: true });
      } catch (err) {
        const message = axios.isAxiosError(err) ? err.response?.data?.message : undefined;
        setErrorMessage(message || t('joinRoom.invalidCode'));
      }
    };
    joinRoom();
  }, [inviteCode, navigate, t]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-100">
      <p className="text-lg font-medium">{errorMessage ?? t('joinRoom.joining')}</p>
    </div>
  );
}

export default JoinStudyRoomPage;
