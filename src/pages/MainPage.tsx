import Background from '../components/Background';
import UserProfile from '../components/UserProfile';

function MainPage() {
  return (
    <div className="relative min-h-screen bg-blue-400">
      <Background size="large">
        <div className="absolute top-6 right-16">
          <UserProfile />
        </div>
        <div
          className="
          absolute left-1/2 -translate-x-1/2
          top-28 w-[1250px] px-8
          flex items-center justify-between
        "
        >
          <button
            className="
            bg-indigo-500 text-white px-6 py-2 rounded-full font-medium
            hover:bg-indigo-600 transition-colors
          "
          >
            스터디룸 생성
          </button>
          <div className="flex items-center gap-3">
            <input
              type="text"
              className="px-6 py-1 border-2 rounded-full outline-none"
              placeholder="검색어 입력"
            />
            <button
              className="
            border border-slate-300 text-slate-700 font-medium
            px-4 py-1.5 rounded-full
            hover:bg-slate-100 active:bg-slate-200
            focus:outline-none focus:ring-indigo-400 focus:ring-offset-1 focus:ring-2
            transition-colors duration-150"
            >
              검색
            </button>
          </div>
        </div>
        <div
          className="absolute mx-auto w-[1250px] h-[500px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
 bg-orange-50 mt-14 rounded-[40px] flex flex-col items-center justify-center-white"
        ></div>
      </Background>
    </div>
  );
}

export default MainPage;
