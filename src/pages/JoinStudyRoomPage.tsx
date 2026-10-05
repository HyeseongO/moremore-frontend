import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import StudyRoomService from '../services/studyroomService';

function JoinStudyRoomPage() {
  const { inviteCode } = useParams<{ inviteCode: string }>();
  const navigate = useNavigate();
  const [msg, setMsg] = useState('스터디룸에 참가 중...');
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
        setMsg(message || '유효하지 않은 초대 코드입니다.');
      }
    };
    joinRoom();
  }, [inviteCode, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-100">
      <p className="text-lg font-medium">{msg}</p>
    </div>
  );
}

export default JoinStudyRoomPage;
