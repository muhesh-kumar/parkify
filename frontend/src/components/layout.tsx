import { FC, ReactElement } from 'react';
import Navbar from './navbar';

type LayoutProps = {
  children: ReactElement | ReactElement[];
};

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex font-poppins text-[#EBEBEB]">
      <Navbar />
      <div className="bg-primaryBackground w-screen p-8 flex flex-col gap-5">
        {children}
      </div>
    </div>
  );
};

export default Layout;
