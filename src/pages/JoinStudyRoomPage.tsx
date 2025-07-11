import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../services/api';

function JoinStudyRoomPage() {
  const { inviteCode } = useParams<{ inviteCode: string }>();
  const navigate = useNavigate();
  const [msg, setMsg] = useState('스터디룸에 참가 중...');

  useEffect(() => {
    const joinRoom = async () => {
      try {
        const res = await api.post(`/studyrooms/join/${inviteCode}`);
        if (res.data.success) {
          navigate(`/studyroom/${res.data.data.roomId}`, { replace: true });
        } else {
          setMsg(res.data.message || '참가에 실패했습니다.');
        }
      } catch (err: any) {
        setMsg(err.response?.data?.message || '유효하지 않은 초대 코드입니다.');
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
