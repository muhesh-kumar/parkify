import { useEffect } from 'react';
import { useAtom } from 'jotai';
import io from 'socket.io-client';
import { availableSlotsAtom } from '../state/';

import SectionLayout from './section-layout';
import ParkingSlot from './parking-slot';
import AvailabilityStatus from './availability-status';

const ParkingSlotsAvailability = () => {
  const socket = io('http://localhost:3000');
  const [availableSlots, setAvailableSlots] = useAtom(availableSlotsAtom);

  const getAvailabilitySlots = async () => {
    const response = await fetch('http://localhost:3000/api/parking-slots');
    const availableSlots = await response.json();
    console.log('availableSlots: ', availableSlots.availableParkingSlots);
    setAvailableSlots(new Set(availableSlots.availableParkingSlots));
    console.log(availableSlots);
  };

  useEffect(() => {
    getAvailabilitySlots();
  }, []);

  useEffect(() => {
    // Handle incoming data
    const eventListener = (data: any) => {
      console.log('a car slot is requested');
      console.log('new incoming data: ', data);
      getAvailabilitySlots();
    };
    socket.on('redis-update', eventListener);

    return () => {
      socket.off('redis-update', eventListener);
    };
  }, [socket]);

  const row1 = [],
    row2 = [],
    row3 = [],
    row4 = [];
  let len = 10,
    currId = 1;
  for (let i = 0; i < len; i++) {
    row1.push(<ParkingSlot id={currId++} />);
    if (i < len - 1) row2.push(<ParkingSlot id={currId++} />);
  }
  for (let i = 0; i < len; i++) {
    row3.push(<ParkingSlot id={currId++} />);
    if (i < len - 1) row4.push(<ParkingSlot id={currId++} />);
  }
  const row1Container = (
    <div className="flex justify-between">
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">{row1}</div>
        <div className="flex gap-2">{row2}</div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">{row3}</div>
        <div className="ml-auto flex gap-2">{row4}</div>
      </div>
    </div>
  );

  const row21 = [],
    row22 = [],
    row23 = [],
    row24 = [];
  for (let i = 0; i < len; i++) {
    row21.push(<ParkingSlot id={currId++} />);
    if (i < len - 1) row22.push(<ParkingSlot id={currId++} />);
  }
  for (let i = 0; i < len; i++) {
    row23.push(<ParkingSlot id={currId++} />);
    if (i < len - 1) row24.push(<ParkingSlot id={currId++} />);
  }
  const row2Container = (
    <div className="flex justify-between">
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">{row21}</div>
        <div className="flex gap-2">{row22}</div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">{row23}</div>
        <div className="ml-auto flex gap-2">{row24}</div>
      </div>
    </div>
  );

  const midRow1 = [],
    midRow2 = [],
    midRow3 = [];
  const midRow4 = [],
    midRow5 = [],
    midRow6 = [];
  for (let i = 0; i < len - 2; i++) {
    if (i < len - 5) midRow1.push(<ParkingSlot id={currId++} />);
    midRow2.push(<ParkingSlot id={currId++} />);
    midRow3.push(<ParkingSlot id={currId++} />);
  }
  for (let i = 0; i < len - 2; i++) {
    if (i < len - 5) midRow4.push(<ParkingSlot id={currId++} />);
    midRow5.push(<ParkingSlot id={currId++} />);
    midRow6.push(<ParkingSlot id={currId++} />);
  }
  const midRowContainer = (
    <div className="flex justify-between">
      <div className="flex flex-col gap-4 items-center">
        <div className="flex gap-2">{midRow1}</div>
        <div className="flex gap-2">{midRow2}</div>
        <div className="flex gap-2">{midRow3}</div>
      </div>
      <div className="flex flex-col gap-4 items-center">
        <div className="flex gap-2">{midRow4}</div>
        <div className="flex gap-2">{midRow5}</div>
        <div className="flex gap-2">{midRow6}</div>
      </div>
    </div>
  );

  const bottomRow1 = [],
    bottomRow2 = [];
  len = 25;
  for (let i = 0; i < len - 2; i++) {
    if (i < len - 5) bottomRow1.push(<ParkingSlot id={currId++} />);
    bottomRow2.push(<ParkingSlot id={currId++} />);
  }
  const bottomRowContainer = (
    <div className="flex flex-col gap-4 items-center">
      <div className="flex gap-2">{bottomRow1}</div>
      <div className="flex gap-2">{bottomRow2}</div>
    </div>
  );

  return (
    <div className="flex gap-5">
      <SectionLayout width="70%">
        <h2 className="text-md font-bold">Parking Slots Availability</h2>

        {/* Left side */}
        <div className="flex flex-col gap-20">
          {row1Container}
          {midRowContainer}
          {row2Container}
          {bottomRowContainer}
        </div>
        {/* <div className="flex gap-2">
          <ParkingSlot isAvailable />
          <ParkingSlot />
        </div> */}
      </SectionLayout>

      {/* Right side */}
      <SectionLayout width="30%">
        <AvailabilityStatus />
      </SectionLayout>
    </div>
  );
};

export default ParkingSlotsAvailability;
