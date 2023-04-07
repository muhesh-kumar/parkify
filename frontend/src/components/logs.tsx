import { useEffect, useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import io from 'socket.io-client';

import SectionLayout from './section-layout';

import cn from '../utils/classnames';
import { emails, carManufacturers } from '../data/';

type Log = {
  email: string;
  carManufacturer: string;
  plateNumber: string;
  timeOfEntry: string;
};

const socket = io('http://localhost:3000');

const Logs = () => {
  const [logs, setLogs] = useState<Log[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const result = await fetch('http://localhost:3000/api/events');
        const data = await result.json();
        const newLogs: Log[] = Object.keys(data.events).map((key) => ({
          email: emails[Math.floor(Math.random() * emails.length)],
          carManufacturer:
            carManufacturers[
              Math.floor(Math.random() * carManufacturers.length)
            ],
          plateNumber: key,
          timeOfEntry: data.events[key].entryTimeStamp,
        }));
        // reverse newLogs array
        newLogs.reverse();
        setLogs(newLogs);
      } catch (err) {
        console.log(err);
      }
    };
    fetchLogs();
  }, []);

  useEffect(() => {
    const eventListener = (data: any) => {
      console.log('redis update event emittion detected');
      console.log('new incoming data: ', data);
      const newData = {
        email: emails[Math.floor(Math.random() * emails.length)],
        carManufacturer:
          carManufacturers[Math.floor(Math.random() * carManufacturers.length)],
        plateNumber: data.plateNumber,
        timeOfEntry: data.entryTimeStamp,
      };
      setLogs((prevData) => [newData, ...prevData]);
      // console.log('Logs: ', logs, newData);
    };
    socket.on('redis-update', eventListener);

    return () => {
      socket.off('redis-update', eventListener);
    };
  }, [socket]);

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
      <div className="bg-primaryBackground rounded-xl flex flex-col font-semibold text-xs max-h-[520px]">
        <div className="border-b border-b-[#3E3E3E] flex bg-selected text-fontSelected rounded-t-xl py-6 px-3">
          <p className="w-1/4">Name/Email</p>
          <p className="w-1/4">Car Manufacturer</p>
          <p className="w-1/4">Plate Number</p>
          <p className="w-1/4">Time of Entry</p>
        </div>
        <div className="flex flex-col gap-2 overflow-y-auto">
          {logs.map((row, idx) => {
            return (
              <div
                key={row.email}
                className={cn(
                  'flex py-4 px-3',
                  idx < logs.length - 1 ? 'border-b-2 border-b-[#3E3E3E]' : ''
                )}
              >
                <p className="w-1/4">{row.email}</p>
                <p className="w-1/4">{row.carManufacturer}</p>
                <p className="w-1/4">{row.plateNumber}</p>
                <p className="w-1/4">{row.timeOfEntry}</p>
              </div>
            );
          })}
        </div>
      </div>
    </SectionLayout>
  );
};

export default Logs;
