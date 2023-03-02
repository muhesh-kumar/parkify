import { FC, ReactElement } from 'react';
import Navbar from './navbar';

type LayoutProps = {
  children: ReactElement;
};

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex font-poppins text-white">
      <Navbar />
      {children}
    </div>
  );
};

export default Layout;
