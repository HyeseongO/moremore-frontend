import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import api from '../services/api';

const ALREADY_MEMBER_MESSAGE = '이미 참여중인 스터디룸입니다.';

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
        const res = await api.post(`/studyrooms/join/${inviteCode}`);
        navigate(`/studyroom/${res.data.id}`, { replace: true });
      } catch (err) {
        const message = axios.isAxiosError(err) ? err.response?.data?.message : undefined;
        if (message !== ALREADY_MEMBER_MESSAGE) {
          setMsg(message || '유효하지 않은 초대 코드입니다.');
          return;
        }
        try {
          const room = await api.get(`/studyrooms/invite/${inviteCode}`);
          navigate(`/studyroom/${room.data.id}`, { replace: true });
        } catch {
          setMsg('유효하지 않은 초대 코드입니다.');
        }
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
