import { Popover } from '@headlessui/react';

import SidebarContent from '@components/sidebar-content';
import Logo from '@elements/logo';
import cn from '@utils/classnames';

import hamBurgerMenuIcon from '@assets/hamburger-menu.svg';
import closeMenuIcon from '@assets/close-icon.png';

const MobileNavbar = () => {
  return (
    <div className="relative">
      <div
        className="w-screen px-5 py-3 flex justify-between fixed z-50 backdrop-blur transition-colors
        duration-500 border-b border-secondaryBackground/10 bg-secondaryBackground/50 
        supports-backdrop-blur:bg-secondaryBackground/50"
      >
        <Logo />

        {/* Hamburger Menu */}
        <Popover className="relative">
          {({ open }) => (
            <>
              <Popover.Button className="focus:outline-none focus:ring-0 focus:ring-offset-0">
                <img
                  src={open ? closeMenuIcon : hamBurgerMenuIcon}
                  alt="Hamburger Menu"
                  className="inline md:hidden h-7 w-7"
                />
              </Popover.Button>

              <Popover.Overlay className="fixed inset-0 bg-black opacity-40" />

              <Popover.Panel
                className={cn(
                  open ? 'flex flex-col gap-[50px]' : 'hidden',
                  /* top-[54px] because of the height of the navbar being 52px and 2px extra for gap between the navbar and the sidebar
                    100vh - 60px because the height of the navbar is 52px, and we want the sidebar to take up the rest of the height */
                  'fixed left-0 rounded-md z-2 top-[54px] h-[calc(100vh-52px)] px-5 py-10 w-[250px] backdrop-blur transition-colors duration-500 border-b border-secondaryBackground/10 bg-secondaryBackground/90 supports-backdrop-blur:bg-secondaryBackground/90'
                )}
              >
                <SidebarContent />
              </Popover.Panel>
            </>
          )}
        </Popover>
      </div>
    </div>
  );
};

export default MobileNavbar;
