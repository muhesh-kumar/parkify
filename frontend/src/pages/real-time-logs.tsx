import { useEffect, useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

import cn from '@utils/classnames';
import { emails, carManufacturers } from '@dummy-data/index';
import { API_URL } from '@constants/index';
import Event from '@interfaces/event';

type EntryOrExit = 'Entry' | 'Exit';

type Log = {
  email: string;
  carManufacturer: string;
  licensePlateNumber: string;
  timeStamp: string;
  eventType: EntryOrExit;
};

const socket = io(API_URL);

const RealTimeLogs = () => {
  const [logs, setLogs] = useState<Log[]>([]);

  // Fetch logs from the API, the first time the component is rendered
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const result = await fetch(`${API_URL}/events`);
        const response = await result.json();
        console.log('resp: ', response);
        const newLogs: Log[] = response.data.events.map((event: Event) => ({
          email: emails[Math.floor(Math.random() * emails.length)],
          carManufacturer:
            carManufacturers[
              Math.floor(Math.random() * carManufacturers.length)
            ],
          licensePlateNumber: event.licensePlateNumber,
          timeStamp: event.timeStamp,
          eventType: (event.isEntry ? 'Entry' : 'Exit') as EntryOrExit,
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

  // Listen to redis-update socket event and update the logs
  useEffect(() => {
    const eventListener = (data: Event) => {
      console.log('Incoming data: ', data);
      const newData = {
        email: emails[Math.floor(Math.random() * emails.length)],
        carManufacturer:
          carManufacturers[Math.floor(Math.random() * carManufacturers.length)],
        licensePlateNumber: data.licensePlateNumber,
        timeStamp: data.timeStamp,
        eventType: (data.isEntry ? 'Entry' : 'Exit') as EntryOrExit,
      };
      setLogs((prevData) => [newData, ...prevData]);
    };
    socket.on('redis-update', eventListener);

    return () => {
      socket.off('redis-update', eventListener);
    };
  }, [socket]);

  return (
    <div className="rounded-2xl py-3 px-4 w-full bg-secondaryBackground flex flex-col gap-4 min-w-[800px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-md font-bold">Real Time Logs</h2>
        <div className="bg-primaryBackground rounded-xl w-1/4 px-2 py-3 flex gap-2 items-center text-[#777777]">
          <MagnifyingGlassIcon className="w-[14px] h-[14px]" />
          <input
            type="text"
            className="text-xs appearance-none outline-none border-none bg-primaryBackground placeholder-[#777777] w-full"
            placeholder="Search"
          />
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-primaryBackground rounded-xl flex flex-col font-semibold text-xs max-h-[520px] overflow-x-auto">
        <div className="border-b border-b-[#3E3E3E] flex bg-selected text-fontSelected rounded-t-xl py-6 px-3">
          <p className="w-2/6 md:w-1/5">Name/Email</p>
          <p className="w-1/6 md:w-1/5">Car Manufacturer</p>
          <p className="w-1/6 md:w-1/5">Plate Number</p>
          <p className="w-1/6 md:w-1/5">Timestamp</p>
          <p className="w-1/6 md:w-1/5">Event Type</p>
        </div>
        <div className="flex flex-col gap-2 overflow-y-auto">
          {logs.map((row, idx) => {
            return (
              <div
                key={uuidv4()}
                className={cn(
                  'flex py-4 px-3',
                  idx < logs.length - 1 ? 'border-b-2 border-b-[#3E3E3E]' : ''
                )}
              >
                <p className="w-2/6 md:w-1/5">{row.email}</p>
                <p className="w-1/6 md:w-1/5">{row.carManufacturer}</p>
                <p className="w-1/6 md:w-1/5">{row.licensePlateNumber}</p>
                <p className="w-1/6 md:w-1/5">{row.timeStamp}</p>
                <p className="w-1/6 md:w-1/5">{row.eventType}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RealTimeLogs;
