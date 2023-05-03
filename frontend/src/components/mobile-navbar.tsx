import { useAtom } from 'jotai';
import {
  ChartPieIcon,
  RectangleGroupIcon,
  BuildingOffice2Icon,
  ArrowLeftOnRectangleIcon,
  TableCellsIcon,
} from '@heroicons/react/24/outline';
import { Popover } from '@headlessui/react';

import { selectedNavOptionAtom } from '@state/index';
import cn from '@utils/classnames';

import Logo from '@assets/logo.png';
import hamBurgerMenuIcon from '@assets/hamburger-menu.svg';
import closeMenuIcon from '@assets/close-icon.png';

const navOptions = [
  {
    name: 'parking-slots-availability',
    content: 'Dashboard',
    icon: <RectangleGroupIcon className="h-5 w-5" />,
  },
  {
    name: 'real-time-logs',
    content: 'Real Time Logs',
    icon: <TableCellsIcon className="h-5 w-5" />,
  },
  {
    name: 'statistics',
    content: 'Statistics',
    icon: <ChartPieIcon className="h-5 w-5" />,
  },
];

const MobileNavbar = () => {
  const [selectedNavOption, setSelectedNavOption] = useAtom(
    selectedNavOptionAtom
  );

  return (
    <div className="relative">
      <div className="bg-secondaryBackground w-screen px-5 py-3 flex justify-between fixed z-2">
        {/* Logo */}
        <div className="flex gap-2 items-end justify-start">
          <img src={Logo} className="h-7 w-7 md:h-9 md:w-9" />
          <h1 className="font-bold text-lg md:text-xl">
            Park<span className="text-fontSelected">ify</span>
          </h1>
        </div>

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
                  'fixed left-0 rounded-md z-2 top-[54px] h-[calc(100vh-52px)] bg-secondaryBackground px-5 py-10 w-[250px]'
                )}
              >
                <div>
                  {navOptions.map((option) => {
                    return (
                      <div
                        className={cn(
                          'flex gap-2 items-center text-xs py-2 px-4',
                          selectedNavOption == option.name
                            ? 'text-fontSelected bg-selected font-semibold rounded-[12.5px]'
                            : ''
                        )}
                        onClick={() => setSelectedNavOption(option.name)}
                      >
                        {option.icon}
                        <p>{option.content}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-auto flex flex-col gap-2 items-center">
                  <div className="text-fontSelected bg-selected rounded-full p-5">
                    <BuildingOffice2Icon className="h-9 w-9" />
                  </div>
                  <div>
                    <p className="text-sm">Pheonix Mall</p>
                    <p className="text-[11px] text-[#898989]">
                      Main Parking Lot
                    </p>
                  </div>
                  <button className="text-fontSelected font-semibold flex gap-1 text-sm">
                    <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                    <span>Log out</span>
                  </button>
                </div>
              </Popover.Panel>
            </>
          )}
        </Popover>
      </div>
    </div>
  );
};

export default MobileNavbar;
