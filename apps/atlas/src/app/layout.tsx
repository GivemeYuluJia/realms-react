import { headers } from 'next/headers';
import type { ReactElement } from 'react';

import React from 'react';
import { Head } from '@/components/Head';
import { AtlasLink } from '@/components/navigation/AtlasLink';
import { BottomLeftNav } from '@/components/navigation/BottomLeftNav';
import { MenuSideBar } from '@/components/navigation/MenuSideBar';
import { TopLeftNav } from '@/components/navigation/TopLeftNav';
import { TopRightNav } from '@/components/navigation/TopRightNav';
import Atlas from './Atlas';
import { ClientProviders } from './ClientProviders';
// import { Header } from './Header';
import '../styles/global.css';
import 'mapbox-gl/dist/mapbox-gl.css';
// import { UserAgentProvider } from '@quentin-sommer/react-useragent';

export default function Layout({ children }: { children: React.ReactNode }) {
  const headersInstance = headers();
  const userAgent = headersInstance.get('user-agent') || '';
  return (
    <html lang="en">
      <Head />
      <body>
        <ClientProviders>
          <div className="relative flex h-full overflow-hidden sm:h-screen">
            <TopLeftNav />
            <TopRightNav />
            <BottomLeftNav />
            <AtlasLink />
            {/* <MenuSideBar /> */}
            <div className="relative flex flex-col w-full">
              {/* <Header /> */}
              <div className="relative w-full h-full pt-32 pl-10 bg-black">
                <Atlas />
                {children}
                <div className="object-cover object-right w-full h-full bg-center bg-fill bg-warRoom" />
                <div id="sidebar-root">
                  {/* Render children here using the AtlasSideBar component */}
                </div>
              </div>
            </div>
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}
