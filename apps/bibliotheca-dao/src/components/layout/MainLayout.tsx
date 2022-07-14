import type { FC, ReactNode } from 'react';
import { MainFooter } from '@/components/layout/MainFooter';

export const MainLayout: FC<{ children: ReactNode }> = (props) => {
  const { children } = props;
  return (
    <div className="flex flex-col min-h-screen bg-black">
      <main>{children}</main>
      <MainFooter />
    </div>
  );
};
