import { useState } from 'react';
import {
  ChartPieIcon,
  RectangleGroupIcon,
  BuildingOffice2Icon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';

import cn from '../utils/classnames';
import Logo from '../assets/logo.png';

const Navbar = () => {
  const [selectedNavOption, setSelectedNavOption] = useState('statistics');

  return (
    <div className="bg-secondaryBackground px-5 py-10 h-screen w-[250px] flex flex-col gap-[50px]">
      <div className="flex gap-2 items-end">
        <img src={Logo} className="h-9 w-9" />
        <h1 className="font-bold text-xl">
          Park<span className="text-fontSelected">ify</span>
        </h1>
      </div>

      <div>
        <div
          className={cn(
            'flex gap-2 items-center text-xs py-2 px-4',
            selectedNavOption == 'statistics'
              ? 'text-fontSelected bg-selected font-semibold rounded-[12.5px]'
              : ''
          )}
          onClick={() => setSelectedNavOption('statistics')}
        >
          <ChartPieIcon className="h-5 w-5" />
          <p>Statistics</p>
        </div>
        <div
          className={cn(
            'flex gap-2 items-center text-xs py-2 px-4',
            selectedNavOption == 'dashboard'
              ? 'text-fontSelected bg-selected font-semibold rounded-[12.5px]'
              : ''
          )}
          onClick={() => setSelectedNavOption('dashboard')}
        >
          <RectangleGroupIcon className="h-5 w-5" />
          <p>Dashboard</p>
        </div>
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
  );
};

export default Navbar;
