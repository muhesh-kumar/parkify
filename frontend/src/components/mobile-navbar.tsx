import { useState } from 'react';
import { useAtom } from 'jotai';
import {
  ChartPieIcon,
  RectangleGroupIcon,
  BuildingOffice2Icon,
  ArrowLeftOnRectangleIcon,
  TableCellsIcon,
} from '@heroicons/react/24/outline';

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
  const [isOpen, setIsOpen] = useState(false);
  const [selectedNavOption, setSelectedNavOption] = useAtom(
    selectedNavOptionAtom
  );

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <div className="bg-secondaryBackground px-5 py-3 flex justify-between">
        {/* Logo */}
        <div className="flex gap-2 items-end justify-start">
          <img src={Logo} className="h-7 w-7 md:h-9 md:w-9" />
          <h1 className="font-bold text-lg md:text-xl">
            Park<span className="text-fontSelected">ify</span>
          </h1>
        </div>

        {/* Hamburger Button */}
        <button onClick={handleClick}>
          <img
            src={isOpen ? closeMenuIcon : hamBurgerMenuIcon}
            alt="Hamburger Menu"
            className="inline md:hidden h-8 w-8"
          />
        </button>
      </div>

      <div
        className={cn(
          isOpen ? 'flex flex-col gap-[50px]' : 'hidden',
          'absolute rounded z-2 mt-[2px] h-[calc(100vh-54px)] bg-secondaryBackground px-5 py-10 w-[200px]'
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
            <p className="text-[11px] text-[#898989]">Main Parking Lot</p>
          </div>
          <button className="text-fontSelected font-semibold flex gap-1 text-sm">
            <ArrowLeftOnRectangleIcon className="h-5 w-5" />
            <span>Log out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileNavbar;
