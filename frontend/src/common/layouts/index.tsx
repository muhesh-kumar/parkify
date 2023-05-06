import { ReactNode } from 'react';

import Navbar from '@components/navbar';
import MobileNavbar from '@components/mobile-navbar';

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      {/* Larger screens */}
      <div className="hidden md:flex font-poppins text-[#EBEBEB] overflow-y-hidden">
        <Navbar />
        <div className="bg-primaryBackground w-screen px-10 justify-center flex flex-col gap-5">
          {children}
        </div>
      </div>

      {/* Smaller screens */}
      <div className="flex flex-col gap-5 md:hidden font-poppins text-[#EBEBEB] overflow-y-hidden w-screen bg-primaryBackground">
        <MobileNavbar />
        <div className="mt-[52px] mb-[18px] px-5 h-full min-h-screen">
          {' '}
          {children}
        </div>
      </div>
    </>
  );
};

export default Layout;
