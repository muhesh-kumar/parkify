import { FC, ReactElement } from 'react';

import Navbar from '@components/navbar';

type LayoutProps = {
  children: ReactElement | ReactElement[] | boolean;
};

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex font-poppins text-[#EBEBEB] overflow-y-hidden">
      <Navbar />
      <div className="bg-primaryBackground w-screen p-8 flex flex-col gap-5">
        {children}
      </div>
    </div>
  );
};

export default Layout;
