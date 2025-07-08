import { Link } from 'react-router-dom';
import Background from '../components/Background';

function RoomPage() {
  return (
    <div className="relative min-h-screen bg-amber-100">
      <Background size="large">
        <div className="absolute top-6 right-16">
          <Link
            to="/main"
            className="px-8 py-1.5 rounded-lg bg-rose-200 hover:bg-rose-300 text-rose-800"
          >
            나가기
          </Link>
        </div>
      </Background>
    </div>
  );
}

export default RoomPage;
