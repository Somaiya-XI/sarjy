import Image from 'next/image';
import { ReactNode } from 'react';

export function PaperBackground({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative h-full w-full ${className || ''}`}>
      <div className='absolute inset-0 z-0'>
        <Image src='/bg-lilac.svg' alt='Fabric Texture' fill priority sizes='100vw' className=' object-cover ' />
      </div>
      <div className='relative z-10'>{children}</div>
    </div>
  );
}
