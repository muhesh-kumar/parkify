import { FC, ReactElement } from 'react';

import Navbar from '@components/navbar';
import MobileNavbar from '@components/mobile-navbar';

type LayoutProps = {
  children: ReactElement | ReactElement[] | boolean;
};

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <>
      {/* Larger screens */}
      <div className="hidden md:flex font-poppins text-[#EBEBEB] overflow-y-hidden">
        <Navbar />
        <div className="bg-primaryBackground w-screen p-8 flex flex-col gap-5">
          {children}
        </div>
      </div>

      {/* Smaller screens */}
      <div className="flex flex-col gap-5 md:hidden font-poppins text-[#EBEBEB] overflow-y-hidden w-screen bg-primaryBackground">
        <MobileNavbar />
        <div className="mt-[52px] px-5 h-full min-h-screen"> {children}</div>
      </div>
    </>
  );
};

export default Layout;
