import type { ReactNode } from 'react';

interface BackgroundProps {
  children: ReactNode;
  size: 'small' | 'medium' | 'large';
}

const sizeClasses = {
  small: 'w-[600px] h-[600px]',
  medium: 'w-[1000px] h-[650px]',
  large: 'w-[1300px] h-[700px]',
};

function Background({ children, size = 'medium' }: BackgroundProps) {
  return (
    <div
      className={`mx-auto ${sizeClasses[size]} absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
 bg-white rounded-[60px] shadow-lg flex flex-col items-center justify-center-white`}
    >
      {children}
    </div>
  );
}

export default Background;
