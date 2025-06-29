import type { ReactNode } from 'react';

interface BackgroundProps {
  children: ReactNode;
}

function Background({ children }: BackgroundProps) {
  return (
    <div
      className="mx-auto w-[1000px] h-[600px] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
 bg-white rounded-[60px] shadow-lg flex flex-col items-center justify-center-white"
    >
      {children}
    </div>
  );
}

export default Background;
