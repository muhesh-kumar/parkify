import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

import cn from '../utils/classnames';
import SectionLayout from './section-layout';

const logs = () => {
  const data = [
    {
      identifier: 'abc@gmail.com',
      carManufacturer: 'Range Rover',
      plateNumber: 'WN-054-NW',
      timeOfEntry: '15:52 24 January, 2022',
    },
    {
      identifier: 'abc@gmail.com',
      carManufacturer: 'Range Rover',
      plateNumber: 'WN-054-NW',
      timeOfEntry: '15:52 24 January, 2022',
    },
    {
      identifier: 'abc@gmail.com',
      carManufacturer: 'Range Rover',
      plateNumber: 'WN-054-NW',
      timeOfEntry: '15:52 24 January, 2022',
    },
  ];

  return (
    <SectionLayout>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-md font-bold">Real Time Logs</h2>
        <div className="bg-primaryBackground rounded-xl w-1/4 px-2 py-3 flex gap-2 items-center text-[#777777]">
          <MagnifyingGlassIcon className="w-[14px] h-[14px]" />
          <input
            type="text"
            className="text-xs appearance-none outline-none border-none bg-primaryBackground placeholder-[#777777]"
            placeholder="Search"
          />
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-primaryBackground rounded-xl flex flex-col gap-2 font-semibold text-xs">
        <div className="border-b border-b-[#3E3E3E] flex bg-selected text-fontSelected rounded-t-xl py-6 px-3">
          <p className="w-1/4">Name/Email</p>
          <p className="w-1/4">Car Manufacturer</p>
          <p className="w-1/4">Plate Number</p>
          <p className="w-1/4">Time of Entry</p>
        </div>
        {data.map((row, idx) => {
          return (
            <div
              key={row.identifier}
              className={cn(
                'flex py-4 px-3',
                idx < data.length - 1 ? 'border-b-2 border-b-[#3E3E3E]' : ''
              )}
            >
              <p className="w-1/4">{row.identifier}</p>
              <p className="w-1/4">{row.carManufacturer}</p>
              <p className="w-1/4">{row.plateNumber}</p>
              <p className="w-1/4">{row.timeOfEntry}</p>
            </div>
          );
        })}
      </div>
    </SectionLayout>
  );
};

export default logs;
