import { useAtom } from 'jotai';
import { v4 as uuidv4 } from 'uuid';
import {
  ChartPieIcon,
  RectangleGroupIcon,
  BuildingOffice2Icon,
  ArrowLeftOnRectangleIcon,
  TableCellsIcon,
} from '@heroicons/react/24/outline';

import { selectedNavOptionAtom } from '@state/index';
import cn from '@utils/classnames';
import { API_URL } from '@constants/index';
import { useEffect, useState } from 'react';

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

const SidebarContent = () => {
  const [selectedNavOption, setSelectedNavOption] = useAtom(
    selectedNavOptionAtom
  );
  const [user, setUser] = useState(null);
  console.log(user);

  const login = () => {
    window.open(`${API_URL}/auth/google`, '_self');
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch('http://localhost:3000/auth/user', {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log(data);

        if (data) {
          setUser(data);
        }
      } catch (error) {
        console.error('There was a problem fetching the user:', error);
      }
    };
    getUser();
  }, []);

  return (
    <>
      <div>
        {navOptions.map((option) => {
          return (
            <div
              key={uuidv4()}
              className={cn(
                'flex gap-2 items-center text-xs py-2 px-4 cursor-pointer',
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
          <button onClick={login}>Log In</button>
        </button>
      </div>
    </>
  );
};

export default SidebarContent;
